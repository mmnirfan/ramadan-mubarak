/**
 * ========================================
 * RamadanHub - Google Apps Script Backend
 * ========================================
 * 
 * This script handles form submissions from the RamadanHub
 * registration form and stores them in Google Sheets.
 * 
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Update SPREADSHEET_ID below
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy Web App URL to your .env.local file
 */

// ============================================
// CONFIGURATION
// ============================================

const SPREADSHEET_ID = '15eLrUfUYoP2F_EB72ddowXhdrrkOUgnowOx5d9fQNUk';
const SHEET_NAME = 'Sheet1';
const SEND_EMAIL_CONFIRMATION = false;
const ADMIN_EMAIL = 'hr@company.com';

// ============================================
// MAIN HANDLERS
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    validateData(data);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    const timestamp = new Date().toLocaleString('en-AE', { 
      timeZone: 'Asia/Dubai',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    
    const mealDate = data.date ? formatDate(data.date) : '';
    
    sheet.appendRow([
      timestamp,
      data.fullName || '',
      data.employeeId || '',
      data.email || '',
      data.phone || '',
      data.department || '',
      capitalizeFirst(data.mealType) || '',
      mealDate,
      data.guestCount || '1',
      data.dietaryNotes || ''
    ]);
    
    if (SEND_EMAIL_CONFIRMATION && data.email) {
      sendConfirmationEmail(data, mealDate);
    }
    
    console.log(`Registration saved: ${data.fullName} - ${data.mealType} on ${mealDate}`);
    
    return createJsonResponse({ 
      success: true, 
      message: 'Registration saved successfully'
    });
      
  } catch (error) {
    console.error('Submission error:', error.toString());
    
    return createJsonResponse({ 
      success: false, 
      error: error.toString() 
    });
  }
}

function doGet(e) {
  return createJsonResponse({ 
    status: 'online',
    service: 'RamadanHub Registration API',
    message: 'Use POST method to submit registrations'
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

function validateData(data) {
  const required = ['fullName', 'email', 'department', 'mealType', 'date'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format');
  }
}

function formatDate(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-AE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return isoDate;
  }
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================
// EMAIL FUNCTION (Optional)
// ============================================

function sendConfirmationEmail(data, formattedDate) {
  const mealEmoji = data.mealType === 'iftar' ? '🌙' : '⭐';
  const mealTime = data.mealType === 'iftar' ? '~6:18 PM' : '~4:30 AM';
  
  const subject = `${mealEmoji} RamadanHub: Your ${capitalizeFirst(data.mealType)} Registration is Confirmed`;
  
  const body = `
Assalamu Alaikum ${data.fullName},

Your registration has been confirmed!

DETAILS:
- Meal Type: ${capitalizeFirst(data.mealType)}
- Date: ${formattedDate}
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
// TEST FUNCTION
// ============================================

function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Test User',
        employeeId: 'EMP-TEST',
        email: 'test@example.com',
        phone: '+971 50 123 4567',
        department: 'IT',
        mealType: 'iftar',
        date: '2026-02-20',
        guestCount: '2',
        dietaryNotes: 'Vegetarian'
      })
    }
  };
  
  console.log('Testing submission...');
  const result = doPost(testData);
  console.log('Result:', result.getContent());
}
