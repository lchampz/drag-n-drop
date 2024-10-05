const store = [
  { name: "Chocolate", id: 1, qtd: 15, price: 10.3 },
  { name: "Leite", id: 2, qtd: 4, price: 5.0 },
  { name: "Nescau", id: 3, qtd: 7, price: 7.1 },
];

const cart = [];

const storeComponent = document.getElementById("store");
const cartComponent = document.getElementById("cart");
const totalComponent = document.getElementById("total");

const reloadPrices = () => {
  totalComponent.innerText = "R$ " + cart.reduce((acc, v) => acc + v.price * v.qtd, 0).toFixed(2);
};

const createCardElement = (item, isCart = false) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.id = isCart ? `cart-card-${item.id}` : `card-${item.id}`;
  div.draggable = true;
  div.innerHTML = `
    <p>${item.name}</p> -
    <p class="qtd">${item.qtd} unidade(s)</p> -
    <p>R$ ${item.price.toFixed(2)}</p>
  `;
  div.addEventListener("dragstart", (e) => e.dataTransfer.setData("id", e.target.id));
  return div;
};

const updateStoreView = () => {
  store.forEach((item) => {
    const itemDiv = document.getElementById(`card-${item.id}`);
    if (item.qtd === 0) {
      itemDiv.style.display = "none";
    } else {
      itemDiv.style.display = "flex";
      itemDiv.querySelector(".qtd").innerText = `${item.qtd} unidade(s)`;
    }
  });
};

const updateCartView = () => {
  cart.forEach((item) => {
    const itemDiv = document.getElementById(`cart-card-${item.id}`);

    if (item.qtd === 0) {
      itemDiv?.remove();
    } else {
      if (!itemDiv) {
        cartComponent.append(createCardElement(item, true));
      } else {
        itemDiv.querySelector(".qtd").innerText = `${item.qtd} unidade(s)`;
      }
    }
  });
};

const updateView = () => {
  updateStoreView();
  updateCartView();
  reloadPrices();
};

const removeCardDOM = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
}

const moveItem = (type, itemId) => {
  let itemIndex, itemInCartIndex;

  const itemIdNum = parseInt(itemId.replace(/cart-card-|card-/, ""));
  itemIndex = store.findIndex((item) => item.id === itemIdNum);
  itemInCartIndex = cart.findIndex((item) => item.id === itemIdNum);

  if (itemIndex === -1) return;

  if (type === "add" && store[itemIndex].qtd > 0) {
    store[itemIndex].qtd -= 1;
    if (itemInCartIndex === -1) {
      cart.push({ ...store[itemIndex], qtd: 1 });
    } else {
      cart[itemInCartIndex].qtd += 1;
    }
  } else if (type === "remove" && itemInCartIndex !== -1) {
    removeCardDOM("cart-card-" + cart[itemInCartIndex].id);
    cart[itemInCartIndex].qtd -= 1;
    if (cart[itemInCartIndex].qtd === 0) {
      cart.splice(itemInCartIndex, 1);
    }
    store[itemIndex].qtd += 1;
  }
  
  updateView();
};

const load = () => {
  store.forEach((item) => storeComponent.append(createCardElement(item)));

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (type) => (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("id");
    moveItem(type === "cart" ? "add" : "remove", data);
  };

  storeComponent.addEventListener("dragover", handleDragOver);
  storeComponent.addEventListener("drop", handleDrop("store"));

  cartComponent.addEventListener("dragover", handleDragOver);
  cartComponent.addEventListener("drop", handleDrop("cart"));

  reloadPrices();
};

window.addEventListener("load", load);
