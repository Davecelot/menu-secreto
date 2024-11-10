// Initialize cart array to store selected items
let cart = [];
let products = []; // Will hold the fetched products

/**
 * Function to fetch products from JSON file.
 */
function fetchProducts() {
  fetch("public/data/burgers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      products = data;
      renderProducts(); // Render products after data is loaded
    })
    .catch((error) => console.error("Error fetching products:", error));
}

/**
 * Function to render products to the HTML.
 */
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-lg-6 mb-4";
    productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.imagen}" class="card-img-top" alt="${
      product.nombreProducto
    }">
                <div class="card-body">
                    <h5 class="card-title">${product.nombreProducto}</h5>
                    <p class="card-text">${product.descripcion}</p>
                    <p class="card-text"><strong>Precio:</strong> $${product.precio.toFixed(
                      2
                    )}</p>
                    <button onclick="addToCart(${
                      product.idProducto
                    })" class="btn btn-secondary">Añadir al carrito</button>
                </div>
            </div>
        `;
    productList.appendChild(productCard);
  });
}

/**
 * Function to add product to cart.
 * @param {number} id - Product ID.
 */
function addToCart(id) {
  const product = products.find((item) => item.idProducto === id);
  const itemInCart = cart.find((item) => item.idProducto === id);

  if (itemInCart) {
    itemInCart.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

/**
 * Function to remove product from cart.
 * @param {number} id - Product ID.
 */
function removeFromCart(id) {
  cart = cart.filter((item) => item.idProducto !== id);
  renderCart();
}

/**
 * Function to render cart items and calculate total price.
 */
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Clear existing cart items
    let total = 0;

    if (cart.length === 0) {
        // Show empty state message if cart is empty
        cartItems.innerHTML = `
            <div class="text-center py-4">
                <p class="mb-0">Aún no has sumado nada al carrito. ¿Qué esperas para disfrutar de una hamburguesa única?</p>
            </div>
        `;
    } else {
        // Render each item in the cart
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.nombreProducto}</strong> x${item.quantity} 
                    <button onclick="removeFromCart(${item.idProducto})" class="btn btn-sm btn-danger ms-3">Eliminar</button>
                </div>
                <span>$${(item.precio * item.quantity).toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItem);
            total += item.precio * item.quantity;
        });
    }

    // Update total price in the UI
    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Fetch products and initialize empty state in cart on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    renderCart(); // Ensure empty state is shown initially
});
