let members = JSON.parse(localStorage.getItem("members")) || [];

let treasurerPassword = localStorage.getItem("treasurerPassword") || "m1234";
let treasurerAccess = false;

function save(){
localStorage.setItem("members", JSON.stringify(members));
}

/* SAFE PAGE SWITCH */
function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
if(p) p.classList.remove("active");
});

let target = document.getElementById(page);
if(target) target.classList.add("active");

render();
}

/* SUBMIT */
function submitPayment(){

let name = document.getElementById("name")?.value;
let category = document.getElementById("category")?.value;
let amount = document.getElementById("amount")?.value;

if(!name || !amount){
alert("Fill all fields");
return;
}

members.push({
name,
category,
amount,
status:"pending",
date:new Date().toLocaleString()
});

save();
alert("Submitted ✔");
render();
}

/* TREASURER LOGIN */
function unlockTreasurer(){

let pass = prompt("Enter Treasurer Password");

if(pass === treasurerPassword){
treasurerAccess = true;
showPage("admin");
}else{
alert("Wrong password");
}
}

/* CHANGE PASSWORD */
function changeTreasurerPassword(){

let old = prompt("Current password");

if(old !== treasurerPassword){
alert("Wrong password");
return;
}

let newPass = prompt("New password");

treasurerPassword = newPass;
localStorage.setItem("treasurerPassword", newPass);

alert("Password updated ✔");
}

/* LOGOUT */
function logoutTreasurer(){
treasurerAccess = false;
showPage("home");
}

/* APPROVE */
function approve(i){

if(!treasurerAccess){
alert("Enter password first");
return;
}

members[i].status = "approved";
members[i].approvedDate = new Date().toLocaleString();

save();
render();
}

/* RENDER SAFE */
function render(){

let active=0, pending=0, total=0;

let pendingList=document.getElementById("pendingList");
let memberList=document.getElementById("memberList");
let paymentList=document.getElementById("paymentList");

if(pendingList) pendingList.innerHTML="";
if(memberList) memberList.innerHTML="";
if(paymentList) paymentList.innerHTML="";

members.forEach((m,i)=>{

if(m.status==="pending"){
pending++;

if(pendingList){
pendingList.innerHTML+=`
<div class="card">
${m.name}<br>
${m.category}<br>
KES ${m.amount}<br>
<button onclick="approve(${i})">Approve</button>
</div>`;
}
}

if(m.status==="approved"){
active++;
total += Number(m.amount);

if(memberList){
memberList.innerHTML+=`
<div class="card">
${m.name} ✔
</div>`;
}
}

});

let hm=document.getElementById("homeMembers");
let hp=document.getElementById("homePending");
let ht=document.getElementById("homeMoney");

if(hm) hm.innerText=active;
if(hp) hp.innerText=pending;
if(ht) ht.innerText=total;

if(document.getElementById("activeCount"))
document.getElementById("activeCount").innerText=active;

if(document.getElementById("pendingCount"))
document.getElementById("pendingCount").innerText=pending;

if(document.getElementById("moneyCount"))
document.getElementById("moneyCount").innerText=total;
}

render();
