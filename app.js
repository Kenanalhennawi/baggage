
let data = null;

fetch("data.json")
  .then((res) => res.json())
  .then((json) => {
    data = json;
  })
  .catch((err) => {
    document.getElementById("result").textContent =
      "Failed to load data.json: " + err;
  });

function resolveName(code) {
  if (!data) return code;
  code = code.trim().toUpperCase();
  if (data.iata_to_city[code]) return data.iata_to_city[code];
  if (data.iata_to_country[code]) return data.iata_to_country[code];
  if (code === "KSA") return "Saudi Arabia";
  if (code === "UAE") return "United Arab Emirates";
  return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}

function getZone(input) {
  if (!data) return null;
  input = input.trim().toLowerCase();
  for (const [zone, places] of Object.entries(data.destinations)) {
    for (const key in places) {
      const value = places[key];
      if (
        input === key.toLowerCase() ||
        input === value.toLowerCase()
      ) {
        return parseInt(zone);
      }
    }
  }
  return null;
}

function calculatePrice() {
  if (!data) {
    document.getElementById("result").textContent =
      "Data not loaded yet. Please wait a second.";
    return;
  }

  const originInput = document.getElementById("origin").value;
  const destInput = document.getElementById("destination").value;

  const zone1 = getZone(originInput);
  const zone2 = getZone(destInput);

  if (!zone1 || !zone2) {
    document.getElementById("result").textContent =
      "Destination not found. Please check your input.";
    return;
  }

  const priceKey = `${zone1},${zone2}`;
  const price = data.prices[priceKey];

  if (price == null) {
    document.getElementById("result").textContent =
      "Price not available for this route.";
    return;
  }

  const originName = resolveName(originInput);
  const destinationName = resolveName(destInput);

  document.getElementById("result").textContent = `The Price Per Kilo From ${originName} To ${destinationName} Is: AED ${price}`;
}

function swapCities() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;
  document.getElementById("origin").value = destination;
  document.getElementById("destination").value = origin;
  calculatePrice();
}

function clearFields() {
  document.getElementById("origin").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("result").textContent = "";
}
