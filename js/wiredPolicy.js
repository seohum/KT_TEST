let policies = [];

fetch('data/wired/policy.json')
.then(r=>r.json())
.then(d=>policies=d);

function isTvProduct(code){
  return ['IT','MIT','UIT'].includes(code);
}

function getOption(tv,onestop,genie3){
  if(!tv){
    return onestop ? 'ONESTOP':'NONE';
  }
  if(genie3 && onestop) return 'GENIE3+ONESTOP';
  if(genie3) return 'GENIE3';
  if(onestop) return 'ONESTOP';
  return 'NONE';
}

function makeWiredKey(product,onestop,genie3){
  const tv = isTvProduct(product);
  const tvFlag = tv ? 'TV':'NO_TV';
  const option = getOption(tv,onestop,genie3);
  return `WIRED|${product}|${tvFlag}|${option}`;
}

function getWiredPrice(key){
  const f = policies.find(p=>p.KEY===key);
  return f ? f['정책금액(만원)']:0;
}
