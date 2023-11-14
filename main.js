const API_KEY = "063591b804ab4cd1903a01398a68fb5b";

function run() {
  getCoordinates()
    .then((coords) => reverseGeocoding(...coords))
    .then((country) => getCountry(country))
    .then((data) => renderCountry());
}

function getCoordinates() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  ).then((location) => {
    ({ latitude, longitude } = location.coords);
    return [latitude, longitude];
  });
}

function reverseGeocoding(latitude, longitude) {
  return fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => data.results[0].country);
}

function getCountry(countryName) {
  console.log(countryName);
  return fetch(`https://restcountries.com/v3.1/name/${countryName}`).then(
    (response) => response.json()
  );
}

function renderCountry() {}

run();
