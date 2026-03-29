


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
    const pantryList = document.getElementById('pantrylist');
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

    document.getElementById("pantrylist").appendChild(li);
}

kitchenItems.forEach(item => {pushElemListAdd(item)});

// ITEM DELETE MODE CODE --------------------- //

// html elements
var deleteQueue = [];

function invListItemOnClick(elem) {
    if (itemDeleteFlag) {

        var i = deleteQueue.indexOf(elem.id.toLowerCase());
        console.log(i);
        if (i >= 0) {
            console.log("removing " + elem.id + " from queue");
            deleteQueue.splice(i, 1);
            elem.style.background = bg_main;
        } else {
            console.log("adding " + elem.id + " to queue");
            deleteQueue.push(elem);
            elem.style.background = "red";
        }
        
    } 
}

function toggleListDeleteMode() {
    
    itemDeleteFlag = !itemDeleteFlag;
    if(itemDeleteFlag) {
        document.getElementById("sortsearch").disabled = true;
        document.getElementById("sortalpha").disabled = true;
        document.getElementById("sortexp").disabled = true;
        document.getElementById("itemdeletemodetoggle").style.background = "red";
        document.getElementById("itemadd").style.display = "none";
        document.getElementById("itemdeletecancel").style.display = "block";
    } else {
        document.getElementById("sortsearch").disabled = false;
        document.getElementById("sortalpha").disabled = false;
        document.getElementById("sortexp").disabled = false;
        document.getElementById("itemdeletemodetoggle").style.background = "green";
        if (deleteQueue.length != 0) {
            deleteQueue.forEach(elem => {
                console.log("removing " + elem.id);
                kitchenItems = kitchenItems.filter(item => item.name.toLowerCase() != elem.id.toLowerCase());
                elem.remove();
            });
        }
        document.getElementById("itemdeletemodetoggle").style.background = "green";
        document.getElementById("itemadd").style.display = "block";
        document.getElementById("itemdeletecancel").style.display = "none";
    }
}

function itemDeleteCancel() {
    document.getElementById("sortsearch").disabled = false;
    document.getElementById("sortalpha").disabled = false;
    document.getElementById("sortexp").disabled = false;
    deleteQueue.forEach(elem =>{
        elem.style.background = bg_main;
    });
    deleteQueue = [];
    document.getElementById("itemdeletemodetoggle").style.background = "green";
    document.getElementById("itemadd").style.display = "block";
    document.getElementById("itemdeletecancel").style.display = "none";
    itemDeleteFlag = false;
    
}



// NEW ITEM FORM ------------------------------ //

// add a list item using the form

function addListItemFormSubmit() {

    var name, location, quantity, expirationDate;

    name = document.getElementById("newlistitemname").value.trim();
    location = document.getElementById("newlistitemdropdown").value.trim();
    quantity = document.getElementById("newlistitemquantity").value.trim();
    expirationDate = document.getElementById("newlistitemdate").value.trim();

    var nameflag = false;
    kitchenItems.forEach(item => {
        if (item.name.toLowerCase() == name.toLowerCase()) {
            document.getElementById("formnamewarning").style.display = "block";
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

// open the add an item form

function openListAddForm() {
    document.getElementById("listaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const selectElement = document.getElementById('newlistitemdropdown');

    let locationOptions = '';
    defaultKitchenLocations.forEach(location => {
    locationOptions += `<option value="${location}">${location}</option>`;
    });

    selectElement.innerHTML = locationOptions;
}

function closeListAddForm() {
  document.getElementById("listaddform").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("formnamewarning").style.display = "none";
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

    const query = document.getElementById("listitemsearch").value.trim();

    kitchenItems.forEach(item => {
        item.dist = levenshtein(item.name, query);
    });

    kitchenItems.sort((a, b) => a.dist - b.dist);

    updateListDisplay();
}