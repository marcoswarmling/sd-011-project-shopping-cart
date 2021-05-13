function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const downloadJSON = () => new Promise((resolve, reject) => {
    const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const params = { method: 'GET', headers: { Accept: 'application/json' } };
    const itemsList = document.querySelector('.items');
    fetch(API_URL, params)
      .then((response) => response.json())
      .then((json) => json.results
      .forEach((element) => itemsList
      .appendChild(createProductItemElement(
        { sku: element.id, name: element.title, image: element.thumbnail },
))));
      resolve();
  });

  window.onload = function onload() { 
    downloadJSON();
   };  