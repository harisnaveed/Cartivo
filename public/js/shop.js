// =================================
// CART COUNTER
// =================================

let cart = JSON.parse(localStorage.getItem("cartivoCart")) || [];

const cartCount = document.getElementById("cart-count");
const cartLabel = document.getElementById("cart-label");

function updateCartCounter() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalItems;
  cartLabel.textContent = `${totalItems} items added`;

  localStorage.setItem("cartivoCart", JSON.stringify(cart));
}

updateCartCounter();

// =================================
// ADD TO CART
// =================================

document.querySelectorAll(".add-cart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image,
    };

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    updateCartCounter();

    const originalText = button.innerHTML;

    button.innerHTML = '<i class="fa-solid fa-check"></i> Added';

    setTimeout(() => {
      button.innerHTML = originalText;
    }, 1200);
  });
});

// =================================
// QUICK VIEW
// =================================

const modal = document.getElementById("quick-view-modal");
const modalImage = document.getElementById("quick-view-image");

let selectedProduct = null;

document.querySelectorAll(".quick-view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    selectedProduct = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      image: button.dataset.image,
    };

    document.getElementById("quick-view-name").textContent =
      button.dataset.name;

    document.getElementById("quick-view-category").textContent =
      button.dataset.category;

    document.getElementById("quick-view-price").textContent =
      "$" + Number(button.dataset.price).toFixed(2);

    document.getElementById("quick-view-description").textContent =
      button.dataset.description || "No description available.";

    const stock = Number(button.dataset.stock);
    const stockElement = document.getElementById("quick-view-stock");

    stockElement.textContent =
      stock > 0 ? `${stock} items available` : "Out of stock";

    stockElement.classList.toggle("out-stock", stock <= 0);

    modalImage.innerHTML = button.dataset.image
      ? `<img src="${button.dataset.image}" alt="">`
      : '<i class="fa-solid fa-box-open"></i>';

    const quickAddButton = document.getElementById("quick-add-cart");

    quickAddButton.disabled = stock <= 0;
    quickAddButton.innerHTML =
      stock > 0
        ? '<i class="fa-solid fa-cart-plus"></i> Add to Cart'
        : "Out of Stock";

    modal.classList.add("open");
  });
});

// =================================
// ADD TO CART FROM QUICK VIEW
// =================================

document.getElementById("quick-add-cart").addEventListener("click", () => {
  if (!selectedProduct) return;

  const existingProduct = cart.find((item) => item.id === selectedProduct.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1,
    });
  }

  updateCartCounter();

  modal.classList.remove("open");
});

// =================================
// CLOSE QUICK VIEW
// =================================

document.getElementById("modal-close").addEventListener("click", () => {
  modal.classList.remove("open");
});

document.getElementById("quick-view-close").addEventListener("click", () => {
  modal.classList.remove("open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("open");
  }
});

// =================================
// PRODUCT SEARCH
// =================================

document.getElementById("shop-search").addEventListener("input", (event) => {
  const searchValue = event.target.value.toLowerCase();

  document.querySelectorAll(".shop-product-card").forEach((card) => {
    const productName = card
      .querySelector(".shop-product-name")
      .textContent.toLowerCase();

    card.style.display = productName.includes(searchValue) ? "" : "none";
  });
});
