/**
 * Free lead storage in a Google Sheet (no database).
 * 1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
 * 2. Deploy → New deployment → Web app. Execute as: Me. Access: Anyone.
 * 3. Copy the web app URL into LEADS_WEBHOOK_URL (add ?secret=... and set
 *    the same value below so strangers can't write to your sheet).
 */
const SECRET = "change-me";
const COLUMNS = [
  "submitted_at", "name", "business_name", "business_type", "phone", "email",
  "consent_email", "consent_email_text", "consent_ai_call", "consent_ai_call_text",
  "consent_version", "ip", "user_agent",
];

function doPost(e) {
  if (e.parameter.secret !== SECRET) return ContentService.createTextOutput("forbidden");
  const lead = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  sheet.appendRow(COLUMNS.map((c) => (lead[c] === null || lead[c] === undefined ? "" : String(lead[c]))));
  return ContentService.createTextOutput("ok");
}
