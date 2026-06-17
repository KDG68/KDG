/* ==========================================================================
   SOFTZONE TECH UNIVERSE - HUB HUD & UI MANAGER
   ========================================================================== */

(function() {
  let sidePanel, bottomSheet;
  let searchInput, searchResults;
  
  // State lists
  let wishlist = [];
  let recentlyViewed = [];

  function init() {
    sidePanel = document.getElementById("universe-side-panel");
    bottomSheet = document.getElementById("universe-bottom-sheet");
    
    // Load lists from LocalStorage
    loadWishlist();
    loadRecentlyViewed();

    // Setup Minimap click navigator
    setupMinimapClick();

    // Create space dust
    createSpaceDust();
  }

  // ==========================================================================
  // VIEWPORT HUD DISPATCHERS
  // ==========================================================================
  function openPanel(title, html, color = "var(--cyan)", categoryId = null) {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    
    // Construct HTML wrapper
    const headerHtml = `
      <h3 class="side-panel-title" style="color:${color}">${title}</h3>
      <button class="modal-close-btn" onclick="window.UniverseUI.closePanel()" aria-label="Đóng bảng thông tin">×</button>
    `;

    if (isMobile) {
      // Mobile Bottom Sheet
      const sheetHeader = bottomSheet.querySelector(".sheet-handle-bar");
      const sheetBody = document.getElementById("bottom-sheet-body-content");
      
      sheetBody.innerHTML = `
        <div style="padding: 0 20px 20px 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-family:var(--font-heading); font-size:1.3rem; color:${color}">${title}</h3>
            <button class="modal-close-btn" onclick="window.UniverseUI.closePanel()" style="font-size:1.8rem;">×</button>
          </div>
          ${html}
        </div>
      `;

      bottomSheet.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      // Desktop Side Panel
      const panelHeader = sidePanel.querySelector(".side-panel-header");
      const panelBody = sidePanel.querySelector(".side-panel-body");

      panelHeader.innerHTML = headerHtml;
      panelBody.innerHTML = html;
      sidePanel.style.setProperty("--cluster-color", color);
      
      sidePanel.classList.add("active");
    }

    // Update active highlight node states in world
    const nodes = document.querySelectorAll(".space-node");
    nodes.forEach(n => {
      const isSelected = n.getAttribute("data-id") === categoryId || n.getAttribute("id") === categoryId;
      n.classList.toggle("selected", isSelected);
    });
  }

  function closePanel() {
    if (sidePanel) sidePanel.classList.remove("active");
    if (bottomSheet) bottomSheet.classList.remove("active");
    document.body.style.overflow = "";

    // Reset visual nodes
    const nodes = document.querySelectorAll(".space-node");
    nodes.forEach(n => n.classList.remove("selected"));
  }

  // ==========================================================================
  // WISHLIST & RECENTLY VIEWED OPERATIONS
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
      window.App.showToast("Đã xóa khỏi danh sách yêu thích.", "info");
    } else {
      wishlist.push(productId);
      window.App.showToast("Đã thêm vào danh sách yêu thích!", "success");
    }
    localStorage.setItem("softzone_wishlist", JSON.stringify(wishlist));
    
    // Auto refresh active panel if displaying wishlist or core
    if (sidePanel.classList.contains("active") || bottomSheet.classList.contains("active")) {
      const activeNode = document.querySelector(".space-node.selected");
      if (activeNode && activeNode.getAttribute("data-id") === "sz-core") {
        openCoreCommandCenter();
      }
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
    recentlyViewed.unshift(productId); // Add to top
    recentlyViewed = recentlyViewed.slice(0, 5); // Keep last 5
    localStorage.setItem("softzone_recently_viewed", JSON.stringify(recentlyViewed));
  }

  // ==========================================================================
  // DEMO SIMULATORS DISPATCHERS (15 TRẠM SATELLITE)
  // ==========================================================================
  function openSatellitePanel(satellite) {
    const products = window.AppData.products.filter(p => satellite.relatedProducts.includes(p.id));
    
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

    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">${satellite.desc}</p>
      
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:10px; margin-bottom:10px;">Chạy thử Demo tại trạm:</h4>
      ${window.UniverseDemos.renderDemo(satellite.demoType)}

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px;">Phần mềm liên quan trong khu vực:</h4>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${productsHtml || `<div class="sr-only"></div><p style="font-size:0.8rem; color:var(--text-muted);">Đang bổ sung sản phẩm...</p>`}
      </div>
      
      <a href="#/store?category=${satellite.sector}" class="btn btn-outline btn-sm flex-center" style="margin-top:12px; width:100%; border-color:${satellite.color}; color:${satellite.color}">
        Khám phá Danh mục
      </a>
    `;

    openPanel(satellite.title, html, satellite.color, satellite.id);
    
    // Bind demo actions
    window.UniverseDemos.bindDemo(satellite.demoType);
  }

  // ==========================================================================
  // SOFTZONE CORE COMMAND CENTER
  // ==========================================================================
  function openCoreCommandCenter() {
    // 1. Featured Releases
    const releases = window.AppData.products.slice(0, 3);
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

    // 2. Wishlist Items
    const wishItems = window.AppData.products.filter(p => wishlist.includes(p.id));
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

    // 3. Recently viewed
    const recentItems = window.AppData.products.filter(p => recentlyViewed.includes(p.id));
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

    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Chào mừng tới Trung tâm Chỉ huy KDG. Quản lý nhanh bộ lọc phễu và theo dõi tài nguyên cửa hàng.</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <a href="#/store" class="btn btn-cyan btn-sm flex-center" style="font-size:0.8rem; padding:8px;">Tất cả sản phẩm</a>
        <a href="#/store?sort=rating" class="btn btn-outline btn-sm flex-center" style="font-size:0.8rem; padding:8px; border-color:var(--purple); color:var(--purple);">Đánh giá tốt</a>
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px;">Phần mềm mới cập nhật:</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${releasesHtml}
      </div>

      ${wishlistHtml ? `
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px;">Sản phẩm yêu thích (${wishItems.length}):</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${wishlistHtml}
      </div>` : ""}

      ${recentHtml ? `
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px;">Xem gần đây:</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${recentHtml}
      </div>` : ""}
    `;

    openPanel("Command Center", html, "#f8fafc", "sz-core");
  }

  // ==========================================================================
  // COMPARE GATE TERMINAL (COMPARE 3 PRODUCTS)
  // ==========================================================================
  let compareList = [];

  function openCompareGate() {
    renderCompareListPanel();
  }

  function renderCompareListPanel() {
    const listHtml = window.AppData.products.map(prod => {
      const isChecked = compareList.includes(prod.id);
      return `
        <label class="filter-checkbox-label" style="padding:8px; border:1px solid var(--border-soft); border-radius:6px; background:rgba(255,255,255,0.01);">
          <input type="checkbox" value="${prod.id}" class="compare-checkbox-select" ${isChecked ? "checked" : ""}>
          <span class="custom-checkbox" style="border-color:${prod.themeColor};"></span>
          <span style="font-size:0.85rem;">${prod.name}</span>
        </label>
      `;
    }).join("");

    const html = `
      <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">Chọn tối đa 3 sản phẩm KDG để so sánh chi tiết tính năng, giá và khả năng tích hợp.</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin: 12px 0 20px;" id="compare-selection-grid">
        ${listHtml}
      </div>

      <button class="btn btn-cyan btn-sm flex-center" id="run-comparison-btn" style="width:100%; background:var(--green); color:var(--bg-deep); font-weight:700;">So sánh cấu hình</button>
      
      <div id="compare-results-table-wrap" style="margin-top:20px; display:none; overflow-x:auto;"></div>
    `;

    openPanel("Compare Gate", html, "#34d399", "util-compare");

    // Bind checkboxes click limit to 3 items max
    const cbs = document.querySelectorAll(".compare-checkbox-select");
    cbs.forEach(cb => {
      cb.addEventListener("change", () => {
        compareList = Array.from(cbs).filter(i => i.checked).map(i => i.value);
        if (compareList.length > 3) {
          cb.checked = false;
          compareList = compareList.filter(id => id !== cb.value);
          window.App.showToast("Bạn chỉ có thể so sánh tối đa 3 sản phẩm.", "error");
        }
      });
    });

    const compareBtn = document.getElementById("run-comparison-btn");
    compareBtn.onclick = () => {
      if (compareList.length < 2) {
        window.App.showToast("Vui lòng chọn ít nhất 2 sản phẩm để tiến hành so sánh.", "error");
        return;
      }
      
      renderCompareResults();
    };
  }

  function renderCompareResults() {
    const wrap = document.getElementById("compare-results-table-wrap");
    const compareProducts = window.AppData.products.filter(p => compareList.includes(p.id));

    let headersHtml = `<th>Thông số</th>`;
    let priceHtml = `<td>Giá hàng tháng</td>`;
    let lifetimeHtml = `<td>Giá trọn đời</td>`;
    let ratingHtml = `<td>Đánh giá</td>`;
    let osHtml = `<td>Hệ điều hành</td>`;
    let actionHtml = `<td>Hành động</td>`;

    compareProducts.forEach(prod => {
      headersHtml += `<th style="color:${prod.themeColor}">${prod.name}</th>`;
      priceHtml += `<td>$${prod.priceMonthly}</td>`;
      lifetimeHtml += `<td>${prod.priceLifetime ? `$${prod.priceLifetime}` : "N/A"}</td>`;
      ratingHtml += `<td>⭐ ${prod.rating}/5.0</td>`;
      osHtml += `<td style="font-size:0.75rem;">${prod.requirements.os}</td>`;
      actionHtml += `
        <td>
          <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm flex-center" style="font-size:0.7rem; padding:6px 10px; width:100%;">+ Giỏ hàng</button>
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
    
    // Style tables programmatically
    const cells = wrap.querySelectorAll("th, td");
    cells.forEach(c => {
      c.style.padding = "8px";
      c.style.border = "1px solid var(--border-soft)";
    });
  }

  // ==========================================================================
  // SUPPORT BEACON STATION (MINI FAQ & CONTACT FORM)
  // ==========================================================================
  function openSupportBeacon() {
    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Gặp sự cố kích hoạt key hoặc cài đặt? Xem FAQ nhanh hoặc gửi tin nhắn cứu hộ bảo mật.</p>
      
      <!-- Mini FAQ accordion -->
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:16px;">Hỏi đáp FAQ nhanh:</h4>
      <div style="display:flex; flex-direction:column; border:1px solid var(--border-soft); border-radius:8px; background:rgba(255,255,255,0.01);">
        <div style="padding:12px; border-bottom:1px solid var(--border-soft);">
          <strong style="font-size:0.8rem; color:var(--text-primary); display:block; margin-bottom:4px;">Q: Làm thế nào nhận Key kích hoạt?</strong>
          <span style="font-size:0.75rem; color:var(--text-secondary);">Hệ thống sinh License Key tự động và gửi kèm link tải ngay sau khi thanh toán thành công.</span>
        </div>
        <div style="padding:12px;">
          <strong style="font-size:0.8rem; color:var(--text-primary); display:block; margin-bottom:4px;">Q: Bản Lifetime hỗ trợ bao nhiêu máy?</strong>
          <span style="font-size:0.75rem; color:var(--text-secondary);">Gói Lifetime hỗ trợ kích hoạt chạy độc lập tối đa trên 3 máy tính cá nhân.</span>
        </div>
      </div>

      <!-- Contact form -->
      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-top:20px; margin-bottom:10px;">Gửi tin nhắn hỗ trợ kỹ thuật:</h4>
      <div class="demo-stage-wrapper">
        <div class="form-group" style="margin-bottom:10px;">
          <input type="text" class="form-control" id="support-hud-name" placeholder="Họ và tên của bạn" style="padding:6px 12px; font-size:0.8rem;">
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <textarea class="form-control" id="support-hud-msg" rows="2" placeholder="Nội dung lỗi gặp phải..." style="font-size:0.8rem; padding:6px 12px; resize:none;"></textarea>
        </div>
        <button class="btn btn-purple btn-sm" id="support-hud-submit-btn" style="background:var(--purple); width:100%;">Gửi cứu hộ</button>
        <div class="demo-output-terminal" id="support-hud-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
      </div>
    `;

    openPanel("Support Beacon", html, "#8b5cf6", "util-support");

    // Bind submit contact
    const btn = document.getElementById("support-hud-submit-btn");
    const nameInput = document.getElementById("support-hud-name");
    const msgInput = document.getElementById("support-hud-msg");
    const output = document.getElementById("support-hud-output");

    btn.onclick = () => {
      const name = nameInput.value.trim();
      const msg = msgInput.value.trim();
      if (name === "" || msg === "") {
        window.App.showToast("Vui lòng điền đủ Tên và Nội dung cần hỗ trợ.", "error");
        return;
      }

      output.style.display = "block";
      output.innerHTML = `Đang phân luồng request và chuyển tiếp kỹ sư...`;
      
      setTimeout(() => {
        output.innerHTML = `
          <span style="color:var(--green);">[THÀNH CÔNG] Đã định tuyến hỗ trợ:</span><br>
          Mã số: <strong>SZ-FAQ-${Math.floor(Math.random()*9000+1000)}</strong><br>
          Chào <strong>${name}</strong>, AI Agent đã gán ticket của bạn cho phòng kỹ thuật. Hồi âm sẽ được gửi tới Email của bạn trong 15 phút.
        `;
        nameInput.value = "";
        msgInput.value = "";
      }, 700);
    };
  }

  // ==========================================================================
  // SEARCH SATELLITE (UNIVERSAL SEARCH & CAMERA FOCUS PAN)
  // ==========================================================================
  function openSearchSatellite() {
    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Nhập tên sản phẩm hoặc trạm để camera tự động pan-zoom tập trung định vị.</p>
      
      <div class="search-bar-wrap" style="max-width:100%; margin: 12px 0 20px;">
        <svg class="search-icon-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="search-input-field" id="hud-search-input" placeholder="Tìm 'coding', 'chatbot', 'Kanban'...">
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-bottom:10px;">Kết quả tìm kiếm:</h4>
      <div style="display:flex; flex-direction:column; gap:8px;" id="hud-search-results-list">
        <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">Nhập từ khóa để quét tín hiệu...</div>
      </div>
    `;

    openPanel("Search Satellite", html, "#3b82f6", "util-search");

    const input = document.getElementById("hud-search-input");
    const list = document.getElementById("hud-search-results-list");

    input.focus();
    input.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q === "") {
        list.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">Nhập từ khóa để quét tín hiệu...</div>`;
        return;
      }

      // Filter satellites + sectors + products
      const matchedObjects = window.UniverseData.objects.filter(obj => 
        obj.title.toLowerCase().includes(q) || 
        obj.desc.toLowerCase().includes(q) ||
        (obj.demoType && obj.demoType.toLowerCase().includes(q))
      );

      if (matchedObjects.length === 0) {
        list.innerHTML = `<div style="font-size:0.8rem; color:var(--text-pink); text-align:center; padding:12px;">Không tìm thấy tín hiệu tương thích.</div>`;
        return;
      }

      list.innerHTML = matchedObjects.map(obj => `
        <div onclick="window.UniverseUI.focusAndOpenNode('${obj.id}')" style="padding:10px; border:1px solid var(--border-soft); border-radius:6px; background:rgba(255,255,255,0.02); cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${obj.title}</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">Tọa độ: (${obj.x}, ${obj.y})</div>
          </div>
          <span style="font-size:0.7rem; font-weight:700; color:${obj.color}; text-transform:uppercase;">Focus</span>
        </div>
      `).join("");
    });
  }

  function focusAndOpenNode(nodeId) {
    const obj = window.UniverseData.objects.find(o => o.id === nodeId);
    if (!obj) return;

    // Smooth-pan camera focus on coord
    if (window.UniversePanZoom && typeof window.UniversePanZoom.focusOn === "function") {
      window.UniversePanZoom.focusOn(obj.x, obj.y, 1.2);
    }

    // Delay a bit and trigger panel content load
    setTimeout(() => {
      if (obj.action === "focus-sector") {
        // Redraw sector information panel
        const cat = window.AppData.categories.find(c => c.id === obj.sector);
        if (cat) renderSectorPanel(cat);
      } else if (obj.action === "demo-panel") {
        openSatellitePanel(obj);
      } else if (obj.action === "command-center") {
        openCoreCommandCenter();
      } else if (obj.action === "util-compare") {
        openCompareGate();
      } else if (obj.action === "util-support") {
        openSupportBeacon();
      } else if (obj.action === "util-cart") {
        window.App.openCartDrawer();
      } else if (obj.action === "util-wishlist") {
        openWishlistPanel();
      }
    }, 700);
  }

  function openWishlistPanel() {
    const wishItems = window.AppData.products.filter(p => wishlist.includes(p.id));
    const itemsHtml = wishItems.map(prod => `
      <div class="cart-item-row" style="padding:10px 0; border-bottom:1px solid var(--border-soft); --product-theme-color: ${prod.themeColor}">
        <div class="cart-item-logo" style="width:36px; height:36px;">
          ${getCategoryIconSvg(prod.category)}
        </div>
        <div class="cart-item-details" style="gap:2px;">
          <h6 class="cart-item-title" style="font-size:0.85rem;">${prod.name}</h6>
          <span class="cart-item-license" style="font-size:0.7rem; color:var(--text-muted);">$${prod.priceMonthly}/tháng</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.UniverseUI.toggleWishlist('${prod.id}')" class="btn btn-secondary btn-sm" style="padding: 4px; width:30px; height:30px; font-size: 1.1rem; color:var(--pink);">×</button>
          <button onclick="window.App.quickAddCart('${prod.id}', 'monthly')" class="btn btn-cyan btn-sm" style="padding: 6px 12px; font-size: 0.75rem;">+ Giỏ</button>
        </div>
      </div>
    `).join("");

    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">Danh sách các công cụ bạn đã đánh dấu yêu thích để dễ dàng mua và so sánh sau này.</p>
      
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
        ${itemsHtml || `<div class="empty-cart-state" style="padding:24px;"><p style="font-size:0.8rem; color:var(--text-muted);">Không có sản phẩm nào trong danh sách yêu thích.</p></div>`}
      </div>
    `;

    openPanel("Danh sách yêu thích", html, "#ec4899", "util-wishlist");
  }

  function renderSectorPanel(category) {
    const categoryProducts = window.AppData.products.filter(p => p.category === category.id).slice(0, 3);
    
    const productsHtml = categoryProducts.map(prod => {
      const isFav = wishlist.includes(prod.id);
      return `
        <div class="product-card" style="--product-theme-color: ${prod.themeColor}">
          <div class="card-header-info">
            <div class="card-logo-box">
              ${getCategoryIconSvg(prod.category)}
            </div>
            <button onclick="window.UniverseUI.toggleWishlist('${prod.id}')" style="color:${isFav ? 'var(--pink)' : 'var(--text-muted)'}; font-size: 1.15rem; padding: 4px;" aria-label="Yêu thích">
              ${isFav ? '❤️' : '🤍'}
            </button>
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
    }).join("");

    const html = `
      <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:12px;">${category.desc}</p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
        <button onclick="window.UniverseUI.jumpToSimulator('${category.id}')" class="btn btn-outline btn-sm flex-center" style="border-color:${category.color}; color:${category.color};">Mô phỏng Workflow</button>
        <a href="#/store?category=${category.id}" class="btn btn-primary btn-sm flex-center" style="background:${category.color}; color:var(--bg-deep);">Khám phá Cửa hàng</a>
      </div>

      <h4 class="panel-featured-heading" style="font-size:0.9rem; margin-bottom:12px;">Sản phẩm nổi bật trong cụm:</h4>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${productsHtml}
      </div>
    `;

    openPanel(category.name, html, category.color, `sector-${category.id}`);
  }

  function jumpToSimulator(catId) {
    closePanel();
    // Redirect to simulator page
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

  // ==========================================================================
  // HUD MINIMAP COORDS INDICATOR
  // ==========================================================================
  function setupMinimapClick() {
    const mapBox = document.getElementById("minimap-sensor");
    if (!mapBox) return;

    mapBox.onclick = (e) => {
      const rect = mapBox.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Calculate virtual coords in 2000px space
      const scaleX = 2000 / rect.width;
      const scaleY = 2000 / rect.height;
      const virtualX = clickX * scaleX;
      const virtualY = clickY * scaleY;

      // Smooth pan to coords
      if (window.UniversePanZoom && typeof window.UniversePanZoom.focusOn === "function") {
        const trans = window.UniversePanZoom.getTransform();
        window.UniversePanZoom.focusOn(virtualX, virtualY, trans.scale);
      }
    };
  }

  function createSpaceDust() {
    const world = document.getElementById("universe-world");
    if (!world) return;

    const colors = ["var(--cyan)", "var(--purple)", "var(--pink)", "var(--green)", "var(--blue)"];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 40; i++) {
      const dust = document.createElement("div");
      dust.className = "space-dust";

      // Random position in 2000x2000px space
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);

      // Exclude central core area (around 1000, 1000) to keep it clear
      const dx = x - 1000;
      const dy = y - 1000;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) continue; // Skip if too close to core

      const size = Math.random() * 3 + 2; // 2px to 5px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * -20; // negative delay to start immediately
      
      const floatX = (Math.random() * 80 - 40) + "px";
      const floatY = (Math.random() * 80 - 40) + "px";
      const floatScale = (Math.random() * 0.4 + 0.8).toFixed(2);

      dust.style.left = x + "px";
      dust.style.top = y + "px";
      dust.style.setProperty("--size", size + "px");
      dust.style.setProperty("--color", color);
      dust.style.setProperty("--duration", duration + "s");
      dust.style.setProperty("--delay", delay + "s");
      dust.style.setProperty("--float-x", floatX);
      dust.style.setProperty("--float-y", floatY);
      dust.style.setProperty("--float-scale", floatScale);

      fragment.appendChild(dust);
    }

    world.appendChild(fragment);
  }


  function updateMinimap(panX, panY, scale, vWidth, vHeight) {
    const box = document.getElementById("minimap-viewport-box");
    if (!box) return;

    // Minimap SVG size is 144x144. Virtual space 2000x2000.
    const mapScale = 144 / 2000;

    // Viewport relative bounds
    const worldWidth = vWidth / scale;
    const worldHeight = vHeight / scale;
    const worldX = -panX / scale;
    const worldY = -panY / scale;

    // Set coordinates
    box.setAttribute("x", (worldX * mapScale).toString());
    box.setAttribute("y", (worldY * mapScale).toString());
    box.setAttribute("width", (worldWidth * mapScale).toString());
    box.setAttribute("height", (worldHeight * mapScale).toString());
  }

  // Helpers
  function getCategoryIconSvg(catId) {
    const cat = window.AppData.categories.find(c => c.id === catId);
    return cat ? cat.icon : "";
  }

  // Expose methods
  window.UniverseUI = {
    init,
    openPanel,
    closePanel,
    openSatellitePanel,
    openCoreCommandCenter,
    openCompareGate,
    openSupportBeacon,
    openSearchSatellite,
    openWishlistPanel,
    renderSectorPanel,
    focusAndOpenNode,
    toggleWishlist,
    addRecentlyViewed,
    jumpToSimulator,
    updateMinimap
  };
})();
