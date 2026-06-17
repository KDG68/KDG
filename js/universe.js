/* ==========================================================================
   SOFTZONE TECH UNIVERSE - TECH UNIVERSE NAVIGATOR CONTROLLER
   ========================================================================== */

(function() {
  let activeClusterId = null;
  let isMobile = false;
  let initialized = false;

  // Cache DOM
  let universeMap, infoPanel, infoPanelInner, mobileCarousel;
  let desktopNodes = [];

  function init() {
    universeMap = document.getElementById("desktop-universe-map");
    infoPanel = document.getElementById("universe-info-panel");
    mobileCarousel = document.getElementById("mobile-sectors-swiper");
    desktopNodes = document.querySelectorAll(".universe-node");

    if (initialized) {
      selectCluster(activeClusterId || "ai");
      return;
    }

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    initialized = true;

    // Initial load selection
    selectCluster("ai");
  }

  function checkBreakpoint() {
    const wasMobile = isMobile;
    isMobile = window.matchMedia("(max-width: 1023px)").matches;

    if (wasMobile !== isMobile) {
      cleanupEvents();
      setupEvents();
    }
  }

  function cleanupEvents() {
    // Desktop Cleanup
    if (universeMap) {
      universeMap.removeEventListener("mousemove", handleParallax);
      universeMap.removeEventListener("mouseleave", resetParallax);
    }

    desktopNodes.forEach(node => {
      node.removeEventListener("click", handleNodeClick);
      node.removeEventListener("keydown", handleNodeKeydown);
    });

    // Mobile Cleanup
    const mobileCards = document.querySelectorAll(".mobile-sector-card");
    mobileCards.forEach(card => {
      card.removeEventListener("click", handleMobileCardClick);
    });
  }

  function setupEvents() {
    if (isMobile) {
      setupMobileEvents();
    } else {
      setupDesktopEvents();
    }
  }

  // ==========================================================================
  // DESKTOP INTERACTIVITY
  // ==========================================================================
  function setupDesktopEvents() {
    if (!universeMap) return;

    // Mouse parallax for 3D depth
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      universeMap.addEventListener("mousemove", handleParallax);
      universeMap.addEventListener("mouseleave", resetParallax);
    }

    desktopNodes.forEach(node => {
      node.addEventListener("click", handleNodeClick);
      node.addEventListener("keydown", handleNodeKeydown);
    });
  }

  function handleParallax(e) {
    const rect = universeMap.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates (-0.5 to 0.5)
    const normX = x / rect.width;
    const normY = y / rect.height;

    // Apply translation to nodes (subtle shifting)
    desktopNodes.forEach((node, index) => {
      const depth = (index % 3 + 1) * 8; // Different depth for different nodes
      const group = node.querySelector(".node-group");
      if (group) {
        group.style.transform = `translate(${normX * depth}px, ${normY * depth}px)`;
      }
    });

    // Shift background orbits slightly in reverse direction
    const orbits = document.querySelectorAll(".orbit-line");
    orbits.forEach((orbit, index) => {
      const speed = (index + 1) * -4;
      orbit.style.transform = `translate(${normX * speed}px, ${normY * speed}px)`;
    });
  }

  function resetParallax() {
    desktopNodes.forEach(node => {
      const group = node.querySelector(".node-group");
      if (group) {
        group.style.transform = "translate(0px, 0px)";
      }
    });

    const orbits = document.querySelectorAll(".orbit-line");
    orbits.forEach(orbit => {
      orbit.style.transform = "translate(0px, 0px)";
    });
  }

  function handleNodeClick(e) {
    const clusterId = e.currentTarget.getAttribute("data-cluster");
    selectCluster(clusterId);
  }

  function handleNodeKeydown(e) {
    const clusterId = e.currentTarget.getAttribute("data-cluster");
    
    // Accessibility Keyboard Controls
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectCluster(clusterId);
    }
  }

  // ==========================================================================
  // MOBILE INTERACTIVITY
  // ==========================================================================
  function setupMobileEvents() {
    const mobileCards = document.querySelectorAll(".mobile-sector-card");
    mobileCards.forEach(card => {
      card.addEventListener("click", handleMobileCardClick);
    });
  }

  function handleMobileCardClick(e) {
    const clusterId = e.currentTarget.getAttribute("data-cluster");
    selectCluster(clusterId);
    
    // Center clicked card in carousel viewport
    e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  // ==========================================================================
  // SECTOR SELECTION & RENDER
  // ==========================================================================
  function selectCluster(clusterId) {
    if (!clusterId) return;
    activeClusterId = clusterId;

    // Find category info
    const category = window.AppData.categories.find(c => c.id === clusterId);
    if (!category) return;

    // Update Desktop UI states
    desktopNodes.forEach(node => {
      const isSelected = node.getAttribute("data-cluster") === clusterId;
      node.classList.toggle("selected", isSelected);
      node.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    // Update Mobile UI states
    const mobileCards = document.querySelectorAll(".mobile-sector-card");
    mobileCards.forEach(card => {
      const isSelected = card.getAttribute("data-cluster") === clusterId;
      card.classList.toggle("active", isSelected);
    });

    renderModulePanel(category);
  }

  function renderModulePanel(category) {
    if (!infoPanel) return;

    // Get 3 featured products for this category
    const categoryProducts = window.AppData.products
      .filter(p => p.category === category.id)
      .slice(0, 3);

    // Set panel colors
    infoPanel.style.setProperty("--cluster-color", category.color);
    infoPanel.style.setProperty("--cluster-color-rgb", category.colorRgb);

    // Build Product Cards HTML inside panel
    let productsHtml = "";
    if (categoryProducts.length > 0) {
      categoryProducts.forEach(prod => {
        productsHtml += `
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
                ${prod.oldPrice ? `<span class="card-price-discount">$${prod.oldPrice}</span>` : ""}
              </div>
              <span class="card-license-label">Bản quyền số</span>
            </div>
            <div class="card-actions">
              <a href="#/product/${prod.id}" class="btn btn-secondary btn-sm flex-center">Chi tiết</a>
              <button onclick="event.preventDefault(); window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm flex-center">
                Mua ngay
              </button>
            </div>
          </div>
        `;
      });
    } else {
      productsHtml = `<div class="no-results-state">Sản phẩm hệ sinh thái đang được phát triển...</div>`;
    }

    // Build Feature badges
    const featuresHtml = category.features.map(f => `
      <span class="hero-tag" style="border-color: rgba(${category.colorRgb}, 0.25); background: rgba(${category.colorRgb}, 0.05); color: ${category.color}; font-size: 0.75rem;">
        ${f}
      </span>
    `).join("");

    // Update panel markup
    infoPanel.innerHTML = `
      <div class="module-panel glass-panel">
        <div class="panel-header-wrap">
          <div class="panel-title-area">
            <div class="panel-icon-box" style="border-color: rgba(${category.colorRgb}, 0.2); background: rgba(${category.colorRgb}, 0.03);">
              ${category.icon}
            </div>
            <div>
              <h3 class="panel-title">${category.name}</h3>
              <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
                ${featuresHtml}
              </div>
            </div>
          </div>
          <div style="display:flex; gap:12px;">
            <button onclick="window.UniverseNavigator.jumpToSimulator('${category.id}')" class="btn btn-outline btn-sm flex-center" style="border-color: ${category.color}; color: ${category.color};">
              Mô phỏng Workflow
            </button>
            <button onclick="window.UniverseNavigator.viewCategoryInStore('${category.id}')" class="btn btn-primary btn-sm flex-center">
              Khám phá Danh mục
            </button>
          </div>
        </div>
        <p class="panel-desc" style="margin-bottom: 24px;">${category.desc}</p>
        
        <h4 class="panel-featured-heading">Sản phẩm nổi bật trong cụm</h4>
        <div class="panel-products-grid">
          ${productsHtml}
        </div>
      </div>
    `;

    // Active panel display state
    infoPanel.classList.add("active");
  }

  // Helpers
  function getCategoryIconSvg(catId) {
    const cat = window.AppData.categories.find(c => c.id === catId);
    return cat ? cat.icon : "";
  }

  // Interactive buttons inside panel actions
  function viewCategoryInStore(catId) {
    // Navigate to store route with category query
    window.location.hash = `#/store?category=${catId}`;
  }

  function jumpToSimulator(catId) {
    // Scroll to simulator section
    const simSection = document.getElementById("automation-simulation-section");
    if (simSection) {
      simSection.scrollIntoView({ behavior: "smooth" });
    }

    // Set simulator active template mapping
    let workflowId = "cust-support"; // Default mapping
    if (catId === "automation") workflowId = "marketing-auto";
    else if (catId === "marketing") workflowId = "social-post";
    else if (catId === "data") workflowId = "data-process";
    
    if (window.WorkflowSimulator && typeof window.WorkflowSimulator.selectTemplate === "function") {
      window.WorkflowSimulator.selectTemplate(workflowId);
    }
  }

  // Expose module
  window.UniverseNavigator = {
    init,
    selectCluster,
    viewCategoryInStore,
    jumpToSimulator
  };
})();
