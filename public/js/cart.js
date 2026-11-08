/**
 * ============================================================================
 * CARTIVO — SHOPPING CART PAGE INTERACTION ENGINE
 * Location: public/js/cart.js
 * Scope: /cart Page (Client-Side Rendering & LocalStorage Management)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initCheckoutModal();
});

/**
 * Retrieve current cart array from localStorage
 */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cartivoCart")) || [];
  } catch (err) {
    console.error("Failed to parse cartivoCart from localStorage:", err);
    return [];
  }
}

/**
 * Persist cart array and trigger count sync
 */
function saveCart(cart) {
  localStorage.setItem("cartivoCart", JSON.stringify(cart));
  if (typeof updateCartCounter === "function") {
    updateCartCounter();
  } else {
    // Fallback sync
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const headerCount = document.getElementById("header-cart-count");
    if (headerCount) headerCount.textContent = totalItems;
  }
}

/**
 * Formats a number to USD currency ($XX.XX)
 */
function formatCurrency(amount) {
  return "$" + Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Main Cart Renderer
 */
function renderCart() {
  const cart = getCart();
  const emptyState = document.getElementById("empty-cart-state");
  const contentState = document.getElementById("cart-content-state");
  const itemsContainer = document.getElementById("cart-items-container");
  const itemsCountBadge = document.getElementById("cart-total-badge");

  // Summary elements
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const taxEl = document.getElementById("summary-tax");
  const grandTotalEl = document.getElementById("summary-grand-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (itemsCountBadge) {
    itemsCountBadge.textContent = `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`;
  }

  // Handle empty cart state
  if (!cart || cart.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    if (contentState) contentState.classList.add("hidden");
    saveCart([]);
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");
  if (contentState) contentState.classList.remove("hidden");

  // Calculate financials
  let subtotal = 0;
  let itemsHtml = "";

  cart.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const itemTotal = price * qty;
    subtotal += itemTotal;

    const imageMarkup = item.image
      ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300">`
      : `<div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl"><i class="fa-solid fa-box-open text-xl"></i></div>`;

    itemsHtml += `
      <div class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200" data-item-id="${item.id}">
        
        <!-- Left: Image & Info -->
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden p-1">
            ${imageMarkup}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 truncate block hover:text-amber-600 transition-colors">
              ${escapeHtml(item.name)}
            </h3>
            <span class="text-xs font-semibold text-slate-500 mt-0.5 block">
              ${formatCurrency(price)} <span class="text-[10px] text-slate-400 font-normal">/ each</span>
            </span>
            <div class="sm:hidden mt-2 flex items-center justify-between">
              <span class="text-xs font-extrabold text-slate-900">
                ${formatCurrency(itemTotal)}
              </span>
            </div>
          </div>
        </div>

        <!-- Middle: Quantity Stepper -->
        <div class="flex items-center justify-between sm:justify-center gap-3">
          <div class="inline-flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onclick="handleQuantityChange('${item.id}', -1)"
              class="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs active:scale-95"
              title="Decrease quantity"
            >
              <i class="fa-solid fa-minus text-[10px]"></i>
            </button>

            <span class="w-8 text-center text-xs font-bold text-slate-900 select-none">
              ${qty}
            </span>

            <button
              type="button"
              onclick="handleQuantityChange('${item.id}', 1)"
              class="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs active:scale-95"
              title="Increase quantity"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>

          <!-- Total for Desktop -->
          <div class="hidden sm:block text-right w-24">
            <span class="text-xs sm:text-sm font-extrabold text-slate-900 block">
              ${formatCurrency(itemTotal)}
            </span>
          </div>

          <!-- Remove Item Button -->
          <button
            type="button"
            onclick="handleRemoveItem('${item.id}')"
            class="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0"
            title="Remove item"
          >
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>

      </div>
    `;
  });

  if (itemsContainer) {
    itemsContainer.innerHTML = itemsHtml;
  }

  // Shipping & Tax Calculations
  // Free shipping on orders over $150, otherwise flat $15.00
  const shipping = subtotal > 150 ? 0 : 15.0;
  const tax = subtotal * 0.05; // 5% estimated sales tax
  const grandTotal = subtotal + shipping + tax;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (shippingEl) {
    shippingEl.innerHTML = shipping === 0
      ? '<span class="text-emerald-600 font-bold">Free</span>'
      : formatCurrency(shipping);
  }
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (grandTotalEl) grandTotalEl.textContent = formatCurrency(grandTotal);

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

/**
 * Handle +/- stepper click
 */
window.handleQuantityChange = function (productId, delta) {
  let cart = getCart();
  const productIndex = cart.findIndex((item) => String(item.id) === String(productId));

  if (productIndex === -1) return;

  const newQty = (cart[productIndex].quantity || 1) + delta;

  if (newQty <= 0) {
    // If reducing to 0, confirm removal
    cart.splice(productIndex, 1);
  } else {
    cart[productIndex].quantity = newQty;
  }

  saveCart(cart);
  renderCart();
};

/**
 * Handle single item removal
 */
window.handleRemoveItem = function (productId) {
  let cart = getCart();
  cart = cart.filter((item) => String(item.id) !== String(productId));
  saveCart(cart);
  renderCart();
};

/**
 * Clear all items from cart
 */
window.handleClearCart = function () {
  if (confirm("Are you sure you want to clear all items from your cart?")) {
    saveCart([]);
    renderCart();
  }
};

/**
 * Helper to prevent XSS injection in cart item names
 */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Checkout Modal & Mock Order Confirmation
 */
function initCheckoutModal() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const modal = document.getElementById("checkout-modal");
  const closeModalBtn = document.getElementById("close-checkout-modal");
  const confirmOrderBtn = document.getElementById("confirm-order-btn");

  if (!checkoutBtn || !modal) return;

  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const modalTotal = document.getElementById("modal-order-total");
    const grandTotalEl = document.getElementById("summary-grand-total");
    if (modalTotal && grandTotalEl) {
      modalTotal.textContent = grandTotalEl.textContent;
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
      // Simulate successful checkout
      confirmOrderBtn.disabled = true;
      confirmOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Processing Order...</span>';

      setTimeout(() => {
        // Clear cart after checkout
        saveCart([]);
        closeModal();

        // Redirect to shop with order placed message or re-render
        alert("🎉 Order placed successfully! Thank you for shopping with Cartivo.");
        window.location.href = "/shop";
      }, 1200);
    });
  }
}

