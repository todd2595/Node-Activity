require('dotenv').config();
var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var now = moment();

var spotify = new Spotify(keys.spotify);

var operation = process.argv[2];
var input = process.argv.slice(3).join(" ");
var userInput = process.argv.slice(2).join(" ");

//Concert In town
if (operation === "concert") {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp=upcoming")
        .then(function (response) {
            for (i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name)
                console.log(response.data[i].venue.city)
                console.log(moment(response.data[i].datetime).format('L'));
                console.log("##############################")
            }
            if (response === null) {
                console.log("There are not any dates booked yet!");
            }
            // console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
}

//Spotify API
function music (){
    spotify.search({ type: 'track', query: input, limit: 3 }, function (err, data) {
        if (err) {
            return console.log('error' + err);
        }
        // console.log(data);
        // console.log(data.tracks.href);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].artists[0].external_urls.spotify);
})
}

if (operation === "spotify") {
    if(!input === null){
        input = "The Sign"
        music();
    }
    else{
        music();
    }
    
}

//movie api
function upload (){
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + input).then(function (response) {
        console.log(response.data.Title);
        console.log(response.data.Year);
        console.log(response.data.Ratings[0].Value);
        console.log(response.data.Ratings[1].Value);
        console.log(response.data.Country);
        console.log(response.data.Language);
        console.log(response.data.Plot);
        console.log(response.data.Actors);
    })
}
if (operation === "movie") {
    if (!input) {
        input = "Mr.Nobody"
        upload();}
    else{
        upload();
}}

if (operation === "do") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { 
            console.log(error);
        }
        var dataArr = data.split(",");
        var command = dataArr[0];
        var term = dataArr.slice(1).join(" ");
        if(command === "movie"){
            term = input;
            upload();
        }
        else{
            term = input;
            music();
        }

    })
}
//append to random.txt
function log(){
fs.appendFile("log.txt", userInput, function(err){
    if(err){
        console.log(err);
    }
})
}
log();