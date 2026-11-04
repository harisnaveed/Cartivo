// =================================
// CARTIVO STOREFRONT & MODAL ENGINE
// =================================

let cart = JSON.parse(localStorage.getItem("cartivoCart")) || [];

// Update cart counter in DOM and localStorage
function updateCartCounter() {
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const cartCount = document.getElementById("cart-count");
  const cartLabel = document.getElementById("cart-label");

  if (cartCount) cartCount.textContent = totalItems;
  if (cartLabel) cartLabel.textContent = `${totalItems} items added`;

  localStorage.setItem("cartivoCart", JSON.stringify(cart));
}

// Add an item to cart
function addToCart(product) {
  if (!product || !product.id) return;

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: 1,
    });
  }

  updateCartCounter();
}

let selectedProduct = null;

// Open Quick View Modal
function openQuickView(button) {
  const modal = document.getElementById("quick-view-modal");
  if (!modal) {
    console.warn("quick-view-modal element not found on page");
    return;
  }

  selectedProduct = {
    id: button.dataset.id,
    name: button.dataset.name,
    price: Number(button.dataset.price) || 0,
    category: button.dataset.category || "General",
    description: button.dataset.description || "No description available.",
    image: button.dataset.image || "",
    stock: Number(button.dataset.stock ?? 0),
  };

  const nameEl = document.getElementById("quick-view-name");
  if (nameEl) nameEl.textContent = selectedProduct.name;

  const categoryEl = document.getElementById("quick-view-category");
  if (categoryEl) categoryEl.textContent = selectedProduct.category;

  const priceEl = document.getElementById("quick-view-price");
  if (priceEl) priceEl.textContent = "$" + selectedProduct.price.toFixed(2);

  const descEl = document.getElementById("quick-view-description");
  if (descEl) descEl.textContent = selectedProduct.description;

  const stockElement = document.getElementById("quick-view-stock");
  if (stockElement) {
    stockElement.textContent =
      selectedProduct.stock > 0
        ? `${selectedProduct.stock} items available`
        : "Out of stock";

    if (selectedProduct.stock > 0) {
      stockElement.className = "quick-stock text-xs font-semibold text-emerald-600 mb-5 flex items-center gap-1.5";
    } else {
      stockElement.className = "quick-stock text-xs font-semibold text-rose-500 out-stock mb-5 flex items-center gap-1.5";
    }
  }

  const modalImage = document.getElementById("quick-view-image");
  if (modalImage) {
    modalImage.innerHTML = selectedProduct.image
      ? `<img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="w-full h-full object-cover">`
      : '<i class="fa-solid fa-box-open text-4xl text-slate-300"></i>';
  }

  const quickAddButton = document.getElementById("quick-add-cart");
  if (quickAddButton) {
    quickAddButton.disabled = selectedProduct.stock <= 0;
    quickAddButton.innerHTML =
      selectedProduct.stock > 0
        ? '<i class="fa-solid fa-cart-plus text-xs"></i> <span>Add to Cart</span>'
        : '<span>Out of Stock</span>';
  }

  // Support both 'active' and 'open' classes for styling compatibility
  modal.classList.add("active", "open");
  document.body.style.overflow = "hidden";
}

// Close Quick View Modal
function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) {
    modal.classList.remove("active", "open");
  }
  document.body.style.overflow = "";
}

// Global Event Delegation for clicks
document.addEventListener("click", (e) => {
  // 1. Quick View Trigger
  const quickBtn = e.target.closest(".quick-view-btn");
  if (quickBtn) {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(quickBtn);
    return;
  }

  // 2. Add To Cart Button from Card
  const addCartBtn = e.target.closest(".add-cart-btn");
  if (addCartBtn) {
    e.preventDefault();
    const product = {
      id: addCartBtn.dataset.id,
      name: addCartBtn.dataset.name,
      price: Number(addCartBtn.dataset.price) || 0,
      image: addCartBtn.dataset.image || "",
    };

    addToCart(product);

    const originalHtml = addCartBtn.innerHTML;
    addCartBtn.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i> <span>Added</span>';
    setTimeout(() => {
      addCartBtn.innerHTML = originalHtml;
    }, 1200);
    return;
  }

  // 3. Quick View Modal Close (X button or Backdrop overlay)
  if (
    e.target.closest("#modal-close") ||
    e.target.id === "quick-view-close" ||
    e.target.closest("#quick-view-close")
  ) {
    e.preventDefault();
    closeQuickView();
    return;
  }

  // 4. Quick View Modal: Add to Cart button
  if (e.target.closest("#quick-add-cart")) {
    e.preventDefault();
    if (selectedProduct && selectedProduct.stock > 0) {
      addToCart(selectedProduct);

      const quickBtn = document.getElementById("quick-add-cart");
      if (quickBtn) {
        const orig = quickBtn.innerHTML;
        quickBtn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> <span>Added to Cart!</span>';
        setTimeout(() => {
          quickBtn.innerHTML = orig;
          closeQuickView();
        }, 800);
      } else {
        closeQuickView();
      }
    }
    return;
  }
});

// Close on Escape Key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuickView();
  }
});

// Shop Search Live Filter
const shopSearchInput = document.getElementById("shop-search");
if (shopSearchInput) {
  shopSearchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value.toLowerCase().trim();

    document.querySelectorAll(".shop-product-card").forEach((card) => {
      const nameEl = card.querySelector(".shop-product-name");
      const productName = nameEl ? nameEl.textContent.toLowerCase() : "";

      card.style.display = productName.includes(searchValue) ? "" : "none";
    });
  });
}

// Initial cart counter sync
updateCartCounter();
