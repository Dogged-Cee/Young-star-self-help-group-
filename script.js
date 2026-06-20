let data = JSON.parse(localStorage.getItem("data")) || [];

function show(id){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

document.getElementById(id).classList.add("active");

render();
}

function add(){

let name = document.getElementById("name").value;
let amount = document.getElementById("amount").value;

if(!name || !amount){
alert("Fill all fields");
return;
}

data.push({
name,
amount,
date:new Date().toLocaleString()
});

localStorage.setItem("data", JSON.stringify(data));

render();
}

function render(){

let box = document.getElementById("list");
if(!box) return;

box.innerHTML = "";

data.forEach((d,i)=>{
box.innerHTML += `
<div>
${d.name} - KES ${d.amount}
</div>
`;
});

}

render();