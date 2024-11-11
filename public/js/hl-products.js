document.addEventListener("DOMContentLoaded", () => {
  // Fetch burgers.json
  fetch("public/data/burgers.json")
    .then((response) => response.json())
    .then((data) => {
      const products = data;
      // Select 4 products randomly
      const selectedProducts = [];
      while (selectedProducts.length < 4) {
        const randomIndex = Math.floor(Math.random() * products.length);
        if (!selectedProducts.includes(products[randomIndex])) {
          selectedProducts.push(products[randomIndex]);
        }
      }

      // Render in the HTML
      selectedProducts.forEach((product, index) => {
        document.getElementById(`product-card-${index + 1}`).innerHTML = `
            <div class="card h-100">
                <img src="${product.imagen}" class="card-img-top" alt="${
          product.nombreProducto
        }">
                <div class="card-body">
                    <div class="card-content">
                      <h5 class="card-title">${product.nombreProducto}</h5>
                      <p class="card-text">${product.descripcion}</p>
                      <p class="card-text"><strong>Precio:</strong> $${product.precio.toFixed(
                        2
                      )}</p>
                    </div>
                    <a href="products.html" class="btn btn-secondary">Ver producto</a>
                </div>
            </div>
          `;
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
