// Open the "FBA-Tracker (iPad dashboard)" sheet, Extensions > Apps Script, paste this, Run doGet once,
// then Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone. Copy the /exec URL.
// Anyone holding that URL can read these numbers: keep it private.
var SHEET_ID = '1xJX8RgojtrYn1WFcxMXigKMyOL5cHCjexq3OAEvEmLg'; // used only if the script is not attached to the sheet

function rows(ss, name, firstRow) {
  var sh = ss.getSheetByName(name);
  if (!sh || sh.getLastRow() < firstRow) return [];
  return sh.getRange(firstRow, 1, sh.getLastRow() - firstRow + 1, sh.getLastColumn()).getDisplayValues()
    .filter(function (r) { return r[0] && r[0].indexOf('EXAMPLE') !== 0; });
}

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID);
  var summary = rows(ss, 'Summary', 3).slice(0, 5).map(function (r) { return { label: r[0], value: r[1] }; });
  var weeks = rows(ss, 'Summary', 11).map(function (r) { return { week: r[0], profit: r[1], vsGoal: r[2] }; });
  var products = rows(ss, 'Product Check', 4).map(function (r) {
    return { name: r[0], asin: r[1], store: r[2], buy: r[3], sell: r[7], profit: r[12], roi: r[13], verdict: r[14] };
  });
  var log = rows(ss, 'Log', 3).map(function (r) {
    return { date: r[0], name: r[1], units: r[3], sold: r[5], profit: r[8] };
  });
  return ContentService.createTextOutput(JSON.stringify({ summary: summary, weeks: weeks, products: products, log: log }))
    .setMimeType(ContentService.MimeType.JSON);
}
