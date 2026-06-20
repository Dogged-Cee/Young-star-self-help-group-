let members = JSON.parse(localStorage.getItem("members")) || [];
let password = "m1234";
let logged = false;

/* SAVE */
function save(){
localStorage.setItem("members", JSON.stringify(members));
}

/* PAGE SWITCH */
function showPage(id){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

let page = document.getElementById(id);
if(page) page.classList.add("active");

render();
}

/* SUBMIT */
function submitPayment(){

let name = document.getElementById("name").value;
let category = document.getElementById("category").value;
let amount = document.getElementById("amount").value;

if(!name || !amount){
alert("Fill all fields");
return;
}

members.push({
name,
category,
amount:Number(amount),
status:"pending",
id:"",
date:new Date().toLocaleString()
});

save();
render();

alert("Submitted ✔ waiting approval");
}

/* LOGIN DASHBOARD */
function unlockTreasurer(){

let p = prompt("Enter password");

if(p === password){
logged = true;
showPage("admin");
}else{
alert("Wrong password");
}
}

/* APPROVE */
function approve(i){

if(!logged){
alert("Login required");
return;
}

members[i].status = "approved";
members[i].approvedDate = new Date().toLocaleString();

members[i].id = "YS-" + String(i+1).padStart(3,"0");

save();
render();
}

/* REJECT */
function reject(i){

if(!logged) return;

members[i].status = "rejected";
save();
render();
}

/* MEMBER LOGIN */
function memberLogin(){

let id = document.getElementById("memberId").value;

let m = members.find(x =>
x.id === id && x.status === "approved"
);

let box = document.getElementById("memberProfile");

if(!m){
box.innerHTML = `<div class="card">Not found</div>`;
return;
}

let total = members
.filter(x => x.name === m.name && x.status === "approved")
.reduce((a,b)=>a + Number(b.amount),0);

box.innerHTML = `
<div class="card">
<h3>${m.name}</h3>
<p>ID: ${m.id}</p>
<p>Total: KES ${total}</p>
<p>Approved: ${m.approvedDate}</p>
<button onclick="window.print()">Print Receipt</button>
</div>
`;
}

/* SEARCH */
function searchMembers(){

let s = document.getElementById("searchMember").value.toLowerCase();

document.querySelectorAll(".member-card").forEach(c=>{
c.style.display =
c.innerText.toLowerCase().includes(s)
? "block"
: "none";
});
}

/* CHART SAFE */
function loadChart(){

let ctx = document.getElementById("paymentChart");
if(!ctx) return;

let reg = 0;
let chama = 0;

members.forEach(m=>{
if(m.status === "approved"){
if(m.category === "Registration Fee") reg += Number(m.amount);
if(m.category === "Chama Money") chama += Number(m.amount);
}
});

if(window.myChart){
window.myChart.destroy();
}

window.myChart = new Chart(ctx,{
type:"pie",
data:{
labels:["Registration","Chama"],
datasets:[{
data:[reg,chama],
backgroundColor:["#3b82f6","#10b981"]
}]
}
});

}

/* RENDER */
function render(){

let active = 0;
let pending = 0;
let total = 0;

let ml = document.getElementById("memberList");
let pl = document.getElementById("pendingList");
let cl = document.getElementById("paymentList");

if(ml) ml.innerHTML = "";
if(pl) pl.innerHTML = "";
if(cl) cl.innerHTML = "";

members.forEach((m,i)=>{

if(m.status === "pending"){
pending++;

if(pl){
pl.innerHTML += `
<div class="pending-card">
${m.name} - ${m.category} - KES ${m.amount}
<button onclick="approve(${i})">Approve</button>
<button onclick="reject(${i})">Reject</button>
</div>`;
}
}

if(m.status === "approved"){

total += Number(m.amount);

if(m.category === "Registration Fee"){
active++;

if(ml){
ml.innerHTML += `
<div class="member-card">
${m.name} (${m.id})
</div>`;
}
}

if(m.category === "Chama Money"){
if(cl){
cl.innerHTML += `
<div class="chama-card">
${m.name} - KES ${m.amount}
</div>`;
}
}
}

});

/* SAFE SET */
function set(id,val){
let el = document.getElementById(id);
if(el) el.innerText = val;
}

set("homeMembers",active);
set("homePending",pending);
set("homeMoney",total);

set("activeCount",active);
set("pendingCount",pending);
set("moneyCount",total);

/* CHART */
loadChart();
}

/* START */
window.onload = render;