/**
 * ============================================================================
 * CARTIVO ADMIN PORTAL — CLIENT INTERACTIVITY ENGINE
 * Location: public/js/admin/admin.js
 * Scope: Admin Portal Only (Isolated from storefront)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileSidebar();
  initTableSearch();
  initIconPreview();
  initImageUploadPreview();
  initConfirmPrompts();
});

/**
 * 1. Mobile Sidebar Drawer Controller
 */
function initMobileSidebar() {
  const sidebar = document.getElementById("admin-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const closeBtn = document.getElementById("sidebar-close-btn");

  if (!sidebar) return;

  const openSidebar = () => {
    sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (backdrop) backdrop.addEventListener("click", closeSidebar);
}

/**
 * 2. Instant Table Search & Filter Engine
 */
function initTableSearch() {
  const searchInput = document.getElementById("admin-table-search");
  const table = document.querySelector(".admin-table");

  if (!searchInput || !table) return;

  const rows = table.querySelectorAll("tbody tr");
  const countBadge = document.getElementById("table-record-count");

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    rows.forEach((row) => {
      // Exclude placeholder 'no records' rows
      if (row.classList.contains("empty-placeholder-row")) return;

      const text = row.textContent.toLowerCase();
      const match = text.includes(term);
      row.style.display = match ? "" : "none";

      if (match) visibleCount++;
    });

    if (countBadge) {
      countBadge.textContent = `${visibleCount} showing`;
    }
  });
}

/**
 * 3. Live FontAwesome Icon Preview, Device Catalog & Filter Engine
 */
function initIconPreview() {
  const iconInput = document.getElementById("category-icon-input");
  const previewIcon = document.getElementById("category-icon-preview");
  const previewBox = document.querySelector(".icon-preview-box");
  const iconChips = document.querySelectorAll(".icon-suggestion-chip");
  const searchFilter = document.getElementById("icon-search-filter");
  const tabBtns = document.querySelectorAll(".icon-tab-btn");

  if (!iconInput || !previewIcon) return;

  const updatePreview = (value) => {
    const cleanClass = value.trim() || "fa-solid fa-shapes";
    previewIcon.className = cleanClass;

    // Soft pulse visual effect on preview box
    if (previewBox) {
      previewBox.classList.add("ring-2", "ring-amber-400", "scale-105");
      setTimeout(() => {
        previewBox.classList.remove("ring-2", "ring-amber-400", "scale-105");
      }, 250);
    }

    // Highlight matching chip
    iconChips.forEach((chip) => {
      if (chip.dataset.icon === cleanClass) {
        chip.classList.add("bg-slate-900", "text-white", "shadow-sm");
        chip.classList.remove("bg-slate-100", "text-slate-700");
      } else {
        chip.classList.remove("bg-slate-900", "text-white", "shadow-sm");
        chip.classList.add("bg-slate-100", "text-slate-700");
      }
    });
  };

  // Live typing preview
  iconInput.addEventListener("input", (e) => {
    updatePreview(e.target.value);
  });

  // Suggestion chip click
  iconChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selectedIcon = chip.dataset.icon;
      if (selectedIcon) {
        iconInput.value = selectedIcon;
        updatePreview(selectedIcon);
      }
    });
  });

  // Category Tab Filter
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => {
        b.classList.remove("bg-slate-900", "text-white");
        b.classList.add("bg-slate-100", "text-slate-600");
      });
      btn.classList.add("bg-slate-900", "text-white");
      btn.classList.remove("bg-slate-100", "text-slate-600");

      const targetGroup = btn.dataset.group;

      iconChips.forEach((chip) => {
        const chipGroup = chip.dataset.group;
        const matchesGroup = targetGroup === "all" || chipGroup === targetGroup;

        // Apply search query also if present
        const term = searchFilter ? searchFilter.value.toLowerCase().trim() : "";
        const matchesTerm = !term || chip.textContent.toLowerCase().includes(term) || (chip.dataset.icon && chip.dataset.icon.toLowerCase().includes(term));

        chip.style.display = matchesGroup && matchesTerm ? "inline-flex" : "none";
      });
    });
  });

  // Instant Search filter for chips
  if (searchFilter) {
    searchFilter.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const activeTab = document.querySelector(".icon-tab-btn.bg-slate-900");
      const activeGroup = activeTab ? activeTab.dataset.group : "all";

      iconChips.forEach((chip) => {
        const chipGroup = chip.dataset.group;
        const matchesGroup = activeGroup === "all" || chipGroup === activeGroup;
        const matchesTerm = !term || chip.textContent.toLowerCase().includes(term) || (chip.dataset.icon && chip.dataset.icon.toLowerCase().includes(term));

        chip.style.display = matchesGroup && matchesTerm ? "inline-flex" : "none";
      });
    });
  }

  // Initial preview sync if value already present (e.g. edit mode)
  if (iconInput.value) {
    updatePreview(iconInput.value);
  }
}

/**
 * 4. Image Upload Instant File Preview for Products
 */
function initImageUploadPreview() {
  const fileInput = document.getElementById("product-image-input");
  const previewContainer = document.getElementById("product-image-preview-box");
  const previewImg = document.getElementById("product-image-preview");
  const placeholder = document.getElementById("product-image-placeholder");

  if (!fileInput || !previewImg) return;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        previewImg.src = event.target.result;
        previewImg.classList.remove("hidden");
        if (placeholder) placeholder.classList.add("hidden");
        if (previewContainer) {
          previewContainer.classList.remove("border-dashed");
          previewContainer.classList.add("border-solid", "border-amber-400");
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

/**
 * 5. Safe Delete / Confirmation Dialogs
 */
function initConfirmPrompts() {
  const confirmForms = document.querySelectorAll("form[data-confirm]");

  confirmForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const message = form.getAttribute("data-confirm") || "Are you sure you want to proceed?";
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    });
  });
}

