const NATIONAL_PARKS_URL = "https://developer.nps.gov/api/v1/";
const A1 = "pDkTyJPC22l8a";
const A2 = "0Z1d6FmoDiP5m";
const A3 = "C7TLRuurMuRM2O";
const API_KEY = A1 + A3 + A2;

// Get National Parks list
function getNationalParksList(state, maxResults) { 
  // -setup query
  const params = {
    api_key: API_KEY,
    stateCode: state,
    limit: maxResults,
    // q: "",
  };
  // -put url together (FormatQueryParams)
  const queryString = formatQueryParams(params);
  const url = `${NATIONAL_PARKS_URL}parks?${queryString}`;
 
  console.log(url);

  // -FETCH
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getReverseGeocode(latlng, elementID) {
  const splitLatLong = latlng.split(', ');
  const googleLatLng = `latlng=${splitLatLong[0].substr(4)},${splitLatLong[1].substr(5)}`
  const google_url = "https://maps.googleapis.com/maps/api/geocode/json?";
  const k1 = "AIzaSyDfecR4U"
  const k2 = "r2OdLAmKczvA";
  const k3 = "FalgjCmVA2dLp4";
  const google_api = "&key=" + k1 + k3 + k2;
  const completeURL = google_url + googleLatLng + google_api;
  console.log(completeURL);

  fetch(completeURL)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => { 
    console.log(responseJson.results[0].formatted_address);
    $(`#${elementID}`).text(`Address: ${responseJson.results[0].formatted_address}`)
  })
  .catch(err => {
    $(`#${elementID}`).text('Could not get address: ' + err);
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

// Display results
function displayResults(responseJson) {
  console.log(responseJson);
  $('.js-results-list').empty();

  for (let obj in responseJson.data) {
    // Make a quick pit-stop to the google reverse geocode api to get address from lat lng
    let latlng = responseJson.data[obj].latLong;
    let elementID = `li${obj}`;
    
    if (latlng !== "") {
      getReverseGeocode(latlng, elementID);
    }

    $('.js-results-list').append(
      `<li><h3><a href="${responseJson.data[obj].url}">${responseJson.data[obj].fullName}</a></h3>
      <p id='${elementID}'>Address: Not available</p>
      <p>Description: ${responseJson.data[obj].description}</p>
      </li>
      `
    );
  }

  $('.js-results').removeClass('hidden');
}

// Watch for event submit on button
// (send info to function)
function watchForm() {
  $('.js-form').submit(event => {
    event.preventDefault();
    const state = $('.js-state').val();
    const maxResults = $('.js-max-results').val();

    getNationalParksList(state, maxResults);
  });
}

// Jquery watch form
$(watchForm);