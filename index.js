import { menuArray } from "./data.js";

let grandTotal = 0;
const payForm = document.getElementById("pay-form");
const payModal = document.getElementById("pay-modal");
const orderSection = document.getElementById("order-section");

renderItems();

document.addEventListener("click", function (e) {
  if (e.target.dataset.idAdd) {
    handleAddBtn(e.target.dataset.idAdd);
  } else if (e.target.dataset.idSubtract) {
    handleSubtractBtn(e.target.dataset.idSubtract);
  } else if (e.target.dataset.removeId) {
    handleRemoveBtn(e.target.dataset.removeId);
  } else if (e.target.id == "order-btn") {
    handleOrderBtn();
  }
});

payForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const payFormData = new FormData(payForm);
  const clientName = payFormData.get("pay-name");
  handlePayBtn(clientName);
});

function renderItems() {
  const foodEl = document.getElementById("food-el");
  menuArray.forEach(function (food) {
    foodEl.innerHTML += `
    <div class="food-el-card">
      <h2 class="food-emoji">${food.emoji}</h2>
      <div class="food-text">
        <h3 class="food-name">${food.name}</h3>
        <p class="food-ingredients">${food.ingredients.join(", ")}</p>
        <h4 class="food-price">$${food.price}</h4>
      </div>
      <div class="food-button">
      <button class="food-qty-selector" data-id-subtract="${food.id}">-</button>
      <button class="food-qty-selector" data-id-add="${food.id}">+</button>
      </div>
    </div>`;
    console.log(foodEl);
  });
  return foodEl;
}

function handleAddBtn(foodId) {
  for (let item of menuArray) {
    if (item.id == foodId && !item.count) {
      grandTotal += item.price;
      item.count = 1;
      item.ordered = item.price;
    } else if (item.id == foodId) {
      grandTotal += item.price;
      item.count++;
      item.ordered += item.price;
    }
  }
  renderOrder();
}

function handleSubtractBtn(foodId) {
  for (let item of menuArray) {
    if (item.id == foodId && item.count > 0) {
      grandTotal -= item.price;
      item.count -= 1;
      item.ordered -= item.price;
    }
  }
  renderOrder();
}

function handleRemoveBtn(orderItemId) {
  for (let item of menuArray) {
    if (item.id == orderItemId) {
      grandTotal -= item.ordered;
      item.count = 0;
      item.ordered = 0;
    }
  }
  renderOrder();
}

function handleOrderBtn() {
  payModal.classList.remove("hidden");
}

function handlePayBtn(name) {
  const orderConfirmed = document.getElementById("order-confirmed");
  payModal.classList.toggle("hidden");
  orderSection.classList.toggle("hidden");
  orderConfirmed.classList.toggle("hidden");
  orderConfirmed.innerHTML = `
    <h2 class="confirmed-txt">Thanks, ${name}! Your order is on its way!</h2>
    `;
}

function renderOrder() {
  checkEmptyOrder();
  renderItemsOrder();
  renderTotal();
}

function renderItemsOrder() {
  const orderEl = document.getElementById("order-el");
  orderEl.innerHTML = "";
  for (let item of menuArray) {
    if (item.count > 0) {
      orderEl.innerHTML += `
        <div class="order-item" data-order-id="${item.id}">
          <div class="order-item-txt">
            <h3 class="order-item-name">${item.name} x${item.count}</h3>
            <button class="remove-btn" id="remove-btn" data-remove-id="${item.id}">Remove</button>
          </div>
          <p class="order-item-total">$${item.ordered}</p>
        </div>`;
    }
  }
}

function renderTotal() {
  const totalEl = document.getElementById("total-el");
  totalEl.innerHTML = `
      <p class="grand-total">Total price:</p>
      <p class="total-amount">$${grandTotal}</p>
`;
}

function checkEmptyOrder() {
  let isNotEmpty = false;
  for (let item of menuArray) {
    if (item.count > 0) {
      isNotEmpty = true;
    }
  }
  if (isNotEmpty) {
    orderSection.classList.remove("hidden");
  } else {
    orderSection.classList.add("hidden");
  }
}
