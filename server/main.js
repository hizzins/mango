const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3004;

const { google } = require('googleapis');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./google-generated-creds.json');

server.listen(port, () => {
  console.log('서버시작 http://localhost:' + port);
});

app.use('/public', express.static('./public'));

app.get('/', (req, res) => {
  res.redirect(302, '/');
  res.sendFile(__dirname + '/public/index.html');
});

const jwtClient = new google.auth.JWT(
  creds.client_email,
   null,
  creds.private_key,
   ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive']);


app.get('/getData/:range', (req, res) => {
  console.log('**request**', req.params, req.params.range);
  const { range } = req.params;
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
   if (err) {
     console.log(err);
     return;
   } else {
     console.log("Successfully connected!");
     const spreadsheetId = '1Mi1M3ZQ6O_jVTY62xva6frAuJaWEedwkloLOsokXm-Q';
     const sheets = google.sheets('v4');

     sheets.spreadsheets.values.get({
       auth: jwtClient,
       spreadsheetId: spreadsheetId,
       range
     }, (err, response) => {
         if (err) {
           console.log('The API returned an error:' + err);
         } else {
           console.log('성공', response);
           res.json(response);
           for (let row of response.values) {
              console.log('Title [%s]\t\tRating [%s]', row[0], row[1]);
           }
         }
       });
   }
  });



  //
  // const doc = new GoogleSpreadsheet('1Mi1M3ZQ6O_jVTY62xva6frAuJaWEedwkloLOsokXm-Q');
  //
  // doc.useServiceAccountAuth(creds, function (err) {
  //   // Get all of the rows from the spreadsheet.
  //
  //   doc.getInfo(function(err, info) {
  //     console.log('Loaded doc: '+info.title+' by '+info.author.email);
  //     const sheet = info.worksheets[15];
  //     console.log(info);
  //     console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
  //     res.json(info);
  //   });
  //
  //   doc.getRows(1, function (err, rows) {
  //     res.json(rows);
  //   });
  //
  // });

});

io.on('connection', (socket) => {
  socket.on('send-message', (data) => {
    const { name, message } = data;
    console.log('받았다', data);
    io.emit('recieve-message', data);
  });

  socket.on('disconnect', function() { //3-2
    console.log('user disconnected: ', socket.id);
  });
});


