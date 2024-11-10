let data;

$(document).ready(function () {
    console.log("DOM is ready");

    $.getJSON("public/data/burgers.json", function (dataFromJson) {
        data = dataFromJson;
        console.log("JSON data loaded:", data);

        let productList = $("#product-list");
        console.log("Product list element:", productList);

        data.forEach(function (product) {
            let productCard = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${product.imagen}" class="card-img-top" alt="${product.nombreProducto}">
                        <div class="card-body">
                            <h5 class="card-title">${product.nombreProducto}</h5>
                            <p class="card-text">${product.descripcion}</p>
                            <p class="card-text"><strong>Precio:</strong> $${product.precio}</p>
                        </div>
                        <div class="card-footer text-center p-3">
                            <button class="btn btn-secondary add-to-cart" data-product-id="${product.idProducto}">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            `;
            productList.append(productCard);
        });

        $("#smartcart").smartCart({
            cartItemTemplate:
                '<div class="sc-cart-item">' +
                '<div class="sc-cart-item-imagen"><img src="{product_imagen}" /></div>' +
                '<div class="sc-cart-item-nombreProducto">{product_nombreProducto}</div>' +
                '<div class="sc-cart-item-precio">${product_precio}</div>' +
                "</div>",
            lang: {
                cartTitle:
                    "Cualquier hamburguesa es buena, está hecha en Frolly. ¿Qué te gustaría sumar?",
                checkout: "Realizar pedido",
                subtotal: "Monto final:",
                cartEmpty: "Aún no has sumado nada al carrito.",
                clear: "Vaciar carrito",
            },
            onAdd: function (cart) {
                console.log("Item added to cart:", cart);
            },
        });
        console.log("SmartCart initialized");


        $(document).on('click', '.add-to-cart', function () {
            console.log("Add to cart button clicked");

            let productId = $(this).data("product-id");
            console.log("product-id from button:", typeof productId, productId);

            let product = data.find(item => {
                console.log("idProducto from JSON:", typeof item.idProducto, item.idProducto);
                return Number(item.idProducto) === Number(productId);
            });

            console.log("Found product:", product);

            if (product) {
                console.log("Adding product:", product);
                $("#smartcart").smartCart("add", {
                    idProducto: product.idProducto,
                    nombreProducto: product.nombreProducto,
                    precio: product.precio,
                    quantity: 1,
                    imagen: product.imagen,
                });
                console.log("Product added (hopefully)");
            } else {
                console.error("Product not found! Check ID matching.");
            }
        });

    }).fail(function (jqxhr, textStatus, error) {
        console.error("Error fetching JSON:", textStatus, error);
        // Display a user-friendly error message on the page (e.g., using an alert or by adding an error message to a specific element in your HTML).
    });
});