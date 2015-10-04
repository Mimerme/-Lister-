var express = require('express');
var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
var db = require("mongodb").MongoClient;
var app = express();

//-r -D

var DEPLOY_TEST = "4";
var PORT = 3000;
var API_KEY;
var NUMBER  = "(732) 333-6592";

console.log("Running deploy test " + DEPLOY_TEST);

//Open the connection to the database
db.connect('mongodb://Meme_Admin:meme123@ds029224.mongolab.com:29224/plister-database', function (err, db) {
    if (err) {
        console.log("There was a problem trying to connect to the database " +
        "the application has bene terminated");
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
});

app.get('/', function (req, res){
  ///Placeholder for site
  res.send("There's nothing here, plz help");
});

app.get('/fetch', function(req, res){
  //fetches all songs for the given url
  var number = req.query.phoneNum;
  res.send(db.users.find( { phoneNumber: { $eq : number } } ));
});

//Adds song to mongodb server
//Takes in phone number and song / search term
app.get('/addSong', function(req, res){
  var number = req.query.From;
  var text = req.query.Body;

  var songName = parseBody(text);

  //Invalid syntax
  if(songName == null){
    sendMessage(number, "The syntax of your request was invalid");
    res.send("Reponse Finished: With Error by user");
  }

  console.log("adding " + songName);
  var songURL = getSongUrl(songName);
  addToDatabase(number, songURL);
  res.send("Reponse Finished: With Success");
});

//Send a message through twilio
function sendMessage(number, message){
  client.sendMessage({

    to:number, // Any number Twilio can deliver to
    from: NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: message // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) {
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

function getSongUrl(searchTerm){
  //Search for song using youtube api
}

function addToDatabase(number, URL){
  //Add the url with teh number to the song database
  db.users.update({phoneNumber: { $eq: number }},
    { $push: { songs: URL } }
    ,{
    upsert: true,
    multi: false,
  });
}

app.listen(PORT);
console.log("The server is now listening on port " + PORT);
