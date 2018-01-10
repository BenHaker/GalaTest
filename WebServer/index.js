const bodyParser = require('body-parser');
const dataService = require('./dataservice');
var app = require('express')();
var http = require('http').Server(app);

//app.use(bodyParser.urlencoded({ extended: false }));
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
    error: ""
  };
  dataService.getServerUrl(callback);
  function callback(serverUrl) {
//using the URL provided by the user to navigate.
    if(data.isRedirect == false) {
//URL is empty, send error
      if(data.url == "")
        response.error = "If you did not ask to be redirected, please insert a URL";
//make sure URL is in proper format    
      else
        response.url = fixUrl(data.url);
    }
//user asked to be redirected, send server side URL
    else {
      if(serverUrl == "")
        response.error = "You asked to be redirected but the server does not have a valid URL";
//make sure URL is in proper format    
      else
        response.url = fixUrl(serverUrl);
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