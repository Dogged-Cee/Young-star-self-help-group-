let members = JSON.parse(localStorage.getItem("members")) || [];

/* TREASURER PASSWORD */
let treasurerPassword = localStorage.getItem("treasurerPassword") || "m1234";
let treasurerAccess = false;

/* SAVE DATA */
function save(){
localStorage.setItem("members", JSON.stringify(members));
}

/* PAGE SWITCH */
function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
if(p) p.classList.remove("active");
});

let el = document.getElementById(page);
if(el) el.classList.add("active");

render();
}

/* SUBMIT PAYMENT */
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
amount,
status:"pending",
date:new Date().toLocaleString(),
approvedDate:null,
id:null,
receipt:null
});

save();
alert("Submitted ✔ Waiting Treasurer approval");
render();
}

/* TREASURER LOGIN */
function unlockTreasurer(){

let pass = prompt("Enter Treasurer Password");

if(pass === treasurerPassword){
treasurerAccess = true;
showPage("admin");
alert("Access Granted ✔");
}else{
alert("❌ Wrong Password");
}
}

/* CHANGE PASSWORD */
function changeTreasurerPassword(){

let oldPass = prompt("Current password");

if(oldPass !== treasurerPassword){
alert("❌ Wrong password");
return;
}

let newPass = prompt("New password");

if(!newPass){
alert("❌ Invalid password");
return;
}

treasurerPassword = newPass;
localStorage.setItem("treasurerPassword", newPass);

alert("✔ Treasurer password updated");
}

/* LOGOUT */
function logoutTreasurer(){
treasurerAccess = false;
showPage("home");
}

/* APPROVE (REGISTRATION + CHAMA) */
function approve(i){

if(!treasurerAccess){
alert("Enter Treasurer password first");
return;
}

let m = members[i];

m.status = "approved";
m.approvedDate = new Date().toLocaleString();

/* REGISTRATION APPROVAL */
if(m.category === "Registration Fee"){
m.id = "YS-" + String(i+1).padStart(3,"0");
}

/* CHAMA APPROVAL */
if(m.category === "Chama Money"){
m.receipt = "CHAMA-" + Date.now();
}

save();
render();
}

/* RENDER EVERYTHING */
function render(){

let active = 0;
let pending = 0;
let chamaTotal = 0;
let regTotal = 0;

/* DOM ELEMENTS */
let pendingList = document.getElementById("pendingList");
let memberList = document.getElementById("memberList");
let paymentList = document.getElementById("paymentList");

/* CLEAR */
if(pendingList) pendingList.innerHTML = "";
if(memberList) memberList.innerHTML = "";
if(paymentList) paymentList.innerHTML = "";

/* LOOP MEMBERS */
members.forEach((m,i)=>{

/* PENDING */
if(m.status === "pending"){
pending++;

let icon = m.category === "Chama Money" ? "💰" : "🧾";
let cls = m.category === "Chama Money" ? "chama-card" : "registration-card";

if(pendingList){
pendingList.innerHTML += `
<div class="card ${cls}">
${icon} <strong>${m.name}</strong><br>
${m.category}<br>
KES ${m.amount}<br>
<button onclick="approve(${i})">Approve</button>
</div>`;
}
}

/* APPROVED MEMBERS */
if(m.status === "approved" && m.category === "Registration Fee"){
active++;
regTotal++;

if(memberList){
memberList.innerHTML += `
<div class="card registration-card">
🧾 <strong>${m.name}</strong><br>
ID: ${m.id}<br>
<span class="badge reg">ACTIVE</span>
</div>`;
}
}

/* CHAMA PAYMENTS */
if(m.status === "approved" && m.category === "Chama Money"){
chamaTotal += Number(m.amount);

if(paymentList){
paymentList.innerHTML += `
<div class="card chama-card">
💰 <strong>${m.name}</strong><br>
KES ${m.amount}<br>
Receipt: ${m.receipt}<br>
${m.approvedDate}<br>
<span class="badge chama">APPROVED</span>
</div>`;
}
}

});

/* DASHBOARD COUNTERS */
document.getElementById("activeCount").innerText = active;
document.getElementById("pendingCount").innerText = pending;
document.getElementById("paymentCount").innerText = chamaTotal;
document.getElementById("moneyCount").innerText = chamaTotal + regTotal;

/* HOME PAGE */
let homeMembers = document.getElementById("homeMembers");
let homePending = document.getElementById("homePending");
let homeActive = document.getElementById("homeActive");
let homeMoney = document.getElementById("homeMoney");

if(homeMembers) homeMembers.innerText = active;
if(homePending) homePending.innerText = pending;
if(homeActive) homeActive.innerText = active;
if(homeMoney) homeMoney.innerText = chamaTotal;

/* PIE CHART */
let total = regTotal + chamaTotal;
let regDeg = total === 0 ? 0 : (regTotal / total) * 360;

let pie = document.getElementById("pieChart");
if(pie){
pie.style.setProperty("--reg", regDeg + "deg");
}

}

/* INIT */
render();
