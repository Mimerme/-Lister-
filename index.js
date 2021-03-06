var TWILIO_SID, TWILIO_APP_ID, MONGO_DATABASE, YOUTUBE_API;
var google = require('googleapis');
var customsearch = google.customsearch('v1');
var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('./creds.json', 'utf8'));
var path = require('path');

TWILIO_SID = obj.TWILIO_SID;
TWILIO_APP_ID = obj.TWILIO_APP_ID;
MONGO_DATABASE = obj.MONGO_DATABASE;
YOUTUBE_API = obj.YOUTUBE_API;

var express = require('express');
var client = require('twilio')(TWILIO_SID, TWILIO_APP_ID);
var MongoClient = require("mongodb").MongoClient;
var request = require('request');
var app = express();
var db;

//-r -D

var DEPLOY_TEST = "7";
var PORT = 3000;
var API_KEY;
var NUMBER  = "+17323336592";

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
console.log("Running deploy test " + DEPLOY_TEST);

//Open the connection to the database
MongoClient.connect(MONGO_DATABASE, function (err, database) {
    if (err) {
        console.log("There was a problem trying to connect to the database " +
        "the application has bene terminated");
        throw err;
    } else {
      db = database;
        console.log("successfully connected to the database");
        //Simulate should crash the server, does not specify res value
        //console.log("simulating a test text");
        //simulate();
        //console.log(db.collection('users').findOne({"phoneNumber": "+18482294098"}));
        //getSong("Im like hey whats up", function(){});
    }
});
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//Allows client to fetch for the request
app.get('/fetch', function(req, res){
  //fetches all songs for the given url
  var number = req.query.phoneNum;
  var s;
  db.collection('users').find({"phoneNumber": "+1" + number}).forEach(function(u) {
     res.send(u.songs);
     return;
     });
  return;
});

//Adds song to mongodb server
//Takes in phone number and song / search term
app.get('/addSong', function(req, res){
  var number = req.query.From;
  var text = req.query.Body;

  var songName = parseBody(text.toLowerCase());
  var lyrics = parseLyric(text.toLowerCase());

  //Invalid syntax
  if(songName == null){
    if(lyrics == null){
      sendMessage(number, "The syntax of your request was invalid");
      res.send("Reponse Finished: With Error by user");
      return;
    }
    getSong(lyrics, function(reply){
      if(reply == -99){
        sendMessage(number, "We weren't able to identify your song ;_;");
        return;
      }

      if(typeof reply !== 'undefined' && reply){
      sendMessage(number, "The song should be " + reply.replace(" - A-Z Lyrics", ""));
      var s = reply.replace(" - A-Z Lyrics", "").split("-")[1].replace(" ", "");
      if(s == null){
        console.log("null caught");
        return;
      }
      getSongUrl(s,
      function(response){
        var videoID = JSON.parse(response).items[0].id.videoId;
        addToDatabase(number, videoID);
        return;
      });
    }
    });
  }

  getSongUrl(songName, function(response){
    if(JSON.parse(response).items.length > 0){
    var videoID = JSON.parse(response).items[0].id.videoId;
    sendMessage(number, "The song has been added to your playlist");
    addToDatabase(number, videoID);
    res.send("Reponse Finished: With Success");
  }
    return;
  });
});

function getSong(lyric, callback){
  customsearch.cse.list({ cx: '013924013317681380050:mhj2yarvy-q', q: lyric, auth: "AIzaSyAhsmn1-SsD12eowR4dYzY4V4TPsJsP_TI" }, function(err, resp) {
  if (err) {
    console.log('An error occured', err);
    return;
  }
  // Got the response from custom search
  console.log('Result: ' + resp.searchInformation.formattedTotalResults);
  console.log(resp.items);
  if(typeof resp.items !== 'undefined' && resp.items){
  if (resp.items && resp.items.length > 0) {
    callback(resp.items[0].title);
  }
}
else{
  callback(-99);
}
});
}

function parseLyric(body){
  if(body.indexOf("lyric ") == -1){
    return null;
  }
  return body.replace("lyric ", "");
}

//Send a message through twilio
function sendMessage(number, message){
  client.sendMessage({

    to:number, // Any number Twilio can deliver to
    from: NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: message // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (err) {
        console.log(err);
        console.log(responseData.from);
        console.log(responseData.body);
    }
});
}

function parseBody(body){
  if(body.indexOf("add ") == -1){
    return null;
  }
  return body.replace("add ", "");
}

function getSongUrl(searchTerm, callback){
  //Search for song using youtube api
  request("https://www.googleapis.com/youtube/v3/search?part=id&q=" + searchTerm + "&type=video&key=" + YOUTUBE_API, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  })
}

function simulate(){
  var number = "+18482294098";
  var text = "add darude sandstorm";

  var songName = parseBody(text);
  console.log(songName);

  //Invalid syntax
  if(songName == null){
    sendMessage(number, "The syntax of your request was invalid");
    return;
  }

  console.log("adding " + songName);
  getSongUrl(songName, function(response){
    if(JSON.parse(response).items.length > 0){
    var videoID = JSON.parse(response).items[0].id.videoId;
    addToDatabase(number, videoID);
    res.send("Reponse Finished: With Success");
  }
  });
}

function addToDatabase(number, URL){
  //Detect if song is already in the playlist
  //if(db.collection('users').find({"phonenumber": {$eq: number}}, {$elemMatch: {"songs": URL}}).first() !== null){
    //return;
  //}
  console.log(URL);
  if(URL === null || URL === "null"){
    console.log("Null caught");
    return;
  }

  if(URL === "A7JVDxN-Eck"){
    console.log("no null");
    return "";
  }

  if(db.collection('users').find({ "phoneNumber": { $eq : number } }).count() < 0){
    db.collection('users').insertOne({
      "phoneNumber": number,
      "songs": [URL]
    });
  }

  //Add the url with teh number to the song database
  db.collection('users').update({"phoneNumber": { $eq: number }},
    { $push: { "songs": URL } },
    {
      upsert: true,
      multi: false,
  });
}

app.listen(PORT);
console.log("The server is now listening on port " + PORT);
