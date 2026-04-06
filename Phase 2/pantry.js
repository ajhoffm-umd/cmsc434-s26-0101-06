


// sets default for the showing dropdown in pantry

const defaultKitchenLocations = ["Pantry", "Fridge", "Freezer"];

const selectElement = document.getElementById('listdropdown');

let locationOptions = '';
locationOptions += `<option value="All">All</option>`;
defaultKitchenLocations.forEach(location => {
locationOptions += `<option value="${location}">${location}</option>`;
});

let itemInvDeleteFlag = false;
let expSortAscending = true;

selectElement.innerHTML = locationOptions;

let kitchenItems = [
  {
    name: "Almond Milk",
    location: "Fridge",
    quantity: "1 LITER",
    expirationDate: "2026-04-06",
    members: ["Bob", "Alice"],
    image: "images/almond-milk.png"
  },
  {
    name: "Greek Yogurt",
    location: "Fridge",
    quantity: "500 ML",
    expirationDate: "2026-04-08",
    members: ["Clara"],
    image: "images/greek-yogurt.png"
  },
  {
    name: "Cheddar Cheese",
    location: "Fridge",
    quantity: "250 GRAMS",
    expirationDate: "2026-04-12",
    members: ["David"],
    image: "images/cheddar-cheese.png"
  },
  {
    name: "Rice",
    location: "Pantry",
    quantity: "2 bags",
    members: ["Bob", "Alice"]
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
        imageEl = document.createElement("div");
        imageEl.textContent = "🥫";
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
        invListItemOnClick(card);
    };

    // BUILD CARD
    card.appendChild(left);
    card.appendChild(right);
    card.appendChild(trash);

    card.onclick = function() {
        invListItemOnClick(this);
    };

    document.getElementById("invlist").appendChild(card);
}

kitchenItems.forEach(item => {pushElemListAdd(item)});

// ITEM DELETE MODE CODE --------------------- //

// html elements
var deleteQueue = [];

function invListItemOnClick(elem) {
    if (itemInvDeleteFlag) {

        var i = deleteQueue.indexOf(elem);
        console.log(i);
        if (i >= 0) {
            console.log("removing " + elem.id + " from queue");
            deleteQueue.splice(i, 1);
            elem.style.background = bg_main;
        } else {
            console.log("adding " + elem.id + " to queue");
            deleteQueue.push(elem);
            elem.style.background = "red";
            console.log(deleteQueue);
        }
        
    } else {
        openInvEditForm(elem);
    }
}

function toggleInvDeleteMode() {
    
    itemInvDeleteFlag = !itemInvDeleteFlag;
    if(itemInvDeleteFlag) {
        document.getElementById("invsearchsort").disabled = true;
        document.getElementById("invsortalpha").disabled = true;
        document.getElementById("invsortexp").disabled = true;
        document.getElementById("invitemdeletetoggle").style.background = "red";
        document.getElementById("invitemadd").style.display = "none";
        document.getElementById("invdeletecancel").style.display = "block";
    } else {
        document.getElementById("invsearchsort").disabled = false;
        document.getElementById("invsortalpha").disabled = false;
        document.getElementById("invsortexp").disabled = false;
        document.getElementById("invitemdeletetoggle").style.background = "green";
        if (deleteQueue.length != 0) {
            deleteQueue.forEach(elem => {
                console.log("removing " + elem.id);
                kitchenItems = kitchenItems.filter(item => item.name.toLowerCase() != elem.id.toLowerCase());
                elem.remove();
            });
        }
        document.getElementById("invitemdeletetoggle").style.background = "green";
        document.getElementById("invitemadd").style.display = "block";
        document.getElementById("invdeletecancel").style.display = "none";
    }
}

function itemInvDeleteCancel() {
    document.getElementById("invsearchsort").disabled = false;
    document.getElementById("invsortalpha").disabled = false;
    document.getElementById("invsortexp").disabled = false;
    deleteQueue.forEach(elem =>{
        elem.style.background = bg_main;
    });
    deleteQueue = [];
    document.getElementById("invitemdeletetoggle").style.background = "green";
    document.getElementById("invitemadd").style.display = "block";
    document.getElementById("invdeletecancel").style.display = "none";
    itemInvDeleteFlag = false;
    
}



// NEW ITEM FORM ------------------------------ //

// add a list item using the form

function addListItemFormSubmit() {

    var name, location, quantity, expirationDate;

    name = document.getElementById("invnewname").value.trim();
    location = document.getElementById("invnewdrop").value.trim();
    quantity = document.getElementById("invnewquantity").value.trim();
    expirationDate = document.getElementById("invnewdate").value.trim();

    var nameflag = false;
    kitchenItems.forEach(item => {
        if (item.name.toLowerCase() == name.toLowerCase()) {
            document.getElementById("invformnamewarning").style.display = "block";
            nameflag = true;
            console.log("known");
        }
    });
    if(nameflag){
        return false;
    }

    const newItem = {
        name,
        location
    };

    if (quantity !== "") {
        newItem.quantity = quantity;
    }

    if (expirationDate !== "") {
        newItem.expirationDate = expirationDate;
    }

    kitchenItems.push(newItem);

    pushElemListAdd(newItem);

    closeListAddForm();

    return false; // prevents page refresh

}

// open the add and edit an item forms

function openInvAddForm() {
    document.getElementById("invaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const selectElement = document.getElementById('invnewdrop');

    let locationOptions = '';
    defaultKitchenLocations.forEach(location => {
    locationOptions += `<option value="${location}">${location}</option>`;
    });

    selectElement.innerHTML = locationOptions;
}

function closeListAddForm() {
  document.getElementById("invaddform").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("invformnamewarning").style.display = "none";
}

var openItem = null;
var openElem = null;

// open the edit an item form on click the item
function openInvEditForm(elem) {
    // set the form visible and overlay
    document.getElementById("inveditform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    // get the dropdown element and set locations
    const selectElement = document.getElementById('inveditdrop');

    let locationOptions = '';
    defaultKitchenLocations.forEach(location => {
    locationOptions += `<option value="${location}">${location}</option>`;
    });

    selectElement.innerHTML = locationOptions;

    // get the current item stats
    console.log(elem.id);
    openItem = kitchenItems.find(item => item.name == elem.id);
    openElem = elem;
    console.log(openItem);

    document.getElementById("inveditdrop").value = openItem.location;

    // set defaults
    document.getElementById("inveditname").value = openItem.name;
    if (openItem.hasOwnProperty("quantity")) {
        document.getElementById("inveditquantity").value = openItem.quantity;
    } else {
        document.getElementById("inveditquantity").value = "";
    }
    if (openItem.hasOwnProperty("expirationDate")) {
        document.getElementById("inveditdate").value = openItem.expirationDate;
    } else {
        document.getElementById("inveditdate").value = "";
    }

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
    
    var name, location, quantity, expirationDate;

    name = document.getElementById("inveditname").value.trim();
    location = document.getElementById("inveditdrop").value.trim();
    quantity = document.getElementById("inveditquantity").value.trim();
    expirationDate = document.getElementById("inveditdate").value.trim();

    const newItem = {
        name,
        location
    };

    if (quantity !== "") {
        newItem.quantity = quantity;
    }

    if (expirationDate !== "") {
        newItem.expirationDate = expirationDate;
    }

    kitchenItems.push(newItem);

    pushElemListAdd(newItem);

    closeListEditForm();

    updateInvDisplay();
}
catch (e) {
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

// --------- COMMENTING OUT FOR NOW TO ALIGN WITH FIGMA -----

// search and levenshtein distance
// function levenshtein(a, b) {
//   const rows = a.length + 1;
//   const cols = b.length + 1;
//   const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

//   for (let i = 0; i < rows; i++) dp[i][0] = i;
//   for (let j = 0; j < cols; j++) dp[0][j] = j;

//   for (let i = 1; i < rows; i++) {
//     for (let j = 1; j < cols; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       dp[i][j] = Math.min(
//         dp[i - 1][j] + 1,
//         dp[i][j - 1] + 1,
//         dp[i - 1][j - 1] + cost
//       );
//     }
//   }

//   return dp[a.length][b.length];
// }

// function searchInvItems() {
//     console.log("pressed");

//     const query = document.getElementById("invsearch").value.trim();

//     kitchenItems.forEach(item => {
//         item.dist = levenshtein(item.name, query) / ((+item.name.includes(query) * 7) + 1);
//     });

//     kitchenItems.sort((a, b) => a.dist - b.dist);

//     updateInvDisplay();
// }