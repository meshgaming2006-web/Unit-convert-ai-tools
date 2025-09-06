
const BRAND="UnitConverterAIPro";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=(n)=>Number(n).toLocaleString(undefined,{maximumFractionDigits:8});
const copy=async(t)=>{try{await navigator.clipboard.writeText(t);alert("Copied!")}catch(e){console.log(e)}};
const FX_ENDPOINT="https://api.exchangerate.host/latest";
let FX={base:"USD",date:null,rates:{}};
async function loadRates(base="USD"){try{const res=await fetch(`${FX_ENDPOINT}?base=${encodeURIComponent(base)}`);const data=await res.json();if(data&&data.rates){FX={base:data.base,date:data.date,rates:data.rates}}}catch(e){console.warn("FX error",e)}}
function convertLinear(val,unitMap,from,to){if(from===to)return val;const toBase=val*unitMap[from];return toBase/unitMap[to]}
function convertTemp(v,from,to){if(from===to)return v;let C=v;if(from==="F")C=(v-32)*5/9;if(from==="K")C=v-273.15;if(to==="C")return C;if(to==="F")return C*9/5+32;if(to==="K")return C+273.15}
function convertFuel(v,from,to){if(from===to)return v;let mpg;if(from==="mpg")mpg=v;if(from==="L100")mpg=235.214583/v;if(from==="kmpl")mpg=v*2.35214583;if(to==="mpg")return mpg;if(to==="L100")return 235.214583/mpg;if(to==="kmpl")return mpg/2.35214583}
function convertFX(v,from,to){if(from===to)return v;const base=FX.base||"USD";let baseVal;if(from===base)baseVal=v;else baseVal=v/(FX.rates[from]||1);if(to===base)return baseVal;return baseVal*(FX.rates[to]||1)}
(function(){const y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear()})();
