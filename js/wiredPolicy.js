
let productCode = null;
let optionState = {
  onestop:false,
  genie3:false
};

function selectProduct(code){
  productCode = code;
  updateOptionUI();
  recalc();
}

function toggleOneStop(val){
  optionState.onestop = val;
  recalc();
}

function toggleGenie3(val){
  optionState.genie3 = val;
  recalc();
}

function hasTV(code){
  return code && code.endsWith('T');
}

function updateOptionUI(){
  const genie = document.getElementById('genie3');
  if(!genie) return;
  if(!hasTV(productCode)){
    genie.checked = false;
    genie.disabled = true;
  } else {
    genie.disabled = false;
  }
}

function buildKey(){
  if(!productCode) return null;
  const tv = hasTV(productCode) ? "TV" : "NO_TV";
  let option = "NONE";
  if(optionState.onestop && optionState.genie3) option = "GENIE3+ONESTOP";
  else if(optionState.genie3) option = "GENIE3";
  else if(optionState.onestop) option = "ONESTOP";
  return `WIRED|${productCode}|${tv}|${option}`;
}

let policies = [];
fetch("data/wired/policy.json")
 .then(r=>r.json())
 .then(d=>policies=d);

function recalc(){
  const key = buildKey();
  if(!key) return;
  const row = policies.find(p=>p.KEY===key);
  document.getElementById("result").innerText =
    row ? row.price + " 만원" : "-";
}
