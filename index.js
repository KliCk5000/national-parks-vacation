const NATIONAL_PARKS_URL = "https://developer.nps.gov/api/v1/";
const A1 = "pDkTyJPC22l8a";
const A2 = "0Z1d6FmoDiP5m";
const A3 = "C7TLRuurMuRM2O";
const API_KEY = A1 + A3 + A2;

// Get National Parks list
function getNationalParksList(state) { 
  // -setup query
  const params = {
    api_key: API_KEY,
    stateCode: state,
    // limit: "",
    // q: "",
  };
  // -put url together (FormatQueryParams)
  const queryString = formatQueryParams(params);
  const url = `${NATIONAL_PARKS_URL}parks?${queryString}`;
 
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

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

// Display results
function displayResults(responseJson) {
  console.log(responseJson);
  $('.js-results-list').empty();

  for (let obj in responseJson) {
    // $('.js-results-list').append(
    //   `<li><h3><a href="${responseJson[obj].html_url}">${responseJson[obj].name}</a></h3>
    //   <p>Created: ${responseJson[obj].created_at.substr(0, responseJson[obj].created_at.indexOf('T'))}</p>
    //   <p>By ${responseJson[obj].owner.login}</p>
    //   <p>Description: ${responseJson[obj].description}</p>
    //   <p>Language: ${responseJson[obj].language}</p>
    //   </li>`
    // );
  }

  $('.js-results').removeClass('hidden');
}

// Watch for event submit on button
// (send info to function)
function watchForm() {
  $('.js-form').submit(event => {
    event.preventDefault();
    const state = $('.js-state').val();

    $('.js-state').val('');
    getNationalParksList(state);
  });
}

// Jquery watch form
$(watchForm);