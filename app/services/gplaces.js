const axios = require("axios");

module.exports = function() {
  this.getPlaceById = (id)=>{
    return new Promise((resolve, reject)=>{
      axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="
      + id + "&key=" + process.env.GOOGLE_PLACES_KEY)
          .then(function(response) {
            if (response.status == 200) {
              resolve(response.data);
            } else {
              reject(new Error("API Error"));
            }
          })
          .catch(function(error) {
            reject(new Error("Axios Error"));
          });
    });
  };
  this.getPlaceByText = (query, optionalParameters)=>{
    return new Promise((resolve, reject)=>{
      let url;
      if(optionalParameters==undefined)
      {
        url="https://maps.googleapis.com/maps/api/place/textsearch/json?query="
          + query + "&key=" + process.env.GOOGLE_PLACES_KEY
      }
      else{
        url="https://maps.googleapis.com/maps/api/place/textsearch/json?query="
        + query + optionalParameters + "&key=" + process.env.GOOGLE_PLACES_KEY
      }
      axios.get(url)
          .then(function(response) {
            if (response.status == 200) {
              resolve(response.data);
            } else {
              console.log(response.data)
              reject(new Error("API Error"));
            }
          })
          .catch(function(error) {
            console.log(error)
            reject(new Error("Axios Error"));
          });
    });
  }
  return this;
};
