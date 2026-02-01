let POLICY=null;

const $ = (id)=>document.getElementById(id);

function money(v){
  if(v===null || v===undefined || v==="") return "-";
  const n = Number(v);
  if(Number.isNaN(n)) return String(v);
  return n.toLocaleString("ko-KR")+"원";
}

function uniq(arr){ return [...new Set(arr.filter(v=>v!==null && v!==undefined && v!==""))]; }


function normStr(v){
  if(v===null || v===undefined) return null;
  const s = String(v).replace(/\s+/g,"");
  return s===""? null : s;
}
function normGroup(g){
  const s = normStr(g);
  if(!s) return null;
  if(s==="I" || s==="I단품") return "I단품";
  return s;
}
function canonGroupForUI(g){
  const s = normGroup(g);
  if(!s) return null;
  if(s==="I단품") return "I 단품";
  return s;
}
function eqOrAny(policyVal, selectedVal){
  if(policyVal===null || policyVal===undefined || policyVal==="") return true;
  return normStr(policyVal) === normStr(selectedVal);
}
function eqTv(policyTv, selectedTv){
  if(policyTv===null || policyTv===undefined || policyTv==="") return true;
  return normStr(policyTv) === normStr(selectedTv);
}
function normalizePolicy(){
  POLICY.wired_table.forEach(r=>{
    r.group = normGroup(r.group);
    r.internet = normStr(r.internet);
    r.tv = normStr(r.tv);
  });
  POLICY.uit_table.forEach(r=>{
    r.group = normGroup(r.group);
    r.internet = normStr(r.internet);
    r.tv = normStr(r.tv);
    r.mobile_tier = normStr(r.mobile_tier);
  });
}

function buildGroups(){
  // 고정 순서(요청사항): 인터넷 단독, I+T, M+I, U+I, M+I+T, U+I+T
  // 실제 표의 내부 값은 'I 단품'으로 매칭
  const ORDER = [
    { key: "I 단품", label: "인터넷 단독" },
    { key: "I+T", label: "I+T" },
    { key: "M+I", label: "M+I" },
    { key: "U+I", label: "U+I" },
    { key: "M+I+T", label: "M+I+T" },
    { key: "U+I+T", label: "U+I+T" },
  ];

  const exists = new Set((POLICY.wired_table || []).map(r => normGroup(r.group)));
  const wrap = $("groupBtns");
  wrap.innerHTML = "";

  const btns = ORDER.filter(x => exists.has(normGroup(x.key)));
  btns.forEach((x, idx) => {
    const b = document.createElement("button");
    b.className = "btn" + (idx === 0 ? " on" : "");
    b.textContent = x.label;
    b.dataset.g = x.key; // 내부 매칭 값
    b.onclick = () => {
      [...wrap.querySelectorAll(".btn")].forEach(t => t.classList.remove("on"));
      b.classList.add("on");
      refreshSelectors();
    };
    wrap.appendChild(b);
  });
}


function currentGroup(){
  const b = document.querySelector("#groupBtns .btn.on");
  return b ? b.dataset.g : null;
}

function refreshSelectors(){
  const g = currentGroup();
  const gNorm = normGroup(g);

  // 유선만 사용 (무선/UIT 미사용)
  $("mobileTierRow").style.display = "none";

  const table = (POLICY.wired_table || []).filter(r => normGroup(r.group) === gNorm);

  // 인터넷 상품 리스트
  const internetList = uniq(table.map(r => r.internet));
  $("internetSel").innerHTML = internetList.map(v => `<option value="${v}">${v}</option>`).join("");

  // TV 포함 그룹 여부 (T가 들어간 구성만 TV/지니3 옵션 노출)
  const hasTV = ["I+T","M+I+T","U+I+T"].includes(gNorm);

  // TV Row show/hide
  const tvRow = $("tvSel").closest(".row");
  tvRow.style.display = hasTV ? "" : "none";

  // TV 셀렉트 세팅
  if(!hasTV){
    $("tvSel").innerHTML = `<option value="">없음</option>`;
    $("tvSel").disabled = true;
    $("tvSel").value = "";
  }else{
    const tvList = uniq(table.map(r => r.tv));
    $("tvSel").disabled = false;
    $("tvSel").innerHTML = [`<option value="">없음</option>`, ...tvList.map(v => `<option value="${v}">${v}</option>`)].join("");
  }

  // 옵션: 원스톱은 항상, 지니3는 TV 구성일 때만
  const genieLabel = $("optGenie3").closest("label");
  genieLabel.style.display = hasTV ? "" : "none";
  $("optGenie3").disabled = !hasTV;

  // reset options
  $("optOnestop").checked = false;
  $("optGenie3").checked = false;

  calc();
}


function findRow(){
  const g = currentGroup();
  const internet = $("internetSel").value;
  const tv = $("tvSel").disabled ? null : ($("tvSel").value || null);

  const rows = (POLICY.wired_table || []).filter(r =>
    normGroup(r.group) === normGroup(g) &&
    eqOrAny(r.internet, internet) &&
    eqTv(r.tv, tv)
  );
  return rows[0] || null;
}


function calc(){
  const row=findRow();
  if(!row){
    $("vBase").textContent="-";
    $("vBundle").textContent="-";
    $("vU").textContent="-";
    $("vTotal").textContent="-";
    $("vTotalOnestop").textContent="-";
    $("vTotalGenie3").textContent="-";
    $("noteLine").textContent="해당 조합 데이터가 없습니다. 엑셀(유선정책표/UIT)을 확인하세요.";
    return;
  }

  $("vBase").textContent = money(row.base_policy);
  $("vBundle").textContent = money(row.bundle_policy);
  $("vU").textContent = money(row.u_policy ?? 0);

  $("vTotal").textContent = money(row.total_no_gift);

  const useOnestop = $("optOnestop").checked;
  const useGenie3 = $("optGenie3").checked;

  $("vTotalOnestop").textContent = useOnestop ? money(row.total_with_onestop) : "-";
  $("vTotalGenie3").textContent = useGenie3 ? money(row.total_with_genie3) : "-";

  const parts=[];
  parts.push(`구분: ${row.group}`);
  parts.push(`인터넷: ${row.internet}`);
  if(row.tv) parts.push(`TV: ${row.tv}`);
  if(row.mobile_tier) parts.push(`모바일구간: ${row.mobile_tier}`);
  $("noteLine").textContent = parts.join(" / ");
}

async function init(){
  const res = await fetch("data/wired_policy.json");
  POLICY = await res.json();

  
  normalizePolicy();
buildGroups();
  refreshSelectors();

  $("internetSel").addEventListener("change", calc);
  $("tvSel").addEventListener("change", calc);
  $("mobileTierSel").addEventListener("change", calc);
  $("optOnestop").addEventListener("change", calc);
  $("optGenie3").addEventListener("change", calc);

  $("resetBtn").onclick=()=>refreshSelectors();

  $("copyBtn").onclick=async ()=>{
    const row=findRow();
    if(!row) return;
    const lines=[];
    lines.push(`[유선정책 자동화]`);
    lines.push(`- 구분: ${row.group}`);
    lines.push(`- 인터넷: ${row.internet}`);
    if(row.tv) lines.push(`- TV: ${row.tv}`);
    if(row.mobile_tier) lines.push(`- 모바일구간: ${row.mobile_tier}`);
    lines.push(`- 기본정책: ${money(row.base_policy)}`);
    lines.push(`- 결합정책: ${money(row.bundle_policy)}`);
    if(row.u_policy!==undefined && row.u_policy!==null) lines.push(`- U정책: ${money(row.u_policy)}`);
    lines.push(`- 합계(사은품 미포함): ${money(row.total_no_gift)}`);
    if($("optOnestop").checked) lines.push(`- 원스톱 포함 합계: ${money(row.total_with_onestop)}`);
    if($("optGenie3").checked) lines.push(`- 지니3 포함 합계: ${money(row.total_with_genie3)}`);
    const text = lines.join("\n");
    await navigator.clipboard.writeText(text);
    alert("복사 완료");
  };
}

init();
