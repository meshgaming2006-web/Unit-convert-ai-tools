// script.js
// All-in-One Unit Converter

// ----------------------------
// Unit Registry
// ----------------------------
const units = {
  length: {
    name: "Length",
    base: "meter",
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34,
    },
  },
  weight: {
    name: "Weight",
    base: "kilogram",
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.453592,
      ounce: 0.0283495,
      ton: 1000,
    },
  },
  temperature: {
    name: "Temperature",
    special: true,
    units: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K",
    },
  },
  volume: {
    name: "Volume",
    base: "liter",
    units: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
      cup: 0.24,
    },
  },
  area: {
    name: "Area",
    base: "sqmeter",
    units: {
      sqmeter: 1,
      sqkilometer: 1e6,
      sqcentimeter: 0.0001,
      sqmile: 2.59e6,
      sqyard: 0.836127,
      sqfoot: 0.092903,
      sqinch: 0.00064516,
      acre: 4046.86,
      hectare: 10000,
    },
  },
  speed: {
    name: "Speed",
    base: "mps",
    units: {
      mps: 1,
      kph: 0.277778,
      mph: 0.44704,
      knot: 0.514444,
    },
  },
  data: {
    name: "Data",
    base: "byte",
    units: {
      byte: 1,
      kilobyte: 1024,
      megabyte: 1048576,
      gigabyte: 1073741824,
      terabyte: 1099511627776,
    },
  },
  fuel: {
    name: "Fuel Economy",
    base: "kmpl",
    units: {
      kmpl: 1,
      mpg: 0.425144,
      lper100km: 0.01, // handled separately
    },
  },
  currency: {
    name: "Currency",
    api: true,
  },
};

// ----------------------------
// Build UI
// ----------------------------
const app = document.getElementById("app");

let categorySelect = document.createElement("select");
for (let key in units) {
  let opt = document.createElement("option");
  opt.value = key;
  opt.textContent = units[key].name;
  categorySelect.appendChild(opt);
}
app.appendChild(categorySelect);

app.appendChild(document.createElement("br"));
app.appendChild(document.createElement("br"));

let inputVal = document.createElement("input");
inputVal.type = "number";
inputVal.value = 1;
inputVal.className = "border p-2 rounded";
app.appendChild(inputVal);

let fromSelect = document.createElement("select");
let toSelect = document.createElement("select");
app.appendChild(fromSelect);
app.appendChild(toSelect);

app.appendChild(document.createElement("br"));
app.appendChild(document.createElement("br"));

let resultBox = document.createElement("div");
resultBox.className = "p-3 bg-slate-100 rounded font-semibold";
app.appendChild(resultBox);

// ----------------------------
// Functions
// ----------------------------
async function updateUnits(category) {
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  if (units[category].api) {
    // Currency API
    let res = await fetch("https://api.exchangerate.host/latest?base=USD");
    let data = await res.json();
    let keys = Object.keys(data.rates);

    keys.forEach((k) => {
      let opt1 = document.createElement("option");
      opt1.value = k;
      opt1.textContent = k;
      let opt2 = opt1.cloneNode(true);
      fromSelect.appendChild(opt1);
      toSelect.appendChild(opt2);
    });

    fromSelect.value = "USD";
    toSelect.value = "INR";
  } else {
    let u = units[category].units;
    for (let k in u) {
      let opt1 = document.createElement("option");
      opt1.value = k;
      opt1.textContent = k;
      let opt2 = opt1.cloneNode(true);
      fromSelect.appendChild(opt1);
      toSelect.appendChild(opt2);
    }
  }
  calculate();
}

function convertTemperature(val, from, to) {
  if (from === to) return val;
  if (from === "celsius") {
    if (to === "fahrenheit") return val * 9 / 5 + 32;
    if (to === "kelvin") return val + 273.15;
  }
  if (from === "fahrenheit") {
    if (to === "celsius") return (val - 32) * 5 / 9;
    if (to === "kelvin") return (val - 32) * 5 / 9 + 273.15;
  }
  if (from === "kelvin") {
    if (to === "celsius") return val - 273.15;
    if (to === "fahrenheit") return (val - 273.15) * 9 / 5 + 32;
  }
  return val;
}

async function calculate() {
  let category = categorySelect.value;
  let val = parseFloat(inputVal.value) || 0;
  let from = fromSelect.value;
  let to = toSelect.value;

  if (units[category].api) {
    let res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${val}`);
    let data = await res.json();
    resultBox.textContent = `${val} ${from} = ${data.result.toFixed(2)} ${to}`;
  } else if (units[category].special) {
    let result = convertTemperature(val, from, to);
    resultBox.textContent = `${val} ${from} = ${result.toFixed(2)} ${to}`;
  } else {
    let baseVal = val * units[category].units[from];
    let result = baseVal / units[category].units[to];
    resultBox.textContent = `${val} ${from} = ${result.toFixed(4)} ${to}`;
  }
}

// ----------------------------
// Event Listeners
// ----------------------------
categorySelect.addEventListener("change", () => updateUnits(categorySelect.value));
inputVal.addEventListener("input", calculate);
fromSelect.addEventListener("change", calculate);
toSelect.addEventListener("change", calculate);

// Init
updateUnits("length");
                                
