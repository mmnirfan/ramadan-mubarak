/**
 * ========================================
 * RamadanHub - Google Apps Script Backend
 * ========================================
 *
 * This script handles Sehri registrations from the RamadanHub form
 * (people staying in PGs / hostels / rooms in Hoskote) and stores them
 * in Google Sheets.
 *
 * - POST: saves one row per selected date. Dates the person is already
 *   registered for (matched by mobile number OR name) are skipped and
 *   reported back as duplicates.
 * - GET ?phone=... or ?name=...: returns that person's existing
 *   registrations (meal type + dates only, no personal details).
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Update SPREADSHEET_ID below
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy Web App URL to your .env.local file
 *    (NEXT_PUBLIC_GOOGLE_SCRIPT_URL=...)
 *
 * The header row is created automatically on an empty sheet.
 * After editing this file, create a NEW deployment version
 * (Deploy → Manage deployments → Edit → New version), otherwise
 * the web app keeps running the old code.
 */

// ============================================
// CONFIGURATION
// ============================================

const SPREADSHEET_ID = '15eLrUfUYoP2F_EB72ddowXhdrrkOUgnowOx5d9fQNUk';
const SHEET_NAME = 'Sheet1';
const SEND_EMAIL_CONFIRMATION = false;
const ADMIN_EMAIL = 'sehri@example.com';
const TIMEZONE = 'Asia/Kolkata';

// Ramadan 2027 / 1448 AH - expected in India (subject to moon sighting)
// (inclusive, yyyy-MM-dd; the end allows a 30th day)
const RAMADAN_START = '2027-02-09';
const RAMADAN_END = '2027-03-10';

// Registrations are for Sehri only
const MEAL_TYPE = 'Sehri';

const HEADERS = [
  'Timestamp',
  'Full Name',
  'Phone',
  'Email',
  'Occupation',
  'Address',
  'Nearest Masjid',
  'Meal Type',
  'Date',
  'Date Key',
  'Status',
  'Cancelled At',
  'Cancel Reason'
];

// 0-based column indexes, must match HEADERS
const COL = {
  NAME: 1,
  PHONE: 2,
  EMAIL: 3,
  MEAL_TYPE: 7,
  DATE_KEY: 9,
  STATUS: 10,
  CANCELLED_AT: 11,
  CANCEL_REASON: 12
};

// Cancelled bookings are kept (marked, not deleted) so organisers keep a record
const STATUS_ACTIVE = 'Active';
const STATUS_CANCELLED = 'Cancelled';
const REASON_MAX_LENGTH = 300;

// ============================================
// MAIN HANDLERS
// ============================================

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'cancel') {
      return cancelRegistrations(data, lock);
    }

    const dates = validateData(data);
    const mealType = MEAL_TYPE.toLowerCase();

    // Prevent two simultaneous submissions both passing the duplicate check
    lock.waitLock(20000);

    const sheet = getSheet();
    const existing = findRegistrations(sheet, data.phone, data.fullName);

    const savedDates = [];
    const duplicateDates = [];
    let duplicateType = null;

    dates.forEach(dateKey => {
      const match = existing.find(r => r.mealType === mealType && r.dateKey === dateKey);
      if (match) {
        duplicateDates.push(dateKey);
        duplicateType = duplicateType || match.matchedBy;
      } else {
        savedDates.push(dateKey);
      }
    });

    if (savedDates.length > 0) {
      const timestamp = new Date();
      const rows = savedDates.map(dateKey => [
        timestamp,
        sanitize(data.fullName),
        sanitize(data.phone),
        sanitize(data.email),
        sanitize(data.occupation),
        sanitize(data.address),
        sanitize(data.masjidName),
        MEAL_TYPE,
        formatDateKey(dateKey),
        dateKey,
        STATUS_ACTIVE,
        '',
        ''
      ]);

      const startRow = sheet.getLastRow() + 1;
      const range = sheet.getRange(startRow, 1, rows.length, HEADERS.length);
      // Keep the Date Key column as plain text so Sheets doesn't convert it
      sheet.getRange(startRow, COL.DATE_KEY + 1, rows.length, 1).setNumberFormat('@');
      range.setValues(rows);
      SpreadsheetApp.flush();
    }

    lock.releaseLock();

    if (savedDates.length > 0 && SEND_EMAIL_CONFIRMATION && data.email) {
      sendConfirmationEmail(data, savedDates.map(formatDateKey));
    }

    console.log(`Registration: ${data.fullName} - ${mealType} saved [${savedDates}] duplicate [${duplicateDates}]`);

    const mealLabel = capitalizeFirst(mealType);

    if (savedDates.length === 0) {
      return createJsonResponse({
        success: false,
        isDuplicate: true,
        duplicateType: duplicateType,
        mealType: mealLabel,
        savedDates: [],
        duplicateDates: duplicateDates,
        message: `You are already registered for ${mealLabel} on all selected dates`
      });
    }

    if (duplicateDates.length > 0) {
      return createJsonResponse({
        success: true,
        partialDuplicate: true,
        duplicateType: duplicateType,
        mealType: mealLabel,
        savedDates: savedDates,
        duplicateDates: duplicateDates,
        message: `Saved ${savedDates.length} date(s); ${duplicateDates.length} were already registered`
      });
    }

    return createJsonResponse({
      success: true,
      mealType: mealLabel,
      savedDates: savedDates,
      message: 'Registration saved successfully'
    });

  } catch (error) {
    console.error('Submission error:', error.toString());

    return createJsonResponse({
      success: false,
      error: error.message || error.toString()
    });
  } finally {
    // releaseLock is a no-op if the lock is not held
    lock.releaseLock();
  }
}

function doGet(e) {
  const params = (e && e.parameter) || {};

  if (!params.phone && !params.name) {
    return createJsonResponse({
      status: 'online',
      service: 'RamadanHub Registration API',
      message: 'POST to register, or GET ?phone=... / ?name=... to look up registrations'
    });
  }

  try {
    const registrations = findRegistrations(getSheet(), params.phone, params.name)
      // Only expose meal type and date - never other people's personal details
      .map(r => ({ mealType: capitalizeFirst(r.mealType), date: r.dateKey }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return createJsonResponse({
      success: true,
      count: registrations.length,
      registrations: registrations
    });
  } catch (error) {
    console.error('Lookup error:', error.toString());
    return createJsonResponse({ success: false, error: error.message || error.toString() });
  }
}

// ============================================
// SHEET ACCESS
// ============================================

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`Sheet "${SHEET_NAME}" not found`);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Returns all active (not cancelled) rows that belong to the same person,
 * matched by normalized mobile number OR normalized name.
 */
function findRegistrations(sheet, phone, name) {
  const phoneKey = normalizePhone(phone);
  const nameKey = normalizeName(name);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2 || (!phoneKey && !nameKey)) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const results = [];

  values.forEach(row => {
    // A cancelled booking doesn't block registering for that date again
    if (row[COL.STATUS] === STATUS_CANCELLED) return;

    let matchedBy = null;
    if (phoneKey && normalizePhone(row[COL.PHONE]) === phoneKey) {
      matchedBy = 'phone';
    } else if (nameKey && normalizeName(row[COL.NAME]) === nameKey) {
      matchedBy = 'name';
    }

    if (matchedBy) {
      results.push({
        mealType: String(row[COL.MEAL_TYPE]).toLowerCase().trim(),
        dateKey: toDateKey(row[COL.DATE_KEY]),
        matchedBy: matchedBy
      });
    }
  });

  return results;
}

/**
 * Marks the person's active bookings on the given dates as cancelled.
 * The person is identified by mobile number (phone) or email.
 */
function cancelRegistrations(data, lock) {
  const phoneKey = normalizePhone(data.phone);
  const emailKey = normalizeEmail(data.email);

  if (phoneKey.length < 10 && !emailKey) {
    throw new Error('Enter the mobile number or email you registered with');
  }
  if (emailKey && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKey)) {
    throw new Error('Invalid email format');
  }

  const dates = validateDates(data.dates);
  const today = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
  const past = dates.filter(d => d < today);
  if (past.length > 0) {
    throw new Error(`These dates have already passed: ${past.join(', ')}`);
  }

  const reason = sanitize(String(data.reason || '').slice(0, REASON_MAX_LENGTH));

  lock.waitLock(20000);

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  const values = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const cancelledAt = new Date();
  const cancelled = new Set();

  values.forEach((row, i) => {
    if (row[COL.STATUS] === STATUS_CANCELLED) return;
    const dateKey = toDateKey(row[COL.DATE_KEY]);
    if (!dates.includes(dateKey)) return;

    const samePerson = (phoneKey && normalizePhone(row[COL.PHONE]) === phoneKey) ||
      (emailKey && normalizeEmail(row[COL.EMAIL]) === emailKey);
    if (!samePerson) return;

    // Status, Cancelled At, Cancel Reason are adjacent columns
    sheet.getRange(i + 2, COL.STATUS + 1, 1, 3).setValues([[STATUS_CANCELLED, cancelledAt, reason]]);
    cancelled.add(dateKey);
  });

  SpreadsheetApp.flush();
  lock.releaseLock();

  const cancelledDates = dates.filter(d => cancelled.has(d));
  const notFoundDates = dates.filter(d => !cancelled.has(d));
  console.log(`Cancellation: ${phoneKey || emailKey} cancelled [${cancelledDates}] not found [${notFoundDates}]`);

  if (cancelledDates.length === 0) {
    return createJsonResponse({
      success: false,
      notFound: true,
      notFoundDates: notFoundDates,
      message: 'No active Sehri booking found for these dates'
    });
  }

  return createJsonResponse({
    success: true,
    cancelledDates: cancelledDates,
    notFoundDates: notFoundDates,
    message: `Cancelled Sehri on ${cancelledDates.length} date(s)`
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validates the payload and returns the unique, sorted list of date keys.
 */
function validateData(data) {
  const required = ['fullName', 'phone', 'occupation', 'address', 'masjidName'];
  const missing = required.filter(field => !String(data[field] || '').trim());

  if (!Array.isArray(data.dates) || data.dates.length === 0) {
    missing.push('dates');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  // Email is optional, but must be valid when given
  const email = String(data.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }

  if (normalizePhone(data.phone).length < 10) {
    throw new Error('Invalid mobile number');
  }

  // Only Sehri registrations are accepted (the form sends "suhoor")
  const mealType = String(data.mealType || 'suhoor').toLowerCase();
  if (mealType !== 'suhoor' && mealType !== 'sehri') {
    throw new Error('Only Sehri registrations are accepted');
  }

  return validateDates(data.dates);
}

/**
 * Checks a list of yyyy-MM-dd dates and returns them unique and sorted.
 */
function validateDates(rawDates) {
  if (!Array.isArray(rawDates) || rawDates.length === 0) {
    throw new Error('Missing required fields: dates');
  }

  const dates = [...new Set(rawDates.map(String))].sort();
  dates.forEach(d => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      throw new Error(`Invalid date: ${d}`);
    }
    if (d < RAMADAN_START || d > RAMADAN_END) {
      throw new Error(`Date ${d} is outside Ramadan (${RAMADAN_START} to ${RAMADAN_END})`);
    }
  });

  return dates;
}

/**
 * Keeps the last 10 digits (Indian mobile numbers) so +91 98765 43210,
 * 09876543210 and 919876543210 all compare equal.
 */
function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Sheets may hand back a Date object or a string - always return yyyy-MM-dd.
 */
function toDateKey(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, TIMEZONE, 'yyyy-MM-dd');
  }
  return String(value || '').trim();
}

/**
 * yyyy-MM-dd → "Wed, 10 Feb 2027" (no timezone shifting)
 */
function formatDateKey(dateKey) {
  const parts = dateKey.split('-').map(Number);
  // Noon UTC stays on the same calendar day in Asia/Kolkata
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
  return Utilities.formatDate(date, TIMEZONE, 'EEE, d MMM yyyy');
}

/**
 * Prevents user input like "=IMPORTRANGE(...)" from running as a formula.
 */
function sanitize(value) {
  const str = String(value || '').trim();
  return /^[=+\-@]/.test(str) ? `'${str}` : str;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================
// EMAIL FUNCTION (Optional)
// ============================================

function sendConfirmationEmail(data, formattedDates) {
  const subject = '⭐ RamadanHub: Your Sehri Registration is Confirmed';

  const body = `
Assalamu Alaikum ${data.fullName},

Your Sehri registration has been confirmed!

DETAILS:
- Dates: ${formattedDates.join('; ')}
- Staying at: ${data.address}
- Nearest masjid: ${data.masjidName}
- Sehri ends: around 5:16 - 5:27 AM (see the timetable for each day)

Jazak Allah Khair!

RamadanHub Team
  `;

  try {
    MailApp.sendEmail(data.email, subject, body);
    console.log(`Email sent to ${data.email}`);
  } catch (error) {
    console.error(`Email failed: ${error}`);
  }
}

// ============================================
// TEST FUNCTIONS
// ============================================

function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Test User',
        phone: '+91 98765 43210',
        email: '',
        occupation: 'Student',
        address: 'Test PG, Room 12, Hoskote',
        masjidName: 'Test Masjid',
        mealType: 'suhoor',
        dates: ['2027-02-10', '2027-02-11']
      })
    }
  };

  console.log('Testing submission...');
  const result = doPost(testData);
  console.log('Result:', result.getContent());
}

function testLookup() {
  const result = doGet({ parameter: { phone: '09876543210' } });
  console.log('Lookup result:', result.getContent());
}
