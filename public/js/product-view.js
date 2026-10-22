// Product data is text, never HTML or executable event-handler source.
window.FrollyProducts = (() => {
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function imageUrl(value) {
    const imageRoot = new URL('public/imgs/', document.baseURI);
    try {
      const url = new URL(value, document.baseURI);
      if (url.origin === imageRoot.origin && url.pathname.startsWith(imageRoot.pathname)) {
        return url.href;
      }
    } catch (_) {
      // Invalid or external image locations use the site's own placeholder.
    }
    return new URL('public/imgs/logo-frolly.svg', document.baseURI).href;
  }

  function createCard(product, onAdd) {
    const card = element('div', 'card h-100');
    const image = element('img', 'card-img-top');
    image.src = imageUrl(product.imagen);
    image.alt = product.nombreProducto;
    const body = element('div', 'card-body');
    const content = element('div', 'card-content');
    content.append(element('h5', 'card-title', product.nombreProducto));
    content.append(element('p', 'card-text', product.descripcion));
    const price = element('p', 'card-text');
    price.append(element('strong', '', 'Precio:'), document.createTextNode(` $${product.precio.toFixed(2)}`));
    content.append(price);
    body.append(content);
    if (onAdd) {
      const button = element('button', 'btn btn-secondary', 'Añadir al carrito');
      button.type = 'button';
      button.addEventListener('click', () => onAdd(product.idProducto));
      body.append(button);
    } else {
      const link = element('a', 'btn btn-secondary', 'Ir al carrito');
      link.href = 'products.html';
      body.append(link);
    }
    card.append(image, body);
    return card;
  }

  return { createCard };
})();
