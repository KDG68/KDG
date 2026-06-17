/* ==========================================================================
   SOFTZONE TECH UNIVERSE - CANVAS DATA MODEL
   ========================================================================== */

(function() {
  const sectors = {
    ai: { name: "AI Intelligence", color: "#22d3ee", colorRgb: "34, 211, 238" },
    automation: { name: "Automation Hub", color: "#7c3aed", colorRgb: "124, 58, 237" },
    marketing: { name: "Marketing Network", color: "#ec4899", colorRgb: "236, 72, 153" },
    data: { name: "Data System", color: "#34d399", colorRgb: "52, 211, 153" },
    developer: { name: "Developer Lab", color: "#3b82f6", colorRgb: "59, 130, 246" },
    business: { name: "Business Operations", color: "#8b5cf6", colorRgb: "139, 92, 246" }
  };

  const universeObjects = [
    // --------------------------------------------------------------------------
    // CENTRAL CORE
    // --------------------------------------------------------------------------
    {
      id: "sz-core",
      type: "core",
      title: "KDG Core",
      desc: "Hạt nhân điều phối vũ trụ công nghệ KDG. Click để mở Command Center quản lý bộ lọc nhanh, danh mục, và lịch sử sử dụng hệ thống.",
      x: 1000,
      y: 1000,
      radius: 64,
      color: "#f8fafc",
      action: "command-center",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
    },

    // --------------------------------------------------------------------------
    // SECTORS (MAIN CATEGORY HUBS)
    // --------------------------------------------------------------------------
    {
      id: "sector-ai",
      type: "sector",
      sector: "ai",
      title: "AI Intelligence",
      desc: "Hệ sinh thái ứng dụng Trí tuệ Nhân tạo thông minh. Click để tiếp cận các module AI và vệ tinh tính năng.",
      x: 1000,
      y: 400,
      radius: 46,
      color: "#22d3ee",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"/></svg>`
    },
    {
      id: "sector-automation",
      type: "sector",
      sector: "automation",
      title: "Automation Hub",
      desc: "Hệ thống tự động hóa quy trình nghiệp vụ chuyên nghiệp. Click để thiết lập các workflow và kết nối dữ liệu tự động.",
      x: 1520,
      y: 700,
      radius: 46,
      color: "#7c3aed",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="5" ry="5"/></svg>`
    },
    {
      id: "sector-marketing",
      type: "sector",
      sector: "marketing",
      title: "Marketing Network",
      desc: "Mạng lưới kết nối chiến dịch truyền thông quảng cáo. Click để tối ưu hóa Leads và theo dõi hiệu suất tiếp thị.",
      x: 1520,
      y: 1300,
      radius: 46,
      color: "#ec4899",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/></svg>`
    },
    {
      id: "sector-data",
      type: "sector",
      sector: "data",
      title: "Data System",
      desc: "Trạm điều phối, cào dữ liệu và chuẩn hóa thông tin doanh nghiệp. Click để kích hoạt quy trình trích xuất và lọc nhiễu.",
      x: 1000,
      y: 1600,
      radius: 46,
      color: "#34d399",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/></svg>`
    },
    {
      id: "sector-developer",
      type: "sector",
      sector: "developer",
      title: "Developer Lab",
      desc: "Trung tâm phát triển và tối ưu mã nguồn. Click để tiếp cận các trạm giả lập API, Unit Test và quét bảo mật.",
      x: 480,
      y: 1300,
      radius: 46,
      color: "#3b82f6",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/></svg>`
    },
    {
      id: "sector-business",
      type: "sector",
      sector: "business",
      title: "Business Operations",
      desc: "Số hóa quy trình văn phòng, CRM và quản trị dự án. Click để vận hành các trạm Kanban, tạo hóa đơn tự động.",
      x: 480,
      y: 700,
      radius: 46,
      color: "#8b5cf6",
      action: "focus-sector",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>`
    },

    // --------------------------------------------------------------------------
    // SATELLITES (INTERACTIVE FUNCTIONAL NODES)
    // --------------------------------------------------------------------------
    // 1. AI Satellites
    {
      id: "sat-ai-content",
      type: "satellite",
      sector: "ai",
      title: "AI Content Creator",
      desc: "Vệ tinh tạo văn bản, tiêu đề quảng cáo thông minh dựa trên LLM. Viết thử tiêu đề quảng cáo tức thì ngay tại đây.",
      x: 1000,
      y: 250,
      radius: 22,
      color: "#22d3ee",
      action: "demo-panel",
      demoType: "ai-content",
      relatedProducts: ["synthetix-chatbot", "aetherai-code"]
    },
    {
      id: "sat-ai-chatbot",
      type: "satellite",
      sector: "ai",
      title: "AI Chatbot Agent",
      desc: "Trạm tương tác trực tiếp với khách hàng của Synthetix. Thử nghiệm trò chuyện thời gian thực với AI Agent.",
      x: 1150,
      y: 400,
      radius: 22,
      color: "#22d3ee",
      action: "demo-panel",
      demoType: "ai-chatbot",
      relatedProducts: ["synthetix-chatbot"]
    },
    {
      id: "sat-ai-coding",
      type: "satellite",
      sector: "ai",
      title: "AI Code Optimizer",
      desc: "Trợ lý lập trình AI. Nhập một đoạn code JS cũ để AI tối ưu hóa sang phiên bản mới ngắn gọn và mượt hơn.",
      x: 850,
      y: 400,
      radius: 22,
      color: "#22d3ee",
      action: "demo-panel",
      demoType: "ai-coding",
      relatedProducts: ["aetherai-code"]
    },
    {
      id: "sat-ai-analytics",
      type: "satellite",
      sector: "ai",
      title: "AI Predictive Analytics",
      desc: "Trạm phân tích và vẽ biểu đồ dự toán. Click để chạy mô hình AI mô phỏng dữ liệu tăng trưởng kinh doanh.",
      x: 1000,
      y: 550,
      radius: 22,
      color: "#22d3ee",
      action: "demo-panel",
      demoType: "ai-analytics",
      relatedProducts: ["insightful-analytics"]
    },

    // 2. Automation Satellites
    {
      id: "sat-auto-email",
      type: "satellite",
      sector: "automation",
      title: "Email Automation Stream",
      desc: "Bộ xử lý email phễu tự động. Chạy giả lập gửi email chào mừng dựa trên dữ liệu Lead mới thu thập được.",
      x: 1520,
      y: 550,
      radius: 22,
      color: "#7c3aed",
      action: "demo-panel",
      demoType: "auto-email",
      relatedProducts: ["chronos-automator"]
    },
    {
      id: "sat-auto-social",
      type: "satellite",
      sector: "automation",
      title: "Social Scheduler Dispatcher",
      desc: "Trạm lập lịch và phân phối bài đăng MXH tự động. Chọn nền tảng để giả lập luồng đăng bài tức thì.",
      x: 1670,
      y: 700,
      radius: 22,
      color: "#7c3aed",
      action: "demo-panel",
      demoType: "auto-social",
      relatedProducts: ["omnipost-social"]
    },
    {
      id: "sat-auto-report",
      type: "satellite",
      sector: "automation",
      title: "Automated Report Generator",
      desc: "Trạm tự động hóa tổng hợp báo cáo. Click để chạy quy trình phân tích và trích xuất bảng báo cáo mẫu.",
      x: 1370,
      y: 700,
      radius: 22,
      color: "#7c3aed",
      action: "demo-panel",
      demoType: "auto-report",
      relatedProducts: ["chronos-automator", "insightful-analytics"]
    },

    // 3. Marketing Satellites
    {
      id: "sat-mkt-lead",
      type: "satellite",
      sector: "marketing",
      title: "Lead Generation Pipeline",
      desc: "Mô phỏng phễu thu thập thông tin khách hàng tiềm năng. Click để kích hoạt quy trình ghi nhận Lead.",
      x: 1520,
      y: 1150,
      radius: 22,
      color: "#ec4899",
      action: "demo-panel",
      demoType: "mkt-lead",
      relatedProducts: ["leadscout-b2b", "omnipost-social"]
    },
    {
      id: "sat-mkt-ads",
      type: "satellite",
      sector: "marketing",
      title: "Ads Performance Dashboard",
      desc: "Đo lường hiệu suất chạy quảng cáo. Xem mô phỏng biểu đồ CPC và conversion thu hút khách hàng.",
      x: 1670,
      y: 1300,
      radius: 22,
      color: "#ec4899",
      action: "demo-panel",
      demoType: "mkt-ads",
      relatedProducts: ["leadscout-b2b"]
    },

    // 4. Data Satellites
    {
      id: "sat-data-scrape",
      type: "satellite",
      sector: "data",
      title: "DeepScrape Web Extractor",
      desc: "Trạm thu thập dữ liệu sản phẩm từ web. Chạy thử quy trình cào thông tin giá bán sản phẩm từ 1 link giả lập.",
      x: 850,
      y: 1600,
      radius: 22,
      color: "#34d399",
      action: "demo-panel",
      demoType: "data-scrape",
      relatedProducts: ["deepscrape-data"]
    },
    {
      id: "sat-data-clean",
      type: "satellite",
      sector: "data",
      title: "Data Cleaning Terminal",
      desc: "Bộ xử lý chuẩn hóa dữ liệu. Nhấn chạy để lọc bỏ các dòng dữ liệu trùng lặp hoặc thiếu thông tin.",
      x: 1000,
      y: 1750,
      radius: 22,
      color: "#34d399",
      action: "demo-panel",
      demoType: "data-clean",
      relatedProducts: ["deepscrape-data", "insightful-analytics"]
    },

    // 5. Developer Satellites
    {
      id: "sat-dev-api",
      type: "satellite",
      sector: "developer",
      title: "SecureGuard API Terminal",
      desc: "Giả lập API client/server endpoint. Chạy test request HTTP để kiểm tra tường lửa Rate Limit.",
      x: 480,
      y: 1150,
      radius: 22,
      color: "#3b82f6",
      action: "demo-panel",
      demoType: "dev-api",
      relatedProducts: ["secureguard-api"]
    },
    {
      id: "sat-dev-test",
      type: "satellite",
      sector: "developer",
      title: "Unit Test Automated Suite",
      desc: "Bộ kiểm thử tự động. Nhấn để mô phỏng quy trình kiểm tra mã nguồn chạy 6 test suites thành công.",
      x: 330,
      y: 1300,
      radius: 22,
      color: "#3b82f6",
      action: "demo-panel",
      demoType: "dev-test",
      relatedProducts: ["aetherai-code"]
    },
    {
      id: "sat-dev-security",
      type: "satellite",
      sector: "developer",
      title: "Security Scanner Beacon",
      desc: "Quét lỗ hổng bảo mật. Chạy giả lập audit quét các file hệ thống để phát hiện rủi ro Sql Injection.",
      x: 480,
      y: 1450,
      radius: 22,
      color: "#3b82f6",
      action: "demo-panel",
      demoType: "dev-security",
      relatedProducts: ["secureguard-api"]
    },

    // 6. Business Satellites
    {
      id: "sat-biz-pm",
      type: "satellite",
      sector: "business",
      title: "Task Kanban Board",
      desc: "Giả lập bảng quản lý công việc của Nexus Flow. Click kéo thả và dịch chuyển thẻ công việc qua lại các cột.",
      x: 480,
      y: 550,
      radius: 22,
      color: "#8b5cf6",
      action: "demo-panel",
      demoType: "biz-pm",
      relatedProducts: ["nexus-flow-crm"]
    },

    // --------------------------------------------------------------------------
    // UTILITY STATIONS
    // --------------------------------------------------------------------------
    {
      id: "util-search",
      type: "utility",
      title: "Universal Search Satellite",
      desc: "Trạm tìm kiếm toàn thư viện KDG. Nhập tên sản phẩm, danh mục để quét định vị nhanh trên bản đồ.",
      x: 750,
      y: 750,
      radius: 26,
      color: "#3b82f6",
      action: "util-search",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
    },
    {
      id: "util-cart",
      type: "utility",
      title: "E-Commerce Cart Station",
      desc: "Trạm quản lý giỏ hàng của bạn. Click để xem nhanh các tool đã thêm, nhập mã giảm giá và chuyển tới thanh toán.",
      x: 1250,
      y: 750,
      radius: 26,
      color: "#22d3ee",
      action: "util-cart",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
    },
    {
      id: "util-wishlist",
      type: "utility",
      title: "Wishlist Moon Node",
      desc: "Hành tinh lưu trữ các sản phẩm bạn đã yêu thích. Click để quản lý danh sách yêu thích và chuyển nhanh vào giỏ hàng.",
      x: 750,
      y: 1250,
      radius: 26,
      color: "#ec4899",
      action: "util-wishlist",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
    },
    {
      id: "util-compare",
      type: "utility",
      title: "Compare Gate Terminal",
      desc: "Trạm so sánh tính năng và thông số kỹ thuật. Click để lựa chọn so sánh trực quan tối đa 3 sản phẩm KDG cùng lúc.",
      x: 1250,
      y: 1250,
      radius: 26,
      color: "#34d399",
      action: "util-compare",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
    },
    {
      id: "util-support",
      type: "utility",
      title: "Support Beacon Station",
      desc: "Trạm phát sóng hỗ trợ khách hàng. Click để đọc các câu hỏi thường gặp FAQ hoặc mở hộp thư gửi yêu cầu hỗ trợ kỹ thuật.",
      x: 1000,
      y: 1250,
      radius: 26,
      color: "#8b5cf6",
      action: "util-support",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    }
  ];

  // Helper function to auto validate all objects have useful actions
  function validateSphereNodes() {
    let invalidCount = 0;
    universeObjects.forEach(obj => {
      const hasAction = obj.action || obj.route || obj.demoType;
      if (!hasAction) {
        console.error(`[ERROR] Sphere node "${obj.id}" has no useful action`);
        invalidCount++;
      }
    });
    if (invalidCount === 0) {
      console.log("[INFO] validateSphereNodes: 100% of sphere nodes have useful actions.");
    }
  }

  // Run validation
  validateSphereNodes();

  // Expose to App
  window.UniverseData = {
    sectors: sectors,
    objects: universeObjects
  };
})();
