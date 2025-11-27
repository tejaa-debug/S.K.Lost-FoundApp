window.onload = function() {
    if (window.location.pathname.includes("view.html")) loadItems();
    if (window.location.pathname.includes("edit.html")) loadEditData();
};

function saveItem() {
    let name = document.getElementById("itemName").value;
    let desc = document.getElementById("itemDescription").value;
    let contact = document.getElementById("contact").value;
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let imageInput = document.getElementById("itemImage");

    if (!name || !desc || !contact || !imageInput.files.length) {
        alert("Please fill all fields!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function() {
        let newItem = { name, desc, contact, type, category, image: reader.result };
        let items = JSON.parse(localStorage.getItem("lostItems")) || [];
        items.push(newItem);
        localStorage.setItem("lostItems", JSON.stringify(items));
        alert("Item added successfully!");
        window.location.href = "view.html";
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function loadItems() {
    let items = JSON.parse(localStorage.getItem("lostItems")) || [];
    let container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<h3>No items added yet</h3>";
        return;
    }

    let search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    let category = document.getElementById("categoryFilter")?.value || "";
    let type = document.getElementById("typeFilter")?.value || "";

    items.forEach((item, index) => {
        if (item.name.toLowerCase().includes(search) &&
            (category === "" || item.category === category) &&
            (type === "" || item.type === type)) {

            container.innerHTML += `
            <div class="item-card">
                <img src="${item.image}" class="item-img">
                <h3>${item.name} (${item.type})</h3>
                <p>${item.desc}</p>
                <p><b>Category:</b> ${item.category}</p>
                <p><b>Contact:</b> ${item.contact}</p>
                <button onclick="editItem(${index})" class="edit-btn">Edit</button>
                <button onclick="deleteItem(${index})" class="delete-btn">Delete</button>
            </div>`;
        }
    });
}

function editItem(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "edit.html";
}

function loadEditData() {
    let index = localStorage.getItem("editIndex");
    let items = JSON.parse(localStorage.getItem("lostItems")) || [];
    if (!items[index]) return;

    let item = items[index];
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemDescription").value = item.desc;
    document.getElementById("contact").value = item.contact;
    document.getElementById("category").value = item.category;
    document.getElementById("type").value = item.type;
}

function updateItem() {
    let index = localStorage.getItem("editIndex");
    let items = JSON.parse(localStorage.getItem("lostItems")) || [];

    items[index].name = document.getElementById("itemName").value;
    items[index].desc = document.getElementById("itemDescription").value;
    items[index].contact = document.getElementById("contact").value;
    items[index].category = document.getElementById("category").value;
    items[index].type = document.getElementById("type").value;

    localStorage.setItem("lostItems", JSON.stringify(items));
    localStorage.removeItem("editIndex");
    alert("Item updated!");
    window.location.href = "view.html";
}

function deleteItem(index) {
    if (!confirm("Are you sure?")) return;
    let items = JSON.parse(localStorage.getItem("lostItems")) || [];
    items.splice(index, 1);
    localStorage.setItem("lostItems", JSON.stringify(items));
    loadItems();
}

// Filters
document.getElementById("searchInput")?.addEventListener("input", loadItems);
document.getElementById("categoryFilter")?.addEventListener("change", loadItems);
document.getElementById("typeFilter")?.addEventListener("change", loadItems);
