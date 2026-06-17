/* ==========================================================================
   SOFTZONE TECH UNIVERSE - MOCK DATA
   ========================================================================== */

(function() {
  const categories = [
    {
      id: "ai",
      name: "AI Intelligence",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-10 10c0 4.14 2.52 7.7 6.13 9.17A3 3 0 0 1 11 18v-2a1 1 0 0 0-1-1H9a3 3 0 0 1-3-3v-1h4v1a1 1 0 0 0 1 1h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1V7h2a2 2 0 0 0 2-2V4.5a3 3 0 0 1 2 2.7c0 1.25-.47 2.39-1.24 3.26a1 1 0 0 0-.26.69v2.15a1 1 0 0 0 1 1h2.5a3 3 0 0 1 3 3v2.85A10 10 0 0 0 12 2z"/></svg>`,
      color: "#22d3ee", // Cyan
      colorRgb: "34, 211, 238",
      desc: "Giải pháp trí tuệ nhân tạo thông minh: Chatbot, xử lý ngôn ngữ tự nhiên, phân tích hành vi và tạo nội dung tự động thế hệ mới.",
      productCount: 4,
      features: ["Tích hợp API dễ dàng", "Mô hình LLM tùy chỉnh", "Học sâu thời gian thực"]
    },
    {
      id: "automation",
      name: "Automation Hub",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>`,
      color: "#7c3aed", // Purple
      colorRgb: "124, 58, 237",
      desc: "Trung tâm quản lý các quy trình tự động (RPA). Kết nối dữ liệu, tự động hóa tác vụ lặp đi lặp lại giữa các phần mềm.",
      productCount: 3,
      features: ["Kéo thả trực quan", "Tương thích 200+ ứng dụng", "Chạy ngầm ổn định"]
    },
    {
      id: "marketing",
      name: "Marketing Network",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>`,
      color: "#ec4899", // Pink
      colorRgb: "236, 72, 153",
      desc: "Công cụ tối ưu hóa phễu tiếp thị: Đăng bài tự động, quét dữ liệu khách hàng tiềm năng, gửi email hàng loạt và tối ưu ngân sách quảng cáo.",
      productCount: 3,
      features: ["Hệ thống báo cáo chi tiết", "Phân nhóm khách hàng", "Cá nhân hóa nội dung"]
    },
    {
      id: "data",
      name: "Data System",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V10.125m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V13.875" /></svg>`,
      color: "#34d399", // Green
      colorRgb: "52, 211, 153",
      desc: "Phân tích, xử lý và thu thập dữ liệu tự động. Dễ dàng cào dữ liệu web (scraping), chuẩn hóa dữ liệu lớn và phân tích báo cáo.",
      productCount: 3,
      features: ["Trình thu thập siêu tốc", "Xuất file linh hoạt CSV/Excel", "Chế độ Proxy xoay vòng"]
    },
    {
      id: "developer",
      name: "Developer Lab",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>`,
      color: "#3b82f6", // Blue
      colorRgb: "59, 130, 246",
      desc: "Các công cụ tối ưu quy trình phát triển ứng dụng: Quản lý Docker, giả lập thiết bị, API Gateway, và tự động hóa CI/CD cho lập trình viên.",
      productCount: 3,
      features: ["Hỗ trợ đa ngôn ngữ", "Terminal tích hợp", "Quản lý SSH an toàn"]
    },
    {
      id: "business",
      name: "Business Operations",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H18.5m2.25 2.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 14.15m0 0a2.25 2.25 0 012.25-2.25H5.5m-2.25 2.25A2.25 2.25 0 005.25 12H18.75A2.25 2.25 0 0021 14.15zM18.5 11.9V6a2.25 2.25 0 00-2.25-2.25H7.75A2.25 2.25 0 005.5 6v5.9m13 0h-13m13 0V12m-13 0v.1" /></svg>`,
      color: "#8b5cf6", // Violet
      colorRgb: "139, 92, 246",
      desc: "Số hóa quy trình doanh nghiệp: Quản lý bán hàng CRM, tự động tạo hóa đơn tài chính, phân công công việc thông minh, và lập lịch biểu.",
      productCount: 4,
      features: ["Đồng bộ Cloud đa nền tảng", "Xuất báo cáo thuế tự động", "Phân quyền thành viên sâu"]
    }
  ];

  const products = [
    {
      id: "aetherai-code",
      name: "AetherAI Code Writer",
      category: "developer",
      categoryName: "Developer Lab",
      themeColor: "#3b82f6",
      tagline: "Trợ lý AI lập trình siêu tốc trực tiếp trên editor",
      desc: "AetherAI Code Writer là một công cụ tiện ích mạnh mẽ tích hợp trực tiếp vào môi trường lập trình của bạn. Hỗ trợ tự động hoàn thành dòng mã, giải thích các thuật toán phức tạp, phát hiện lỗ hổng bảo mật và tự động viết test case chỉ trong vài giây.",
      priceMonthly: 29,
      priceLifetime: 299,
      oldPrice: 39,
      rating: 4.8,
      reviewsCount: 142,
      platforms: ["win", "mac", "linux", "web"],
      featured: true,
      label: "Bán Chạy",
      licenseFeatures: [
        "Hoàn thành mã AI thời gian thực",
        "Hỗ trợ 25+ ngôn ngữ lập trình",
        "Phát hiện lỗi bảo mật tức thời",
        "Sinh kiểm thử tự động (Unit Test)",
        "Đồng bộ hóa cấu hình trên Cloud"
      ],
      requirements: {
        os: "Windows 10/11, macOS 11+, Linux Ubuntu 20.04+",
        cpu: "Intel Core i3 hoặc Apple M1 trở lên",
        ram: "Tối thiểu 4GB RAM trống",
        storage: "200MB dung lượng đĩa trống"
      },
      faqs: [
        { q: "AetherAI có hỗ trợ VS Code và JetBrains không?", a: "Có, phần mềm hỗ trợ extension trên tất cả các IDE phổ biến bao gồm VS Code, WebStorm, IntelliJ IDEA, PyCharm và Sublime Text." },
        { q: "Tôi có thể sử dụng ngoại tuyến (offline) không?", a: "Một số tính năng cơ bản có thể lưu cache cục bộ, nhưng để AI sinh mã tối ưu nhất cần có kết nối mạng internet." }
      ]
    },
    {
      id: "synthetix-chatbot",
      name: "Synthetix Smart Chatbot",
      category: "ai",
      categoryName: "AI Intelligence",
      themeColor: "#22d3ee",
      tagline: "Chatbot AI chăm sóc khách hàng 24/7 tự động tối ưu hóa hội thoại",
      desc: "Synthetix sử dụng mô hình ngôn ngữ lớn tùy chỉnh có khả năng hiểu ngữ cảnh tiếng Việt cực tốt. Tự động trả lời câu hỏi thường gặp, tư vấn sản phẩm, chốt đơn hàng và chuyển tiếp thông minh đến nhân viên khi gặp vấn đề phức tạp.",
      priceMonthly: 19,
      priceLifetime: 199,
      oldPrice: 25,
      rating: 4.9,
      reviewsCount: 88,
      platforms: ["web", "android", "ios"],
      featured: true,
      label: "Hot",
      licenseFeatures: [
        "Học máy tự động từ lịch sử tư vấn",
        "Kết nối Facebook, Zalo, Website, Telegram",
        "Không giới hạn số lượng hội thoại",
        "Tự động trích xuất ý định (Intent Extraction)",
        "Giao diện phân tích chỉ số chi tiết"
      ],
      requirements: {
        os: "Chạy trực tiếp trên trình duyệt Web (Chrome, Safari, Edge)",
        cpu: "Không yêu cầu phần cứng thiết bị",
        ram: "Không yêu cầu",
        storage: "Ứng dụng đám mây (SaaS)"
      },
      faqs: [
        { q: "Tôi có cần biết lập trình để cài chatbot không?", a: "Hoàn toàn không. Synthetix cung cấp giao diện kéo thả trực quan để xây dựng kịch bản và cung cấp 1 dòng mã nhúng đơn giản để gắn vào website của bạn." },
        { q: "Hệ thống có tự động nhận diện thông tin khách hàng không?", a: "Có, chatbot có thể tự động nhận diện Số điện thoại, Email và Tên khách hàng từ cuộc hội thoại để lưu trực tiếp vào CRM." }
      ]
    },
    {
      id: "nexus-flow-crm",
      name: "Nexus Flow CRM",
      category: "business",
      categoryName: "Business Operations",
      themeColor: "#8b5cf6",
      tagline: "Hệ thống quản lý khách hàng và tự động hóa quy trình kinh doanh",
      desc: "Nexus Flow giúp đơn giản hóa quy trình bán hàng của doanh nghiệp. Tự động hóa việc phân chia khách hàng tiềm năng cho sale, theo dõi lịch sử tương tác, dự báo doanh thu và quản lý hợp đồng chuyên nghiệp.",
      priceMonthly: 49,
      priceLifetime: 499,
      oldPrice: 65,
      rating: 4.7,
      reviewsCount: 65,
      platforms: ["web", "android", "ios"],
      featured: true,
      label: "Đề Xuất",
      licenseFeatures: [
        "Quản lý phễu bán hàng trực quan",
        "Phân chia Lead tự động cho nhân viên",
        "Theo dõi KPI và doanh số thời gian thực",
        "Tích hợp VOIP gọi điện trực tiếp",
        "Bảo mật dữ liệu chuẩn mã hóa AES-256"
      ],
      requirements: {
        os: "Web App tương thích mọi hệ điều hành. App mobile yêu cầu Android 8.0+ hoặc iOS 13+",
        cpu: "Không yêu cầu đặc biệt",
        ram: "Khuyên dùng 2GB RAM cho thiết bị di động",
        storage: "Không tốn dung lượng máy chủ cục bộ"
      },
      faqs: [
        { q: "Dữ liệu khách hàng của tôi có được bảo mật an toàn?", a: "Có. Nexus Flow lưu trữ trên máy chủ đám mây mã hóa đa lớp, cam kết bảo mật 100% và hỗ trợ xuất bản sao lưu (Backup) bất cứ lúc nào." }
      ]
    },
    {
      id: "omnipost-social",
      name: "OmniPost Social",
      category: "marketing",
      categoryName: "Marketing Network",
      themeColor: "#ec4899",
      tagline: "Tự động lên lịch và đăng bài đa nền tảng mạng xã hội",
      desc: "Tiết kiệm 80% thời gian quản lý mạng xã hội với OmniPost. Chỉ cần biên soạn nội dung một lần, hệ thống sẽ tự động tối ưu hóa định dạng hình ảnh và đăng bài theo lịch trình tối ưu lên Facebook, Instagram, TikTok, LinkedIn và Twitter.",
      priceMonthly: 15,
      priceLifetime: 120,
      oldPrice: 19,
      rating: 4.6,
      reviewsCount: 112,
      platforms: ["win", "mac", "web"],
      featured: false,
      label: "",
      licenseFeatures: [
        "Đăng bài đồng thời lên 5+ MXH",
        "AI gợi ý viết caption và hashtag xu hướng",
        "Lên lịch đăng bài trước hàng tháng",
        "Thống kê tương tác gộp (Omni Analytics)",
        "Quản lý hộp thư bình luận tập trung"
      ],
      requirements: {
        os: "Windows 10+, macOS Catalina+, Chrome/Firefox/Safari",
        cpu: "Intel Core i3 hoặc tương đương",
        ram: "2GB RAM",
        storage: "100MB dung lượng cài đặt"
      },
      faqs: [
        { q: "Tôi có bị khóa tài khoản mạng xã hội khi dùng tool không?", a: "Không. OmniPost sử dụng API chính thức của các nền tảng và mô phỏng hành vi đăng của người dùng thực với độ trễ an toàn để tránh bị đánh dấu spam." }
      ]
    },
    {
      id: "deepscrape-data",
      name: "DeepScrape Data Extractor",
      category: "data",
      categoryName: "Data System",
      themeColor: "#34d399",
      tagline: "Công cụ cào và trích xuất dữ liệu website tự động",
      desc: "DeepScrape giúp thu thập hàng triệu dữ liệu từ bất kỳ website nào (thương mại điện tử, danh bạ doanh nghiệp, mạng xã hội) mà không cần viết code. Khả năng vượt tường lửa Cloudflare, tự động giải mã captcha và xoay proxy liên tục.",
      priceMonthly: 39,
      priceLifetime: 390,
      oldPrice: 49,
      rating: 4.8,
      reviewsCount: 94,
      platforms: ["win", "mac", "linux"],
      featured: true,
      label: "Mới",
      licenseFeatures: [
        "Quét dữ liệu không cần biết viết code",
        "Tự động bypass Captcha và Cloudflare",
        "Tích hợp Proxy xoay vòng miễn phí",
        "Đặt lịch quét dữ liệu tự động hàng ngày",
        "Xuất file Excel, CSV, JSON, Google Sheets"
      ],
      requirements: {
        os: "Windows 10/11 (64-bit), macOS 10.15+, Ubuntu 18.04+",
        cpu: "Intel i5 hoặc AMD Ryzen 5 trở lên",
        ram: "8GB RAM khuyên dùng",
        storage: "500MB trống (cộng thêm dung lượng lưu trữ file kết quả)"
      },
      faqs: [
        { q: "Tool có cào được các trang yêu cầu đăng nhập không?", a: "Có. Trình quét hỗ trợ đăng nhập cookie hoặc tự động điền form đăng nhập trước khi tiến hành thu thập dữ liệu." }
      ]
    },
    {
      id: "chronos-automator",
      name: "Chronos Workflow Automator",
      category: "automation",
      categoryName: "Automation Hub",
      themeColor: "#7c3aed",
      tagline: "Phần mềm RPA thiết lập quy trình tự động hóa máy tính",
      desc: "Giúp máy tính của bạn tự làm việc thay bạn. Thiết lập quy trình tự động click chuột, nhập liệu, mở ứng dụng, tải file, đọc email và xử lý file Excel theo điều kiện logic cực kỳ dễ dàng.",
      priceMonthly: 25,
      priceLifetime: 249,
      oldPrice: 35,
      rating: 4.7,
      reviewsCount: 73,
      platforms: ["win", "mac"],
      featured: false,
      label: "",
      licenseFeatures: [
        "Thiết lập quy trình bằng sơ đồ kéo thả",
        "Mô phỏng click chuột và bàn phím thông minh",
        "Đọc và ghi Excel, SQL siêu tốc",
        "Kích hoạt theo lịch biểu hoặc sự kiện máy tính",
        "Báo lỗi tức thời qua Telegram/Email"
      ],
      requirements: {
        os: "Windows 10/11 (64-bit), macOS 11+",
        cpu: "Intel Core i5 hoặc Apple Silicon M1",
        ram: "4GB RAM",
        storage: "150MB đĩa trống"
      },
      faqs: [
        { q: "Nó có thể chạy ngầm khi tôi đang làm việc khác không?", a: "Có, Chronos hỗ trợ chạy trong môi trường ảo (Background thread) hoặc trên máy chủ ảo VPS mà không chiếm chuột màn hình của bạn." }
      ]
    },
    {
      id: "insightful-analytics",
      name: "Insightful Analytics Engine",
      category: "data",
      categoryName: "Data System",
      themeColor: "#34d399",
      tagline: "Công cụ phân tích dữ liệu kinh doanh và dự báo xu hướng",
      desc: "Insightful tự động chuyển đổi các bảng tính Excel thô và cơ sở dữ liệu cồng kềnh thành các biểu đồ trực quan thông minh. Sử dụng thuật toán dự báo tự động để phân tích xu hướng bán hàng và cảnh báo hàng tồn kho.",
      priceMonthly: 59,
      priceLifetime: 590,
      oldPrice: 79,
      rating: 4.9,
      reviewsCount: 52,
      platforms: ["web"],
      featured: false,
      label: "",
      licenseFeatures: [
        "Tạo Dashboard báo cáo tự động chỉ với 1 click",
        "Thuật toán AI dự báo xu hướng tài chính",
        "Kết nối trực tiếp SQL, Excel, Google Sheets, CRM",
        "Hỗ trợ phân tích dữ liệu đa chiều (Pivot)",
        "Chia sẻ báo cáo bảo mật qua link web"
      ],
      requirements: {
        os: "Hệ thống SaaS chạy trực tiếp trên trình duyệt Web",
        cpu: "Không yêu cầu phần cứng",
        ram: "Không yêu cầu",
        storage: "Lưu trữ đám mây bảo mật"
      },
      faqs: [
        { q: "Insightful có hỗ trợ tiếng Việt không?", a: "Có, toàn bộ giao diện và công cụ phân tích ngôn ngữ tự nhiên để hỏi đáp chỉ số đều hỗ trợ tiếng Việt hoàn toàn." }
      ]
    },
    {
      id: "secureguard-api",
      name: "SecureGuard API Firewall",
      category: "developer",
      categoryName: "Developer Lab",
      themeColor: "#3b82f6",
      tagline: "Tường lửa bảo vệ API và chống tấn công DDoS siêu nhẹ",
      desc: "Bảo vệ hệ thống backend của bạn khỏi các cuộc tấn công DDoS, SQL Injection và quét bot. SecureGuard hoạt động như một reverse proxy siêu nhẹ, lọc các request độc hại trước khi chúng chạm tới máy chủ của bạn.",
      priceMonthly: 35,
      priceLifetime: 349,
      oldPrice: 45,
      rating: 4.8,
      reviewsCount: 41,
      platforms: ["linux"],
      featured: false,
      label: "",
      licenseFeatures: [
        "Lọc request độc hại với độ trễ dưới 1ms",
        "Tự động chặn IP nghi vấn tấn công",
        "Hạn chế tần suất gọi API (Rate Limiting) thông minh",
        "Mã hóa lưu lượng SSL/TLS tự động",
        "Hỗ trợ cấu hình qua giao diện Web UI trực quan"
      ],
      requirements: {
        os: "Linux (Debian 10+, Ubuntu 18.04+, CentOS 8+, Alpine)",
        cpu: "Tối thiểu 1 vCPU",
        ram: "512MB RAM trống",
        storage: "50MB dung lượng cài đặt"
      },
      faqs: [
        { q: "SecureGuard có làm chậm tốc độ phản hồi API không?", a: "Không đáng kể. Phần mềm được viết bằng ngôn ngữ Rust tối ưu cao, chỉ mất trung bình 0.2ms để phân tích và điều phối một request." }
      ]
    },
    {
      id: "leadscout-b2b",
      name: "LeadScout B2B Prospector",
      category: "marketing",
      categoryName: "Marketing Network",
      themeColor: "#ec4899",
      tagline: "Tìm kiếm thông tin liên hệ doanh nghiệp tự động",
      desc: "LeadScout giúp đội ngũ sale tìm kiếm khách hàng doanh nghiệp nhanh chóng. Tự động tìm kiếm email, số điện thoại, link LinkedIn của các nhà quản lý, CEO từ các nguồn dữ liệu công khai trên internet theo ngành nghề.",
      priceMonthly: 49,
      priceLifetime: 499,
      oldPrice: 59,
      rating: 4.7,
      reviewsCount: 81,
      platforms: ["web", "win"],
      featured: false,
      label: "",
      licenseFeatures: [
        "Quét email & SĐT doanh nghiệp theo từ khóa",
        "Xác thực email hoạt động (Email verification) tự động",
        "Tích hợp xuất file lưu thẳng vào CRM",
        "Tìm kiếm theo chức danh và vị trí địa lý",
        "Cập nhật dữ liệu tự động hàng tuần"
      ],
      requirements: {
        os: "Windows 10/11 hoặc chạy Cloud trên Web Browser",
        cpu: "Không yêu cầu",
        ram: "2GB RAM",
        storage: "50MB cài đặt"
      },
      faqs: [
        { q: "Dữ liệu thu thập được có tuân thủ quy định bảo mật GDPR không?", a: "LeadScout chỉ thu thập các thông tin liên hệ được doanh nghiệp công bố công khai trên website và mạng xã hội của họ, đảm bảo tính hợp pháp." }
      ]
    },
    {
      id: "billforge-invoicing",
      name: "BillForge Invoicing",
      category: "business",
      categoryName: "Business Operations",
      themeColor: "#8b5cf6",
      tagline: "Hóa đơn điện tử và thu hồi công nợ tự động",
      desc: "Hệ thống quản lý hóa đơn thông minh dành cho freelancer và doanh nghiệp nhỏ. Tự động tạo hóa đơn chuyên nghiệp, gửi nhắc nhở thanh toán định kỳ khi đến hạn và tích hợp cổng thanh toán trực tuyến.",
      priceMonthly: 9,
      priceLifetime: 79,
      oldPrice: 15,
      rating: 4.5,
      reviewsCount: 129,
      platforms: ["web"],
      featured: false,
      label: "Giá Tốt",
      licenseFeatures: [
        "Mẫu hóa đơn đẹp chuyên nghiệp chuẩn quốc tế",
        "Tự động gửi email nhắc nợ định kỳ",
        "Tích hợp thanh toán QR Code, PayPal, Stripe",
        "Thống kê thuế và công nợ trực quan",
        "Hỗ trợ đa tiền tệ (VND, USD, EUR...)"
      ],
      requirements: {
        os: "Chạy trên mọi trình duyệt web di động và máy tính",
        cpu: "Không yêu cầu",
        ram: "Không yêu cầu",
        storage: "Lưu trữ đám mây đám mây"
      },
      faqs: [
        { q: "Tôi có thể chèn logo thương hiệu riêng vào hóa đơn?", a: "Có, bạn có thể tùy biến hoàn toàn màu sắc, logo, thông tin chân trang của hóa đơn theo nhận diện thương hiệu của mình." }
      ]
    }
  ];

  const workflows = [
    {
      id: "cust-support",
      name: "CSKH Tự Động",
      desc: "AI tiếp nhận yêu cầu, phân loại và soạn thảo phản hồi, lưu thông tin khách hàng vào CRM và gửi email chăm sóc.",
      steps: [
        { id: "step-1", name: "Form Đăng Ký", icon: "form", desc: "Nhận yêu cầu của khách hàng từ Landing Page", time: "0.8s" },
        { id: "step-2", name: "AI Phân Tích", icon: "brain", desc: "Mô hình NLP phân tích ý định và cảm xúc", time: "1.2s" },
        { id: "step-3", name: "Tra Cứu CRM", icon: "database", desc: "Kiểm tra lịch sử khách hàng trong Nexus CRM", time: "0.5s" },
        { id: "step-4", name: "Soạn Thảo Email", icon: "terminal", desc: "AetherAI tự động viết thư nháp phản hồi", time: "1.5s" },
        { id: "step-5", name: "Gửi Email", icon: "mail", desc: "Gửi thư tự động qua hệ thống AeroMail", time: "0.8s" },
        { id: "step-6", name: "Lưu Báo Cáo", icon: "briefcase", desc: "Ghi nhận tiến trình hoàn tất vào Dashboard", time: "0.4s" }
      ],
      results: [
        { label: "Yêu cầu xử lý", value: "3,820", trend: "+12%" },
        { label: "Thời gian trung bình", value: "5.2s", trend: "-85%" },
        { label: "Đánh giá hài lòng", value: "98.2%", trend: "+3%" }
      ],
      logs: [
        "Đang lắng nghe cổng webhook Form khách hàng...",
        "Phát hiện yêu cầu mới từ email: customer@example.com",
        "AI phân tích ý định: 'Yêu cầu hỗ trợ cài đặt kỹ thuật' (Độ tin cậy: 98%)",
        "CRM: Tìm thấy thông tin. Gói đăng ký: Pro License",
        "AetherAI: Đang sinh thư trả lời cá nhân hóa bằng tiếng Việt...",
        "Mail API: Đang gửi email hướng dẫn cài đặt...",
        "Hệ thống: Quy trình hoàn thành thành công trong 5.2s."
      ]
    },
    {
      id: "marketing-auto",
      name: "Marketing Automation",
      desc: "Quét Lead khách hàng, đồng bộ danh sách, gửi email chuỗi phễu chăm sóc và gửi báo cáo kết quả chiến dịch.",
      steps: [
        { id: "step-1", name: "Quét Lead", icon: "search", desc: "LeadScout quét thông tin khách hàng B2B", time: "1.5s" },
        { id: "step-2", name: "Lọc Email", icon: "filter", desc: "Xác thực danh sách email còn hoạt động", time: "1.0s" },
        { id: "step-3", name: "Đồng Bộ Lead", icon: "database", desc: "Lưu danh sách lead sạch vào dữ liệu", time: "0.8s" },
        { id: "step-4", name: "Gửi Email Phễu", icon: "mail", desc: "Gửi email kích hoạt chuỗi chào mừng khách", time: "1.2s" },
        { id: "step-5", name: "Xuất Kết Quả", icon: "file-text", desc: "Tạo file báo cáo chiến dịch gửi Marketing Team", time: "0.6s" }
      ],
      results: [
        { label: "Lead thu thập", value: "12,490", trend: "+28%" },
        { label: "Tỷ lệ mở email", value: "42.5%", trend: "+15%" },
        { label: "Tỷ lệ chuyển đổi", value: "8.6%", trend: "+2.4%" }
      ],
      logs: [
        "Khởi chạy chiến dịch LeadScout B2B...",
        "Tìm thấy 150 liên hệ doanh nghiệp tiềm năng theo bộ lọc...",
        "Bắt đầu lọc danh sách: Phát hiện 12 email ảo, loại bỏ khỏi danh sách.",
        "Đang ghi 138 liên hệ hợp lệ vào hệ thống cơ sở dữ liệu...",
        "Gửi hàng loạt email giới thiệu sản phẩm KDG...",
        "Đồng bộ hóa kết quả mở/click sang Dashboard...",
        "Đã xuất báo cáo CSV gửi tự động qua email quản lý."
      ]
    },
    {
      id: "social-post",
      name: "Đăng Bài Mạng Xã Hội",
      desc: "AI tự động lên lịch, tối ưu caption, thiết kế hình ảnh minh họa cơ bản và tự động đăng bài lên Fanpages.",
      steps: [
        { id: "step-1", name: "Chọn Chủ Đề", icon: "file-text", desc: "Lấy bài viết gốc từ kho lưu trữ ý tưởng", time: "0.5s" },
        { id: "step-2", name: "AI Viết Caption", icon: "brain", desc: "Mô hình AI tối ưu hóa ngôn từ và hashtag", time: "1.4s" },
        { id: "step-3", name: "Tạo Ảnh Minh Họa", icon: "image", desc: "Sinh ảnh graphic phù hợp chủ đề qua AI", time: "2.0s" },
        { id: "step-4", name: "Đăng Tức Thì", icon: "share-2", desc: "OmniPost đăng đồng loạt lên FB, Insta, TikTok", time: "1.2s" }
      ],
      results: [
        { label: "Bài viết đã đăng", value: "450 bài", trend: "100%" },
        { label: "Lượt tiếp cận", value: "+84,200", trend: "+45%" },
        { label: "Tương tác trung bình", value: "3,240", trend: "+32%" }
      ],
      logs: [
        "Đọc bài viết mẫu: 'Xu hướng AI năm 2026'...",
        "AI đang tạo 3 phiên bản Caption kèm hashtag #AI #Tech #KDG...",
        "AI Image Engine: Đang thiết kế ảnh minh họa độ phân giải cao...",
        "OmniPost API: Đang xác thực tài khoản Fanpage Facebook...",
        "OmniPost API: Đang đăng tải lên Instagram và TikTok...",
        "Đăng bài hoàn tất! Đang thu thập chỉ số lượt tương tác ban đầu..."
      ]
    },
    {
      id: "data-process",
      name: "Xử Lý Dữ Liệu Lớn",
      desc: "Quét dữ liệu thô từ web thương mại điện tử, lọc nhiễu, AI phân loại ngành hàng và đẩy dữ liệu sạch về server.",
      steps: [
        { id: "step-1", name: "Cào Dữ Liệu", icon: "download", desc: "DeepScrape quét thông tin sản phẩm trên web", time: "2.2s" },
        { id: "step-2", name: "Lọc Nhiễu", icon: "filter", desc: "Loại bỏ các sản phẩm trùng lặp, thiếu giá", time: "1.0s" },
        { id: "step-3", name: "AI Gắn Tag", icon: "brain", desc: "Phân loại danh mục tự động bằng AI Classifier", time: "1.5s" },
        { id: "step-4", name: "Tính Thống Kê", icon: "activity", desc: "Insightful tính toán giá trung bình, tăng trưởng", time: "0.8s" },
        { id: "step-5", name: "Lưu Database", icon: "database", desc: "Lưu dữ liệu sạch vào hệ thống SQL máy chủ", time: "0.7s" }
      ],
      results: [
        { label: "Dòng dữ liệu cào", value: "542,000", trend: "+55%" },
        { label: "Dữ liệu rác đã lọc", value: "18,400", trend: "-12%" },
        { label: "Độ chính xác AI", value: "99.4%", trend: "+0.2%" }
      ],
      logs: [
        "Đang chạy DeepScrape trên trang mục tiêu...",
        "Đã tải xuống 12,500 sản phẩm thô (dung lượng 45MB)...",
        "Tiến hành lọc nhiễu: Loại bỏ 425 sản phẩm lỗi định dạng giá...",
        "AI Classifier: Đang tự động phân loại 12,075 sản phẩm vào 14 ngành hàng...",
        "Insightful Analytics: Đang tính toán biên độ dao động giá...",
        "Đang lưu dữ liệu sạch vào SQL Server...",
        "Hoàn tất quy trình xử lý dữ liệu lớn!"
      ]
    }
  ];

  // Expose globally
  window.AppData = {
    categories: categories,
    products: products,
    workflows: workflows
  };
})();
