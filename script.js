let members = JSON.parse(localStorage.getItem("members")) || [];
let password = "m1234";
let logged = false;

function save(){
localStorage.setItem("members", JSON.stringify(members));
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
render();
}

function submitPayment(){

let name=document.getElementById("name").value;
let category=document.getElementById("category").value;
let amount=document.getElementById("amount").value;

if(!name||!amount)return alert("Fill all");

let id="YS-"+(members.length+1).toString().padStart(3,"0");

members.push({
name,category,amount,
id,
status:"pending",
date:new Date().toLocaleString()
});

save();
render();
alert("Submitted");
}

function unlockTreasurer(){
let p=prompt("Password");
if(p===password){
logged=true;
showPage("admin");
}
}

function approve(i){
if(!logged)return;

members[i].status="approved";
members[i].approvedDate=new Date().toLocaleString();

save();
render();
}

function reject(i){
if(!logged)return;
members[i].status="rejected";
save();
render();
}

function logout(){
logged=false;
showPage("home");
}

function changePassword(){
let p=prompt("New password");
if(p)password=p;
}

function memberLogin(){

let id=document.getElementById("memberId").value;

let m=members.find(x=>x.id===id && x.status==="approved");

let box=document.getElementById("memberProfile");

if(!m){
box.innerHTML="Not found";
return;
}

let total=members
.filter(x=>x.name===m.name && x.status==="approved")
.reduce((a,b)=>a+Number(b.amount),0);

box.innerHTML=`
<div class="card">
<h3>${m.name}</h3>
<p>ID: ${m.id}</p>
<p>Total: KES ${total}</p>
<p>Approved: ${m.approvedDate}</p>
</div>`;
}

function searchMembers(){
let s=document.getElementById("searchMember").value.toLowerCase();
document.querySelectorAll(".member-card").forEach(c=>{
c.style.display=c.innerText.toLowerCase().includes(s)?"block":"none";
});
}

function render(){

let active=0,pending=0,total=0;

let ml=document.getElementById("memberList");
let pl=document.getElementById("pendingList");
let cl=document.getElementById("paymentList");

ml.innerHTML="";
pl.innerHTML="";
cl.innerHTML="";

members.forEach((m,i)=>{

if(m.status==="pending"){
pending++;
pl.innerHTML+=`
<div class="pending-card">
${m.name} - ${m.category} - KES ${m.amount}
<button onclick="approve(${i})">Approve</button>
<button onclick="reject(${i})">Reject</button>
</div>`;
}

if(m.status==="approved"){
total+=Number(m.amount);

if(m.category==="Registration Fee"){
active++;
ml.innerHTML+=`<div class="member-card">${m.name} (${m.id})</div>`;
}

if(m.category==="Chama Money"){
cl.innerHTML+=`<div class="chama-card">${m.name} - KES ${m.amount}</div>`;
}
}

});

document.getElementById("homeMembers").innerText=active;
document.getElementById("homePending").innerText=pending;
document.getElementById("homeMoney").innerText=total;

document.getElementById("activeCount").innerText=active;
document.getElementById("pendingCount").innerText=pending;
document.getElementById("moneyCount").innerText=total;
}

render();