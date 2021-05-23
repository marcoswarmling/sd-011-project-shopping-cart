//
const productsContainer = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

function showLoading() {
  const loadingElement = document.createElement('section');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'loading...';
  document.body.appendChild(loadingElement);
}

function removeLoading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
}

/** Consultei o repositório do Matheus Inacio para resolver o requisito 4 - LocalStorage.
Link do repositório: https://github.com/tryber/sd-011-project-shopping-cart/pull/15
*/
function getStorage() {
  const savedStorage = localStorage.getItem('shoppingCart');
  return savedStorage ? JSON.parse(savedStorage) : [];
}

function updatePrice() {
  const price = document.querySelector('.total-price');
  price.innerText = getStorage().reduce((acc, curr) => acc + curr.price, 0);
}

function fetchItem(urlItemId) {
  return new Promise((resolve, reject) => {
    fetch(urlItemId)
      .then((r) => resolve(r.json()))
      .catch((error) => reject(error));
  });
}

function saveStorage(cartArray) {
  localStorage.setItem('shoppingCart', JSON.stringify(cartArray));
}

function removeCartItemFromLocalStorage(id) {
  const cartArray = getStorage();
  const newArray = cartArray.filter((item) => item.id !== id);
  saveStorage(newArray);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getSkuFromText(itemText) {
  const skuIndex = itemText.indexOf('SKU: ') + 5;
  const pipeIndex = itemText.indexOf(' | ');
  return itemText.substring(skuIndex, pipeIndex);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  const id = getSkuFromText(item.innerText);
  removeCartItemFromLocalStorage(id);
  item.remove();
  updatePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToLocalStorage(item) {
  const cartArray = getStorage();
  cartArray.push(item);
  saveStorage(cartArray);
}

function createCartListByStorage() {
  const cartArray = getStorage();
  cartArray.forEach(({ id, title, price }) => {
    cartItems.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  });
}

async function addToCartEvent(event) {
  const button = event.target;
  const itemId = getSkuFromProductItem(button.parentElement);
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  showLoading();
  const item = await fetchItem(endpoint);
  removeLoading();
  const { id, title, price } = item;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItems.appendChild(cartItem);
  addItemToLocalStorage(item);
  updatePrice();
}

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
  if (element === 'button') {
    e.addEventListener('click', addToCartEvent);
  }
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

const query = 'computador';
const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

function fetchApi(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL)
      .then((r) => r.json())
      .then((json) => resolve(json.results))
      .catch((error) => reject(error));
  });
}

async function createList() {
  showLoading();
  const productsList = await fetchApi(url);
  removeLoading();
  productsList.forEach(({ id, title, thumbnail }) => {
    const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
    productsContainer.appendChild(product);
  });
}

/** Consultei o repositório do Matheus Inacio para resolver o requisito 6 - Limpar Carrinho.
Link do repositório: https://github.com/tryber/sd-011-project-shopping-cart/pull/15
*/
function emptyCart() {
  while (cartItems.children.length) { cartItems.removeChild(cartItems.lastChild); }
  localStorage.removeItem('shoppingCart');
  updatePrice();
}

window.onload = function onload() {
  createList();
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
  createCartListByStorage();
  updatePrice();
};
