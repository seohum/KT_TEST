
let productCode = null;

function selectProduct(code){
  productCode = code;
  updateOptionAvailability();
  recalc();
}

function isTvProduct(code){
  return code && code.endsWith('T');
}

function updateOptionAvailability(){
  const genie = document.getElementById('genie3');
  if(!genie) return;

  if(!isTvProduct(productCode)){
    genie.checked = false;
    genie.disabled = true;
  } else {
    genie.disabled = false;
  }
}

function getOption(tv,onestop,genie3){
  if(!tv){
    return onestop ? 'ONESTOP' : 'NONE';
  }
  if(genie3 && onestop) return 'GENIE3+ONESTOP';
  if(genie3) return 'GENIE3';
  if(onestop) return 'ONESTOP';
  return 'NONE';
}

function makeWiredKey(){
  const onestopEl = document.getElementById('onestop');
  const genieEl = document.getElementById('genie3');

  const onestop = onestopEl ? onestopEl.checked : false;
  const genie3 = genieEl ? genieEl.checked : false;

  const tv = isTvProduct(productCode);
  const option = getOption(tv,onestop,genie3);
  return `WIRED|${productCode}|${tv ? 'TV' : 'NO_TV'}|${option}`;
}

let wiredPolicies = [];
fetch('data/wired/policy.json')
  .then(r=>r.json())
  .then(d=>wiredPolicies=d);

function getWiredPrice(key){
  const found = wiredPolicies.find(p=>p.KEY===key);
  return found ? found['정책금액(만원)'] : 0;
}

function recalc(){
  if(!productCode) return;
  const key = makeWiredKey();
  const price = getWiredPrice(key);
  const out = document.getElementById('result-price');
  if(out){
    out.innerText = price ? price + ' 만원' : '-';
  }
}
