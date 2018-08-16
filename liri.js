//Importing Modules
const inquirer = require("inquirer");
const request = require("request");
const dotenv = require("dotenv").config();
// const https = require("https");
const keys = require("./keys");
const Twitter = require("twitter");
const Spotify = require('node-spotify-api');
const fs = require("fs");


let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);



//Inquirer prompt is used here, will follow logic based on command
inquirer
    .prompt([
        // Here we create a basic text prompt.
        {
            type: "input",
            message: "Insert your command",
            //Value.command will be used.
            name: "command"
        }
    ]).then(value => {


        //switch statement for entering commands on what to do
        switch (value.command) {
            case 'my-tweets':
                //console.log("You've got the Edge!");
                tweetRequest();
                break;

            case 'spotify-this-song':
                inquirer.prompt([
                    // Here we create a basic text prompt.
                    {
                        type: "input",
                        message: "Insert your song",
                        //Value.command will be used.
                        name: "title"
                    }
                ]).then(values => {
                    var value = findAndReplace(values.title, " ", "+");
                    console.log(value);
                    spotifyRequest(values.title);
                })
                break;
            case 'movie-this':

                inquirer.prompt([
                    // Here we create a basic text prompt.
                    {
                        type: "input",
                        message: "Insert your movie title",
                        //Value.command will be used.
                        name: "title"
                    }
                ]).then(values => {
                    var value = findAndReplace(values.title, " ", "+");
                    console.log(value);
                    omdbRequest(values.title);
                })

                break;

            case 'do-what-it-says':
                readFileCommand();
                break;

            default:
                console.log('We hope that this page looks ok!');
        }

       

    });


//request to grab movie from omdb api, grabs title, year, rating, critic rating,
//country, plot, language, and actors
function omdbRequest(movieTitle) {
   
    

    console.log(movieTitle)
    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!error && response.statusCode === 200) {

            // Then we print out the imdbRating
            //console.log("The movie's rating is: " + JSON.parse(body).Title);
            console.log(JSON.parse(body));
            var parse = JSON.parse(body);
            console.log("Title: ", parse.Title);
            console.log("Year: ", parse.Year);
            console.log("Rating: ", parse.Rated);
            console.log("Critic Rating: " + parse.Ratings[1].Source +  " " + parse.Ratings[1].Value);
            console.log("Country: ", parse.Country);
            console.log("Language: ", parse.Language);
            console.log("Plot: ", parse.Plot);
            console.log("Actors: ", parse.Actors);
        }
    })

}

//function to request a spotify song with its song, artist, album name and its url.
function spotifyRequest(song) {
    
    spotify.search({
        type: 'track',
        query: song,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ', err);
        }

        let dataItem = data.tracks.items[0];
        let songName = dataItem.name;
        var artistName = dataItem.artists[0].name;
        var albumName = dataItem.album.name;
        var songUrl = dataItem.external_urls.spotify
        console.log("songUrl: ", songUrl);
        console.log("Album: ", albumName);
        console.log("Artist: ", artistName);
        console.log("Name: ", songName);
        // console.log(data.tracks.items[0].album.name);


    });
}

//Grab tweets from my account
function tweetRequest() {
    //console.log("Here");
    var params = {
        screen_name: 'Jean_Canales'
    };
    //Grabs them from my time line
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        console.log("I AM HERE");
        console.log(tweets.length);
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
            }
        } else {
            console.log(error);
        }

    });

}


//function to replace white spaces or whatever I want.
function findAndReplace(string, target, replacement) {

    var i = 0;
    var length = string.length;

    for (i; i < length; i++) {

        string = string.replace(target, replacement);

    }

    return string;

}

//Read file function to run command and term for random.txt.
function readFileCommand() {
    //Read file command
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        switch (dataArr[0]) {

            case 'my-tweets':
                tweetRequest();
                break;

            case 'spotify-this-song':
                spotifyRequest(dataArr[1]);
                break;

            case 'movie-this':
                omdbRequest(dataArr[1]);
                break;

            default:
                console.log("No command, enter a command next time.")
                break;

        }

        return

    });

}