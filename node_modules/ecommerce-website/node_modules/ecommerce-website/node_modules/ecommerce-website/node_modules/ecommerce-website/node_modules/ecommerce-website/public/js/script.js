window.onload = function () {
    setTimeout(function () {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('mainContent').classList.add('fade-in');
    }, 4000); // 4-second loading delay for animation
};

document.querySelector(".menu-toggle").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("active");
});

let currentIndex = 0;

function showSliderItem(index) {
    const sliderContainer = document.querySelector(".slider-container");
    const totalItems = document.querySelectorAll(".slider-item").length;

    if (index >= totalItems) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalItems - 1;
    } else {
        currentIndex = index;
    }

    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(() => {
    showSliderItem(currentIndex + 1);
}, 4000);

document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
    updateCartCount();
});

// 🔁 Fetch and display products from backend
function fetchProducts() {
    fetch("http://localhost:3000/get-products")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const products = data.products;
                localStorage.setItem("products", JSON.stringify(products)); // Optional: keep in localStorage
                displayProducts(products);
            } else {
                console.error("Failed to fetch products");
                document.getElementById("productContainer").innerHTML = "<p>No products available.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            document.getElementById("productContainer").innerHTML = "<p>Error loading products.</p>";
        });
}

// 🔁 Display products in the container
function displayProducts(products) {
    let container = document.getElementById("productContainer");

    if (!container) {
        console.warn("productContainer not found!");
        return;
    }

    container.innerHTML = ""; // Clear previous content

    products.forEach((product, index) => {
        let productHTML = `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// ✅ Add product to cart by index
// function addToCart(index) {
//     let products = JSON.parse(localStorage.getItem("products")) || [];
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     if (products[index]) {
//         cart.push(products[index]);
//         localStorage.setItem("cart", JSON.stringify(cart));
//         updateCartCount();
//         alert("Product added to cart!");
//     } else {
//         alert("Product not found!");
//     }
// }
const cartIcon = document.getElementById("cartIcon");
const cartMenu = document.getElementById("cartMenu");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");

let cart = [];

cartIcon.addEventListener("click", () => {
    cartMenu.classList.toggle("show");
});

function addToCart(product) {
    cart.push(product);
    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = ""; // Clear previous items
    cartCount.textContent = cart.length;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.title} - ₹${item.price}</span>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function addToCartFromCard(button) {
    const card = button.closest('.product-card');
    const title = card.querySelector('h3').innerText;
    const priceText = card.querySelector('span').innerText;
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

    addToCart({ title, price });
}
