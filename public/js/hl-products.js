document.addEventListener("DOMContentLoaded", () => {
  // Fetch burgers.json
  fetch("public/data/burgers.json")
    .then((response) => response.json())
    .then((data) => {
      const products = [...data];
      // Select 4 products randomly
      const selectedProducts = [];
      while (selectedProducts.length < 4 && products.length > 0) {
        const randomIndex = Math.floor(Math.random() * products.length);
        selectedProducts.push(products.splice(randomIndex, 1)[0]);
      }

      // Render in the HTML
      selectedProducts.forEach((product, index) => {
        document.getElementById(`product-card-${index + 1}`).replaceChildren(FrollyProducts.createCard(product));
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
