


// sets default for the showing dropdown in pantry

const defaultKitchenLocations = ["Pantry", "Fridge", "Freezer"];

const selectElement = document.getElementById('listdropdown');

let locationOptions = '';
locationOptions += `<option value="All">All</option>`;
defaultKitchenLocations.forEach(location => {
locationOptions += `<option value="${location}">${location}</option>`;
});

var itemDeleteFlag = false;

selectElement.innerHTML = locationOptions;

var kitchenItems = [
  {
    name: "Rice",
    location: "Pantry",
    quantity: "2 bags",
    expirationDate: "2026-08-15"
  },
  {
    name: "Black Beans",
    location: "Pantry",
    quantity: "3 cans"
  },
  {
    name: "Milk",
    location: "Fridge",
    expirationDate: "2026-04-02"
  },
  {
    name: "Fish Tofu",
    location: "Freezer",
    quantity: "6 cubes"
  }
];

// update list depending on selection
function updateListDisplay() {
    console.log("updating with");
    console.log(kitchenItems);
    const pantryList = document.getElementById('invlist');
    pantryList.innerHTML = '<li class="header-row"><span>Name</span><span>Quantity</span><span>Expiration</span></li>';
    kitchenItems.forEach(item => {pushElemListAdd(item);});
}

// actually adds to pantry list on html
function pushElemListAdd(item) {

    var currentLocation = document.getElementById("listdropdown").value;
    if (currentLocation !== item.location && currentLocation !== "All") { return }

    // create new element
    var li = document.createElement("LI");
    li.classList.add("item-row");
    

    // add name span with text
    const name = document.createElement("span");
    name.textContent = item.name;
    li.id = item.name;

    // add quantity span if present
    const quantity = document.createElement("span");
    if (item.hasOwnProperty("quantity")) {
        quantity.textContent = item.quantity;
    } else {
        quantity.textContent = "--";
    }

    // add expiration date if present
    const expiration = document.createElement("span");
    if (item.hasOwnProperty("expirationDate")) {
        const today = new Date();
        const exp = new Date(item.expirationDate);
        const oneDay = 1000 * 60 * 60 * 24;
        const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / oneDay);

        expiration.textContent = daysLeft;
    } else {
        expiration.textContent = "--";
    }

    // add hidden delete button

    li.appendChild(name);
    li.appendChild(quantity);
    li.appendChild(expiration);

    li.onclick = function() {
        invListItemOnClick(this);
    }

    document.getElementById("invlist").appendChild(li);
}

kitchenItems.forEach(item => {pushElemListAdd(item)});

// ITEM DELETE MODE CODE --------------------- //

// html elements
var deleteQueue = [];

function invListItemOnClick(elem) {
    if (itemDeleteFlag) {

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
        openListEditForm(elem);
    }
}

function toggleListDeleteMode() {
    
    itemDeleteFlag = !itemDeleteFlag;
    if(itemDeleteFlag) {
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

function itemDeleteCancel() {
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
    itemDeleteFlag = false;
    
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

function openListAddForm() {
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
function openListEditForm(elem) {
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

    updateListDisplay();
}
catch (e) {
    console.log(e);
    return false;
}

    return false; // prevents page refresh

}


// SORT BUTTONS --------------------- //

function sortListItemAlpha() {
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
    updateListDisplay();
}

function sortListItemExp() {
    kitchenItems.sort((a, b) => {
        
        if (a.hasOwnProperty("expirationDate") && !b.hasOwnProperty("expirationDate")) {
            return -1;
        } else if (!a.hasOwnProperty("expirationDate") && b.hasOwnProperty("expirationDate")) {
            return 1;
        } else if (a.hasOwnProperty("expirationDate") && b.hasOwnProperty("expirationDate")) {
            const dateA = new Date(a.expirationDate);
            const dateB = new Date(b.expirationDate);
            var i = dateA.getTime() - dateB.getTime();  
            if (i == 0) {
                return a.name.localeCompare(b.name);
            } else {
                return i;
            }
        } else {
            return a.name.localeCompare(b.name);
        }
    });
    updateListDisplay();
}

// search and levenshtein distance
function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function searchListItems() {
    console.log("pressed");

    const query = document.getElementById("invsearch").value.trim();

    kitchenItems.forEach(item => {
        item.dist = levenshtein(item.name, query) / ((+item.name.includes(query) * 7) + 1);
    });

    kitchenItems.sort((a, b) => a.dist - b.dist);

    updateListDisplay();
}