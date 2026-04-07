// shared cover image preview helper
function previewCover(fileInput, containerId) {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const upload = document.getElementById(containerId);
            const existing = upload.querySelector("img");
            if (existing) existing.remove();
            const img = document.createElement("img");
            img.src = e.target.result;
            upload.appendChild(img);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function clearCoverUpload(containerId) {
    const upload = document.getElementById(containerId);
    const existing = upload.querySelector("img");
    if (existing) existing.remove();
    const fileInput = upload.querySelector("input[type=file]");
    if (fileInput) fileInput.value = "";
}

function getCoverImageSrc(containerId) {
    const img = document.getElementById(containerId).querySelector("img");
    return img ? img.src : null;
}

// sets default for the showing dropdown in pantry

const defaultKitchenLocations = ["Pantry", "Fridge", "Freezer"];

const selectElement = document.getElementById('listdropdown');

let locationOptions = '';
locationOptions += `<option value="All">All</option>`;
defaultKitchenLocations.forEach(location => {
locationOptions += `<option value="${location}">${location}</option>`;
});

let expSortAscending = true;

selectElement.innerHTML = locationOptions;

let kitchenItems = [
  {
    name: "Almond Milk",
    location: "Fridge",
    quantity: "1 LITER",
    expirationDate: "2026-04-06",
    members: ["Emily", "Sally"],
    image: "photos/default_photo.jpg"
  },
  {
    name: "Greek Yogurt",
    location: "Fridge",
    quantity: "500 ML",
    expirationDate: "2026-04-08",
    members: ["Sarah"],
    image: "photos/default_photo.jpg"
  },
  {
    name: "Cheddar Cheese",
    location: "Fridge",
    quantity: "250 GRAMS",
    expirationDate: "2026-04-12",
    members: ["Mary"],
    image: "photos/default_photo.jpg"
  },
  {
    name: "Rice",
    location: "Pantry",
    quantity: "2 bags",
    members: ["Emily", "Sally"]
  }
];

// update list depending on selection
function updateInvDisplay() {
    console.log("updating with");
    console.log(kitchenItems);

    const pantryList = document.getElementById('invlist');
    const query = document.getElementById("invsearch").value.trim().toLowerCase();
    const currentLocation = document.getElementById("listdropdown").value;

    pantryList.innerHTML = "";

    // do filtering based on what's in the search bar & selected location
    kitchenItems.forEach(item => {
        const matchesSearch = item.name.toLowerCase().includes(query);
        const matchesLocation = currentLocation === "All" || item.location === currentLocation;

        if (matchesSearch && matchesLocation) {
            pushElemListAdd(item);
        }
    });
}

function getExpirationDisplay(expirationDate) {
    if (!expirationDate) {
        return {
            text: "",
            className: ""
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);

    const oneDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / oneDay);

    if (daysLeft < 0) {
        return {
            text: "Expired",
            className: "expired"
        };
    } else if (daysLeft === 0) {
        return {
            text: "Expires today",
            className: "urgent"
        };
    } else if (daysLeft <= 3) {
        return {
            text: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
            className: "urgent"
        };
    } else {
        return {
            text: `${daysLeft} days left`,
            className: "safe"
        };
    }
}

// actually adds to pantry list on html
function pushElemListAdd(item) {

    const currentLocation = document.getElementById("listdropdown").value;
    if (currentLocation !== "All" && currentLocation !== item.location) {
        return;
    }

    const card = document.createElement("div");
    card.classList.add("inventory-card");
    card.id = item.name;

    // left
    const left = document.createElement("div");
    left.classList.add("inventory-card-left");

    // image
    let imageEl;
    if (item.image) {
        imageEl = document.createElement("img");
        imageEl.src = item.image;
        imageEl.alt = item.name;
    } else {
        imageEl = document.createElement("img");
        imageEl.src = "photos/default_photo.jpg";
        imageEl.alt = item.name;
    }
    imageEl.classList.add("inventory-card-image");

    // INFO BLOCK
    const info = document.createElement("div");
    info.classList.add("inventory-card-info");

    const name = document.createElement("div");
    name.classList.add("inventory-card-name");
    name.textContent = item.name;

    const membersRow = document.createElement("div");
    membersRow.classList.add("inventory-card-members");

    const membersIcon = document.createElement("span");
    membersIcon.classList.add("inventory-card-members-icon");
    membersIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <path d="M11.25 17.1875C8.325 17.1875 2.5 18.65 2.5 21.5625V23.75H20V21.5625C20 18.65 14.175 17.1875 11.25 17.1875ZM5.425 21.25C6.475 20.525 9.0125 19.6875 11.25 19.6875C13.4875 19.6875 16.025 20.525 17.075 21.25H5.425ZM11.25 15C13.6625 15 15.625 13.0375 15.625 10.625C15.625 8.2125 13.6625 6.25 11.25 6.25C8.8375 6.25 6.875 8.2125 6.875 10.625C6.875 13.0375 8.8375 15 11.25 15ZM11.25 8.75C12.2875 8.75 13.125 9.5875 13.125 10.625C13.125 11.6625 12.2875 12.5 11.25 12.5C10.2125 12.5 9.375 11.6625 9.375 10.625C9.375 9.5875 10.2125 8.75 11.25 8.75ZM20.05 17.2625C21.5 18.3125 22.5 19.7125 22.5 21.5625V23.75H27.5V21.5625C27.5 19.0375 23.125 17.6 20.05 17.2625ZM18.75 15C21.1625 15 23.125 13.0375 23.125 10.625C23.125 8.2125 21.1625 6.25 18.75 6.25C18.075 6.25 17.45 6.4125 16.875 6.6875C17.6625 7.8 18.125 9.1625 18.125 10.625C18.125 12.0875 17.6625 13.45 16.875 14.5625C17.45 14.8375 18.075 15 18.75 15Z" fill="black" fill-opacity="0.8"/>
    </svg>
    `; // url from figma dev mode

    const membersText = document.createElement("span");
    membersText.classList.add("inventory-card-members-text");
    if (item.members && item.members.length > 0) {
        membersText.textContent = item.members.join(", ");
    } else {
        membersText.textContent = "Shared";
    }

    membersRow.appendChild(membersIcon);
    membersRow.appendChild(membersText);

    const bottomRow = document.createElement("div");
    bottomRow.classList.add("inventory-card-bottomrow");

    const locationPill = document.createElement("span");
    locationPill.classList.add("inventory-card-location");
    locationPill.textContent = item.location;

    bottomRow.appendChild(locationPill);

    info.appendChild(name);
    info.appendChild(membersRow);
    info.appendChild(bottomRow);

    left.appendChild(imageEl);
    left.appendChild(info);

    // RIGHT SIDE
    const right = document.createElement("div");
    right.classList.add("inventory-card-right");

    const qty = document.createElement("div");
    qty.classList.add("inventory-card-qty");
    qty.textContent = item.quantity ? item.quantity : "--";

    const expData = getExpirationDisplay(item.expirationDate);
    const exp = document.createElement("div");
    exp.classList.add("inventory-card-exp");
    if (expData.className) {
        exp.classList.add(expData.className);
    }
    exp.textContent = expData.text;

    right.appendChild(qty);
    right.appendChild(exp);

    // TRASH
    const trash = document.createElement("button");
    trash.classList.add("inventory-card-trash");
    trash.setAttribute("aria-label", `Delete ${item.name}`);
    trash.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none" aria-hidden="true">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"/>
    </svg>
    `;

    trash.onclick = function(event) {
        event.stopPropagation();
        deleteInvItem(card);
    };

    // BUILD CARD
    card.appendChild(left);
    card.appendChild(right);
    card.appendChild(trash);

    card.onclick = function() {
        openInvEditForm(this);
    };

    document.getElementById("invlist").appendChild(card);
}

kitchenItems.forEach(item => {pushElemListAdd(item)});

// ITEM DELETE --------------------- //

function deleteInvItem(cardElem) {
    kitchenItems = kitchenItems.filter(item => item.name.toLowerCase() !== cardElem.id.toLowerCase());
    cardElem.remove();
}



// NEW ITEM FORM ------------------------------ //

// add a list item using the form

let selectedAddMembers = [];

function addListItemFormSubmit() {
    const name = document.getElementById("invnewname").value.trim();
    const location = document.getElementById("invnewdrop").value.trim();
    const qtyVal = document.getElementById("invnewquantity").value.trim();
    const unitsVal = document.getElementById("invnewunits").value.trim();
    const expirationDate = document.getElementById("invnewdate").value.trim();

    var nameflag = false;
    kitchenItems.forEach(item => {
        if (item.name.toLowerCase() == name.toLowerCase()) {
            document.getElementById("invformnamewarning").style.display = "block";
            nameflag = true;
        }
    });
    if (nameflag) {
        return false;
    }

    const newItem = { name, location };

    if (qtyVal !== "") {
        newItem.quantity = unitsVal ? `${qtyVal} ${unitsVal}` : qtyVal;
    }

    if (expirationDate !== "") {
        newItem.expirationDate = expirationDate;
    }

    if (selectedAddMembers.length > 0) {
        newItem.members = [...selectedAddMembers];
    }

    const coverSrc = getCoverImageSrc("invaddcover");
    if (coverSrc) newItem.image = coverSrc;

    kitchenItems.push(newItem);
    pushElemListAdd(newItem);
    closeListAddForm();

    return false;
}

// open the add and edit an item forms

function openInvAddForm() {
    document.getElementById("invaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    document.getElementById("invnewname").value = "";
    document.getElementById("invnewquantity").value = "";
    document.getElementById("invnewunits").value = "";
    document.getElementById("invnewdate").value = "";
    document.getElementById("invnewdrop").value = "Fridge";
    clearCoverUpload("invaddcover");

    document.querySelectorAll("#invaddpills .edit-pill").forEach(p => {
        p.classList.toggle("active-pill", p.dataset.loc === "Fridge");
        p.onclick = function() {
            document.getElementById("invnewdrop").value = this.dataset.loc;
            document.querySelectorAll("#invaddpills .edit-pill").forEach(b => b.classList.remove("active-pill"));
            this.classList.add("active-pill");
        };
    });

    renderAddMembers();
}

function renderAddMembers() {
    selectedAddMembers = [];
    const container = document.getElementById("invaddmembers");
    container.innerHTML = "";

    getHouseholdMemberNames().forEach(member => {
        const div = document.createElement("div");
        div.classList.add("edit-member");

        div.innerHTML = `
            <div class="edit-member-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30" fill="none">
                    <path d="M11.25 17.1875C8.325 17.1875 2.5 18.65 2.5 21.5625V23.75H20V21.5625C20 18.65 14.175 17.1875 11.25 17.1875ZM5.425 21.25C6.475 20.525 9.0125 19.6875 11.25 19.6875C13.4875 19.6875 16.025 20.525 17.075 21.25H5.425ZM11.25 15C13.6625 15 15.625 13.0375 15.625 10.625C15.625 8.2125 13.6625 6.25 11.25 6.25C8.8375 6.25 6.875 8.2125 6.875 10.625C6.875 13.0375 8.8375 15 11.25 15ZM11.25 8.75C12.2875 8.75 13.125 9.5875 13.125 10.625C13.125 11.6625 12.2875 12.5 11.25 12.5C10.2125 12.5 9.375 11.6625 9.375 10.625C9.375 9.5875 10.2125 8.75 11.25 8.75Z" fill="#666"/>
                </svg>
            </div>
            <span class="edit-member-name">${member}</span>
        `;

        div.onclick = function() {
            const idx = selectedAddMembers.indexOf(member);
            if (idx >= 0) {
                selectedAddMembers.splice(idx, 1);
                div.classList.remove("selected");
            } else {
                selectedAddMembers.push(member);
                div.classList.add("selected");
            }
        };

        container.appendChild(div);
    });
}

function closeListAddForm() {
    document.getElementById("invaddform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("invformnamewarning").style.display = "none";
}

var openItem = null;
var openElem = null;

const householdMemberProfiles = [
    { name: "Emily", role: "Roommate", isCreator: true },
    { name: "Sally", role: "Roommate", isCreator: false },
    { name: "Sarah", role: "Roommate", isCreator: false },
    { name: "Mary", role: "Roommate", isCreator: false }
];

function getHouseholdMemberNames() {
    return householdMemberProfiles.map(m => m.name);
}

const householdInfo = {
    name: "Calvert Hall 1406",
    type: "Roommates"
};

let memberFoodRequestTarget = "";

/** Working copy while #householdeditform is open */
let householdEditDraft = null;

const HOUSEHOLD_EDIT_ROLES = ["Adult", "Roommate", "Child"];

function memberInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase() || "?";
}

function openHouseholdEdit() {
    householdEditDraft = householdMemberProfiles.map(p => ({
        name: p.name,
        role: p.role,
        isCreator: !!p.isCreator
    }));

    document.getElementById("householdeditname").value = householdInfo.name;
    const typeSel = document.getElementById("householdedittype");
    if (typeSel) {
        const types = Array.from(typeSel.options).map(o => o.value);
        typeSel.value = types.includes(householdInfo.type) ? householdInfo.type : typeSel.options[0].value;
    }

    renderHouseholdEditMemberRows();

    document.getElementById("householdeditform").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeHouseholdEdit() {
    const form = document.getElementById("householdeditform");
    if (form) form.style.display = "none";
    document.getElementById("overlay").style.display = "none";
    householdEditDraft = null;
}

function syncHouseholdEditDraftFromDom() {
    if (!householdEditDraft) return;
    const rows = document.querySelectorAll("#householdeditmemberrows .household-edit-member-row");
    householdEditDraft = [];
    rows.forEach(row => {
        householdEditDraft.push({
            name: row.querySelector(".household-edit-name-input").value,
            role: row.querySelector(".household-edit-role-select").value,
            isCreator: row.dataset.isCreator === "1"
        });
    });
}

function renderHouseholdEditMemberRows() {
    const container = document.getElementById("householdeditmemberrows");
    if (!container || !householdEditDraft) return;

    container.innerHTML = "";
    const trashSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none" width="26" height="26" aria-hidden="true">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    householdEditDraft.forEach((p, idx) => {
        const row = document.createElement("div");
        row.className = "household-edit-member-row";
        row.dataset.isCreator = p.isCreator ? "1" : "0";

        const nameIn = document.createElement("input");
        nameIn.type = "text";
        nameIn.className = "household-edit-name-input";
        nameIn.placeholder = "Name";
        nameIn.value = p.name;
        nameIn.autocomplete = "off";

        const sel = document.createElement("select");
        sel.className = "household-edit-role-select edit-sm-select";
        HOUSEHOLD_EDIT_ROLES.forEach(r => {
            const o = document.createElement("option");
            o.value = r;
            o.textContent = r;
            sel.appendChild(o);
        });
        if (p.role && !HOUSEHOLD_EDIT_ROLES.includes(p.role)) {
            const o = document.createElement("option");
            o.value = p.role;
            o.textContent = p.role;
            sel.insertBefore(o, sel.firstChild);
        }
        sel.value = p.role;

        const del = document.createElement("button");
        del.type = "button";
        del.className = "household-edit-delete-btn";
        del.setAttribute("aria-label", "Remove member");
        del.innerHTML = trashSvg;
        del.disabled = householdEditDraft.length <= 1;
        del.onclick = function() {
            removeHouseholdEditMemberRow(idx);
        };

        row.appendChild(nameIn);
        row.appendChild(sel);
        row.appendChild(del);
        container.appendChild(row);
    });
}

function removeHouseholdEditMemberRow(index) {
    syncHouseholdEditDraftFromDom();
    if (householdEditDraft.length <= 1) return;

    const wasCreator = householdEditDraft[index].isCreator;
    householdEditDraft.splice(index, 1);
    if (wasCreator && householdEditDraft.length > 0) {
        householdEditDraft[0].isCreator = true;
    }

    renderHouseholdEditMemberRows();
}

function addHouseholdEditMemberRow() {
    syncHouseholdEditDraftFromDom();
    householdEditDraft.push({ name: "", role: "Adult", isCreator: false });
    renderHouseholdEditMemberRows();

    const inputs = document.querySelectorAll("#householdeditmemberrows .household-edit-name-input");
    if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
    }
}

function saveHouseholdEdit() {
    syncHouseholdEditDraftFromDom();

    const hn = document.getElementById("householdeditname").value.trim();
    if (!hn) {
        document.getElementById("householdeditname").focus();
        return;
    }

    const trimmed = householdEditDraft
        .map(p => ({
            name: p.name.trim(),
            role: p.role,
            isCreator: p.isCreator
        }))
        .filter(p => p.name.length > 0);

    if (trimmed.length === 0) {
        window.alert("Add at least one household member with a name.");
        return;
    }

    const lowerNames = trimmed.map(m => m.name.toLowerCase());
    if (new Set(lowerNames).size !== lowerNames.length) {
        window.alert("Each member needs a unique name.");
        return;
    }

    let creatorIndex = trimmed.findIndex(m => m.isCreator);
    if (creatorIndex < 0) {
        creatorIndex = 0;
    }
    trimmed.forEach((m, i) => {
        m.isCreator = i === creatorIndex;
    });

    householdInfo.name = hn;
    const typeSel = document.getElementById("householdedittype");
    if (typeSel) {
        householdInfo.type = typeSel.value;
    }

    householdMemberProfiles.length = 0;
    trimmed.forEach(m => {
        householdMemberProfiles.push({
            name: m.name,
            role: m.role,
            isCreator: m.isCreator
        });
    });

    renderMembersPage();
    closeHouseholdEdit();
}

function renderMembersPage() {
    const nameEl = document.getElementById("household-display-name");
    const typeEl = document.getElementById("household-display-type");
    const listEl = document.getElementById("memberslist");
    if (!nameEl || !typeEl || !listEl) return;

    nameEl.textContent = householdInfo.name;
    typeEl.textContent = householdInfo.type;

    listEl.innerHTML = "";
    householdMemberProfiles.forEach(profile => {
        const card = document.createElement("article");
        card.className = "member-card";

        const avatar = document.createElement("div");
        avatar.className = "member-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = memberInitials(profile.name);

        const name = document.createElement("div");
        name.className = "member-name";
        name.textContent = profile.name;

        const role = document.createElement("div");
        role.className = "member-role";
        role.textContent = profile.role + (profile.isCreator ? " (Creator)" : "");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "member-request-btn";
        btn.setAttribute("aria-label", `Request a food item for ${profile.name}`);
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H19M9 21C9.55228 21 10 20.5523 10 20C10 19.4477 9.55228 19 9 19C8.44772 19 8 19.4477 8 20C8 20.5523 8.44772 21 9 21ZM19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 19 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Request
        `;
        btn.onclick = function() {
            openMemberFoodRequest(profile.name);
        };

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(btn);
        listEl.appendChild(card);
    });
}

function openMemberFoodRequest(memberName) {
    memberFoodRequestTarget = memberName;
    const ctx = document.getElementById("memberrequestcontext");
    const input = document.getElementById("memberrequestitem");
    const warn = document.getElementById("memberrequestwarning");
    if (!ctx || !input) return;

    ctx.textContent = "";
    document.getElementById("memberrequestquantity").value = "";
    document.getElementById("memberrequestunits").value = "";
    ctx.textContent = "Adding for " + memberName + ". This will go on their grocery list.";

    input.value = "";
    if (warn) warn.style.display = "none";

    document.getElementById("memberfoodrequestform").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    input.focus();
}

function closeMemberFoodRequest() {
    document.getElementById("memberfoodrequestform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    memberFoodRequestTarget = "";
}

function submitMemberFoodRequest() {
    const name = document.getElementById("memberrequestitem").value.trim();
    const warn = document.getElementById("memberrequestwarning");
    if (!name) {
        document.getElementById("memberrequestitem").focus();
        return false;
    }

    let duplicate = false;
    groceryItems.forEach(item => {
        if (item.name.toLowerCase() === name.toLowerCase()) duplicate = true;
    });
    if (duplicate) {
        warn.style.display = "block";
        return false;
    }
    warn.style.display = "none";

    const qtyVal = document.getElementById("memberrequestquantity").value.trim();
    const unitsVal = document.getElementById("memberrequestunits").value.trim();

    const newItem = { name, requestedBy: memberFoodRequestTarget };
    if (qtyVal !== "") {
        newItem.quantity = unitsVal ? `${qtyVal} ${unitsVal}` : qtyVal;
    }
    groceryItems.push(newItem);
    updateGroceryDisplay();
    closeMemberFoodRequest();
    return false;
}
let selectedEditMembers = [];

function openInvEditForm(elem) {
    document.getElementById("inveditform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    openItem = kitchenItems.find(item => item.name == elem.id);
    openElem = elem;

    document.getElementById("inveditname").value = openItem.name;

    if (openItem.quantity) {
        const parts = openItem.quantity.split(" ");
        document.getElementById("inveditquantity").value = parts[0];
        if (parts.length >= 2) {
            const unitStr = parts.slice(1).join(" ");
            const unitsSelect = document.getElementById("inveditunits");
            let matched = false;
            for (let opt of unitsSelect.options) {
                if (opt.value.toLowerCase() === unitStr.toLowerCase()) {
                    unitsSelect.value = opt.value;
                    matched = true;
                    break;
                }
            }
            if (!matched) unitsSelect.value = "";
        } else {
            document.getElementById("inveditunits").value = "";
        }
    } else {
        document.getElementById("inveditquantity").value = "";
        document.getElementById("inveditunits").value = "";
    }

    document.getElementById("inveditdate").value = openItem.expirationDate || "";

    // set location pills
    const loc = openItem.location;
    document.getElementById("inveditdrop").value = loc;
    document.querySelectorAll("#inveditpills .edit-pill").forEach(p => {
        p.classList.toggle("active-pill", p.dataset.loc === loc);
    });

    // set up pill click handlers
    document.querySelectorAll("#inveditpills .edit-pill").forEach(p => {
        p.onclick = function() {
            document.getElementById("inveditdrop").value = this.dataset.loc;
            document.querySelectorAll("#inveditpills .edit-pill").forEach(b => b.classList.remove("active-pill"));
            this.classList.add("active-pill");
        };
    });

    // cover image
    clearCoverUpload("inveditcover");
    if (openItem.image) {
        const upload = document.getElementById("inveditcover");
        const img = document.createElement("img");
        img.src = openItem.image;
        upload.appendChild(img);
    }

    renderEditMembers(openItem.members);
}

function renderEditMembers(currentMembers) {
    selectedEditMembers = currentMembers ? [...currentMembers] : [];
    const container = document.getElementById("inveditmembers");
    container.innerHTML = "";

    getHouseholdMemberNames().forEach(member => {
        const isSelected = selectedEditMembers.includes(member);
        const div = document.createElement("div");
        div.classList.add("edit-member");
        if (isSelected) div.classList.add("selected");

        div.innerHTML = `
            <div class="edit-member-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30" fill="none">
                    <path d="M11.25 17.1875C8.325 17.1875 2.5 18.65 2.5 21.5625V23.75H20V21.5625C20 18.65 14.175 17.1875 11.25 17.1875ZM5.425 21.25C6.475 20.525 9.0125 19.6875 11.25 19.6875C13.4875 19.6875 16.025 20.525 17.075 21.25H5.425ZM11.25 15C13.6625 15 15.625 13.0375 15.625 10.625C15.625 8.2125 13.6625 6.25 11.25 6.25C8.8375 6.25 6.875 8.2125 6.875 10.625C6.875 13.0375 8.8375 15 11.25 15ZM11.25 8.75C12.2875 8.75 13.125 9.5875 13.125 10.625C13.125 11.6625 12.2875 12.5 11.25 12.5C10.2125 12.5 9.375 11.6625 9.375 10.625C9.375 9.5875 10.2125 8.75 11.25 8.75Z" fill="#666"/>
                </svg>
            </div>
            <span class="edit-member-name">${member}</span>
        `;

        div.onclick = function() {
            const idx = selectedEditMembers.indexOf(member);
            if (idx >= 0) {
                selectedEditMembers.splice(idx, 1);
                div.classList.remove("selected");
            } else {
                selectedEditMembers.push(member);
                div.classList.add("selected");
            }
        };

        container.appendChild(div);
    });
}

function closeListEditForm() {
  openItem = null;
  openElem = null;
  document.getElementById("inveditform").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("invformnamewarningedit").style.display = "none";
}

function editListItemFormSubmit() {
    try {
        kitchenItems = kitchenItems.filter(item => item.name.toLowerCase() !== openElem.id.toLowerCase());
        openElem.remove();

        const name = document.getElementById("inveditname").value.trim();
        const location = document.getElementById("inveditdrop").value.trim();
        const qtyVal = document.getElementById("inveditquantity").value.trim();
        const unitsVal = document.getElementById("inveditunits").value.trim();
        const expirationDate = document.getElementById("inveditdate").value.trim();

        const newItem = { name, location };

        if (qtyVal !== "") {
            newItem.quantity = unitsVal ? `${qtyVal} ${unitsVal}` : qtyVal;
        }

        if (expirationDate !== "") {
            newItem.expirationDate = expirationDate;
        }

        if (selectedEditMembers.length > 0) {
            newItem.members = [...selectedEditMembers];
        }

        const coverSrc = getCoverImageSrc("inveditcover");
        if (coverSrc) newItem.image = coverSrc;

        kitchenItems.push(newItem);
        pushElemListAdd(newItem);
        closeListEditForm();
        updateInvDisplay();
    } catch (e) {
        console.log(e);
        return false;
    }

    return false; // prevents page refresh

}


// SORT BUTTONS --------------------- //

function sortInvItemAlpha() {
    kitchenItems.sort((a, b) => {
        var i = a.name.localeCompare(b.name);
        if (i == 0 && a.hasOwnProperty("expirationDate") && b.hasOwnProperty("expirationDate")) {

            const dateA = new Date(a.expirationDate);
            const dateB = new Date(b.expirationDate);
            return dateA.getTime() - dateB.getTime();            

        } else {
            return i;
        }
    });
    updateInvDisplay();
}

function sortInvItemExp() {
    kitchenItems.sort((a, b) => {
        const aHasExp = a.hasOwnProperty("expirationDate");
        const bHasExp = b.hasOwnProperty("expirationDate");

        let result;

        if (aHasExp && !bHasExp) {
            result = -1;
        } else if (!aHasExp && bHasExp) {
            result = 1;
        } else if (aHasExp && bHasExp) {
            const dateA = new Date(a.expirationDate);
            const dateB = new Date(b.expirationDate);
            result = dateA.getTime() - dateB.getTime();

            if (result === 0) {
                result = a.name.localeCompare(b.name);
            }
        } else {
            result = a.name.localeCompare(b.name);
        }

        return expSortAscending ? result : -result;
    });

    updateInvDisplay();
    updateExpSortIcon();
    expSortAscending = !expSortAscending;

}

function updateExpSortIcon() {
    const icon = document.getElementById("expiringsoon-svg");

    if (expSortAscending) {
        icon.classList.remove("flipped");
    } else {
        icon.classList.add("flipped");
    }
}

function setInventoryFilter(location, buttonElem) {
    const dropdown = document.getElementById("listdropdown");
    dropdown.value = location;
    updateInvDisplay();

    const tabs = document.getElementsByClassName("locationtab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active-tab");
    }

    buttonElem.classList.add("active-tab");
}

// ===================== GROCERY LIST ===================== //

let groceryItems = [
    { name: "Whole Milk", quantity: "1 LITER", members: ["Emily", "Sally"] },
    { name: "Cauliflower", quantity: "1 LITER", members: ["Emily"] },
    { name: "Eggs", quantity: "1 LITER" }
];

let checkedGroceryItems = new Set();

function updateGroceryDisplay() {
    const container = document.getElementById("groceryitems");
    const query = document.getElementById("grocerysearch").value.trim().toLowerCase();
    container.innerHTML = "";

    const filtered = groceryItems.filter(item => item.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.classList.add("empty-list-message");
        empty.textContent = "Grocery List Empty";
        container.appendChild(empty);
    } else {
        filtered.forEach(item => pushGroceryCard(item));
    }
}

function pushGroceryCard(item) {
    const card = document.createElement("div");
    card.classList.add("grocery-card");
    card.id = "grocery-" + item.name;

    if (checkedGroceryItems.has(item.name)) {
        card.classList.add("checked");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("grocery-checkbox");
    checkbox.checked = checkedGroceryItems.has(item.name);
    checkbox.onchange = function() {
        if (this.checked) {
            checkedGroceryItems.add(item.name);
            card.classList.add("checked");
        } else {
            checkedGroceryItems.delete(item.name);
            card.classList.remove("checked");
        }
    };

    let imageEl;
    if (item.image) {
        imageEl = document.createElement("img");
        imageEl.src = item.image;
        imageEl.alt = item.name;
        imageEl.classList.add("grocery-card-image");
    } else {
        imageEl = document.createElement("img");
        imageEl.src = "photos/default_photo.jpg";
        imageEl.alt = item.name;
        imageEl.classList.add("grocery-card-image");
    }

    const nameBlock = document.createElement("div");
    nameBlock.classList.add("grocery-card-name-block");

    const name = document.createElement("div");
    name.classList.add("grocery-card-name");
    name.textContent = item.name;
    nameBlock.appendChild(name);

    if (item.requestedBy) {
        const req = document.createElement("div");
        req.classList.add("grocery-card-requested");
        req.textContent = "Requested by " + item.requestedBy;
        nameBlock.appendChild(req);
    }

    if (item.members && item.members.length > 0) {
        const shared = document.createElement("div");
        shared.classList.add("grocery-card-shared");
        shared.textContent = "Shared with " + item.members.join(", ");
        nameBlock.appendChild(shared);
    }

    const qty = document.createElement("div");
    qty.classList.add("grocery-card-qty");
    qty.textContent = item.quantity || "--";

    const trash = document.createElement("button");
    trash.classList.add("grocery-card-trash");
    trash.setAttribute("aria-label", `Delete ${item.name}`);
    trash.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    trash.onclick = function() {
        deleteGroceryItem(item.name);
    };

    const left = document.createElement("div");
    left.classList.add("grocery-card-left");
    left.appendChild(checkbox);
    left.appendChild(imageEl);
    left.appendChild(nameBlock);

    const right = document.createElement("div");
    right.classList.add("grocery-card-right");
    right.appendChild(qty);

    card.appendChild(left);
    card.appendChild(right);
    card.appendChild(trash);

    card.onclick = function(e) {
        if (e.target === checkbox || e.target === trash || trash.contains(e.target)) return;
        openGroceryEditForm(item);
    };

    document.getElementById("groceryitems").appendChild(card);
}

function deleteGroceryItem(itemName) {
    groceryItems = groceryItems.filter(item => item.name !== itemName);
    checkedGroceryItems.delete(itemName);
    updateGroceryDisplay();
}

function addCheckedToInventory() {
    const toMove = groceryItems.filter(item => checkedGroceryItems.has(item.name));
    if (toMove.length === 0) return;

    toMove.forEach(item => {
        const newInvItem = {
            name: item.name,
            location: item.location || "Pantry"
        };
        if (item.quantity) newInvItem.quantity = item.quantity;
        if (item.expirationDate) newInvItem.expirationDate = item.expirationDate;
        if (item.members) newInvItem.members = [...item.members];
        if (item.image) newInvItem.image = item.image;
        kitchenItems.push(newInvItem);
    });

    groceryItems = groceryItems.filter(item => !checkedGroceryItems.has(item.name));
    checkedGroceryItems.clear();
    updateGroceryDisplay();
    updateInvDisplay();
}

// grocery add form

let selectedGroceryAddMembers = [];

function openGroceryAddForm() {
    document.getElementById("groceryaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    document.getElementById("grocerynewname").value = "";
    document.getElementById("grocerynewquantity").value = "";
    document.getElementById("grocerynewunits").value = "";
    document.getElementById("grocerynewlocation").value = "Fridge";
    clearCoverUpload("groceryaddcover");

    document.querySelectorAll("#groceryaddpills .edit-pill").forEach(p => {
        p.classList.toggle("active-pill", p.dataset.loc === "Fridge");
        p.onclick = function() {
            document.getElementById("grocerynewlocation").value = this.dataset.loc;
            document.querySelectorAll("#groceryaddpills .edit-pill").forEach(b => b.classList.remove("active-pill"));
            this.classList.add("active-pill");
        };
    });

    renderGroceryAddMembers();
}

function renderGroceryAddMembers() {
    selectedGroceryAddMembers = [];
    const container = document.getElementById("groceryaddmembers");
    container.innerHTML = "";

    getHouseholdMemberNames().forEach(member => {
        const div = document.createElement("div");
        div.classList.add("edit-member");

        div.innerHTML = `
            <div class="edit-member-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30" fill="none">
                    <path d="M11.25 17.1875C8.325 17.1875 2.5 18.65 2.5 21.5625V23.75H20V21.5625C20 18.65 14.175 17.1875 11.25 17.1875ZM5.425 21.25C6.475 20.525 9.0125 19.6875 11.25 19.6875C13.4875 19.6875 16.025 20.525 17.075 21.25H5.425ZM11.25 15C13.6625 15 15.625 13.0375 15.625 10.625C15.625 8.2125 13.6625 6.25 11.25 6.25C8.8375 6.25 6.875 8.2125 6.875 10.625C6.875 13.0375 8.8375 15 11.25 15ZM11.25 8.75C12.2875 8.75 13.125 9.5875 13.125 10.625C13.125 11.6625 12.2875 12.5 11.25 12.5C10.2125 12.5 9.375 11.6625 9.375 10.625C9.375 9.5875 10.2125 8.75 11.25 8.75Z" fill="#666"/>
                </svg>
            </div>
            <span class="edit-member-name">${member}</span>
        `;

        div.onclick = function() {
            const idx = selectedGroceryAddMembers.indexOf(member);
            if (idx >= 0) {
                selectedGroceryAddMembers.splice(idx, 1);
                div.classList.remove("selected");
            } else {
                selectedGroceryAddMembers.push(member);
                div.classList.add("selected");
            }
        };

        container.appendChild(div);
    });
}

function closeGroceryAddForm() {
    document.getElementById("groceryaddform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("groceryformnamewarning").style.display = "none";
}

function groceryAddFormSubmit() {
    const name = document.getElementById("grocerynewname").value.trim();
    const qtyVal = document.getElementById("grocerynewquantity").value.trim();
    const unitsVal = document.getElementById("grocerynewunits").value.trim();
    const location = document.getElementById("grocerynewlocation").value.trim();

    let nameflag = false;
    groceryItems.forEach(item => {
        if (item.name.toLowerCase() === name.toLowerCase()) {
            document.getElementById("groceryformnamewarning").style.display = "block";
            nameflag = true;
        }
    });
    if (nameflag) return false;

    const newItem = { name };
    if (qtyVal !== "") {
        newItem.quantity = unitsVal ? `${qtyVal} ${unitsVal}` : qtyVal;
    }
    if (location) newItem.location = location;
    if (selectedGroceryAddMembers.length > 0) {
        newItem.members = [...selectedGroceryAddMembers];
    }

    const coverSrc = getCoverImageSrc("groceryaddcover");
    if (coverSrc) newItem.image = coverSrc;

    groceryItems.push(newItem);
    updateGroceryDisplay();
    closeGroceryAddForm();
    return false;
}

groceryItems.forEach(item => { pushGroceryCard(item) });

// ===================== GROCERY EDIT FORM ===================== //

let openGroceryItem = null;
let selectedGroceryEditMembers = [];

function openGroceryEditForm(item) {
    openGroceryItem = item;

    document.getElementById("groceryeditform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    document.getElementById("groceryeditname").value = item.name;

    const qtyParts = (item.quantity || "").split(" ");
    document.getElementById("groceryeditquantity").value = qtyParts[0] || "";
    document.getElementById("groceryeditunits").value = qtyParts.slice(1).join(" ") || "";

    const loc = item.location || "Fridge";
    document.getElementById("groceryeditlocation").value = loc;
    document.querySelectorAll("#groceryeditpills .edit-pill").forEach(p => {
        p.classList.toggle("active-pill", p.dataset.loc === loc);
        p.onclick = function() {
            document.getElementById("groceryeditlocation").value = this.dataset.loc;
            document.querySelectorAll("#groceryeditpills .edit-pill").forEach(b => b.classList.remove("active-pill"));
            this.classList.add("active-pill");
        };
    });

    clearCoverUpload("groceryeditcover");
    if (item.image) {
        const upload = document.getElementById("groceryeditcover");
        const img = document.createElement("img");
        img.src = item.image;
        upload.appendChild(img);
    }

    renderGroceryEditMembers(item.members);
}

function renderGroceryEditMembers(currentMembers) {
    selectedGroceryEditMembers = currentMembers ? [...currentMembers] : [];
    const container = document.getElementById("groceryeditmembers");
    container.innerHTML = "";

    getHouseholdMemberNames().forEach(member => {
        const isSelected = selectedGroceryEditMembers.includes(member);
        const div = document.createElement("div");
        div.classList.add("edit-member");
        if (isSelected) div.classList.add("selected");

        div.innerHTML = `
            <div class="edit-member-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30" fill="none">
                    <path d="M11.25 17.1875C8.325 17.1875 2.5 18.65 2.5 21.5625V23.75H20V21.5625C20 18.65 14.175 17.1875 11.25 17.1875ZM5.425 21.25C6.475 20.525 9.0125 19.6875 11.25 19.6875C13.4875 19.6875 16.025 20.525 17.075 21.25H5.425ZM11.25 15C13.6625 15 15.625 13.0375 15.625 10.625C15.625 8.2125 13.6625 6.25 11.25 6.25C8.8375 6.25 6.875 8.2125 6.875 10.625C6.875 13.0375 8.8375 15 11.25 15ZM11.25 8.75C12.2875 8.75 13.125 9.5875 13.125 10.625C13.125 11.6625 12.2875 12.5 11.25 12.5C10.2125 12.5 9.375 11.6625 9.375 10.625C9.375 9.5875 10.2125 8.75 11.25 8.75Z" fill="#666"/>
                </svg>
            </div>
            <span class="edit-member-name">${member}</span>
        `;

        div.onclick = function() {
            const idx = selectedGroceryEditMembers.indexOf(member);
            if (idx >= 0) {
                selectedGroceryEditMembers.splice(idx, 1);
                div.classList.remove("selected");
            } else {
                selectedGroceryEditMembers.push(member);
                div.classList.add("selected");
            }
        };

        container.appendChild(div);
    });
}

function closeGroceryEditForm() {
    openGroceryItem = null;
    document.getElementById("groceryeditform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function groceryEditFormSubmit() {
    const name = document.getElementById("groceryeditname").value.trim();
    const qtyVal = document.getElementById("groceryeditquantity").value.trim();
    const unitsVal = document.getElementById("groceryeditunits").value.trim();
    const location = document.getElementById("groceryeditlocation").value.trim();

    if (name.toLowerCase() !== openGroceryItem.name.toLowerCase()) {
        const duplicate = groceryItems.some(item =>
            item.name.toLowerCase() === name.toLowerCase() && item !== openGroceryItem
        );
        if (duplicate) return false;
    }

    groceryItems = groceryItems.filter(item => item !== openGroceryItem);

    const updatedItem = { name };
    if (qtyVal !== "") {
        updatedItem.quantity = unitsVal ? `${qtyVal} ${unitsVal}` : qtyVal;
    }
    if (location) updatedItem.location = location;
    if (selectedGroceryEditMembers.length > 0) {
        updatedItem.members = [...selectedGroceryEditMembers];
    }

    const coverSrc = getCoverImageSrc("groceryeditcover");
    if (coverSrc) updatedItem.image = coverSrc;

    if (checkedGroceryItems.has(openGroceryItem.name)) {
        checkedGroceryItems.delete(openGroceryItem.name);
        checkedGroceryItems.add(name);
    }

    groceryItems.push(updatedItem);
    updateGroceryDisplay();
    closeGroceryEditForm();
    return false;
}

renderMembersPage();


// ===================== RECIPES ===================== //

let recipes = [
    { name: "Pork & Apples", prepTime: 30, ingredients: ["3 Pork Chops", "2 Apples", "1 Cup Broth"], instructions: "Season pork, sear, add sliced apples and broth. Simmer 25 min." },
    { name: "Apple Pie", prepTime: 45, ingredients: ["5 Apples", "1 Cup Sugar", "2 Pie Crusts"], instructions: "Fill crust with sliced apples and sugar. Bake at 375F for 45 min." },
    { name: "Ham & Corn", prepTime: 25, ingredients: ["1 Ham Steak", "3 Ears Corn", "Butter"], instructions: "Grill ham and corn. Serve with butter." }
];

function updateRecipeDisplay() {
    const container = document.getElementById("recipeitems");
    const query = document.getElementById("recipesearch").value.trim().toLowerCase();
    container.innerHTML = "";

    const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.classList.add("empty-list-message");
        empty.textContent = "No Recipes Yet";
        container.appendChild(empty);
    } else {
        filtered.forEach(r => pushRecipeCard(r));
    }
}

function pushRecipeCard(recipe) {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.id = "recipe-" + recipe.name;

    let imageEl;
    if (recipe.coverImage) {
        imageEl = document.createElement("img");
        imageEl.src = recipe.coverImage;
        imageEl.alt = recipe.name;
        imageEl.classList.add("recipe-card-image");
    } else {
        imageEl = document.createElement("div");
        imageEl.classList.add("recipe-card-image-placeholder");
        imageEl.textContent = "🍽";
    }

    const infoBlock = document.createElement("div");
    infoBlock.classList.add("recipe-card-info");

    const name = document.createElement("div");
    name.classList.add("recipe-card-name");
    name.textContent = recipe.name;
    infoBlock.appendChild(name);

    if (recipe.prepTime) {
        const time = document.createElement("div");
        time.classList.add("recipe-card-time");
        time.textContent = recipe.prepTime + " min";
        infoBlock.appendChild(time);
    }

    const trash = document.createElement("button");
    trash.classList.add("recipe-card-trash");
    trash.setAttribute("aria-label", `Delete ${recipe.name}`);
    trash.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    trash.onclick = function(e) {
        e.stopPropagation();
        recipes = recipes.filter(r => r.name !== recipe.name);
        updateRecipeDisplay();
    };

    card.appendChild(imageEl);
    card.appendChild(infoBlock);
    card.appendChild(trash);

    card.onclick = function() {
        openRecipeEditForm(recipe);
    };

    document.getElementById("recipeitems").appendChild(card);
}

// recipe add form

function openRecipeAddForm() {
    document.getElementById("recipeaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("recipenewname").value = "";
    document.getElementById("recipenewpreptime").value = "";
    document.getElementById("recipenewinstructions").value = "";
    document.getElementById("recipeingredientslist").innerHTML = "";
    const coverUpload = document.querySelector(".recipe-cover-upload");
    const existingImg = coverUpload.querySelector("img");
    if (existingImg) existingImg.remove();
    addIngredientField();
}

function closeRecipeAddForm() {
    document.getElementById("recipeaddform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("recipeformnamewarning").style.display = "none";
}

function addIngredientField() {
    const list = document.getElementById("recipeingredientslist");
    const row = document.createElement("div");
    row.classList.add("recipe-ingredient-row");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "e.g. 3 Tomatoes";

    const trash = document.createElement("button");
    trash.type = "button";
    trash.classList.add("recipe-ingredient-trash");
    trash.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    trash.onclick = function() { row.remove(); };

    row.appendChild(input);
    row.appendChild(trash);
    list.appendChild(row);
}

function previewRecipeCover(fileInput) {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const upload = document.querySelector(".recipe-cover-upload");
            const existing = upload.querySelector("img");
            if (existing) existing.remove();
            const img = document.createElement("img");
            img.src = e.target.result;
            upload.appendChild(img);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function recipeAddFormSubmit() {
    const name = document.getElementById("recipenewname").value.trim();
    const prepTime = document.getElementById("recipenewpreptime").value.trim();
    const instructions = document.getElementById("recipenewinstructions").value.trim();

    let nameflag = false;
    recipes.forEach(r => {
        if (r.name.toLowerCase() === name.toLowerCase()) {
            document.getElementById("recipeformnamewarning").style.display = "block";
            nameflag = true;
        }
    });
    if (nameflag) return false;

    const ingredients = [];
    document.querySelectorAll("#recipeingredientslist .recipe-ingredient-row input").forEach(input => {
        const val = input.value.trim();
        if (val) ingredients.push(val);
    });

    const newRecipe = { name };
    if (prepTime) newRecipe.prepTime = parseInt(prepTime);
    if (ingredients.length > 0) newRecipe.ingredients = ingredients;
    if (instructions) newRecipe.instructions = instructions;

    const coverImg = document.querySelector(".recipe-cover-upload img");
    if (coverImg) newRecipe.coverImage = coverImg.src;

    recipes.push(newRecipe);
    updateRecipeDisplay();
    closeRecipeAddForm();
    return false;
}

// recipe edit form

var openRecipe = null;

function openRecipeEditForm(recipe) {
    openRecipe = recipe;
    document.getElementById("recipeeditform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    document.getElementById("recipeeditname").value = recipe.name;
    document.getElementById("recipeeditpreptime").value = recipe.prepTime || "";
    document.getElementById("recipeeditinstructions").value = recipe.instructions || "";

    // cover image
    const coverUpload = document.getElementById("recipeeditcover");
    const existingImg = coverUpload.querySelector("img");
    if (existingImg) existingImg.remove();
    if (recipe.coverImage) {
        const img = document.createElement("img");
        img.src = recipe.coverImage;
        coverUpload.appendChild(img);
    }

    // ingredients
    const list = document.getElementById("recipeeditingredientslist");
    list.innerHTML = "";
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ing => addEditIngredientField(ing));
    } else {
        addEditIngredientField();
    }
}

function closeRecipeEditForm() {
    openRecipe = null;
    document.getElementById("recipeeditform").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function addEditIngredientField(value) {
    const list = document.getElementById("recipeeditingredientslist");
    const row = document.createElement("div");
    row.classList.add("recipe-ingredient-row");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "e.g. 3 Tomatoes";
    if (value) input.value = value;

    const trash = document.createElement("button");
    trash.type = "button";
    trash.classList.add("recipe-ingredient-trash");
    trash.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" fill="none">
    <path d="M3.625 7.25002H6.04167M6.04167 7.25002H25.375M6.04167 7.25002L6.04167 24.1667C6.04167 24.8076 6.29628 25.4223 6.74949 25.8755C7.20271 26.3287 7.81739 26.5834 8.45833 26.5834H20.5417C21.1826 26.5834 21.7973 26.3287 22.2505 25.8755C22.7037 25.4223 22.9583 24.8076 22.9583 24.1667V7.25002M9.66667 7.25002V4.83335C9.66667 4.19241 9.92128 3.57773 10.3745 3.12451C10.8277 2.6713 11.4424 2.41669 12.0833 2.41669H16.9167C17.5576 2.41669 18.1723 2.6713 18.6255 3.12451C19.0787 3.57773 19.3333 4.19241 19.3333 4.83335V7.25002"
        stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    trash.onclick = function() { row.remove(); };

    row.appendChild(input);
    row.appendChild(trash);
    list.appendChild(row);
}

function previewRecipeEditCover(fileInput) {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const upload = document.getElementById("recipeeditcover");
            const existing = upload.querySelector("img");
            if (existing) existing.remove();
            const img = document.createElement("img");
            img.src = e.target.result;
            upload.appendChild(img);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function recipeEditFormSubmit() {
    const name = document.getElementById("recipeeditname").value.trim();
    const prepTime = document.getElementById("recipeeditpreptime").value.trim();
    const instructions = document.getElementById("recipeeditinstructions").value.trim();

    // remove old recipe
    recipes = recipes.filter(r => r.name !== openRecipe.name);

    const ingredients = [];
    document.querySelectorAll("#recipeeditingredientslist .recipe-ingredient-row input").forEach(input => {
        const val = input.value.trim();
        if (val) ingredients.push(val);
    });

    const updatedRecipe = { name };
    if (prepTime) updatedRecipe.prepTime = parseInt(prepTime);
    if (ingredients.length > 0) updatedRecipe.ingredients = ingredients;
    if (instructions) updatedRecipe.instructions = instructions;

    const coverImg = document.getElementById("recipeeditcover").querySelector("img");
    if (coverImg) updatedRecipe.coverImage = coverImg.src;

    recipes.push(updatedRecipe);
    updateRecipeDisplay();
    closeRecipeEditForm();
    return false;
}

recipes.forEach(r => { pushRecipeCard(r) });

/**
 * Close every modal without persisting (used when switching bottom tabs).
 */
function closeAllPopupsDiscardUnsaved() {
    closeListAddForm();
    closeListEditForm();
    closeGroceryAddForm();
    closeRecipeAddForm();
    closeRecipeEditForm();
    closeHouseholdEdit();
    closeMemberFoodRequest();
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
}