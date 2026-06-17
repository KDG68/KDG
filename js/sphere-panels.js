/* ==========================================================================
   SOFTZONE 3D TECHNOLOGY SPHERE - PANELS CONTROLLER
   ========================================================================== */

(function() {
  let stage, detailPanel, panelHeader, panelBody;
  let wishlist = [];
  let recentlyViewed = [];
  let compareList = [];

  function init() {
    stage = document.getElementById("technology-sphere-stage");
    detailPanel = document.getElementById("sphere-detail-panel");
    panelHeader = document.getElementById("sphere-detail-header");
    panelBody = document.getElementById("sphere-detail-body");

    loadWishlist();
    loadRecentlyViewed();

    // Toggle expand/collapse on mobile bottom sheet drag handle
    const dragHandle = document.getElementById("mobile-drag-handle");
    if (dragHandle) {
      dragHandle.addEventListener("click", () => {
        if (detailPanel && stage) {
          detailPanel.classList.toggle("is-expanded");
          stage.classList.toggle("is-expanded");
        }
      });
      // Support touch gestures on handle to swipe expand/collapse
      let touchStartY = 0;
      dragHandle.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      dragHandle.addEventListener("touchend", (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (diffY > 40 && detailPanel && stage) {
          detailPanel.classList.add("is-expanded"); // Swipe up
          stage.classList.add("is-expanded");
        } else if (diffY < -40 && detailPanel && stage) {
          detailPanel.classList.remove("is-expanded"); // Swipe down
          stage.classList.remove("is-expanded");
        }
      }, { passive: true });
    }
  }

  // ==========================================================================
  // PANEL TRANSITION CONTROL
  // ==========================================================================
  function openPanel(node) {
    if (!stage || !detailPanel) return;

    // 1. Trigger CSS grid columns layout transition
    stage.classList.add("is-panel-open");

    // 2. Render HTML details inside panel
    renderNodeDetails(node);

    // 3. Slide open the details panel
    detailPanel.classList.add("is-open");

    // 4. Add to recently viewed if functional node
    if (node.type === "satellite" || node.type === "sector") {
      addRecentlyViewed(node.id);
    }

    // 5. Update Hash URL route
    window.location.hash = `#/universe/${node.id}`;

    // Auto scroll detail panel body to top
    if (panelBody) panelBody.scrollTop = 0;
  }

  function closePanel() {
    if (!stage || !detailPanel) return;

    // 1. Close panel sliding window & reset mobile states
    detailPanel.classList.remove("is-open");
    detailPanel.classList.remove("is-expanded");
    stage.classList.remove("is-expanded");

    // 2. Collapse grid columns layout
    stage.classList.remove("is-panel-open");

    // 3. Reset connections highlight
    if (window.SphereConnections && typeof window.SphereConnections.highlight === "function") {
      window.SphereConnections.highlight(null);
    }

    // 4. Update route back to universe root
    window.location.hash = `#/universe`;
  }

  // ==========================================================================
  // ROUTING RENDER ROUTINES
  // ==========================================================================
  function renderNodeDetails(node) {
    let headerHtml = "";
    let bodyHtml = "";
    const color = node.color || "var(--cyan)";

    // Setup header
    headerHtml = `
      <h3 class="side-panel-title" style="color:${color}">${node.title}</h3>
      <button class="modal-close-btn" onclick="window.SpherePanels.closePanel()" aria-label="Quay lại vũ trụ">×</button>
    `;

    // Setup body based on action
    if (node.action === "command-center" || node.id === "sz-core") {
      bodyHtml = getCoreCommandCenterHtml();
    } else if (node.action === "focus-sector") {
      const cat = window.AppData ? window.AppData.categories.find(c => c.id === node.sector) : null;
      bodyHtml = getSectorPanelHtml(cat || node);
    } else if (node.action === "demo-panel" || node.type === "satellite") {
      bodyHtml = getSatellitePanelHtml(node);
    } else if (node.action === "util-compare" || node.id === "node-util-compare") {
      bodyHtml = getCompareGateHtml();
    } else if (node.action === "util-support" || node.id === "node-util-support") {
      bodyHtml = getSupportBeaconHtml();
    } else if (node.action === "util-wishlist" || node.id === "node-util-wishlist") {
      bodyHtml = getWishlistPanelHtml();
    } else if (node.action === "util-search" || node.id === "node-util-search") {
      bodyHtml = getSearchPanelHtml();
    } else {
      // Fallback description panel
      bodyHtml = `
        <p style="color:var(--text-secondary); line-height:1.5;">${node.desc || node.description}</p>
        <a href="#/store" class="btn btn-cyan flex-center" style="margin-top:20px; width:100%;">Mở Cửa hàng đầy đủ</a>
      `;
    }

    panelHeader.innerHTML = headerHtml;
    panelBody.innerHTML = bodyHtml;

    // Bind demo handlers if satellite demo
    if (node.action === "demo-panel" && window.UniverseDemos) {
      window.UniverseDemos.bindDemo(node.demoType);
    }

    // Bind sub-element event listeners
    if (node.action === "util-compare") bindCompareEvents();
    if (node.action === "util-support") bindSupportEvents();
  }

  // ==========================================================================
  // STATE MANAGEMENT: WISHLIST & RECENTLY VIEWED
  // ==========================================================================
  function loadWishlist() {
    try {
      const data = localStorage.getItem("softzone_wishlist");
      wishlist = data ? JSON.parse(data) : [];
    } catch (e) {
      wishlist = [];
    }
  }

  function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
      wishlist.splice(idx, 1);
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast("Đã xóa khỏi danh sách yêu thích.", "info");
      }
    } else {
      wishlist.push(productId);
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast("Đã thêm vào danh sách yêu thích!", "success");
      }
    }
    localStorage.setItem("softzone_wishlist", JSON.stringify(wishlist));

    // Refresh active panel if viewing wishlist/core command center
    const activeNode = document.querySelector(".technology-sphere-stage.is-panel-open");
    if (activeNode) {
      // Re-render
      const urlHash = window.location.hash;
      const nodeId = urlHash.split("/").pop();
      const rawObjects = window.UniverseData ? window.UniverseData.objects : [];
      const node = rawObjects.find(o => o.id === nodeId);
      if (node) renderNodeDetails(node);
    }
  }

  function loadRecentlyViewed() {
    try {
      const data = localStorage.getItem("softzone_recently_viewed");
      recentlyViewed = data ? JSON.parse(data) : [];
    } catch (e) {
      recentlyViewed = [];
    }
  }

  function addRecentlyViewed(productId) {
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    recentlyViewed.unshift(productId);
    recentlyViewed = recentlyViewed.slice(0, 5);
    localStorage.setItem("softzone_recently_viewed", JSON.stringify(recentlyViewed));
  }

  // ==========================================================================
  // HTML PANEL BUILDERS
  // ==========================================================================
  function getCategoryIconSvg(catId) {
    const categories = window.AppData ? window.AppData.categories : [];
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.icon : "";
  }

  function getCoreCommandCenterHtml() {
    const releases = window.AppData ? window.AppData.products.slice(0, 3) : [];
    const releasesHtml = releases.map(prod => `
      <div class="cart-item-row" style="padding:10px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:36px; height:36px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details" style="gap:2px;">
          <h6 class="cart-item-title" style="font-size:0.85rem;">${prod.name}</h6>
          <span class="cart-item-license" style="font-size:0.7rem; color:var(--product-theme-color); font-weight:600;">${prod.categoryName}</span>
        </div>
        <a href="#/product/${prod.id}" class="btn btn-secondary btn-sm" style="padding: 6px 12px; font-size: 0.75rem;">Xem</a>
      </div>
    `).join("");

    const wishItems = window.AppData ? window.AppData.products.filter(p => wishlist.includes(p.id)) : [];
    const wishlistHtml = wishItems.map(prod => `
      <div class="cart-item-row" style="padding:8px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:32px; height:32px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details">
          <h6 class="cart-item-title" style="font-size:0.8rem;">${prod.name}</h6>
        </div>
        <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm" style="padding: 4px 10px; font-size: 0.7rem;">+ Giỏ</button>
      </div>
    `).join("");

    const recentItems = window.AppData ? window.AppData.products.filter(p => recentlyViewed.includes(p.id)) : [];
    const recentHtml = recentItems.map(prod => `
      <div class="cart-item-row" style="padding:8px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:32px; height:32px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details">
          <h6 class="cart-item-title" style="font-size:0.8rem;">${prod.name}</h6>
        </div>
        <a href="#/product/${prod.id}" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.7rem;">Xem</a>
      </div>
    `).join("");

    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Chào mừng tới Trung tâm Chỉ huy KDG. Quản lý nhanh bộ lọc phễu và theo dõi tài nguyên cửa hàng.</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <a href="#/store" class="btn btn-cyan btn-sm flex-center" style="font-size:0.8rem; padding:8px;">Tất cả sản phẩm</a>
        <a href="#/store?sort=rating" class="btn btn-outline btn-sm flex-center" style="font-size:0.8rem; padding:8px; border-color:var(--purple); color:var(--purple);">Đánh giá tốt</a>
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px; color:var(--cyan);">Phần mềm mới cập nhật:</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${releasesHtml}
      </div>

      ${wishlistHtml ? `
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px; color:var(--pink);">Sản phẩm yêu thích (${wishItems.length}):</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${wishlistHtml}
      </div>` : ""}

      ${recentHtml ? `
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px; color:var(--violet);">Xem gần đây:</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${recentHtml}
      </div>` : ""}
    `;
  }

  function getSectorPanelHtml(category) {
    const products = window.AppData ? window.AppData.products.filter(p => p.category === category.id).slice(0, 3) : [];
    
    const productsHtml = products.map(prod => {
      const isFav = wishlist.includes(prod.id);
      return `
        <div class="product-card" style="--product-theme-color: ${prod.themeColor}; border: 1px solid var(--border-soft); border-radius:12px; margin-bottom:12px; overflow:hidden; background:rgba(255,255,255,0.01);">
          <div class="card-header-info" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border-soft);">
            <div class="card-logo-box" style="width:28px; height:28px;">
              ${getCategoryIconSvg(prod.category)}
            </div>
            <button onclick="window.SpherePanels.toggleWishlist('${prod.id}')" style="color:${isFav ? 'var(--pink)' : 'var(--text-muted)'}; font-size: 1.15rem; cursor:pointer;">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>
          <div class="card-body-info" style="padding:16px;">
            <h4 class="card-title" style="font-size:0.95rem; font-weight:700; margin-bottom:4px;">${prod.name}</h4>
            <p class="card-desc" style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">${prod.tagline}</p>
          </div>
          <div class="card-pricing-wrap" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-top: 1px solid var(--border-soft); background:rgba(0,0,0,0.1);">
            <span class="card-price-amount" style="font-size:0.88rem; font-weight:700; color:var(--cyan);">$${prod.priceMonthly}/tháng</span>
            <a href="#/product/${prod.id}" class="btn btn-secondary btn-sm flex-center" style="font-size:0.75rem; padding:6px 12px;">Chi tiết</a>
          </div>
        </div>
      `;
    }).join("");

    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:12px;">${category.desc || category.description}</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
        <button onclick="window.SpherePanels.jumpToSimulator('${category.id}')" class="btn btn-outline btn-sm flex-center" style="border-color:${category.color}; color:${category.color};">Mô phỏng Workflow</button>
        <a href="#/store?category=${category.id}" class="btn btn-primary btn-sm flex-center" style="background:${category.color}; color:var(--bg-deep); font-weight:700;">Khám phá Cửa hàng</a>
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-bottom:12px; color:${category.color};">Sản phẩm nổi bật trong cụm:</h4>
      <div style="display:flex; flex-direction:column;">
        ${productsHtml}
      </div>
    `;
  }

  function getSatellitePanelHtml(satellite) {
    const products = window.AppData ? window.AppData.products.filter(p => satellite.relatedProducts.includes(p.id)) : [];
    
    const productsHtml = products.map(prod => `
      <div class="cart-item-row" style="padding:10px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:36px; height:36px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details" style="gap:2px;">
          <h6 class="cart-item-title" style="font-size:0.85rem;">${prod.name}</h6>
          <span class="cart-item-license" style="font-size:0.7rem;">$${prod.priceMonthly}/tháng</span>
        </div>
        <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm" style="padding: 6px 12px; font-size: 0.75rem;">Mua</button>
      </div>
    `).join("");

    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5; margin-bottom:15px;">${satellite.desc}</p>
      
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:10px; margin-bottom:10px; color:${satellite.color};">Chạy thử Demo tại trạm:</h4>
      ${window.UniverseDemos ? window.UniverseDemos.renderDemo(satellite.demoType) : ""}

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px; color:var(--text-primary);">Phần mềm liên quan trong khu vực:</h4>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${productsHtml || `<p style="font-size:0.8rem; color:var(--text-muted);">Đang bổ sung sản phẩm...</p>`}
      </div>
      
      <a href="#/store?category=${satellite.sector}" class="btn btn-outline btn-sm flex-center" style="margin-top:16px; width:100%; border-color:${satellite.color}; color:${satellite.color}">
        Khám phá Danh mục
      </a>
    `;
  }

  function getCompareGateHtml() {
    const listHtml = window.AppData.products.map(prod => {
      const isChecked = compareList.includes(prod.id);
      return `
        <label class="filter-checkbox-label" style="padding:8px; border:1px solid var(--border-soft); border-radius:6px; background:rgba(255,255,255,0.01); display:flex; align-items:center; gap:8px;">
          <input type="checkbox" value="${prod.id}" class="compare-checkbox-select" ${isChecked ? "checked" : ""}>
          <span class="custom-checkbox" style="border-color:${prod.themeColor};"></span>
          <span style="font-size:0.85rem;">${prod.name}</span>
        </label>
      `;
    }).join("");

    return `
      <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">Chọn tối đa 3 sản phẩm KDG để so sánh chi tiết tính năng, giá và khả năng tích hợp.</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin: 12px 0 20px;" id="compare-selection-grid">
        ${listHtml}
      </div>

      <button class="btn btn-cyan btn-sm flex-center" id="run-comparison-btn" style="width:100%; background:var(--green); color:var(--bg-deep); font-weight:700;">So sánh cấu hình</button>
      
      <div id="compare-results-table-wrap" style="margin-top:20px; display:none; overflow-x:auto;"></div>
    `;
  }

  function bindCompareEvents() {
    const cbs = document.querySelectorAll(".compare-checkbox-select");
    cbs.forEach(cb => {
      cb.addEventListener("change", () => {
        compareList = Array.from(cbs).filter(i => i.checked).map(i => i.value);
        if (compareList.length > 3) {
          cb.checked = false;
          compareList = compareList.filter(id => id !== cb.value);
          if (window.App && typeof window.App.showToast === "function") {
            window.App.showToast("Bạn chỉ có thể so sánh tối đa 3 sản phẩm.", "error");
          }
        }
      });
    });

    const compareBtn = document.getElementById("run-comparison-btn");
    if (compareBtn) {
      compareBtn.onclick = () => {
        if (compareList.length < 2) {
          if (window.App && typeof window.App.showToast === "function") {
            window.App.showToast("Vui lòng chọn ít nhất 2 sản phẩm để tiến hành so sánh.", "error");
          }
          return;
        }
        renderCompareResults();
      };
    }
  }

  function renderCompareResults() {
    const wrap = document.getElementById("compare-results-table-wrap");
    if (!wrap) return;

    const compareProducts = window.AppData.products.filter(p => compareList.includes(p.id));

    let headersHtml = `<th>Thông số</th>`;
    let priceHtml = `<td>Giá tháng</td>`;
    let lifetimeHtml = `<td>Giá Lifetime</td>`;
    let ratingHtml = `<td>Đánh giá</td>`;
    let osHtml = `<td>Nền tảng</td>`;
    let actionHtml = `<td>Mua hàng</td>`;

    compareProducts.forEach(prod => {
      headersHtml += `<th style="color:${prod.themeColor}">${prod.name}</th>`;
      priceHtml += `<td>$${prod.priceMonthly}</td>`;
      lifetimeHtml += `<td>${prod.priceLifetime ? `$${prod.priceLifetime}` : "N/A"}</td>`;
      ratingHtml += `<td>⭐ ${prod.rating}/5.0</td>`;
      osHtml += `<td style="font-size:0.75rem;">${prod.requirements.os}</td>`;
      actionHtml += `
        <td>
          <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm flex-center" style="font-size:0.7rem; padding:6px 10px; width:100%;">+ Giỏ</button>
        </td>
      `;
    });

    wrap.style.display = "block";
    wrap.innerHTML = `
      <table class="compare-table" style="width:100%; border-collapse:collapse; font-size:0.8rem; text-align:left; border:1px solid var(--border-soft);">
        <thead>
          <tr style="background:rgba(255,255,255,0.03); border-bottom:1px solid var(--border-soft);">${headersHtml}</tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--border-soft);">${priceHtml}</tr>
          <tr style="border-bottom:1px solid var(--border-soft);">${lifetimeHtml}</tr>
          <tr style="border-bottom:1px solid var(--border-soft);">${ratingHtml}</tr>
          <tr style="border-bottom:1px solid var(--border-soft);">${osHtml}</tr>
          <tr>${actionHtml}</tr>
        </tbody>
      </table>
    `;

    const cells = wrap.querySelectorAll("th, td");
    cells.forEach(c => {
      c.style.padding = "8px";
      c.style.border = "1px solid var(--border-soft)";
    });
  }

  function getSupportBeaconHtml() {
    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Gặp sự cố kích hoạt key hoặc cài đặt? Xem FAQ nhanh hoặc gửi tin nhắn cứu hộ bảo mật.</p>
      
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:16px; color:var(--purple);">Hỏi đáp FAQ nhanh:</h4>
      <div style="display:flex; flex-direction:column; border:1px solid var(--border-soft); border-radius:8px; background:rgba(255,255,255,0.01); overflow:hidden;">
        <div style="padding:12px; border-bottom:1px solid var(--border-soft);">
          <strong style="font-size:0.8rem; color:var(--text-primary); display:block; margin-bottom:4px;">Q: Làm thế nào nhận Key kích hoạt?</strong>
          <span style="font-size:0.75rem; color:var(--text-secondary);">Hệ thống sinh License Key tự động và gửi kèm link tải ngay sau khi thanh toán thành công.</span>
        </div>
        <div style="padding:12px;">
          <strong style="font-size:0.8rem; color:var(--text-primary); display:block; margin-bottom:4px;">Q: Bản Lifetime hỗ trợ bao nhiêu máy?</strong>
          <span style="font-size:0.75rem; color:var(--text-secondary);">Gói Lifetime hỗ trợ kích hoạt chạy độc lập tối đa trên 3 máy tính cá nhân.</span>
        </div>
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px; color:var(--purple);">Gửi tin nhắn hỗ trợ kỹ thuật:</h4>
      <div class="demo-stage-wrapper">
        <div class="form-group" style="margin-bottom:10px;">
          <input type="text" class="form-control" id="support-hud-name" placeholder="Họ và tên của bạn" style="padding:6px 12px; font-size:0.8rem;">
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <textarea class="form-control" id="support-hud-msg" rows="2" placeholder="Nội dung lỗi gặp phải..." style="font-size:0.8rem; padding:6px 12px; resize:none;"></textarea>
        </div>
        <button class="btn btn-purple btn-sm" id="support-hud-submit-btn" style="background:var(--purple); width:100%; font-weight:600;">Gửi yêu cầu hỗ trợ</button>
        <div class="demo-output-terminal" id="support-hud-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
      </div>
    `;
  }

  function bindSupportEvents() {
    const btn = document.getElementById("support-hud-submit-btn");
    const nameInput = document.getElementById("support-hud-name");
    const msgInput = document.getElementById("support-hud-msg");
    const output = document.getElementById("support-hud-output");

    if (btn) {
      btn.onclick = () => {
        const name = nameInput.value.trim();
        const msg = msgInput.value.trim();
        if (name === "" || msg === "") {
          if (window.App && typeof window.App.showToast === "function") {
            window.App.showToast("Vui lòng điền đủ Tên và Nội dung cần hỗ trợ.", "error");
          }
          return;
        }

        output.style.display = "block";
        output.innerHTML = `Đang gán vé hỗ trợ tự động...`;
        
        setTimeout(() => {
          output.innerHTML = `
            <span style="color:var(--green); font-weight:700;">[THÀNH CÔNG] Đã ghi nhận Ticket:</span><br>
            Mã hỗ trợ: <strong>SZ-FAQ-${Math.floor(Math.random()*9000+1000)}</strong><br>
            Chào <strong>${name}</strong>, AI Agent đã gán ticket cứu hộ bảo mật cho phòng kỹ thuật. Phản hồi sẽ gửi đến email của bạn trong 15 phút.
          `;
          nameInput.value = "";
          msgInput.value = "";
        }, 800);
      };
    }
  }

  function getWishlistPanelHtml() {
    const wishItems = window.AppData ? window.AppData.products.filter(p => wishlist.includes(p.id)) : [];
    const itemsHtml = wishItems.map(prod => `
      <div class="cart-item-row" style="padding:10px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:36px; height:36px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details" style="gap:2px;">
          <h6 class="cart-item-title" style="font-size:0.85rem;">${prod.name}</h6>
          <span class="cart-item-license" style="font-size:0.7rem; color:var(--text-muted);">$${prod.priceMonthly}/tháng</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button onclick="window.SpherePanels.toggleWishlist('${prod.id}')" class="btn btn-secondary btn-sm" style="padding: 4px; width:30px; height:30px; font-size: 1.1rem; color:var(--pink);">×</button>
          <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm" style="padding: 6px 12px; font-size: 0.75rem;">+ Giỏ</button>
        </div>
      </div>
    `).join("");

    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Danh sách các công cụ bạn đã đánh dấu yêu thích để dễ dàng mua và so sánh sau này.</p>
      
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
        ${itemsHtml || `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:0.85rem;">Không có sản phẩm nào trong danh sách yêu thích.</div>`}
      </div>
    `;
  }

  function getSearchPanelHtml() {
    return `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Tìm kiếm nhanh sản phẩm hoặc trạm để camera 3D tự động xoay và zoom định vị.</p>
      
      <div class="search-bar-wrap" style="max-width:100%; margin: 12px 0 20px;">
        <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; color:var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="search-input-field" id="hud-search-input" placeholder="Tìm 'coding', 'chatbot', 'Kanban'..." style="width:100%; padding-left:12px;">
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-bottom:10px; color:var(--cyan);">Kết quả tìm kiếm:</h4>
      <div style="display:flex; flex-direction:column; gap:8px;" id="hud-search-results-list">
        <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">Nhập từ khóa để quét tín hiệu...</div>
      </div>
    `;
  }

  function jumpToSimulator(catId) {
    closePanel();
    // Redirect to home root url then scroll down to simulator
    window.location.hash = `#/`;
    setTimeout(() => {
      const simSection = document.getElementById("automation-simulation-section");
      if (simSection) simSection.scrollIntoView({ behavior: "smooth" });
      
      let workflowId = "cust-support";
      if (catId === "automation") workflowId = "marketing-auto";
      else if (catId === "marketing") workflowId = "social-post";
      else if (catId === "data") workflowId = "data-process";
      
      if (window.WorkflowSimulator && typeof window.WorkflowSimulator.selectTemplate === "function") {
        window.WorkflowSimulator.selectTemplate(workflowId);
      }
    }, 200);
  }

  // Expose
  window.SpherePanels = {
    init,
    openPanel,
    closePanel,
    toggleWishlist,
    addRecentlyViewed,
    jumpToSimulator
  };
})();
