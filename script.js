// LOAD SAVED DATA
let members = JSON.parse(localStorage.getItem("members")) || [];

// TREASURER PASSWORD
let treasurerPassword =
    localStorage.getItem("treasurerPassword") || "m1234";

let treasurerAccess = false;

// SAVE DATA
function saveData() {
    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

    localStorage.setItem(
        "treasurerPassword",
        treasurerPassword
    );
}

// CHANGE PAGE
function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId)
        .classList.add("active");

    render();
}

// SUBMIT PAYMENT
function submitPayment() {

    const name =
        document.getElementById("name").value.trim();

    const category =
        document.getElementById("category").value;

    const amount =
        document.getElementById("amount").value;

    if (name === "" || amount === "") {
        alert("Please fill all fields.");
        return;
    }

    const memberId =
        "YS-" + String(members.length + 1).padStart(3, "0");

    const receipt =
        "RC-" + Date.now();

    members.push({
        id: memberId,
        name: name,
        category: category,
        amount: Number(amount),
        status: "pending",
        date: new Date().toLocaleString(),
        approvedDate: "",
        receipt: receipt
    });

    saveData();

    alert(
        "Payment submitted successfully.\nWait for Treasurer approval."
    );

    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";

    render();
}

// TREASURER LOGIN
function unlockTreasurer() {

    let password =
        prompt("Enter Treasurer Password");

    if (password === treasurerPassword) {

        treasurerAccess = true;

        showPage("admin");

    } else {

        alert("Incorrect password.");
    }
}

// CHANGE PASSWORD
function changeTreasurerPassword() {

    if (!treasurerAccess) {
        alert("Login first.");
        return;
    }

    let newPassword =
        prompt("Enter new password");

    if (!newPassword) {
        return;
    }

    treasurerPassword = newPassword;

    saveData();

    alert("Password changed successfully.");
}

// APPROVE PAYMENT
function approve(index) {

    if (!treasurerAccess) {
        alert("Treasurer login required.");
        return;
    }

    members[index].status = "approved";

    members[index].approvedDate =
        new Date().toLocaleString();

    saveData();

    render();
}

// RENDER DATA
function render() {

    let memberList =
        document.getElementById("memberList");

    let paymentList =
        document.getElementById("paymentList");

    let pendingList =
        document.getElementById("pendingList");

    if (memberList)
        memberList.innerHTML = "";

    if (paymentList)
        paymentList.innerHTML = "";

    if (pendingList)
        pendingList.innerHTML = "";

    let activeMembers = 0;
    let pendingPayments = 0;
    let totalMoney = 0;

    members.forEach((member, index) => {

        // PENDING APPROVALS
        if (member.status === "pending") {

            pendingPayments++;

            if (pendingList) {

                pendingList.innerHTML += `
                <div class="pending-card">
                    <h3>${member.name}</h3>

                    <p>
                        ${member.category}
                    </p>

                    <p>
                        KES ${member.amount}
                    </p>

                    <button
                    class="approve-btn"
                    onclick="approve(${index})">
                    Approve
                    </button>

                </div>
                `;
            }
        }

        // ACTIVE MEMBERS
        if (
            member.status === "approved" &&
            member.category ===
            "Registration Fee"
        ) {

            activeMembers++;

            totalMoney += member.amount;

            if (memberList) {

                memberList.innerHTML += `
                <div class="member-card">

                    <h3>${member.name}</h3>

                    <p>ID: ${member.id}</p>

                    <p>
                    Approved:
                    ${member.approvedDate}
                    </p>

                    <span class="badge active-badge">
                    ACTIVE MEMBER
                    </span>

                </div>
                `;
            }
        }

        // CHAMA PAYMENTS
        if (
            member.status === "approved" &&
            member.category ===
            "Chama Money"
        ) {

            totalMoney += member.amount;

            if (paymentList) {

                paymentList.innerHTML += `
                <div class="chama-card">

                    <h3>${member.name}</h3>

                    <p>
                    Amount:
                    KES ${member.amount}
                    </p>

                    <p>
                    Receipt:
                    ${member.receipt}
                    </p>

                    <p>
                    Approved:
                    ${member.approvedDate}
                    </p>

                    <span class="badge chama-badge">
                    APPROVED
                    </span>

                </div>
                `;
            }
        }
    });

    // HOME PAGE STATS
    if (document.getElementById("homeMembers")) {
        document.getElementById(
            "homeMembers"
        ).innerText = activeMembers;
    }

    if (document.getElementById("homePending")) {
        document.getElementById(
            "homePending"
        ).innerText = pendingPayments;
    }

    if (document.getElementById("homeMoney")) {
        document.getElementById(
            "homeMoney"
        ).innerText = totalMoney;
    }

    // DASHBOARD STATS
    if (document.getElementById("activeCount")) {
        document.getElementById(
            "activeCount"
        ).innerText = activeMembers;
    }

    if (document.getElementById("pendingCount")) {
        document.getElementById(
            "pendingCount"
        ).innerText = pendingPayments;
    }

    if (document.getElementById("moneyCount")) {
        document.getElementById(
            "moneyCount"
        ).innerText = totalMoney;
    }
}

// START SYSTEM
render();