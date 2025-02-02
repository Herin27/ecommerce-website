window.onload = function() {
    // Simulate loading process
    setTimeout(function() {
        // Hide the loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';

        // Show the main content
        document.getElementById('mainContent').classList.add('fade-in');
    }, 4000); // 4-second loading delay for animation
}

document.querySelector(".menu-toggle").addEventListener("click", function() {
    document.querySelector(".nav-links").classList.toggle("active");
});

let currentIndex = 0;

function showSliderItem(index) {
    const sliderContainer = document.querySelector(".slider-container");
    const totalItems = document.querySelectorAll(".slider-item").length;
    
    // Loop through images
    if (index >= totalItems) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalItems - 1;
    } else {
        currentIndex = index;
    }

    // Move the slider
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Automatic Slide every 4 seconds
setInterval(() => {
    showSliderItem(currentIndex + 1);
}, 4000);



// Fetch and display products from the server

document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
    updateCartCount();
});

// Toggle Cart Menu
function toggleCart() {
    document.getElementById("cartMenu").classList.toggle("active");
    loadCart();
}

function fetchProducts() {
    fetch("/get-products") // API call to get products
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProducts(data.products);
            } else {
                console.error("Error fetching products:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
}

function displayProducts(products) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = ""; // Clear previous content

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-card");
        productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price: </strong>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
        productContainer.appendChild(productElement);
    });
}

// Add Event Listeners for Cart
function attachCartEventListeners() {
    let buttons = document.querySelectorAll(".addToCart");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let product = {
                id: this.getAttribute("data-id"),
                name: this.getAttribute("data-name"),
                price: this.getAttribute("data-price"),
                quantity: 1
            };

            addToCart(product);
        });
    });
}

// Add to Cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Load Cart Items in Toggle Menu
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        let itemHTML = `
            <div class="cart-item">
                <span>${item.name} (₹${item.price})</span>
                <span>Qty: ${item.quantity}</span>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });
}

// Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalCount;
}


document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    loadCart();
});

// Function to load the cart and display items
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        let itemHTML = `
            <div class="cart-item" data-name="${item.name}">
                <span>${item.name} (₹${item.price})</span>
                <div>
                    <button onclick="changeQuantity('${item.name}', 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 'increase')">+</button>
                </div>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });

    // Show total price
    updateTotalPrice();
}


// Function to update the cart count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalCount;
}

// Function to update the total price in the cart
function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("total-price").innerText = "Total: ₹" + totalPrice;
}

// Show Cart Menu
function toggleCartMenu() {
    let cartMenu = document.getElementById("cartMenu");
    cartMenu.classList.toggle("show");
}

// Event Listeners for the Cart Toggle and Purchase Button
document.getElementById("cart-icon").addEventListener("click", toggleCartMenu);
document.getElementById("purchase-btn").addEventListener("click", purchaseCart);

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    loadCart();
});

// Toggle Cart Sidebar
document.getElementById("cart-icon").addEventListener("click", function () {
    document.getElementById("cartMenu").classList.toggle("show");
});

// Load Cart Items
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty!</p>";
        return;
    }

    cart.forEach((item, index) => {
        let itemHTML = `
            <div class="cart-item" id="item-${index}">
                <span>${item.name} (₹${item.price})</span>
                <div>
                    <button onclick="changeQuantity('${item.name}', 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 'increase')">+</button>
                </div>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });
}

// Update Cart Count
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = totalCount;
}

// Change Quantity
function changeQuantity(productName, action) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.name === productName);

    if (action === 'increase') {
        item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity--;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

// Clear Cart with Animation
function clearCart() {
    let cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach(item => item.classList.add("fade-out"));

    setTimeout(() => {
        localStorage.removeItem("cart");
        updateCartCount();
        loadCart();
    }, 300);
}

// Checkout Function (Redirect to Payment Page)
function checkoutCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
    }

    // Store the cart for the next page
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirect to payment page
    window.location.href = "payment.html";
}
// Toggle Cart Sidebar
document.getElementById("cart-icon").addEventListener("click", function () {
    document.getElementById("cartMenu").classList.add("show");
});

// Close Cart Sidebar
document.getElementById("closeCart").addEventListener("click", function () {
    document.getElementById("cartMenu").classList.remove("show");
});