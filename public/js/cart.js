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
  productList.replaceChildren();

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-lg-6 mb-4";
    productCard.appendChild(FrollyProducts.createCard(product, addToCart));
    productList.appendChild(productCard);
  });
}

/**
 * Function to add product to cart.
 * @param {number} id - Product ID.
 */
function addToCart(id) {
  const product = products.find((item) => item.idProducto === id);
  if (!product) return;
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
  cartItems.replaceChildren();
  let total = 0;

  if (cart.length === 0) {
    // Show empty state message if cart is empty
    const empty = document.createElement('div');
    empty.className = 'text-center py-4';
    const message = document.createElement('p');
    message.className = 'mb-0';
    message.textContent = 'Aún no has sumado nada al carrito. ¿Qué esperas para disfrutar de una hamburguesa única?';
    empty.append(message);
    cartItems.append(empty);
  } else {
    // Render each item in the cart
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'list-group-item d-flex justify-content-between';
      const itemBody = document.createElement('div');
      itemBody.className = 'item-in-cart';
      const content = document.createElement('div');
      content.className = 'content-in-cart';
      const description = document.createElement('p');
      const name = document.createElement('strong');
      name.textContent = item.nombreProducto;
      description.append(name, document.createTextNode(` (x${item.quantity})`));
      content.append(description);
      const remove = document.createElement('button');
      remove.className = 'btn btn-sm btn-danger';
      remove.type = 'button';
      remove.textContent = 'Eliminar';
      remove.addEventListener('click', () => removeFromCart(item.idProducto));
      itemBody.append(content, remove);
      const subtotal = document.createElement('span');
      subtotal.textContent = `$${(item.precio * item.quantity).toFixed(2)}`;
      cartItem.append(itemBody, subtotal);
      cartItems.appendChild(cartItem);
      total += item.precio * item.quantity;
    });
  }

  // Update total price in the UI
  document.getElementById('total-price').innerText = total.toFixed(2);
}

/**
 * Function to simulate purchase and show confirmation alert.
 */
function purchaseItems() {
  if (cart.length === 0) {
    alert("El carrito de compras está vacío. ¿Qué te parece si lo llenas de alegría?");
    return;
  }

  // Clear the cart after purchase
  cart = [];
  renderCart();

  // Show confirmation alert
  const purchaseAlert = document.getElementById('purchase-alert');
  purchaseAlert.classList.remove('d-none'); // Make alert visible

  // Hide the alert after 3 seconds
  setTimeout(() => {
    purchaseAlert.classList.add('d-none'); // Hide alert
  }, 3000);
}

// Fetch products and initialize empty state in cart on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  renderCart(); // Ensure empty state is shown initially
});
