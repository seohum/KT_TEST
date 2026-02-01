
let productCode = null;
let internetCode = null;
let tvCode = null;

function selectProduct(code){
  productCode = code;
  updateOptionAvailability();
}

function selectInternet(code){
  internetCode = code;
}

function selectTv(code){
  tvCode = code;
}

function isTvProduct(code){
  return code && code.endsWith('T');
}

function updateOptionAvailability(){
  const genie = document.getElementById('genie3');
  if(!isTvProduct(productCode)){
    genie.checked=false;
    genie.disabled=true;
  }else{
    genie.disabled=false;
  }
}

function getOption(tv,onestop,genie3){
  if(!tv) return onestop?'ONESTOP':'NONE';
  if(genie3 && onestop) return 'GENIE3+ONESTOP';
  if(genie3) return 'GENIE3';
  if(onestop) return 'ONESTOP';
  return 'NONE';
}

function makeWiredKey(){
  const onestop=document.getElementById('onestop').checked;
  const genie=document.getElementById('genie3').checked;
  const tv=isTvProduct(productCode);
  return `WIRED|${productCode}|${tv?'TV':'NO_TV'}|${getOption(tv,onestop,genie)}`;
}
