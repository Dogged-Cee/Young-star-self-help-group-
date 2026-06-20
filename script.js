let members = JSON.parse(localStorage.getItem("members")) || [];
let password = "m1234";
let logged = false;

/* SAVE */
function save(){
localStorage.setItem("members", JSON.stringify(members));
}

/* PAGE */
function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
render();
}

/* SUBMIT */
function submitPayment(){

let name=document.getElementById("name").value;
let category=document.getElementById("category").value;
let amount=document.getElementById("amount").value;

if(!name||!amount)return alert("Fill all");

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
}

/* LOGIN */
function unlockTreasurer(){
let p=prompt("Password");
if(p===password){
logged=true;
showPage("admin");
}
}

/* APPROVE */
function approve(i){

if(!logged)return;

members[i].status="approved";
members[i].approvedDate=new Date().toLocaleString();

/* GIVE ID ONLY AFTER APPROVAL */
members[i].id="YS-"+String(i+1).padStart(3,"0");

save();
render();
}

/* REJECT */
function reject(i){
if(!logged)return;
members[i].status="rejected";
save();
render();
}

/* LOGOUT */
function logout(){
logged=false;
showPage("home");
}

/* CHANGE PASSWORD */
function changePassword(){
let p=prompt("New password");
if(p)password=p;
}

/* MEMBER LOGIN */
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
<button onclick="