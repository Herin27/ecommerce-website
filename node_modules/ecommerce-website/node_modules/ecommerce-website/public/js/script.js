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
    loadProducts();
    updateCartCount();
});

// Toggle Cart Menu
function toggleCart() {
    document.getElementById("cartMenu").classList.toggle("active");
    loadCart();
}

// Load Products from Database
async function loadProducts() {
    try {
        let response = await fetch("/get-products");
        let data = await response.json();

        if (data.success) {
            let container = document.getElementById("productContainer");
            container.innerHTML = "";

            data.products.forEach(product => {
                let productHTML = `
                    <div class="product-card">
                        <img src="uploads/${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span>₹${product.price}</span>
                        <button class="addToCart" data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}">
                            Add to Cart
                        </button>
                    </div>
                `;
                container.innerHTML += productHTML;
            });

            attachCartEventListeners();
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
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

// Clear Cart
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    loadCart();
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

// Function to change quantity of items
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

// Clear Cart Functionality
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    loadCart();
}

// Purchase Functionality
function purchaseCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`You have purchased items worth ₹${totalPrice}. Thank you for shopping!`);
    
    // Clear the cart after purchase
    localStorage.removeItem("cart");
    updateCartCount();
    loadCart();
}

// Event Listeners for the Cart Toggle and Purchase Button
document.getElementById("cart-icon").addEventListener("click", toggleCartMenu);
document.getElementById("purchase-btn").addEventListener("click", purchaseCart);
