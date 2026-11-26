/**
 * ========================================
 * RamadanHub - Google Apps Script Backend
 * ========================================
 *
 * This script handles Sehri registrations from the RamadanHub form
 * (people staying in PGs / hostels / rooms in Hoskote) and stores them
 * in Google Sheets.
 *
 * ONE ROW PER PERSON. A person is identified by mobile number, or by
 * email when the mobile number doesn't match. All of their dates are
 * kept in that one row:
 *   - "Dates"            active Sehri dates (yyyy-MM-dd, comma separated)
 *   - "Cancelled Dates"  dates the person cancelled
 *   - "Removed Dates"    dates an admin removed
 * Every change (registered / cancelled / removed, with time and reason)
 * is also written to the "History" sheet, which is created automatically.
 *
 * - POST: adds the selected dates to the person's row (creating the row
 *   the first time). Dates they already have are reported as duplicates.
 * - POST {action:'cancel'}: moves dates from "Dates" to "Cancelled Dates".
 * - GET ?phone=... or ?email=...: returns that person's active dates
 *   (meal type + dates only, no personal details).
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Update SPREADSHEET_ID below
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy Web App URL to your .env.local file
 *    (NEXT_PUBLIC_GOOGLE_SCRIPT_URL=...)
 * 7. Admin dashboard: Project Settings → Script Properties → add
 *    ADMIN_KEY = a long random value (at least 32 characters). Put the
 *    same value in the website's ADMIN_API_KEY environment variable.
 *    Removing a person sends them an email, so Google will ask you to
 *    authorize "Send email as you" when you deploy.
 *
 * UPGRADING FROM THE OLD ONE-ROW-PER-DATE SHEET:
 * Run migrateToOnePerPerson() once from the editor (select it in the
 * function list → Run). It copies the old sheet to a backup tab first,
 * then rewrites Sheet1 with one row per person.
 *
 * The header row is created automatically on an empty sheet.
 * After editing this file, create a NEW deployment version
 * (Deploy → Manage deployments → Edit → New version), otherwise
 * the web app keeps running the old code.
 */

/**
 * First in the file so the editor's Run button picks it by default.
 * Converts the old one-row-per-date sheet; safe to run again (it does
 * nothing once the sheet is converted).
 */
function runMeFirst_convertSheet() {
  migrateToOnePerPerson();
}

// ============================================
// CONFIGURATION
// ============================================

const SPREADSHEET_ID = '15eLrUfUYoP2F_EB72ddowXhdrrkOUgnowOx5d9fQNUk';
const SHEET_NAME = 'Sheet1';
const HISTORY_SHEET_NAME = 'History';
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
  'Dates',
  'Total Days',
  'Cancelled Dates',
  'Removed Dates',
  'Last Updated'
];

// 0-based column indexes, must match HEADERS
const COL = {
  TIMESTAMP: 0,
  NAME: 1,
  PHONE: 2,
  EMAIL: 3,
  OCCUPATION: 4,
  ADDRESS: 5,
  MASJID: 6,
  MEAL_TYPE: 7,
  DATES: 8,
  TOTAL_DAYS: 9,
  CANCELLED: 10,
  REMOVED: 11,
  UPDATED: 12
};

// Columns kept as plain text so Sheets doesn't turn "2027-02-09" into a date
// or drop the leading + / 0 of a phone number
const TEXT_COLUMNS = [COL.PHONE, COL.DATES, COL.CANCELLED, COL.REMOVED];

const HISTORY_HEADERS = ['Timestamp', 'Full Name', 'Phone', 'Action', 'Dates', 'Note'];
const HCOL = { TIMESTAMP: 0, NAME: 1, PHONE: 2, ACTION: 3, DATES: 4, NOTE: 5 };

const STATUS_ACTIVE = 'Active';
const STATUS_CANCELLED = 'Cancelled';
const STATUS_REMOVED = 'Removed';
const ACTION_REGISTERED = 'Registered';
const REASON_MAX_LENGTH = 300;

// ============================================
// MAIN HANDLERS
// ============================================

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    if (!e || !e.postData) {
      // Happens when doPost is run from the editor's Run button
      throw new Error('doPost only runs when the website calls it. To convert the sheet, pick migrateToOnePerPerson in the function list and click Run.');
    }
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'cancel') {
      return cancelRegistrations(data, lock);
    }

    if (data.action === 'admin.list' || data.action === 'admin.remove') {
      if (!isAdminRequest(data)) {
        return createJsonResponse({ success: false, error: 'Not authorized' });
      }
      return data.action === 'admin.list' ? adminList() : adminRemove(data, lock);
    }

    return register(data, lock);
  } catch (error) {
    console.error('Request error:', error.toString());

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

  if (!params.phone && !params.email) {
    return createJsonResponse({
      status: 'online',
      service: 'RamadanHub Registration API',
      message: 'POST to register, or GET ?phone=... / ?email=... to look up registrations'
    });
  }

  try {
    const sheet = getSheet();
    const values = readRows(sheet);
    const index = findPersonIndex(values, params.phone, params.email).index;
    const dates = index === -1 ? [] : parseDateList(values[index][COL.DATES]);

    // Only expose meal type and date - never other people's personal details
    const registrations = dates.map(date => ({ mealType: MEAL_TYPE, date: date }));

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
// REGISTRATION
// ============================================

/**
 * Adds the selected dates to the person's row, or creates the row.
 */
function register(data, lock) {
  const dates = validateData(data);

  // Prevent two simultaneous submissions both creating a row for the same person
  lock.waitLock(20000);

  const sheet = getSheet();
  const values = readRows(sheet);
  const match = findPersonIndex(values, data.phone, data.email);
  const now = new Date();

  let savedDates;
  let row;
  let duplicateDates = [];

  if (match.index === -1) {
    savedDates = dates;
    row = [
      now,
      sanitize(data.fullName),
      sanitize(data.phone),
      sanitize(data.email),
      sanitize(data.occupation),
      sanitize(data.address),
      sanitize(data.masjidName),
      MEAL_TYPE,
      '', 0, '', '', now
    ];
    setDateColumns(row, dates, [], []);
    writeRow(sheet, sheet.getLastRow() + 1, row);
  } else {
    row = values[match.index];
    const active = parseDateList(row[COL.DATES]);
    duplicateDates = dates.filter(d => active.includes(d));
    savedDates = dates.filter(d => !active.includes(d));

    if (savedDates.length > 0) {
      // Keep the person's details up to date with their latest submission.
      // The phone number stays as first registered (it identifies the person).
      row[COL.NAME] = sanitize(data.fullName);
      if (String(data.email || '').trim()) row[COL.EMAIL] = sanitize(data.email);
      row[COL.OCCUPATION] = sanitize(data.occupation);
      row[COL.ADDRESS] = sanitize(data.address);
      row[COL.MASJID] = sanitize(data.masjidName);
      row[COL.UPDATED] = now;

      // A date that was cancelled or removed before becomes active again
      setDateColumns(
        row,
        active.concat(savedDates),
        parseDateList(row[COL.CANCELLED]).filter(d => !savedDates.includes(d)),
        parseDateList(row[COL.REMOVED]).filter(d => !savedDates.includes(d))
      );
      writeRow(sheet, match.index + 2, row);
    }
  }

  if (savedDates.length > 0) {
    logHistory(now, row[COL.NAME], row[COL.PHONE], ACTION_REGISTERED, savedDates, '');
    SpreadsheetApp.flush();
  }

  lock.releaseLock();

  if (savedDates.length > 0 && SEND_EMAIL_CONFIRMATION && data.email) {
    sendConfirmationEmail(data, savedDates.map(formatDateKey));
  }

  console.log(`Registration: ${data.fullName} saved [${savedDates}] duplicate [${duplicateDates}]`);

  if (savedDates.length === 0) {
    return createJsonResponse({
      success: false,
      isDuplicate: true,
      duplicateType: match.matchedBy,
      mealType: MEAL_TYPE,
      savedDates: [],
      duplicateDates: duplicateDates,
      message: `You are already registered for ${MEAL_TYPE} on all selected dates`
    });
  }

  if (duplicateDates.length > 0) {
    return createJsonResponse({
      success: true,
      partialDuplicate: true,
      duplicateType: match.matchedBy,
      mealType: MEAL_TYPE,
      savedDates: savedDates,
      duplicateDates: duplicateDates,
      message: `Saved ${savedDates.length} date(s); ${duplicateDates.length} were already registered`
    });
  }

  return createJsonResponse({
    success: true,
    mealType: MEAL_TYPE,
    savedDates: savedDates,
    message: 'Registration saved successfully'
  });
}

// ============================================
// CANCELLATION
// ============================================

/**
 * Moves the given dates from the person's "Dates" to "Cancelled Dates".
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
  const values = readRows(sheet);
  const now = new Date();
  const cancelled = new Set();

  values.forEach((row, i) => {
    const samePerson = (phoneKey && normalizePhone(row[COL.PHONE]) === phoneKey) ||
      (emailKey && normalizeEmail(row[COL.EMAIL]) === emailKey);
    if (!samePerson) return;

    const active = parseDateList(row[COL.DATES]);
    const toCancel = dates.filter(d => active.includes(d));
    if (toCancel.length === 0) return;

    setDateColumns(
      row,
      active.filter(d => !toCancel.includes(d)),
      parseDateList(row[COL.CANCELLED]).concat(toCancel),
      parseDateList(row[COL.REMOVED])
    );
    row[COL.UPDATED] = now;
    writeRow(sheet, i + 2, row);
    logHistory(now, row[COL.NAME], row[COL.PHONE], STATUS_CANCELLED, toCancel, reason);
    toCancel.forEach(d => cancelled.add(d));
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
// ADMIN (called only by the website's server, with the admin key)
// ============================================

function isAdminRequest(data) {
  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  return Boolean(expected) && expected.length >= 32 && data.key === expected;
}

function toIso(value) {
  return value instanceof Date ? value.toISOString() : String(value || '');
}

/**
 * All bookings for the admin dashboard - one entry per person per date
 * (active, cancelled and removed), so the dashboard can count each day.
 */
function adminList() {
  const sheet = getSheet();
  const values = readRows(sheet);

  // Latest cancel / remove event per phone + date, for "when" and "why"
  const events = {};
  readHistory().forEach(h => {
    if (h[HCOL.ACTION] !== STATUS_CANCELLED && h[HCOL.ACTION] !== STATUS_REMOVED) return;
    const phoneKey = normalizePhone(h[HCOL.PHONE]);
    parseDateList(h[HCOL.DATES]).forEach(date => {
      events[`${phoneKey}|${date}|${h[HCOL.ACTION]}`] = {
        at: toIso(h[HCOL.TIMESTAMP]),
        note: String(h[HCOL.NOTE] || '')
      };
    });
  });

  const registrations = [];
  values.forEach((row, i) => {
    if (!row[COL.NAME] && !row[COL.PHONE]) return;

    // Drop the apostrophe sanitize() adds in front of +, -, = and @
    const text = col => String(row[col] || '').replace(/^'/, '');
    const person = {
      row: i + 2,
      timestamp: toIso(row[COL.TIMESTAMP]),
      fullName: text(COL.NAME),
      phone: text(COL.PHONE),
      email: text(COL.EMAIL),
      occupation: text(COL.OCCUPATION),
      address: text(COL.ADDRESS),
      masjidName: text(COL.MASJID)
    };
    const phoneKey = normalizePhone(row[COL.PHONE]);

    const add = (date, status) => {
      const event = events[`${phoneKey}|${date}|${status}`];
      registrations.push(Object.assign({}, person, {
        date: date,
        status: status,
        statusChangedAt: event ? event.at : '',
        reason: event ? event.note : ''
      }));
    };

    parseDateList(row[COL.DATES]).forEach(d => add(d, STATUS_ACTIVE));
    parseDateList(row[COL.CANCELLED]).forEach(d => add(d, STATUS_CANCELLED));
    parseDateList(row[COL.REMOVED]).forEach(d => add(d, STATUS_REMOVED));
  });

  return createJsonResponse({ success: true, registrations: registrations });
}

/**
 * Removes one or more dates from a person's row and sends them one email
 * (if they gave an email). Takes { row, phone, dates: [...] } (or a single `date`).
 * The row is identified by number, and must still hold the same phone, so a row
 * that moved (e.g. after manual edits) is never changed by mistake.
 */
function adminRemove(data, lock) {
  const rowNumber = Number(data.row);
  const requested = uniqueSorted((Array.isArray(data.dates) ? data.dates : [data.date]).map(d => String(d || '')))
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (requested.length === 0) {
    return createJsonResponse({ success: false, error: 'No dates given' });
  }

  lock.waitLock(20000);

  const sheet = getSheet();
  if (!Number.isInteger(rowNumber) || rowNumber < 2 || rowNumber > sheet.getLastRow()) {
    return createJsonResponse({ success: false, error: 'Booking not found - refresh and try again' });
  }

  const row = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0];
  const active = parseDateList(row[COL.DATES]);

  if (normalizePhone(row[COL.PHONE]) !== normalizePhone(data.phone)) {
    return createJsonResponse({ success: false, error: 'This booking has changed - refresh and try again' });
  }
  // Only dates that are still active can be removed
  const toRemove = requested.filter(d => active.includes(d));
  if (toRemove.length === 0) {
    const all = (list) => requested.every(d => parseDateList(row[list]).includes(d));
    if (all(COL.CANCELLED)) {
      return createJsonResponse({ success: false, error: 'This booking is already cancelled' });
    }
    if (all(COL.REMOVED)) {
      return createJsonResponse({ success: false, error: 'This booking is already removed' });
    }
    return createJsonResponse({ success: false, error: 'This booking has changed - refresh and try again' });
  }

  const removedBy = sanitize(String(data.removedBy || 'admin').slice(0, 60));
  const now = new Date();
  setDateColumns(
    row,
    active.filter(d => !toRemove.includes(d)),
    parseDateList(row[COL.CANCELLED]),
    parseDateList(row[COL.REMOVED]).concat(toRemove)
  );
  row[COL.UPDATED] = now;
  writeRow(sheet, rowNumber, row);
  logHistory(now, row[COL.NAME], row[COL.PHONE], STATUS_REMOVED, toRemove, `Removed by admin (${removedBy})`);
  SpreadsheetApp.flush();
  lock.releaseLock();

  const emailed = sendRemovalEmail(row, toRemove);
  console.log(`Admin ${removedBy} removed [${toRemove}] from row ${rowNumber}, emailed: ${emailed}`);
  return createJsonResponse({ success: true, emailed: emailed, removedDates: toRemove });
}

/**
 * Tells the person which of their bookings were removed. Returns true if an email was sent.
 */
function sendRemovalEmail(row, dateKeys) {
  const email = normalizeEmail(row[COL.EMAIL]).replace(/^'/, '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;

  const name = String(row[COL.NAME] || '').replace(/^'/, '');
  const dates = dateKeys.map(formatDateKey).join('; ');
  const masjid = String(row[COL.MASJID] || '').replace(/^'/, '');
  const remaining = parseDateList(row[COL.DATES]);
  const plural = dateKeys.length > 1;

  const subject = 'RamadanHub: Your Sehri registration has been removed';
  const body = `
Assalamu Alaikum ${name},

Your Sehri registration for ${dates}${masjid ? ` (nearest masjid: ${masjid})` : ''} has been removed from the list by the RamadanHub organisers.
${remaining.length > 0 ? `\nYour other Sehri dates are unchanged: ${remaining.map(formatDateKey).join('; ')}\n` : ''}
If you think this is a mistake, or you still need Sehri on ${plural ? 'these dates' : 'this date'}, please contact us at ${ADMIN_EMAIL} or register again on the website.

Jazak Allah Khair,
RamadanHub Team - Hoskote
  `;

  try {
    MailApp.sendEmail(email, subject, body);
    return true;
  } catch (error) {
    console.error(`Removal email failed: ${error}`);
    return false;
  }
}

// ============================================
// SHEET ACCESS
// ============================================

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet() {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`Sheet "${SHEET_NAME}" not found`);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, COL.DATES + 1).getValue() !== HEADERS[COL.DATES]) {
    // Refuse to write new-format rows into the old one-row-per-date sheet
    throw new Error('The sheet uses the old layout - run migrateToOnePerPerson() in the Apps Script editor');
  }

  return sheet;
}

function getHistorySheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(HISTORY_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(HISTORY_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HISTORY_HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/** All person rows (without the header). */
function readRows(sheet) {
  const lastRow = sheet.getLastRow();
  return lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

function readHistory() {
  const sheet = getSpreadsheet().getSheetByName(HISTORY_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, HISTORY_HEADERS.length).getValues();
}

function writeRow(sheet, rowNumber, row) {
  TEXT_COLUMNS.forEach(col => sheet.getRange(rowNumber, col + 1).setNumberFormat('@'));
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([row]);
}

function logHistory(timestamp, name, phone, action, dates, note) {
  const sheet = getHistorySheet();
  const rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, HCOL.PHONE + 1).setNumberFormat('@');
  sheet.getRange(rowNumber, HCOL.DATES + 1).setNumberFormat('@');
  sheet.getRange(rowNumber, 1, 1, HISTORY_HEADERS.length).setValues([[
    timestamp, String(name || ''), String(phone || ''), action, joinDateList(dates), note || ''
  ]]);
}

/**
 * Finds the person's row: by mobile number first, then by email.
 * Returns { index, matchedBy } (index is 0-based into readRows(), -1 if none).
 */
function findPersonIndex(values, phone, email) {
  const phoneKey = normalizePhone(phone);
  const emailKey = normalizeEmail(email);

  if (phoneKey) {
    const index = values.findIndex(row => normalizePhone(row[COL.PHONE]) === phoneKey);
    if (index !== -1) return { index: index, matchedBy: 'phone' };
  }
  if (emailKey) {
    const index = values.findIndex(row => normalizeEmail(row[COL.EMAIL]) === emailKey);
    if (index !== -1) return { index: index, matchedBy: 'email' };
  }
  return { index: -1, matchedBy: null };
}

/** Writes the three date columns and the day count into a row array. */
function setDateColumns(row, active, cancelled, removed) {
  const activeList = uniqueSorted(active);
  row[COL.DATES] = joinDateList(activeList);
  row[COL.TOTAL_DAYS] = activeList.length;
  row[COL.CANCELLED] = joinDateList(uniqueSorted(cancelled).filter(d => !activeList.includes(d)));
  row[COL.REMOVED] = joinDateList(uniqueSorted(removed).filter(d => !activeList.includes(d)));
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

  const dates = uniqueSorted(rawDates.map(String));
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

function uniqueSorted(list) {
  return [...new Set(list)].sort();
}

/**
 * "2027-02-09, 2027-02-10" (or a Date, if Sheets converted a single date) → ['2027-02-09', '2027-02-10']
 */
function parseDateList(value) {
  if (value instanceof Date) return [toDateKey(value)];
  return String(value || '')
    .split(/[,;\s]+/)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
}

function joinDateList(dates) {
  return dates.join(', ');
}

/**
 * Keeps the last 10 digits (Indian mobile numbers) so +91 98765 43210,
 * 09876543210 and 919876543210 all compare equal.
 */
function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
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
- Sehri ends (Hoskote): around 5:15 - 5:27 AM (see the timetable for each day)

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
// ONE-TIME MIGRATION (old one-row-per-date sheet → one row per person)
// ============================================

/**
 * Run once from the editor. Copies the old sheet to a backup tab, then
 * rewrites it with one row per person (grouped by mobile number) and
 * records old cancellations / removals in the History sheet.
 */
function migrateToOnePerPerson() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found`);

  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (header[COL.DATES] === HEADERS[COL.DATES]) {
    console.log('Already migrated - nothing to do');
    return;
  }
  // Old layout: ... Meal Type, Date, Date Key, Status, Cancelled At, Cancel Reason
  const OLD = { DATE_KEY: 9, STATUS: 10, CHANGED_AT: 11, REASON: 12 };
  if (header[OLD.DATE_KEY] !== 'Date Key') {
    throw new Error('Unrecognised sheet layout - expected the old "Date Key" column in J');
  }

  const oldRows = sheet.getLastRow() < 2 ? [] :
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();

  sheet.copyTo(ss).setName(`${SHEET_NAME} backup (per-date) ${Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HHmm')}`);

  const people = [];   // new rows, in order of first registration
  const byKey = {};
  const history = [];

  oldRows.forEach(old => {
    if (!old[COL.NAME] && !old[COL.PHONE]) return;
    const key = normalizePhone(old[COL.PHONE]) || normalizeEmail(old[COL.EMAIL]);
    const date = toDateKey(old[OLD.DATE_KEY]);
    const status = old[OLD.STATUS] || STATUS_ACTIVE;

    let person = byKey[key];
    if (!person) {
      person = {
        row: [old[COL.TIMESTAMP], old[COL.NAME], String(old[COL.PHONE]), old[COL.EMAIL], old[COL.OCCUPATION],
          old[COL.ADDRESS], old[COL.MASJID], MEAL_TYPE, '', 0, '', '', old[COL.TIMESTAMP]],
        active: [], cancelled: [], removed: []
      };
      byKey[key] = person;
      people.push(person);
    } else {
      // Later rows hold the person's latest details
      [COL.NAME, COL.EMAIL, COL.OCCUPATION, COL.ADDRESS, COL.MASJID].forEach(c => {
        if (String(old[c] || '').trim()) person.row[c] = old[c];
      });
      person.row[COL.UPDATED] = old[COL.TIMESTAMP];
    }

    history.push([old[COL.TIMESTAMP], old[COL.NAME], String(old[COL.PHONE]), ACTION_REGISTERED, date, '']);
    if (status === STATUS_CANCELLED || status === STATUS_REMOVED) {
      (status === STATUS_CANCELLED ? person.cancelled : person.removed).push(date);
      history.push([old[OLD.CHANGED_AT], old[COL.NAME], String(old[COL.PHONE]), status, date, old[OLD.REASON]]);
      if (old[OLD.CHANGED_AT] instanceof Date && old[OLD.CHANGED_AT] > person.row[COL.UPDATED]) {
        person.row[COL.UPDATED] = old[OLD.CHANGED_AT];
      }
    } else {
      person.active.push(date);
    }
  });

  const newRows = people.map(p => {
    setDateColumns(p.row, p.active, p.cancelled, p.removed);
    return p.row;
  });

  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  if (newRows.length > 0) {
    TEXT_COLUMNS.forEach(c => sheet.getRange(2, c + 1, newRows.length, 1).setNumberFormat('@'));
    sheet.getRange(2, 1, newRows.length, HEADERS.length).setValues(newRows);
  }

  if (history.length > 0) {
    history.sort((a, b) => new Date(a[0]) - new Date(b[0]));
    const historySheet = getHistorySheet();
    const start = historySheet.getLastRow() + 1;
    historySheet.getRange(start, HCOL.PHONE + 1, history.length, 1).setNumberFormat('@');
    historySheet.getRange(start, HCOL.DATES + 1, history.length, 1).setNumberFormat('@');
    historySheet.getRange(start, 1, history.length, HISTORY_HEADERS.length).setValues(history);
  }

  console.log(`Migrated ${oldRows.length} date rows into ${newRows.length} people`);
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
