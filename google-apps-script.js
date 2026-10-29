/**
 * ========================================
 * RamadanHub - Google Apps Script Backend
 * ========================================
 *
 * This script handles form submissions from the RamadanHub
 * registration form and stores them in Google Sheets.
 *
 * - POST: saves one row per selected date. Dates the person is already
 *   registered for (same meal type, matched by mobile number OR name)
 *   are skipped and reported back as duplicates.
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
const ADMIN_EMAIL = 'hr@company.com';
const TIMEZONE = 'Asia/Kolkata';

// Ramadan 2027 / 1448 AH - expected in India (subject to moon sighting)
// (inclusive, yyyy-MM-dd; the end allows a 30th day)
const RAMADAN_START = '2027-02-09';
const RAMADAN_END = '2027-03-10';
const MAX_GUESTS = 5;

const HEADERS = [
  'Timestamp',
  'Full Name',
  'Employee ID',
  'Email',
  'Phone',
  'Department',
  'Meal Type',
  'Date',
  'Date Key',
  'Guests',
  'Dietary Notes'
];

// 0-based column indexes, must match HEADERS
const COL = {
  NAME: 1,
  PHONE: 4,
  MEAL_TYPE: 6,
  DATE_KEY: 8
};

// ============================================
// MAIN HANDLERS
// ============================================

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const data = JSON.parse(e.postData.contents);
    const dates = validateData(data);
    const mealType = String(data.mealType).toLowerCase();

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
        sanitize(data.employeeId),
        sanitize(data.email),
        sanitize(data.phone),
        sanitize(data.department),
        capitalizeFirst(mealType),
        formatDateKey(dateKey),
        dateKey,
        Number(data.guestCount) || 1,
        sanitize(data.dietaryNotes)
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
 * Returns all rows that belong to the same person, matched by
 * normalized mobile number OR normalized name.
 */
function findRegistrations(sheet, phone, name) {
  const phoneKey = normalizePhone(phone);
  const nameKey = normalizeName(name);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2 || (!phoneKey && !nameKey)) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const results = [];

  values.forEach(row => {
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
  const required = ['fullName', 'email', 'phone', 'department', 'mealType'];
  const missing = required.filter(field => !String(data[field] || '').trim());

  if (!Array.isArray(data.dates) || data.dates.length === 0) {
    missing.push('dates');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email format');
  }

  if (normalizePhone(data.phone).length < 7) {
    throw new Error('Invalid phone number');
  }

  const mealType = String(data.mealType).toLowerCase();
  if (mealType !== 'iftar' && mealType !== 'suhoor') {
    throw new Error('Invalid meal type');
  }

  const guests = Number(data.guestCount || 1);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    throw new Error(`Guest count must be between 1 and ${MAX_GUESTS}`);
  }

  const dates = [...new Set(data.dates.map(String))].sort();
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
  const mealEmoji = data.mealType === 'iftar' ? '🌙' : '⭐';
  const mealTime = data.mealType === 'iftar' ? '~6:28 PM' : '~4:30 AM';

  const subject = `${mealEmoji} RamadanHub: Your ${capitalizeFirst(data.mealType)} Registration is Confirmed`;

  const body = `
Assalamu Alaikum ${data.fullName},

Your registration has been confirmed!

DETAILS:
- Meal Type: ${capitalizeFirst(data.mealType)}
- Dates: ${formattedDates.join('; ')}
- Time: ${mealTime}
- Guests: ${data.guestCount}
${data.dietaryNotes ? `- Dietary Notes: ${data.dietaryNotes}` : ''}

Location: Main Conference Hall

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
        employeeId: 'EMP-TEST',
        email: 'test@example.com',
        phone: '+91 98765 43210',
        department: 'IT',
        mealType: 'iftar',
        dates: ['2027-02-10', '2027-02-11'],
        guestCount: '2',
        dietaryNotes: 'Vegetarian'
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
