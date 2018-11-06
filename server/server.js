/*var https = require('https');
var fs = require('fs');
var crypto = require('crypto');
var pKey  = fs.readFileSync('./cert/key.pem', 'utf8');
var certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
var credentials = {key: pKey, cert: certificate};
var path = require("path");
var sharedsession = require("express-socket.io-session");
var bodyParser = require('body-parser');
var crypto_tools = require('./crypto_tools');
var xor = require("buffer-xor");
var pg = require('pg');
var randomstring = require("randomstring");
var Buffer = require('buffer').Buffer;
var conString = "postgres://messenger:Mf5Bc54VC4BV54V7ws@localhost:5432/messenger";
var userSockets = {};       //сокеты, индексированные по ОКп
var userSocketCounter = 0;
var audSockets = {};        //сокеты ДУП индексированные по ОКдуп
var socketKeys = {};        //ключи шифрования сокетных соединений индексированные по именам сокетов
var plain = null;                  //флаг плейнтекста
*/
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var httpsApp = express();
var httpApp = express();


// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/safekid.tk/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/safekid.tk/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/safekid.tk/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};






var port = (process.env.PORT || process.env.VCAP_APP_PORT || 3000);
httpApp.set('port', port);

//redirect http to https
httpApp.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + req.path);
    
});

//environment
httpsApp.use(express.static(path.join(__dirname, 'public')));

httpApp.get("/.well-known/acme-challenge/kUBR80_jj9oo4nrATld0ii7_0ZO2TST6BX-_a9MtKsE", function (req, res, next){
    var filePath = path.join(__dirname, 'confirm_domain.txt');
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
});



//http.createServer(httpApp).listen(httpApp.get('port'), function() {
//    console.log('Express HTTP server listening on port ' + httpApp.get('port'));
//});


const httpServer = http.createServer(httpApp);
const httpsServer = https.createServer(credentials, httpsApp);


httpServer.listen(port, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});



//https.createServer(httpsOptions, httpsApp).listen(httpsApp.get('port'), function() {
//    console.log('Express HTTPS server listening on port ' + httpsApp.get('port'));
//});

//httpsApp.get('/', function (req, res) {
//    res.send('Hello World!');
//});

// Allow static files in the /public directory to be served

