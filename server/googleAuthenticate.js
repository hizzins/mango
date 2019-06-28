var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./google-generated-creds.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1Mi1M3ZQ6O_jVTY62xva6frAuJaWEedwkloLOsokXm-Q');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    console.log(rows);
  });
});
