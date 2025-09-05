const conversions = {
  cm: { inch: v => v * 0.393701 },
  inch: { cm: v => v * 2.54 },
  kg: { lbs: v => v * 2.20462 },
  lbs: { kg: v => v * 0.453592 },
  celsius: { fahrenheit: v => (v * 9/5) + 32, kelvin: v => v + 273.15 },
  fahrenheit: { celsius: v => (v - 32) * 5/9 },
  kelvin: { celsius: v => v - 273.15 },
  km: { mile: v => v * 0.621371 },
  mile: { km: v => v * 1.60934 },
  meter: { feet: v => v * 3.28084 },
  feet: { meter: v => v * 0.3048 },
  g: { oz: v => v * 0.035274 },
  oz: { g: v => v * 28.3495 },
  liter: { gallon: v => v * 0.264172 },
  gallon: { liter: v => v * 3.78541 },
  m2: { ft2: v => v * 10.7639 },
  ft2: { m2: v => v * 0.092903 },
  kmh: { mph: v => v * 0.621371 },
  mph: { kmh: v => v * 1.60934 },
  MB: { MiB: v => v / 1.04858 },
  MiB: { MB: v => v * 1.04858 },
  GB: { GiB: v => v / 1.07374 },
  GiB: { GB: v => v * 1.07374 }
};

window.onload = function() {
  let fromUnit = document.getElementById("fromUnit");
  let toUnit = document.getElementById("toUnit");

  let units = Object.keys(conversions);
  units.forEach(u => {
    let opt1 = document.createElement("option");
    opt1.value = u; opt1.text = u;
    fromUnit.add(opt1.cloneNode(true));
    toUnit.add(opt1);
  });
};

function convert() {
  let amount = parseFloat(document.getElementById("amount").value);
  let from = document.getElementById("fromUnit").value;
  let to = document.getElementById("toUnit").value;
  let resultText = "";

  if (isNaN(amount)) {
    document.getElementById("result").innerText = "Please enter a valid number";
    return;
  }

  let result;
  if (conversions[from] && conversions[from][to]) {
    result = conversions[from][to](amount);
    resultText = `${amount} ${from} = ${result.toFixed(4)} ${to}`;
    trackEvent(from, to);
  } else {
    resultText = `Conversion not defined for ${from} → ${to}`;
  }

  document.getElementById("result").innerText = resultText;
}

function quickConvert(from, to) {
  document.getElementById("fromUnit").value = from;
  document.getElementById("toUnit").value = to;
  document.getElementById("amount").value = 1;
  convert();
}

// Google Analytics event tracking
function trackEvent(from, to) {
  if (typeof gtag === "function") {
    gtag('event', 'conversion', {
      'event_category': 'Unit Converter',
      'event_label': from + '_to_' + to
    });
  }
}