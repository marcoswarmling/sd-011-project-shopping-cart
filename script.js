async function fetchComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResponse = await response.json();
  const result = await jsonResponse.results;
  return result;
}

function getLocalStorage() {
  const item = localStorage.getItem('shopping-cart');
  const cartItem = item ? JSON.parse(item) : [];
  return cartItem;
}

function setLocalStorage(cartItem) {
  localStorage.setItem('shopping-cart', JSON.stringify(cartItem));
}

function removeItemStorage(id) {
  const cart = getLocalStorage();
  const newCart = cart.filter((e) => e.sku !== id);
  setLocalStorage(newCart);
}

function addItem(item) {
  const cart = getLocalStorage();
  cart.push(item);
  setLocalStorage(cart);
}

async function fetchID(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonResponse = await response.json();
  const result = await jsonResponse;
  return result;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText, event) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (event) {
    e.addEventListener('click', event);
  }
  return e;
}

function sumTotal(value) {
  const totalPriceElement = document.querySelector('span.total-price');
  let sum = parseFloat(totalPriceElement.innerText);
  sum += parseFloat(value);
  totalPriceElement.innerText = Math.round(sum * 100) / 100;
}

function cartItemClickListener(event) {
  removeItemStorage(event.target.id);
  event.target.remove();
  sumTotal(event.target.dataset.price * -1);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.dataset.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(list) {
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(list);
  sumTotal(list.dataset.price);
}

function adItem(event) {
  const ev = getSkuFromProductItem(event.target.parentElement);
  fetchID(ev)
    .then(({ id, title, price }) => {
      addItem({ sku: id, name: title, salePrice: price });
      return createCartItemElement({ sku: id, name: title, salePrice: price });
    })
    .then((list) => addToCart(list))
    .catch((e) => console.error(e));
}
  
function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', adItem));
  return section;
}

async function loadStorage() {
  const cartArray = getLocalStorage();
  cartArray.forEach(({ sku, name, salePrice }) => { 
  addToCart(createCartItemElement({ sku, name, salePrice })); 
});
}

function emptyCart() {
  const cart = document.querySelector('ol.cart__items');
  while (cart.children.length) {
    cart.removeChild(cart.lastChild);
  }
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = '0';
}

window.onload = async () => {
  const items = document.querySelector('.items');
  const list = await fetchComputer();
  list.forEach(({ id, title, thumbnail, price }) => { 
    const listedItens = createProductItemElement({ sku: id, name: title, image: thumbnail, price });
    items.appendChild(listedItens);
  });
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  loadStorage();
};