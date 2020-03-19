const axios = require("axios");
const htmlToText = require("html-to-text");
require("dotenv").config({path: __dirname + "./../../.env"});
/*
USAGE EXAMPLE getDirections
 -----------------------------------------------------------------------
// import gmaps
const gmaps = require("<path-here>services/gmaps");

gmaps.getDirections("Stuttgart DHBW Rotebühlplatz", "Gerber Stuttgart")
    .then((data) => {      console.log(data);    });

//logs a directions string


USAGE EXAMPLE getGoogleMapsRedirectionURL
 -----------------------------------------------------------------------
const gmaps = require("<path-here>services/gmaps");
gmaps.getGoogleMapsRedirectionURL("Gerber Stuttgart");
 */

const buildURL = (origin, destination, travelMode) => {
  // build URL
  const url = new URL("https://maps.googleapis.com/maps/api/directions/json?");
  const params = new URLSearchParams({
    origin: origin,
    destination: destination,
    mode: travelMode,
    language: "de-DE",
    key: process.env.GOOGLE_API_KEY,
  });

  console.log("buildURL", url + params);
  return url + params;
};

// travelMode :   driving | walking | transit | bicycling
module.exports.getDirections = (origin, destination, travelMode = "walking") => {
  return new Promise((resolve, reject) => {
    axios.get(buildURL(origin, destination, travelMode))
        .then((response) => {
          // handle success
          const distance = response.data.routes[0].legs[0].distance.text;
          const duration = response.data.routes[0].legs[0].duration.text;

          // reformat direction steps to single string
          const steps = response.data.routes[0].legs[0].steps.map((step) => {
            // string comes as HTML => reformat to plain text string
            const htmlText = step.html_instructions;
            return htmlToText.fromString(htmlText);
          });

          resolve({distance: distance, duration: duration, steps: steps});
        })
        .catch(function(error) {
          // handle error
          console.error(error);
          reject(error);
        });
  });
};

module.exports.getGoogleMapsRedirectionURL = (destination) => {
  // build URL
  const url = new URL("https://www.google.com/maps/search/?");
  const params = new URLSearchParams({
    api: 1,
    query: destination,
  });

  console.log("buildURL", url + params);
  return url + params;
};

