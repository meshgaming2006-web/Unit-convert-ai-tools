const unitOptions = {
  length: ["meter", "kilometer", "mile", "inch", "foot", "cm"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  weight: ["kg", "lb", "gram"],
  volume: ["liter", "ml", "gallon"],
  area: ["sqm", "sqkm", "acre"],
  time: ["second", "minute", "hour", "day"]
};

let currentTab = "length";

function loadUnits(tab) {
  const from = document.getElementById("fromUnit");
  const to = document.getElementById("toUnit");
  from.innerHTML = "";
  to.innerHTML = "";

  unitOptions[tab].forEach(u => {
    let opt1 = document.createElement("option");
    opt1.value = u;
    opt1.textContent = u;

    let opt2 = document.createElement("option");
    opt2.value = u;
    opt2.textContent = u;

    from.appendChild(opt1);
    to.appendChild(opt2);
  });
  to.selectedIndex = 1;
}
loadUnits(currentTab);

// Tab switching
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    loadUnits(currentTab);
  });
});

// Convert button
document.getElementById("convertBtn").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const resultBox = document.getElementById("result");

  if (isNaN(amount)) {
    resultBox.textContent = "Enter a valid number!";
    return;
  }

  let result = amount;
  if (from === to) result = amount;
  else if (from === "meter" && to === "kilometer") result = amount / 1000;
  else if (from === "kilometer" && to === "meter") result = amount * 1000;
  else if (from === "celsius" && to === "fahrenheit") result = (amount * 9/5) + 32;
  else if (from === "fahrenheit" && to === "celsius") result = (amount - 32) * 5/9;
  else result = "Conversion not defined yet.";

  resultBox.textContent = `${amount} ${from} = ${result} ${to}`;
});

// Shortcuts
document.querySelectorAll(".shortcut").forEach(btn => {
  btn.addEventListener("click", () => {
    const from = btn.dataset.from;
    const to = btn.dataset.to;
    document.getElementById("fromUnit").value = from;
    document.getElementById("toUnit").value = to;
  });
});
