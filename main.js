const API_KEY = "063591b804ab4cd1903a01398a68fb5b";

function initializeUI() {
  const ui = {};
  ui.btn = document.querySelector("button");
  ui.btn.addEventListener("click", run);
  ui.info = document.querySelector(".info");
  return ui;
}

function run() {
  getCoordinates()
    .then((coords) => getCountryNameByCoords(...coords))
    .then((country) => getCountryData("name", country))
    .then((data) => renderCountry(data));
}

function getCoordinates() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  ).then((location) => {
    ({ latitude, longitude } = location.coords);
    return [latitude, longitude];
  });
}

function getCountryNameByCoords(latitude, longitude) {
  return fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => data.results[0].country);
}

function getCountryData(endpoint, query) {
  return fetch(`https://restcountries.com/v3.1/${endpoint}/${query}`)
    .then((response) => response.json())
    .then((data) => data[0]);
}

async function renderCountry(country) {
  const nativeOfficialName = Object.values(country.name.nativeName)[0].official;
  const {
    flag: flagEmoji,
    name: { common: commonName, official: officialName },
    independent,
    landlocked,
    region,
    population,
    area,
    capital: [capital],
    borders: neighborCodes,
    flags: { svg: flagSVG },
  } = country;

  ui.info.innerHTML = `
    <h2>${commonName}</h2>
    <p class="desciprtion">
      ${flagEmoji} ${officialName} (${nativeOfficialName}) is a 
      ${landlocked ? "landlocked" : "coastal"},
      ${independent ? "indepdent" : "unrecognized"}
      country in ${region} with a population of ${population} and surface area of
      ${area} km<sup>2</sup>. Capital city is ${capital}.
      ${
        neighborCodes.length
          ? `It neighbors ${neighborCodes.length} countries: ${(
              await parseNeighbors(neighborCodes)
            ).join(", ")}`
          : "It doesn't have any neighbors"
      }
      
    </p>
    <img class="flag" src="${flagSVG}" alt="" />
  `;
}

function parseNeighbors(codes) {
  let promises = [];
  for (const code of codes) {
    promises.push(getCountryData("alpha", code));
  }
  return Promise.all(promises).then((arr) =>
    arr.map((country) => country.name.common)
  );
}

const ui = initializeUI();
