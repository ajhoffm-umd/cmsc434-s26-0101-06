var householdMembers = [
  { name: "Bob", role: "Owner" },
  { name: "John", role: "Member" },
  { name: "Steve", role: "Member" },
  { name: "Kevin", role: "Member" }
];

function renderMembers() {
    const memberList = document.getElementById("memberlist");
    if (!memberList) return;

    memberList.innerHTML = `
        <li class="header-row member-header-row">
            <span>Name</span>
            <span>Role</span>
        </li>
    `;

    householdMembers.forEach(member => {
        const li = document.createElement("li");
        li.classList.add("item-row", "member-row");
        li.dataset.memberName = member.name;

        const name = document.createElement("span");
        name.textContent = member.name;

        const role = document.createElement("span");
        role.textContent = member.role;

        // remove button (hidden by default)
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.style.display = "none";

        removeBtn.onclick = function(e) {
            e.stopPropagation();
            removeMember(member.name);
        };

        li.appendChild(name);
        li.appendChild(role);
        li.appendChild(removeBtn);

        li.onclick = function() {
            toggleRemoveButton(li);
        };

        memberList.appendChild(li);
    });
}

function openMemberAddPopup() {
    document.getElementById("memberaddpopup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("copymsg").style.display = "none";
}

function closeMemberAddPopup() {
    document.getElementById("memberaddpopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function copyMemberLink() {
    const linkInput = document.getElementById("memberlink");
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(linkInput.value);
    document.getElementById("copymsg").style.display = "block";
}

function removeMember(memberName) {
    householdMembers = householdMembers.filter(m => m.name !== memberName);
    renderMembers();
}

document.addEventListener("DOMContentLoaded", function() {
    renderMembers();
});

function toggleRemoveButton(selectedLi) {
    const allRows = document.querySelectorAll(".member-row");

    allRows.forEach(row => {
        const btn = row.querySelector(".remove-btn");

        if (row === selectedLi) {
            btn.style.display = (btn.style.display === "block") ? "none" : "block";
        } else {
            btn.style.display = "none";
        }
    });
}