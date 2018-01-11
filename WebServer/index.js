const bodyParser = require('body-parser');
const dataService = require('./dataservice');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messageInterval = 2000;
var dbUrl;
var clientUrl;
var nextUrl;
var interval;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

dataService.seedDB("www.yahoo.com");

app.post('/', function(req, res) {
  let data = req.body;
  let response = {
    url: "",
    error: "",
  };
  dataService.getServerUrl(callback);
  function callback(serverUrl) {
//Using the URL provided by the user to navigate.
    if(data.isRedirect == false) {
//URL is empty, send error
      if(data.url == "")
        response.error = "You did not ask to be redirected. Please insert a URL";
//Make sure URL is in proper format    
      else
        response.url = fixUrl(data.url);
    }
//User asked to be redirected, check for valid client side URL and send server side URL
    else {
      if(serverUrl == "")
        response.error = "You asked to be redirected but the server does not have a valid URL";
      else
      {
//Client URL is empty, send and error.
        if(data.url == "")
          response.error = "You asked to be redirected but you did not send a valid URL";
        else {
//Make sure URL is in proper format
          dbUrl = fixUrl(serverUrl);
          clientUrl = fixUrl(data.url);
          response.url = dbUrl;
//Open a socket
          io.on('connect', (socket) => {
            console.log("connect");
//Clear the running interval if the client disconnected
            socket.on('disconnect', function() {
              console.log("disconnect");
              if(interval != null) {
                console.log("clearInterval");
                clearInterval(interval);   
              }
            });
          });
//Start the socket messages
          interval = setInterval(function() {
            console.log("setInterval");
            nextUrl = (nextUrl == dbUrl ? clientUrl : dbUrl);
            io.sockets.send(nextUrl);
          }, messageInterval);
        }
      }
    }
    res.json(response);
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function fixUrl(baseUrl) {
  let url = baseUrl == null ? "" : baseUrl;
  if(url.substring(0, 4) != "http")
    url = "http://" + url;
  return url;
}