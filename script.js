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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function processData(data) {
  const itemsSection = document.querySelector('.items');
  data.results.forEach((item) => itemsSection.appendChild(createProductItemElement(item)));
}

function fetchProducts(searchTerm) {
  const apiEndpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`;
  const requestParameters = { headers: new Headers({ Accept: 'application/json' }) };

  fetch(apiEndpoint, requestParameters)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }
      return response.json();
    })
    .then((data) => processData(data))
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

window.onload = async () => {
  await fetchProducts('computador');
};
