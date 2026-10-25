/**
 * Google Apps Script backend for the Aai Medicines PWA.
 * Create a new Google Sheet, then Extensions > Apps Script, paste this, save.
 * Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * Copy the /exec URL into the app's Settings tab.
 *
 * Every tick or untick in the app arrives as an event row in the "DoseLog" tab.
 * Rows carry a client id, so re-syncing never creates duplicates.
 */

var SHEET_NAME = 'DoseLog';
var HEADERS = ['id', 'date', 'slot', 'medicine', 'dose', 'action', 'undoes', 'by', 'deviceTime', 'savedAt'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var values = getSheet_().getDataRange().getValues();
    var rows = [];
    for (var i = 1; i < values.length; i++) {
      var obj = {};
      for (var c = 0; c < HEADERS.length; c++) obj[HEADERS[c]] = values[i][c];
      if (obj.id) rows.push(obj);
    }
    return json_({ ok: true, rows: rows });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var events = body.events || [];
    if (!events.length) return json_({ ok: false, error: 'no events' });
    var sh = getSheet_();
    var existing = {};
    var n = Math.max(sh.getLastRow() - 1, 0);
    if (n) sh.getRange(2, 1, n, 1).getValues().forEach(function (r) { if (r[0]) existing[r[0]] = true; });
    var written = 0;
    events.forEach(function (ev) {
      if (!ev.id || existing[ev.id]) return;
      sh.appendRow(HEADERS.map(function (h) {
        if (h === 'savedAt') return new Date();
        return ev[h] === undefined || ev[h] === null ? '' : ev[h];
      }));
      existing[ev.id] = true;
      written++;
    });
    return json_({ ok: true, written: written });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
