var express = require('express');
var app = express();


var PORT = 3000;
var API_KEY;
var NUMBER  = "(732) 333-6592";

app.get('/', function (req, res){
  ///Placeholder for site
  console.log('reset');
  res.send("There's nothing here, plz help");
});

app.get('/fetch', function(req, res){
  //fetches all songs for the given url
  var number = req.query.phoneNum;
});

app.get('/messageRecieve', function(req, res){
  console.log(req.query);
  res.send('requrest');
});

//Adds song to mongodb server
//Takes in phone number and song / search term
app.get('/addSong', function(req, res){
  var number = req.query.phoneNum;
  var songName = req.query.song;
  var songURL = getSongUrl(songName);
});

function getSongUrl(searchTerm){
  //Search for song using youtube api
}

app.listen(PORT);
console.log("The server is now listening on port " + PORT);
