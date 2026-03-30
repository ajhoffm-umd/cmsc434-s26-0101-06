

var groceryList = [
  {
    name: "Tortillas",
    location: "Pantry",
    expirationDate: "2026-04-15",
    checked: false
  },
  {
    name: "Ground Beef",
    location: "Fridge",
    quantity: "2 lbs",
    checked: false
  },
  {
    name: "Milk",
    location: "Fridge",
    quantity: "2 cartons",
    checked: false
  },
  {
    name: "Shredded Cheese",
    location: "Fridge",
    quantity: "1 bag",
    checked: false
  }
];

// updates grocery list
function updateGroceryDisplay() {
    console.log("updating with");
    console.log(groceryList);
    const listElem = document.getElementById('grocerylist');
    listElem.innerHTML = '<li class="header-row"><span>Name</span><span>Quantity</span><span>Expiration</span></li>';
    listElem.forEach(item => {pushElemGroceryAdd(item);});
}

// actually adds to pantry list on html
function pushElemGroceryAdd(item) {

    // create new element
    var li = document.createElement("LI");
    li.classList.add("item-row-grocery");
    

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

    // add checkmarks
    li.onclick = function() {
        this.classList.toggle("strikethrough");
    }

    li.appendChild(name);
    li.appendChild(quantity);
    li.appendChild(expiration);

    document.getElementById("grocery").appendChild(li);
}

groceryList.forEach(item => {pushElemGroceryAdd(item)});

// adding items

function openGroceryAddForm() {
    document.getElementById("groceryaddform").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const selectElement = document.getElementById('grocerynewdrop');

    let locationOptions = '';
    defaultKitchenLocations.forEach(location => {
    locationOptions += `<option value="${location}">${location}</option>`;
    });

    selectElement.innerHTML = locationOptions;
}

function closeGroceryAddForm() {
  document.getElementById("groceryaddform").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("groceryformnamewarning").style.display = "none";

}

function addGroceryItemFormSubmit() {

    try {

    var name, location, quantity, expirationDate;

    name = document.getElementById("grocerynewname").value.trim();
    location = document.getElementById("grocerynewdrop").value.trim();
    quantity = document.getElementById("grocerynewquantity").value.trim();
    expirationDate = document.getElementById("grocerynewdate").value.trim();

    var nameflag = false;
    groceryList.forEach(item => {
        if (item.name.toLowerCase() == name.toLowerCase()) {
            document.getElementById("groceryformnamewarning").style.display = "block";
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

    newItem.checked = false;

    groceryList.push(newItem);

    pushElemGroceryAdd(newItem);

    closeGroceryAddForm();
} catch (e) {
    console.log(e);
}

    return false; // prevents page refresh

}