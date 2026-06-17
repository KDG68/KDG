/* ==========================================================================
   SOFTZONE TECH UNIVERSE - MAIN APPLICATION CONTROLLER
   ========================================================================== */

(function() {
  // Global App variables
  let activeDetailProductId = null;
  let activeDetailLicense = "monthly";
  let activeDetailThumbIndex = 0;

  // Performance Mode
  let performanceMode = "balanced";

  // Cache elements
  let header, mobileMenuToggle, mobileMenuOverlay, cartDrawer, cartBackdrop, toastContainer;
  let quickViewModal, quickViewBackdrop;
  let viewport;

  function init() {
    // Select elements
    header = document.querySelector(".site-header");
    mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    cartDrawer = document.getElementById("cart-drawer");
    cartBackdrop = document.getElementById("cart-backdrop");
    toastContainer = document.getElementById("toast-container");
    quickViewModal = document.getElementById("quickview-modal");
    quickViewBackdrop = document.getElementById("quickview-backdrop");
    viewport = document.getElementById("technology-sphere-stage");

    setupCommonEvents();
    
    // Initialize WorkflowSimulator module
    if (window.WorkflowSimulator) window.WorkflowSimulator.init();

    // Save desktop template and check media queries for desktop vs mobile modes
    window.desktopUniverseTemplate = document.getElementById("view-home") ? document.getElementById("view-home").innerHTML : "";
    window.currentUniverseMode = "";

    const mobileQuery = window.matchMedia("(max-width: 767px)");

    function checkBreakpoint() {
      if (mobileQuery.matches) {
        if (window.currentUniverseMode !== "mobile") {
          // Dispose desktop universe
          if (window.SphereScene && typeof window.SphereScene.dispose === "function") {
            window.SphereScene.dispose();
          }
          window.currentUniverseMode = "mobile";
          if (window.MobileUniverse) {
            window.MobileUniverse.renderMobileUniverse();
            window.MobileUniverse.initMobileUniverse();
          }
          // Re-evaluate routes for mobile deep links
          handleRoute();
        }
      } else {
        if (window.currentUniverseMode !== "desktop") {
          // Dispose mobile universe
          if (window.MobileUniverse && typeof window.MobileUniverse.cleanupMobile === "function") {
            window.MobileUniverse.cleanupMobile();
          }
          window.currentUniverseMode = "desktop";
          const viewHome = document.getElementById("view-home");
          if (viewHome) {
            viewHome.innerHTML = window.desktopUniverseTemplate;
          }
          // Initialize desktop universe
          if (window.SphereScene && typeof window.SphereScene.init === "function") {
            window.SphereScene.init();
          }
          // Re-evaluate routes for desktop deep links
          handleRoute();
        }
      }
    }

    // Run first check
    checkBreakpoint();

    // Listen to resize and media query changes
    window.addEventListener("resize", checkBreakpoint);
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", checkBreakpoint);
    } else {
      mobileQuery.addListener(checkBreakpoint);
    }

    // Check guide banner
    const guideBanner = document.getElementById("universe-guide-banner");
    if (guideBanner) {
      const shown = localStorage.getItem("softzone_guide_shown");
      if (shown === "true") {
        guideBanner.remove();
      }
    }

    // Set default Performance Mode based on device
    const isMobileDevice = window.matchMedia("(max-width: 1023px)").matches;
    const storedPerf = localStorage.getItem("softzone_perf_mode");
    if (storedPerf) {
      setPerformanceMode(storedPerf);
    } else {
      setPerformanceMode(isMobileDevice ? "lite" : "balanced");
    }

    // Bind routing events
    window.addEventListener("hashchange", handleRoute);
    
    // Initialize routing on first load
    handleRoute();

    // Subscribe to cart changes to update UI
    window.Store.onCartChange(updateCartUI);
    updateCartUI();
  }

  // ==========================================================================
  // ROUTING & PAGE SWAPPING (WITH DEEP LINKS SUPPORT)
  // ==========================================================================
  function handleRoute() {
    const rawHash = window.location.hash || "#/";
    const [path, queryString] = rawHash.split("?");
    
    // Parse query params
    const queryParams = new URLSearchParams(queryString || "");
    
    // Scroll to top on navigation (except when navigating inside universe)
    if (!path.startsWith("#/universe")) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Close mobile menu and cart drawer on navigation
    closeMobileMenu();
    closeCartDrawer();

    // Hide all views first
    const views = document.querySelectorAll(".page-view");
    views.forEach(v => v.style.display = "none");

    // Clean active nav states
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    const navCenterBtn = document.getElementById("nav-center-action-btn");
    if (navCenterBtn) {
      navCenterBtn.style.display = "none";
    }

    // Router matching
    if (path === "#/" || path === "" || path.startsWith("#/universe")) {
      showView("view-home");
      highlightNav("");
      
      if (navCenterBtn) {
        navCenterBtn.style.display = "inline-flex";
      }

      // Handle Universe Deep Links
      if (path.startsWith("#/universe")) {
        const routeId = path.replace("#/universe/", "");
        const nodeId = mapRouteToNodeId(routeId);
        
        if (nodeId) {
          if (window.currentUniverseMode === "mobile") {
            if (window.MobileUniverse && typeof window.MobileUniverse.selectAndCloseSearch === "function") {
              window.MobileUniverse.selectAndCloseSearch(nodeId);
            }
          } else {
            const rawObjects = window.UniverseData ? window.UniverseData.objects : [];
            const node = rawObjects.find(o => o.id === nodeId);
            if (node) {
              if (window.SphereInteraction && typeof window.SphereInteraction.focusNode === "function") {
                window.SphereInteraction.focusNode(node);
              }
              if (window.SpherePanels && typeof window.SpherePanels.openPanel === "function") {
                window.SpherePanels.openPanel(node);
              }
            }
          }
        }
      } else {
        if (window.currentUniverseMode === "mobile") {
          if (window.MobileUniverse && typeof window.MobileUniverse.closeMobileSheet === "function") {
            window.MobileUniverse.closeMobileSheet();
          }
        } else {
          // Core home center
          if (window.SphereInteraction && typeof window.SphereInteraction.resetSphereState === "function") {
            window.SphereInteraction.resetSphereState();
          }
          if (window.SpherePanels && typeof window.SpherePanels.closePanel === "function") {
            window.SpherePanels.closePanel();
          }
        }
      }

    } else if (path === "#/store") {
      showView("view-store");
      highlightNav("store");
      
      // Check query params to pre-fill filters
      const categoryParam = queryParams.get("category") || "all";
      const searchParam = queryParams.get("search") || "";
      
      initStorePage(categoryParam, searchParam);

    } else if (path.startsWith("#/product/")) {
      showView("view-detail");
      const productId = path.replace("#/product/", "");
      renderProductDetailPage(productId);

    } else if (path === "#/checkout") {
      showView("view-checkout");
      initCheckoutPage();

    } else if (path === "#/about") {
      showView("view-about");
      highlightNav("about");

    } else if (path === "#/contact") {
      showView("view-contact");
      highlightNav("contact");
      initContactPage();

    } else if (path === "#/faq") {
      showView("view-faq");
      highlightNav("faq");
      initFaqPage();

    } else {
      // Fallback
      showView("view-home");
      highlightNav("");
      if (window.SphereInteraction && typeof window.SphereInteraction.resetSphereState === "function") {
        window.SphereInteraction.resetSphereState();
      }
    }
  }

  function showView(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "flex";
  }

  function highlightNav(route) {
    const navLinks = document.querySelectorAll(`.nav-link[href="#/${route}"], .mobile-nav-link[href="#/${route}"]`);
    navLinks.forEach(link => link.classList.add("active"));
  }

  // Deep Link Routing Map mapping URL strings to space node IDs
  function mapRouteToNodeId(routeStr) {
    const routeMap = {
      "ai": "sector-ai",
      "ai/content": "sat-ai-content",
      "ai/chatbot": "sat-ai-chatbot",
      "ai/coding": "sat-ai-coding",
      "ai/analytics": "sat-ai-analytics",
      
      "automation": "sector-automation",
      "automation/email": "sat-auto-email",
      "automation/social": "sat-auto-social",
      "automation/report": "sat-auto-report",

      "marketing": "sector-marketing",
      "marketing/lead": "sat-mkt-lead",
      "marketing/ads": "sat-mkt-ads",

      "data": "sector-data",
      "data/scrape": "sat-data-scrape",
      "data/clean": "sat-data-clean",

      "developer": "sector-developer",
      "developer/api": "sat-dev-api",
      "developer/test": "sat-dev-test",
      "developer/security": "sat-dev-security",

      "business": "sector-business",
      "business/pm": "sat-biz-pm",

      "core": "sz-core",
      "search": "util-search",
      "cart": "util-cart",
      "wishlist": "util-wishlist",
      "compare": "util-compare",
      "support": "util-support"
    };

    return routeMap[routeStr] || routeStr;
  }

  // ==========================================================================
  // PERFORMANCE MODE CYCLING
  // ==========================================================================
  function cyclePerformanceMode() {
    if (performanceMode === "full") {
      setPerformanceMode("balanced");
    } else if (performanceMode === "balanced") {
      setPerformanceMode("lite");
    } else {
      setPerformanceMode("full");
    }
  }

  function setPerformanceMode(mode) {
    performanceMode = mode;
    localStorage.setItem("softzone_perf_mode", mode);

    if (!viewport) return;

    // Remove old classes
    viewport.classList.remove("perf-full", "perf-balanced", "perf-lite");
    viewport.classList.add(`perf-${mode}`);

    // Update 3D Scene performance mode
    if (window.SphereScene && typeof window.SphereScene.setPerformanceMode === "function") {
      window.SphereScene.setPerformanceMode(mode);
    }

    // Update Command bar button text
    const btn = document.getElementById("performance-mode-toggle");
    if (btn) {
      btn.innerText = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    }
    
    showToast(`Đã chuyển đổi sang chế độ hiệu năng: ${mode.toUpperCase()}`, "info");
  }

  // ==========================================================================
  // COMMON EVENT HANDLERS (Header scroll, Drawers, Modals, Visibility)
  // ==========================================================================
  function setupCommonEvents() {
    // Scroll header contraction (throttled)
    let scrollTicking = false;
    window.addEventListener("scroll", () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Mobile Menu toggles
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    // Cart Drawer toggles
    cartBackdrop.addEventListener("click", closeCartDrawer);

    // Global Key Handlers (Close modals/drawers on ESC)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCartDrawer();
        closeMobileMenu();
        closeQuickViewModal();
        closeCheckoutSuccessModal();
        if (window.SpherePanels) window.SpherePanels.closePanel();
      }
    });

    // Page Visibility API optimization
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Pause simulation loops when tab hidden
        if (window.WorkflowSimulator && typeof window.WorkflowSimulator.resetSimulation === "function") {
          window.WorkflowSimulator.resetSimulation();
        }
      }
    });

    // Setup mobile swiper layout dock triggers
    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    function handleMobileDock(q) {
      const dock = document.getElementById("mobile-sectors-swiper-dock");
      if (dock) {
        dock.style.display = q.matches ? "flex" : "none";
      }
    }
    mobileQuery.addListener(handleMobileDock);
    handleMobileDock(mobileQuery);
  }

  // Mobile Menu Operations
  function toggleMobileMenu() {
    const isOpen = mobileMenuOverlay.classList.contains("active");
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenuOverlay.classList.add("active");
      mobileMenuToggle.classList.add("open");
      mobileMenuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (window.currentUniverseMode === "mobile" && window.MobileUniverse && typeof window.MobileUniverse.pause === "function") {
        window.MobileUniverse.pause();
      }
    }
  }

  // Close mobile navigation menu
  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove("active");
    mobileMenuToggle.classList.remove("open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (window.currentUniverseMode === "mobile" && window.MobileUniverse && typeof window.MobileUniverse.resume === "function") {
      window.MobileUniverse.resume();
    }
  }

  // Cart Drawer Operations
  function openCartDrawer() {
    cartDrawer.classList.add("active");
    cartBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    cartDrawer.focus();
    if (window.currentUniverseMode === "mobile" && window.MobileUniverse && typeof window.MobileUniverse.pause === "function") {
      window.MobileUniverse.pause();
    }
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove("active");
    cartBackdrop.classList.remove("active");
    document.body.style.overflow = "";
    if (window.currentUniverseMode === "mobile" && window.MobileUniverse && typeof window.MobileUniverse.resume === "function") {
      window.MobileUniverse.resume();
    }
  }

  // Quick View Modal
  function openQuickView(productId) {
    const product = window.AppData.products.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById("quickview-body-content");
    modalBody.innerHTML = `
      <div class="product-detail-grid" style="grid-template-columns: 1fr; gap: 20px;">
        <div class="detail-content-info" style="gap:16px;">
          <span class="detail-category-tag" style="--product-theme-color: ${product.themeColor}">${product.categoryName}</span>
          <h2 class="detail-title" style="font-size:1.8rem;">${product.name}</h2>
          <p class="detail-tagline" style="font-size:1rem;">${product.tagline}</p>
          <p style="color:var(--text-secondary); font-size:0.9rem;">${product.desc}</p>
          
          <div class="detail-pricing-panel" style="padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.9rem; color:var(--text-muted);">Gói hàng tháng:</span>
              <span class="license-price" style="font-size:1.4rem; color:var(--cyan);">$${product.priceMonthly}</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:8px;">
            <a href="#/product/${product.id}" onclick="window.App.closeQuickViewModal()" class="btn btn-secondary btn-sm flex-center">
              Xem chi tiết
            </a>
            <button onclick="window.App.quickAddCart('${product.id}', 'monthly')" class="btn btn-cyan btn-sm flex-center">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.add("active");
    quickViewBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeQuickViewModal() {
    quickViewModal.classList.remove("active");
    quickViewBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ==========================================================================
  // STORE & CATALOG RENDERING
  // ==========================================================================
  let activeFilters = {
    search: "",
    category: "all",
    priceMin: 0,
    priceMax: 600,
    platforms: [],
    licenseType: "all",
    sort: "featured"
  };

  function initStorePage(preselectCategory = "all", preselectSearch = "") {
    activeFilters.category = preselectCategory;
    activeFilters.search = preselectSearch;
    activeFilters.platforms = [];
    activeFilters.priceMin = 0;
    activeFilters.priceMax = 600;
    activeFilters.sort = "featured";

    renderStoreSidebarFilters();
    renderStoreGrid();

    // Setup filter change events
    const searchField = document.getElementById("store-search-input");
    if (searchField) {
      searchField.value = preselectSearch;
      
      // Remove old listeners to avoid duplicates
      const newSearch = searchField.cloneNode(true);
      searchField.parentNode.replaceChild(newSearch, searchField);
      
      newSearch.addEventListener("input", (e) => {
        activeFilters.search = e.target.value;
        renderStoreGrid();
      });
    }

    const sortSelect = document.getElementById("store-sort-select");
    if (sortSelect) {
      sortSelect.value = "featured";
      
      const newSort = sortSelect.cloneNode(true);
      sortSelect.parentNode.replaceChild(newSort, sortSelect);
      
      newSort.addEventListener("change", (e) => {
        activeFilters.sort = e.target.value;
        renderStoreGrid();
      });
    }

    const rangeInput = document.getElementById("price-range-slider");
    const priceText = document.getElementById("price-max-display");
    if (rangeInput && priceText) {
      rangeInput.value = 600;
      priceText.innerText = "$600";
      
      const newRange = rangeInput.cloneNode(true);
      rangeInput.parentNode.replaceChild(newRange, rangeInput);
      
      newRange.addEventListener("input", (e) => {
        activeFilters.priceMax = parseInt(e.target.value);
        priceText.innerText = `$${e.target.value}`;
        renderStoreGrid();
      });
    }
  }

  function renderStoreSidebarFilters() {
    const categoriesFilterList = document.getElementById("filter-categories-list");
    if (!categoriesFilterList) return;

    let catHtml = `
      <label class="filter-checkbox-label">
        <input type="radio" name="category-radio" value="all" ${activeFilters.category === "all" ? "checked" : ""}>
        <span class="custom-checkbox"></span>
        <span class="filter-text">Tất cả hệ sinh thái</span>
      </label>
    `;

    window.AppData.categories.forEach(cat => {
      catHtml += `
        <label class="filter-checkbox-label">
          <input type="radio" name="category-radio" value="${cat.id}" ${activeFilters.category === cat.id ? "checked" : ""}>
          <span class="custom-checkbox" style="border-color: rgba(${cat.colorRgb}, 0.25);"></span>
          <span class="filter-text" style="color: ${activeFilters.category === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)'}">${cat.name}</span>
        </label>
      `;
    });

    categoriesFilterList.innerHTML = catHtml;

    const radios = categoriesFilterList.querySelectorAll("input[name='category-radio']");
    radios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        activeFilters.category = e.target.value;
        renderStoreGrid();
      });
    });

    const platformList = document.getElementById("filter-platforms-list");
    if (platformList) {
      const checkBoxes = platformList.querySelectorAll("input[type='checkbox']");
      checkBoxes.forEach(cb => {
        cb.checked = false;
        
        const newCb = cb.cloneNode(true);
        cb.parentNode.replaceChild(newCb, cb);
      });
      
      const freshCheckBoxes = platformList.querySelectorAll("input[type='checkbox']");
      freshCheckBoxes.forEach(cb => {
        cb.addEventListener("change", () => {
          activeFilters.platforms = Array.from(freshCheckBoxes)
            .filter(i => i.checked)
            .map(i => i.value);
          renderStoreGrid();
        });
      });
    }
  }

  function renderStoreGrid() {
    const productsGrid = document.getElementById("store-products-grid");
    const resultsCountText = document.getElementById("store-results-count");
    if (!productsGrid) return;

    const filteredList = window.Store.getFilteredProducts(activeFilters);
    
    if (resultsCountText) {
      resultsCountText.innerText = `Hiển thị ${filteredList.length} phần mềm / tool AI`;
    }

    if (filteredList.length === 0) {
      productsGrid.className = "no-results-state";
      productsGrid.style.display = "block";
      productsGrid.innerHTML = `
        <svg class="no-results-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3>Không tìm thấy sản phẩm</h3>
        <p style="margin-top:8px;">Hãy thử điều chỉnh bộ lọc hoặc xóa từ khóa tìm kiếm.</p>
      `;
      return;
    }

    productsGrid.className = "products-grid";
    productsGrid.style.display = "grid";

    let gridHtml = "";
    filteredList.forEach(prod => {
      gridHtml += `
        <div class="product-card" style="--product-theme-color: ${prod.themeColor}">
          <div class="card-header-info">
            <div class="card-logo-box">
              ${getCategoryIconSvg(prod.category)}
            </div>
            <div class="card-platform-tags">
              ${prod.platforms.map(plat => `<span class="platform-tag">${plat}</span>`).join("")}
            </div>
          </div>
          <div class="card-body-info">
            <span class="card-category">${prod.categoryName}</span>
            <h4 class="card-title">${prod.name}</h4>
            <p class="card-desc">${prod.tagline}</p>
          </div>
          <div class="card-pricing-wrap">
            <div class="card-price-display">
              <span class="card-price-amount">$${prod.priceMonthly}/tháng</span>
            </div>
            ${prod.label ? `<span class="platform-tag" style="background:var(--product-theme-color); color:var(--bg-deep); border-color:var(--product-theme-color); font-weight:700;">${prod.label}</span>` : ""}
          </div>
          <div class="card-actions">
            <button onclick="window.App.openQuickView('${prod.id}')" class="btn btn-secondary btn-sm flex-center" style="padding: 10px 14px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <a href="#/product/${prod.id}" class="btn btn-outline btn-sm flex-center">Chi tiết</a>
            <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm flex-center">Mua</button>
          </div>
        </div>
      `;
    });

    productsGrid.innerHTML = gridHtml;
  }

  // ==========================================================================
  // PRODUCT DETAIL RENDERING
  // ==========================================================================
  function renderProductDetailPage(productId) {
    const product = window.AppData.products.find(p => p.id === productId);
    if (!product) {
      window.location.hash = "#/store";
      return;
    }

    activeDetailProductId = productId;
    activeDetailLicense = "monthly";
    activeDetailThumbIndex = 0;

    // Log this product in the Recently Viewed list
    if (window.SpherePanels && typeof window.SpherePanels.addRecentlyViewed === "function") {
      window.SpherePanels.addRecentlyViewed(productId);
    }

    // Render Basic Details
    document.getElementById("detail-category-tag").innerText = product.categoryName;
    document.getElementById("detail-category-tag").style.setProperty("--product-theme-color", product.themeColor);
    document.getElementById("detail-title").innerText = product.name;
    document.getElementById("detail-tagline").innerText = product.tagline;
    document.getElementById("detail-description").innerText = product.desc;
    
    // Spec Sheet Rendering
    document.getElementById("spec-os").innerText = product.requirements.os;
    document.getElementById("spec-cpu").innerText = product.requirements.cpu;
    document.getElementById("spec-ram").innerText = product.requirements.ram;
    document.getElementById("spec-storage").innerText = product.requirements.storage;

    renderDetailLicenseOptions(product);
    renderDetailGallery(product);
    renderUniversePositionMap(product);
    renderRelatedProducts(product);

    // Set Buy CTA events
    const cartCta = document.getElementById("detail-add-cart-btn");
    const buyCta = document.getElementById("detail-buy-now-btn");

    cartCta.onclick = () => {
      const res = window.Store.addItem(activeDetailProductId, activeDetailLicense);
      if (res.status === "added") {
        showToast(`Đã thêm "${res.product.name}" vào giỏ hàng!`, "success");
      } else {
        showToast(`Sản phẩm đã có sẵn trong giỏ hàng.`, "info");
      }
      openCartDrawer();
    };

    buyCta.onclick = () => {
      window.Store.addItem(activeDetailProductId, activeDetailLicense);
      window.location.hash = "#/checkout";
    };
  }

  function renderDetailLicenseOptions(product) {
    const parent = document.getElementById("detail-license-cards-wrap");
    if (!parent) return;

    let html = `
      <div class="license-option-card active" data-license="monthly" id="license-card-monthly">
        <div class="license-name">Gói hàng tháng (Monthly)</div>
        <div class="license-price text-cyan" style="margin-top:6px;">$${product.priceMonthly}</div>
        <span style="font-size:0.75rem; color:var(--text-muted);">Sử dụng trên 1 thiết bị</span>
      </div>
    `;

    if (product.priceLifetime) {
      html += `
        <div class="license-option-card" data-license="lifetime" id="license-card-lifetime">
          <div class="license-name">Bản trọn đời (Lifetime)</div>
          <div class="license-price text-purple" style="margin-top:6px;">$${product.priceLifetime}</div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Mua 1 lần, cập nhật trọn đời</span>
        </div>
      `;
    }

    parent.innerHTML = html;

    const monthlyCard = document.getElementById("license-card-monthly");
    const lifetimeCard = document.getElementById("license-card-lifetime");

    monthlyCard.onclick = () => {
      activeDetailLicense = "monthly";
      monthlyCard.classList.add("active");
      if (lifetimeCard) lifetimeCard.classList.remove("active");
    };

    if (lifetimeCard) {
      lifetimeCard.onclick = () => {
        activeDetailLicense = "lifetime";
        lifetimeCard.classList.add("active");
        monthlyCard.classList.remove("active");
      };
    }
  }

  function renderDetailGallery(product) {
    const mainBox = document.getElementById("detail-gallery-main");
    const thumbBox = document.getElementById("detail-gallery-thumbs");
    if (!mainBox || !thumbBox) return;

    const mockScreenshots = [
      `<svg viewBox="0 0 600 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="360" rx="12" fill="var(--bg-secondary)"/>
        <rect width="600" height="40" fill="rgba(7,10,20,0.5)" rx="12"/>
        <circle cx="20" cy="20" r="5" fill="#ef4444"/>
        <circle cx="35" cy="20" r="5" fill="#f59e0b"/>
        <circle cx="50" cy="20" r="5" fill="#10b981"/>
        <rect x="80" y="12" width="440" height="16" rx="4" fill="rgba(255,255,255,0.03)" stroke="var(--border-soft)"/>
        <text x="300" y="24" fill="var(--text-muted)" font-size="10" text-anchor="middle" font-family="monospace">${product.name} v2.6.4</text>
        <text x="300" y="200" fill="var(--text-secondary)" font-size="16" text-anchor="middle" font-family="sans-serif">${product.name}</text>
        <text x="300" y="224" fill="var(--product-theme-color)" font-size="11" font-weight="700" text-anchor="middle" font-family="sans-serif">${product.categoryName} Satellite</text>
      </svg>`
    ];

    mainBox.innerHTML = mockScreenshots[0];
    thumbBox.innerHTML = `
      <div class="detail-thumb-item active">
        ${mockScreenshots[0]}
      </div>
    `;
  }

  function renderUniversePositionMap(product) {
    const parent = document.getElementById("product-detail-position-diagram");
    if (!parent) return;

    parent.innerHTML = `
      <svg class="position-diagram-svg" viewBox="0 0 500 360">
        <circle cx="250" cy="180" r="80" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1.5" />
        <circle cx="250" cy="180" r="140" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1.5" stroke-dasharray="4,8" />
        
        <path class="diagram-link-path" d="M 250 180 L 130 90" stroke="${product.themeColor}" />
        <path class="diagram-link-path" d="M 250 180 L 370 90" stroke="${product.themeColor}" style="animation-delay: 0.5s;" />

        <circle class="diagram-core-node" cx="250" cy="180" r="24" />
        <text x="250" y="184" fill="var(--text-muted)" font-size="9" font-weight="700" text-anchor="middle" font-family="sans-serif">SZ CORE</text>

        <circle class="diagram-active-node" cx="130" cy="90" r="20" stroke="${product.themeColor}" />
        <text x="130" y="140" fill="var(--text-primary)" font-size="10" font-weight="600" text-anchor="middle" font-family="sans-serif">${product.categoryName}</text>
        <text x="130" y="94" fill="${product.themeColor}" font-size="10" font-weight="700" text-anchor="middle" font-family="sans-serif">HUB</text>

        <circle cx="370" cy="90" r="28" fill="${product.themeColor}" opacity="0.15" />
        <circle cx="370" cy="90" r="22" fill="var(--bg-secondary)" stroke="${product.themeColor}" stroke-width="2.5" />
        <text x="370" y="140" fill="var(--text-primary)" font-size="10" font-weight="700" text-anchor="middle" font-family="sans-serif">${product.name}</text>
      </svg>
    `;
  }

  function renderRelatedProducts(product) {
    const grid = document.getElementById("detail-related-grid");
    if (!grid) return;

    const list = window.AppData.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);

    if (list.length === 0) {
      grid.innerHTML = `<div class="no-results-state" style="grid-column: span 3;">Các tool AI liên kết đang được phát triển...</div>`;
      return;
    }

    let gridHtml = "";
    list.forEach(prod => {
      gridHtml += `
        <div class="product-card" style="--product-theme-color: ${prod.themeColor}">
          <div class="card-header-info">
            <div class="card-logo-box">
              ${getCategoryIconSvg(prod.category)}
            </div>
            <div class="card-platform-tags">
              ${prod.platforms.map(plat => `<span class="platform-tag">${plat}</span>`).join("")}
            </div>
          </div>
          <div class="card-body-info">
            <span class="card-category">${prod.categoryName}</span>
            <h4 class="card-title">${prod.name}</h4>
            <p class="card-desc">${prod.tagline}</p>
          </div>
          <div class="card-pricing-wrap">
            <div class="card-price-display">
              <span class="card-price-amount">$${prod.priceMonthly}/tháng</span>
            </div>
            <a href="#/product/${prod.id}" class="btn btn-secondary btn-sm flex-center">Chi tiết</a>
          </div>
        </div>
      `;
    });

    grid.innerHTML = gridHtml;
  }

  // ==========================================================================
  // SHOPPING CART DRAWER RENDERING
  // ==========================================================================
  function updateCartUI() {
    const cartItemsList = document.getElementById("cart-drawer-items-list");
    const headerCount = document.getElementById("header-cart-badge-count");
    const subtotalText = document.getElementById("cart-subtotal-display");
    const totalText = document.getElementById("cart-total-display");
    const discountText = document.getElementById("cart-discount-display");
    const discountRow = document.getElementById("cart-discount-row");
    const couponAppliedTag = document.getElementById("cart-applied-coupon-tag");

    if (!cartItemsList) return;

    const items = window.Store.getCartItems();
    const count = window.Store.getCount();

    if (headerCount) {
      headerCount.innerText = count.toString();
      headerCount.style.display = count > 0 ? "flex" : "none";
    }

    if (count === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart-state">
          <svg class="empty-cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <h4>Giỏ hàng đang trống</h4>
        </div>
      `;
      subtotalText.innerText = "$0";
      totalText.innerText = "$0";
      if (discountRow) discountRow.style.display = "none";
      if (couponAppliedTag) couponAppliedTag.style.display = "none";
      
      const checkoutBtn = document.getElementById("cart-drawer-checkout-btn");
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    let listHtml = "";
    items.forEach(item => {
      listHtml += `
        <div class="cart-item-row" style="--product-theme-color: ${item.themeColor}">
          <div class="cart-item-logo">
            ${getCategoryIconSvg(item.category)}
          </div>
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.name}</h5>
            <span class="cart-item-license">${item.license === 'lifetime' ? 'Lifetime trọn đời' : 'Thuê bao tháng'}</span>
            <div class="cart-item-price-actions">
              <span class="cart-item-price">$${item.price}</span>
              <button onclick="window.App.removeItemCart('${item.id}', '${item.license}')" class="cart-item-remove-btn">Gỡ bỏ</button>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsList.innerHTML = listHtml;

    const subtotal = window.Store.getSubtotal();
    const discount = window.Store.getDiscountAmount();
    const total = window.Store.getTotal();

    subtotalText.innerText = `$${subtotal}`;
    totalText.innerText = `$${total}`;

    const code = window.Store.getCouponCode();
    if (code) {
      if (discountRow) {
        discountRow.style.display = "flex";
        discountText.innerText = `-$${discount.toFixed(0)}`;
      }
      if (couponAppliedTag) {
        couponAppliedTag.style.display = "inline-flex";
        couponAppliedTag.innerHTML = `
          <span>Mã ${code} (Giảm 50%)</span>
          <button onclick="window.Store.removeCoupon();" style="margin-left:6px; color:var(--pink);">×</button>
        `;
      }
    } else {
      if (discountRow) discountRow.style.display = "none";
      if (couponAppliedTag) couponAppliedTag.style.display = "none";
    }

    const checkoutBtn = document.getElementById("cart-drawer-checkout-btn");
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  function quickAddCart(productId, licenseType = "monthly") {
    const res = window.Store.addItem(productId, licenseType);
    if (res.status === "added") {
      showToast(`Đã thêm "${res.product.name}" vào giỏ hàng!`, "success");
    } else {
      showToast(`Sản phẩm đã có sẵn trong giỏ hàng.`, "info");
    }
    closeQuickViewModal();
    if (window.SpherePanels) window.SpherePanels.closePanel();
    openCartDrawer();
  }

  function removeItemCart(productId, licenseType) {
    const success = window.Store.removeItem(productId, licenseType);
    if (success) {
      showToast("Đã gỡ sản phẩm khỏi giỏ hàng.", "info");
    }
  }

  function handlePromoCodeApply() {
    const input = document.getElementById("cart-promo-input");
    if (!input || input.value.trim() === "") return;

    const res = window.Store.applyCoupon(input.value);
    if (res.success) {
      showToast(res.message, "success");
      input.value = "";
    } else {
      showToast(res.message, "error");
    }
  }

  // ==========================================================================
  // CHECKOUT PAGE LOGIC
  // ==========================================================================
  function initCheckoutPage() {
    renderCheckoutSummary();
    
    const methods = document.querySelectorAll(".payment-method-card");
    methods.forEach(card => {
      card.onclick = (e) => {
        methods.forEach(c => c.classList.remove("active"));
        e.currentTarget.classList.add("active");
      };
    });

    const form = document.getElementById("checkout-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        submitCheckoutForm();
      };
    }
  }

  function renderCheckoutSummary() {
    const container = document.getElementById("checkout-items-list-summary");
    const subtotalText = document.getElementById("checkout-subtotal-display");
    const discountText = document.getElementById("checkout-discount-display");
    const discountRow = document.getElementById("checkout-discount-row");
    const totalText = document.getElementById("checkout-total-display");

    if (!container) return;

    const items = window.Store.getCartItems();
    const count = window.Store.getCount();

    if (count === 0) {
      window.location.hash = "#/store";
      return;
    }

    let summaryHtml = "";
    items.forEach(item => {
      summaryHtml += `
        <div class="cart-item-row" style="padding:10px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${item.themeColor}">
          <div class="cart-item-logo" style="width:36px; height:36px;">
            ${getCategoryIconSvg(item.category)}
          </div>
          <div class="cart-item-details">
            <h6 class="cart-item-title" style="font-size:0.85rem;">${item.name}</h6>
            <span class="cart-item-license" style="font-size:0.7rem;">${item.license === 'lifetime' ? 'Lifetime trọn đời' : 'Thuê bao tháng'}</span>
          </div>
          <span style="font-family:var(--font-heading); font-size:0.9rem; font-weight:700;">$${item.price}</span>
        </div>
      `;
    });

    container.innerHTML = summaryHtml;

    const subtotal = window.Store.getSubtotal();
    const discount = window.Store.getDiscountAmount();
    const total = window.Store.getTotal();

    subtotalText.innerText = `$${subtotal}`;
    totalText.innerText = `$${total}`;

    const code = window.Store.getCouponCode();
    if (code) {
      discountRow.style.display = "flex";
      discountText.innerText = `-$${discount.toFixed(0)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  function submitCheckoutForm() {
    const fullName = document.getElementById("checkout-name").value.trim();
    const email = document.getElementById("checkout-email").value.trim();

    if (fullName === "" || email === "") {
      showToast("Vui lòng điền đầy đủ Tên và Email nhận sản phẩm.", "error");
      return;
    }

    const invoiceId = "SZ-" + Math.floor(Math.random() * 900000 + 100000);
    const orderItems = window.Store.getCartItems();
    
    const keysHtml = orderItems.map(item => {
      const key = Array.from({length: 4}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join("-");
      return `
        <div style="padding: 12px; background:rgba(255,255,255,0.03); border:1px solid var(--border-soft); border-radius:6px; margin-top:8px;">
          <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">${item.name} (${item.license.toUpperCase()})</div>
          <div style="font-family:monospace; font-size:1.1rem; color:var(--cyan); margin-top:4px; letter-spacing:0.05em; font-weight:700;">${key}</div>
        </div>
      `;
    }).join("");

    const modal = document.getElementById("checkout-success-modal");
    const detailsContainer = document.getElementById("checkout-success-details");
    
    detailsContainer.innerHTML = `
      <div style="text-align:center; margin-bottom:20px;">
        <span style="font-size:3.5rem;">🎉</span>
        <h4 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--green); margin-top:10px;">Thanh toán thành công!</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:6px;">Mã đơn hàng: <strong class="text-cyan">${invoiceId}</strong></p>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">Thông tin kích hoạt đã được gửi tới: <strong>${email}</strong></p>
      </div>
      <div style="margin-bottom:16px;">
        <span style="font-size:0.9rem; font-weight:600; color:var(--text-primary);">License Keys kích hoạt:</span>
        ${keysHtml}
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.4; border-top:1px solid var(--border-soft); padding-top:12px;">
        * Đây là website giả lập, không có giao dịch thật xảy ra.
      </div>
    `;

    modal.classList.add("active");
    window.Store.clearCart();
  }

  function closeCheckoutSuccessModal() {
    const modal = document.getElementById("checkout-success-modal");
    modal.classList.remove("active");
    window.location.hash = "#/";
  }

  // ==========================================================================
  // EXTRA MODULE PAGES
  // ==========================================================================
  function initContactPage() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name").value.trim();
      const msg = document.getElementById("contact-message").value.trim();
      
      if (name === "" || msg === "") {
        showToast("Vui lòng nhập Tên và Nội dung liên hệ.", "error");
        return;
      }

      showToast("Gửi tin nhắn liên hệ thành công!", "success");
      form.reset();
      
      const chatConsole = document.getElementById("contact-chat-bot-response");
      if (chatConsole) {
        chatConsole.style.display = "block";
        chatConsole.innerHTML = `
          <div class="console-line console-line-success" style="font-family:monospace; font-size:0.85rem; padding:12px; background:rgba(52,211,153,0.06); border:1px solid var(--green); border-radius:6px; line-height:1.5;">
            <strong>[KDG Assistant]:</strong> Chào ${name}! AI đã định tuyến tin nhắn của bạn sang trạm hỗ trợ kỹ thuật.
          </div>
        `;
      }
    };
  }

  function initFaqPage() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach(item => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      
      header.onclick = () => {
        const isOpen = item.classList.contains("open");
        
        items.forEach(i => {
          i.classList.remove("open");
          i.querySelector(".accordion-content").style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      };
    });
  }

  // ==========================================================================
  // TOAST SYSTEM
  // ==========================================================================
  function showToast(message, type = "success") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    
    let icon = "";
    if (type === "success") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;stroke:var(--green);"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "error") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;stroke:var(--pink);"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;stroke:var(--cyan);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-closing");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 3000);
  }

  // Helpers
  function getCategoryIconSvg(catId) {
    const cat = window.AppData.categories.find(c => c.id === catId);
    return cat ? cat.icon : "";
  }

  // Expose global methods
  window.App = {
    init,
    openCartDrawer,
    closeCartDrawer,
    openQuickView,
    closeQuickViewModal,
    quickAddCart,
    removeItemCart,
    applyPromoCode: handlePromoCodeApply,
    closeCheckoutSuccessModal,
    showToast,
    cyclePerformanceMode
  };

  // Run initial Setup
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
