
function isTvProduct(code){return ['IT','MIT','UIT'].includes(code);}
function getOption(tv,onestop,genie3){
 if(!tv) return onestop?'ONESTOP':'NONE';
 if(genie3&&onestop) return 'GENIE3+ONESTOP';
 if(genie3) return 'GENIE3';
 if(onestop) return 'ONESTOP';
 return 'NONE';
}
function makeWiredKey(product,onestop,genie3){
 const tv=isTvProduct(product);
 return `WIRED|${product}|${tv?'TV':'NO_TV'}|${getOption(tv,onestop,genie3)}`;
}
