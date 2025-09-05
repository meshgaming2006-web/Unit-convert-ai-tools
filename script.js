
// Basic conversions shared across pages
const Conv = {
  // length
  cmToIn: v => v * 0.3937007874,
  inToCm: v => v * 2.54,
  kmToMi: v => v * 0.621371,
  miToKm: v => v / 0.621371,
  ftToM: v => v * 0.3048,
  mToFt: v => v / 0.3048,
  // weight
  kgToLb: v => v * 2.20462,
  lbToKg: v => v / 2.20462,
  // temp
  cToF: v => (v * 9/5) + 32,
  fToC: v => (v - 32) * 5/9,
};

function fmt(n){
  if (typeof n !== "number" || !isFinite(n)) return "";
  return Number(n).toLocaleString(undefined,{maximumFractionDigits:8});
}

// Single tool binder
function bindSimpleTool({inputId, outputId, from, to, op}){
  const input = document.getElementById(inputId);
  const out = document.getElementById(outputId);
  const btn = document.getElementById('convertBtn');
  const copyBtn = document.getElementById('copyBtn');
  const tableBody = document.getElementById('tableBody');

  function run(){
    const v = parseFloat(input.value);
    if (isNaN(v)) { out.textContent = ""; return; }
    const res = op(v);
    out.textContent = `${fmt(v)} ${from} = ${fmt(res)} ${to}`;
  }

  function buildTable(){
    if (!tableBody) return;
    const samples = [1, 5, 10, 25, 50, 100];
    tableBody.innerHTML = samples.map(x => {
      const y = op(x);
      return `<tr><td>${fmt(x)} ${from}</td><td>${fmt(y)} ${to}</td></tr>`;
    }).join("");
  }

  input?.addEventListener('input', run);
  btn?.addEventListener('click', run);
  copyBtn?.addEventListener('click', async () => {
    try{ await navigator.clipboard.writeText(out.textContent || ""); copyBtn.textContent="Copied!"; setTimeout(()=>copyBtn.textContent="Copy",1000);}catch(e){}
  });

  buildTable();
  return { run };
}

// Nav builder for internal linking
function renderToolLinks(elId){
  const tools = [
    ["cm-to-inch.html","CM to Inches"],
    ["inch-to-cm.html","Inches to CM"],
    ["kg-to-lbs.html","KG to LBS"],
    ["lbs-to-kg.html","LBS to KG"],
    ["miles-to-km.html","Miles to KM"],
    ["km-to-miles.html","KM to Miles"],
    ["feet-to-meters.html","Feet to Meters"],
    ["meters-to-feet.html","Meters to Feet"],
    ["celsius-to-fahrenheit.html","Celsius to Fahrenheit"],
    ["fahrenheit-to-celsius.html","Fahrenheit to Celsius"],
  ];
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = tools.map(([href,label]) => `<a class="list-item" href="${href}">${label}</a>`).join("");
}

// Search box on index
function attachSearch(filterId, listId){
  const i = document.getElementById(filterId);
  const list = document.getElementById(listId);
  if (!i || !list) return;
  i.addEventListener('input', () => {
    const q = i.value.toLowerCase();
    for(const a of list.querySelectorAll('a')){
      a.style.display = a.textContent.toLowerCase().includes(q) ? "" : "none";
    }
  });
}
