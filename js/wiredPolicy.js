fetch('/data/wired/policy.json')
  .then(r=>r.json())
  .then(policies=>{
    window.getWiredPrice = function(key){
      const found = policies.find(p=>p.KEY===key);
      return found ? found["정책금액(만원)"] : 0;
    }
  });