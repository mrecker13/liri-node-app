var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var twitKeys = new Twitter(keys.twitter);
var spotifyKeys = new Spotify(keys.spotify);
var target = process.argv;
var userInput = "";

// Spotify
if (process.argv[2] === "my-tweets") {
  displayTwitter();
}
if (process.argv[2] === "spotify-this-song") {
  getInput();
  if (userInput != "") {
    displaySpotify(userInput);
  }
  else {
    displaySpotify("The Sign Ace of Base");
  }
}
if (process.argv[2] === "movie-this") {
  getInput();
  if (userInput !== "") {
    displayMovie(userInput);
  }
  else {
    displayMovie("Mr. Nobody");
  }
}
if (process.argv[2] === "do-what-it-says") {
  doWhatItSays();
}

//user Input function
function getInput () {
  for (var i = 3; i < target.length; i++) {
    userInput += target[i] + " ";
  }
};

// Twitter
function displayTwitter () {
  var params = {screen_name: 'mbrecker26', count: 20};
  twitKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
          var tweetData = "\n------------------------" + 
            "\n" + tweets[i].created_at +
            "\n" + tweets[i].text;

          console.log(tweetData);
          fs.appendFile("log.txt", tweetData, function(error) {
            if (error) {
              console.log(error)
            }
          });
      }
    }
  });
};

// Spotify
function displaySpotify (song) {

  spotifyKeys.search({ type: 'track', query: song, limit: 1}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var artist = data.tracks.items[0].artists[0].name;
    var track = data.tracks.items[0].name;
    var url = data.tracks.items[0].external_urls.spotify;
    var album = data.tracks.items[0].album.name;
    var musicData = "\n--------------------------" + 
      "\nArtist: " + artist + 
      "\nTrack Name: " + track + 
      "\nCheck it out: " + url + 
      "\nAlbum: " + album +
      "\n--------------------------";

    console.log(musicData);
    fs.appendFile("log.txt", musicData, function(error) {
      if (error) {
        console.log(error)
      }
    })
  });
};

function displayMovie (userInput) {
  var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    
      // If the request is successful
      if (!error && response.statusCode === 200) {
        // console.log(JSON.parse(body));
        var title = JSON.parse(body).Title;
        var year = JSON.parse(body).Year;
        var imdbRating = JSON.parse(body).imdbRating;
        var rtRating = JSON.parse(body).Ratings[1].Value;
        var country = JSON.parse(body).Country;
        var language = JSON.parse(body).Language;
        var plot = JSON.parse(body).Plot;
        var actors = JSON.parse(body).Actors;
        var movieData ="\n--------------------------" + 
          "\nTitle: " + title +
          "\nYear: " + year +
          "\nIMDB Rating: " + imdbRating +
          "\nRotten Tomatoes Rating: " + rtRating +
          "\nCountry: " + country +
          "\nLanguage: " + language +
          "\nPlot: " + plot +
          "\nActors: " + actors +
          "\n--------------------------";

        console.log(movieData);
        fs.appendFile("log.txt", movieData, function(error) {
          if (error) {
            console.log(error)
          }
        })
      }
    });
};

function doWhatItSays () {

  fs.readFile("random.txt", "utf8", function(error, data) {
    
      if (error) {
        return console.log(error);
      }
      var randomArr = data.split(",");
      var randomSong = randomArr[1];
      displaySpotify(randomSong);

    });
}