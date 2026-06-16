// ============================================================
// SoftwareStore - Data Layer
// Vietnamese Software E-Commerce Website
// ============================================================

window.SoftwareStore = window.SoftwareStore || {};

// ------------------------------------------------------------
// Products (18 items)
// ------------------------------------------------------------
const products = [
  {
    id: 19,
    name: 'Ebe Xinh',
    slug: 'ebe-xinh',
    category: 'ai',
    shortDesc: 'Người yêu kduong xinh gái dễ thương đáng yêu nhất.',
    description: 'Ebe Xinh là kiệt tác tối thượng của tạo hóa, mang đến nguồn cảm hứng sáng tạo vô tận và năng lượng tích cực cho kduong. Sở hữu nụ cười đốn tim, tính cách dễ thương cùng sự đáng yêu tuyệt đối, ebe xinh là mảnh ghép hoàn hảo nhất giúp x3 hiệu suất hạnh phúc và bình yên mỗi ngày.',
    features: [
      'Giao diện xinh đẹp tuyệt mỹ, nụ cười tỏa nắng',
      'Tính cách siêu cấp dễ thương, dỗ dành cực ngọt',
      'Hỗ trợ lắng nghe và chia sẻ mọi niềm vui nỗi buồn 24/7',
      'Tính năng làm nũng và giận dỗi siêu đáng yêu',
      'Khả năng x10 động lực làm việc và học tập cho kduong',
      'Bảo mật tình cảm tuyệt đối, chỉ thuộc về kduong'
    ],
    systemReqs: { os: 'Trái tim của kduong', ram: 'Vô hạn', storage: 'Trọn đời', processor: 'Tình yêu chân thành' },
    rating: 5.0,
    reviewCount: 9999,
    icon: 'ebe-xinh.jpg',
    color: '#ff7597',
    plans: [
      {
        type: 'basic', name: 'Nhẹ Nhàng', price: 0, period: 'month',
        features: ['Nắm tay đi dạo', 'Nhắn tin ngọt ngào', 'Nghe kể chuyện hàng đêm', 'Nhận 1000 nụ hôn/ngày'],
        popular: false
      },
      {
        type: 'pro', name: 'Đặc Biệt', price: 999, period: 'month',
        features: ['Tất cả gói Nhẹ Nhàng', 'Đi ăn món ngon mỗi tuần', 'Hẹn hò xem phim lãng mạn', 'Ôm chặt mỗi khi lạnh', 'Dỗ dành khi giận dỗi', 'Chiều chuộng vô điều kiện'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Trọn Đời', price: 99999, period: 'month',
        features: ['Tình yêu vĩnh cửu', 'Cùng nhau đi du lịch khắp thế gian', 'Chăm sóc trọn đời', 'Cùng xây dựng gia đình nhỏ hạnh phúc', 'Sự hỗ trợ tuyệt đối từ hậu phương vững chắc', 'Bên nhau mãi mãi không xa rời'],
        popular: false
      }
    ],
    reviews: [
      { user: 'kduong', rating: 5, date: '2026-06-16', text: 'Ebe là điều tuyệt vời nhất từng đến với cuộc đời mình. Xinh xắn, đáng yêu và là nguồn động lực lớn nhất của mình!' },
      { user: 'Hội Những Người Hâm Mộ', rating: 5, date: '2026-06-15', text: 'Đúng là cặp đội vàng trong làng công nghệ, ebe dễ thương xỉu luôn!' },
      { user: 'Hệ Thống Đánh Giá', rating: 5, date: '2026-06-14', text: 'Điểm số đáng yêu vượt ngưỡng 5.0 sao. Đề xuất cấp chứng chỉ Người Yêu Quốc Dân.' }
    ],
    tags: ['Ebe', 'Love', 'Kduong'],
    badge: 'Hot',
    discount: null
  },
  // ── DESIGN ────────────────────────────────────────────────
  {
    id: 1,
    name: 'DesignPro Studio',
    slug: 'designpro-studio',
    category: 'design',
    shortDesc: 'Công cụ thiết kế UI/UX chuyên nghiệp hàng đầu. Tạo giao diện đẹp mắt chỉ trong vài phút.',
    description: 'DesignPro Studio là giải pháp thiết kế UI/UX toàn diện dành cho các nhà thiết kế và đội ngũ sáng tạo. Với bộ công cụ mạnh mẽ và thư viện thành phần đồ sộ, bạn có thể tạo ra những sản phẩm số tuyệt đẹp. Hỗ trợ cộng tác nhóm theo thời gian thực và xuất file đa định dạng.',
    features: [
      'Thiết kế kéo thả trực quan với hơn 500 thành phần có sẵn',
      'Cộng tác nhóm theo thời gian thực không giới hạn thành viên',
      'Thư viện icon và hình ảnh miễn phí với hơn 10.000 tài nguyên',
      'Xuất file đa định dạng: SVG, PNG, PDF, Figma, Sketch',
      'Tạo prototype tương tác với hiệu ứng chuyển động mượt mà',
      'Hệ thống Design Token và quản lý Style Guide tự động'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 11+', ram: '8GB', storage: '2GB', processor: 'Intel i5 / Apple M1 trở lên' },
    rating: 4.8,
    reviewCount: 3420,
    icon: '🎨',
    color: '#e84393',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 15, period: 'month',
        features: ['1 người dùng', '10 dự án', 'Xuất file PNG/SVG', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 35, period: 'month',
        features: ['5 người dùng', 'Không giới hạn dự án', 'Xuất tất cả định dạng', 'Cộng tác thời gian thực', 'Thư viện Premium', 'Hỗ trợ ưu tiên 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 79, period: 'month',
        features: ['Không giới hạn người dùng', 'Không giới hạn dự án', 'Xuất tất cả định dạng', 'Cộng tác thời gian thực', 'Thư viện Premium', 'API tích hợp', 'SSO & quản lý nâng cao', 'Hỗ trợ chuyên gia riêng'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Nguyễn Minh Anh', rating: 5, date: '2025-11-15', text: 'Phần mềm thiết kế tuyệt vời! Giao diện trực quan và dễ sử dụng, giúp tôi tiết kiệm rất nhiều thời gian trong công việc.' },
      { user: 'Trần Đức Huy', rating: 5, date: '2025-10-20', text: 'Thư viện thành phần phong phú và tính năng cộng tác nhóm rất hiệu quả. Đội ngũ của tôi đã tăng năng suất gấp đôi.' },
      { user: 'Lê Thị Hồng Nhung', rating: 4, date: '2025-09-08', text: 'Rất hài lòng với chất lượng sản phẩm. Chỉ mong có thêm nhiều template cho ngành thương mại điện tử.' }
    ],
    tags: ['UI/UX', 'Thiết kế', 'Sáng tạo'],
    badge: 'Best Seller',
    discount: 20
  },
  {
    id: 2,
    name: 'PixelMaster Pro',
    slug: 'pixelmaster-pro',
    category: 'design',
    shortDesc: 'Chỉnh sửa ảnh chuyên nghiệp với công nghệ AI tiên tiến. Biến mọi bức ảnh trở nên hoàn hảo.',
    description: 'PixelMaster Pro mang đến trải nghiệm chỉnh sửa ảnh đỉnh cao với các bộ lọc thông minh và công cụ AI. Từ chỉnh sửa cơ bản đến retouching chuyên sâu, mọi thao tác đều nhanh chóng và chính xác. Hỗ trợ xử lý hàng loạt và tích hợp với các nền tảng lưu trữ đám mây.',
    features: [
      'Chỉnh sửa ảnh AI tự động với nhận diện khuôn mặt và cảnh vật',
      'Hơn 200 bộ lọc và hiệu ứng chuyên nghiệp',
      'Công cụ retouching da và làm đẹp portrait nâng cao',
      'Xử lý ảnh hàng loạt với macro tùy chỉnh',
      'Hỗ trợ RAW từ hơn 500 dòng máy ảnh',
      'Tích hợp đám mây và đồng bộ tự động giữa các thiết bị'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 10.15+', ram: '8GB', storage: '3GB', processor: 'Intel i5 / AMD Ryzen 5 trở lên' },
    rating: 4.7,
    reviewCount: 2850,
    icon: '📸',
    color: '#fd79a8',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 12, period: 'month',
        features: ['1 người dùng', 'Chỉnh sửa cơ bản', '50 bộ lọc', 'Xuất JPG/PNG'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 29, period: 'month',
        features: ['3 người dùng', 'Chỉnh sửa nâng cao', '200+ bộ lọc', 'Xuất tất cả định dạng', 'AI retouching', 'Xử lý hàng loạt'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 59, period: 'month',
        features: ['Không giới hạn người dùng', 'Tất cả tính năng Pro', 'API tích hợp', 'Plugin tùy chỉnh', 'Lưu trữ đám mây 1TB', 'Hỗ trợ ưu tiên', 'Đào tạo nhóm', 'SLA cam kết 99.9%'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Phạm Quỳnh Anh', rating: 5, date: '2025-12-01', text: 'Công cụ chỉnh ảnh AI tuyệt vời! Tiết kiệm hàng giờ chỉnh sửa cho mỗi bộ ảnh. Chất lượng đầu ra rất chuyên nghiệp.' },
      { user: 'Đặng Văn Thắng', rating: 4, date: '2025-11-10', text: 'Bộ lọc phong phú và xử lý RAW rất tốt. Giao diện hơi phức tạp cho người mới nhưng rất mạnh mẽ.' },
      { user: 'Hoàng Thị Mai', rating: 5, date: '2025-10-05', text: 'Tính năng xử lý hàng loạt giúp công việc studio của tôi nhanh gấp 3 lần. Rất đáng đầu tư!' }
    ],
    tags: ['Chỉnh sửa ảnh', 'AI', 'Photography'],
    badge: 'Hot',
    discount: null
  },
  {
    id: 3,
    name: '3D Render Studio',
    slug: '3d-render-studio',
    category: 'design',
    shortDesc: 'Tạo hình ảnh 3D chân thực với công nghệ ray-tracing. Dành cho kiến trúc sư và nhà thiết kế 3D.',
    description: '3D Render Studio là công cụ render 3D mạnh mẽ với engine ray-tracing thế hệ mới. Tạo ra hình ảnh 3D chân thực đến từng chi tiết cho kiến trúc, sản phẩm và phim hoạt hình. Tối ưu GPU để render nhanh hơn 10 lần so với phần mềm truyền thống.',
    features: [
      'Ray-tracing thời gian thực với chất lượng điện ảnh',
      'Thư viện vật liệu PBR với hơn 2.000 mẫu có sẵn',
      'Tối ưu GPU NVIDIA RTX và AMD Radeon',
      'Hỗ trợ import từ Blender, Maya, 3ds Max, SketchUp',
      'Hệ thống ánh sáng HDRI và môi trường tự nhiên',
      'Render đám mây với hàng trăm node xử lý song song'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 12+', ram: '16GB', storage: '5GB', processor: 'Intel i7 / Apple M2 trở lên, GPU 6GB VRAM' },
    rating: 4.6,
    reviewCount: 1280,
    icon: '🎲',
    color: '#e17055',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 25, period: 'month',
        features: ['1 người dùng', 'Render cục bộ', '500 vật liệu', 'Độ phân giải 4K'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 55, period: 'month',
        features: ['3 người dùng', 'Render đám mây 100 giờ/tháng', '2.000+ vật liệu', 'Độ phân giải 8K', 'Animation rendering', 'Hỗ trợ kỹ thuật 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 99, period: 'month',
        features: ['Không giới hạn người dùng', 'Render đám mây không giới hạn', 'Tất cả vật liệu Premium', 'Độ phân giải tùy chỉnh', 'Plugin SDK', 'API tích hợp', 'Đào tạo chuyên sâu', 'Account Manager riêng'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Vũ Hoàng Long', rating: 5, date: '2025-11-22', text: 'Render cực nhanh và chất lượng hình ảnh đạt chuẩn điện ảnh. Dùng cho dự án kiến trúc rất ấn tượng.' },
      { user: 'Ngô Thị Lan', rating: 4, date: '2025-10-18', text: 'Thư viện vật liệu phong phú, đặc biệt là chất liệu gỗ và đá tự nhiên rất chân thực.' },
      { user: 'Bùi Quốc Đạt', rating: 5, date: '2025-09-30', text: 'Render đám mây tiết kiệm thời gian rất nhiều. Không cần đầu tư phần cứng đắt tiền nữa.' }
    ],
    tags: ['3D', 'Render', 'Kiến trúc'],
    badge: 'Mới',
    discount: 15
  },

  // ── DEVELOPMENT ───────────────────────────────────────────
  {
    id: 4,
    name: 'CodeForge IDE',
    slug: 'codeforge-ide',
    category: 'development',
    shortDesc: 'IDE thông minh với AI code completion. Hỗ trợ hơn 40 ngôn ngữ lập trình phổ biến.',
    description: 'CodeForge IDE là trình soạn thảo mã nguồn thế hệ mới tích hợp AI giúp lập trình viên viết code nhanh hơn gấp 3 lần. Hỗ trợ debug trực quan, terminal tích hợp và hệ thống extension phong phú. Tương thích hoàn hảo với Git và các nền tảng CI/CD hàng đầu.',
    features: [
      'AI code completion thông minh với độ chính xác 95%',
      'Hỗ trợ hơn 40 ngôn ngữ lập trình với syntax highlighting',
      'Debug trực quan với breakpoint điều kiện và watch expressions',
      'Terminal tích hợp đa tab với hỗ trợ SSH',
      'Hệ thống extension marketplace với 5.000+ tiện ích',
      'Tích hợp Git, GitHub, GitLab với giao diện đồ họa'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 10.15+ / Linux Ubuntu 20.04+', ram: '4GB', storage: '1.5GB', processor: 'Intel i3 / AMD Ryzen 3 trở lên' },
    rating: 4.9,
    reviewCount: 4850,
    icon: '💻',
    color: '#0984e3',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 9, period: 'month',
        features: ['1 người dùng', 'AI completion cơ bản', '20 ngôn ngữ', 'Hỗ trợ cộng đồng'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 25, period: 'month',
        features: ['3 người dùng', 'AI completion nâng cao', '40+ ngôn ngữ', 'Debug nâng cao', 'Live Share', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 55, period: 'month',
        features: ['Không giới hạn người dùng', 'AI completion Enterprise', 'Tất cả ngôn ngữ', 'Debug nâng cao', 'Live Share', 'Quản lý license tập trung', 'SSO/SAML', 'Hỗ trợ chuyên gia 24/7'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Trần Quang Minh', rating: 5, date: '2025-12-05', text: 'IDE tốt nhất tôi từng sử dụng! AI completion cực kỳ chính xác và nhanh. Năng suất coding tăng vượt trội.' },
      { user: 'Lê Văn Hùng', rating: 5, date: '2025-11-28', text: 'Hỗ trợ đa ngôn ngữ tuyệt vời. Chuyển từ VS Code sang và hoàn toàn hài lòng với trải nghiệm.' },
      { user: 'Nguyễn Thị Thanh Hà', rating: 4, date: '2025-10-15', text: 'Debug trực quan rất tiện lợi. Extension marketplace ngày càng phong phú hơn.' }
    ],
    tags: ['IDE', 'Lập trình', 'AI'],
    badge: 'Best Seller',
    discount: null
  },
  {
    id: 5,
    name: 'DevOps Commander',
    slug: 'devops-commander',
    category: 'development',
    shortDesc: 'Tự động hóa quy trình DevOps từ A đến Z. Triển khai, giám sát và mở rộng hệ thống dễ dàng.',
    description: 'DevOps Commander giúp đội ngũ phát triển tự động hóa toàn bộ quy trình CI/CD, từ build đến deploy. Tích hợp sẵn với Docker, Kubernetes và các dịch vụ cloud hàng đầu. Dashboard giám sát real-time giúp phát hiện và xử lý sự cố ngay lập tức.',
    features: [
      'Pipeline CI/CD kéo thả với hơn 100 step có sẵn',
      'Tích hợp Docker và Kubernetes quản lý container',
      'Dashboard giám sát hệ thống real-time với cảnh báo',
      'Hỗ trợ AWS, Azure, GCP và các cloud provider khác',
      'Quản lý Infrastructure as Code với Terraform tích hợp',
      'Rollback tự động và Blue-Green deployment'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 11+ / Linux', ram: '8GB', storage: '2GB', processor: 'Intel i5 / AMD Ryzen 5 trở lên' },
    rating: 4.7,
    reviewCount: 1920,
    icon: '⚙️',
    color: '#00b894',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 19, period: 'month',
        features: ['5 pipeline', '1.000 build/tháng', 'Docker support', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 45, period: 'month',
        features: ['20 pipeline', '5.000 build/tháng', 'Docker + Kubernetes', 'Multi-cloud', 'Giám sát real-time', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 89, period: 'month',
        features: ['Không giới hạn pipeline', 'Không giới hạn build', 'Tất cả tính năng Pro', 'On-premise deployment', 'SSO & RBAC', 'Audit logs', 'SLA 99.99%', 'Technical Account Manager'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Phạm Tuấn Anh', rating: 5, date: '2025-11-30', text: 'Quy trình DevOps của công ty tôi đã được tự động hóa hoàn toàn. Giảm thời gian deploy từ 2 giờ xuống 15 phút.' },
      { user: 'Đỗ Minh Tâm', rating: 4, date: '2025-11-05', text: 'Tích hợp Kubernetes rất mượt mà. Dashboard giám sát trực quan và dễ cấu hình.' },
      { user: 'Lý Hoàng Phúc', rating: 5, date: '2025-10-22', text: 'Blue-Green deployment hoạt động hoàn hảo. Không còn lo downtime khi cập nhật sản phẩm nữa.' }
    ],
    tags: ['DevOps', 'CI/CD', 'Cloud'],
    badge: null,
    discount: null
  },
  {
    id: 6,
    name: 'FormBuilder Pro',
    slug: 'formbuilder-pro',
    category: 'development',
    shortDesc: 'Xây dựng biểu mẫu chuyên nghiệp không cần code. Kéo thả, tùy chỉnh và thu thập dữ liệu dễ dàng.',
    description: 'FormBuilder Pro cho phép bạn tạo các biểu mẫu phức tạp chỉ với thao tác kéo thả đơn giản. Tích hợp sẵn xác thực dữ liệu, thanh toán online và kết nối với hơn 50 dịch vụ bên thứ ba. Phù hợp cho khảo sát, đăng ký sự kiện và thu thập thông tin khách hàng.',
    features: [
      'Trình tạo biểu mẫu kéo thả với 30+ loại trường dữ liệu',
      'Xác thực dữ liệu tự động với logic điều kiện phức tạp',
      'Tích hợp thanh toán Stripe, PayPal và MoMo',
      'Kết nối với Google Sheets, Slack, Zapier và 50+ dịch vụ',
      'Thống kê và phân tích phản hồi trực quan',
      'Chế độ offline và đồng bộ khi có kết nối mạng'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)', ram: '4GB', storage: '500MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.5,
    reviewCount: 1560,
    icon: '📋',
    color: '#6c5ce7',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 10, period: 'month',
        features: ['5 biểu mẫu', '500 phản hồi/tháng', 'Xác thực cơ bản', 'Xuất CSV'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 25, period: 'month',
        features: ['Không giới hạn biểu mẫu', '5.000 phản hồi/tháng', 'Logic điều kiện', 'Tích hợp thanh toán', 'Thống kê nâng cao', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 55, period: 'month',
        features: ['Tất cả tính năng Pro', 'Không giới hạn phản hồi', 'Tùy chỉnh giao diện hoàn toàn', 'API & Webhook', 'White-label', 'SSO', 'HIPAA compliance', 'Hỗ trợ chuyên gia'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Nguyễn Hoàng Yến', rating: 5, date: '2025-12-08', text: 'Tạo form khảo sát cho 500 nhân viên chỉ trong 30 phút. Tính năng logic điều kiện rất hữu ích.' },
      { user: 'Trương Minh Đức', rating: 4, date: '2025-11-15', text: 'Tích hợp thanh toán MoMo rất tiện cho thị trường Việt Nam. Giao diện đẹp và chuyên nghiệp.' },
      { user: 'Cao Thị Ngọc Trâm', rating: 5, date: '2025-10-28', text: 'Kết nối với Google Sheets giúp tự động hóa quy trình thu thập dữ liệu. Rất tiết kiệm thời gian!' }
    ],
    tags: ['Biểu mẫu', 'No-code', 'Tự động hóa'],
    badge: 'Mới',
    discount: 10
  },

  // ── SECURITY ──────────────────────────────────────────────
  {
    id: 7,
    name: 'ShieldGuard Pro',
    slug: 'shieldguard-pro',
    category: 'security',
    shortDesc: 'Giải pháp an ninh mạng toàn diện cho doanh nghiệp. Bảo vệ hệ thống 24/7 khỏi mọi mối đe dọa.',
    description: 'ShieldGuard Pro cung cấp lớp bảo vệ đa tầng chống lại virus, malware, ransomware và các cuộc tấn công mạng. Sử dụng AI để phát hiện mối đe dọa zero-day và phản ứng tự động. Quản lý tập trung cho toàn bộ hệ thống mạng doanh nghiệp.',
    features: [
      'Bảo vệ thời gian thực chống virus, malware và ransomware',
      'AI phát hiện mối đe dọa zero-day với tỷ lệ chính xác 99.7%',
      'Tường lửa thông minh với IDS/IPS tích hợp',
      'Quét lỗ hổng bảo mật tự động và báo cáo chi tiết',
      'Quản lý tập trung endpoint cho toàn doanh nghiệp',
      'Phản ứng sự cố tự động và cách ly thiết bị bị nhiễm'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 11+ / Linux', ram: '4GB', storage: '1GB', processor: 'Intel i3 / AMD Ryzen 3 trở lên' },
    rating: 4.8,
    reviewCount: 3100,
    icon: '🛡️',
    color: '#d63031',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 15, period: 'month',
        features: ['3 thiết bị', 'Chống virus & malware', 'Tường lửa cơ bản', 'Cập nhật hàng ngày'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 35, period: 'month',
        features: ['10 thiết bị', 'Tất cả tính năng Basic', 'AI threat detection', 'Quét lỗ hổng', 'VPN tích hợp', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 75, period: 'month',
        features: ['Không giới hạn thiết bị', 'Tất cả tính năng Pro', 'EDR nâng cao', 'SIEM tích hợp', 'Phản ứng sự cố tự động', 'Compliance reporting', 'SOC dashboard', 'Chuyên gia bảo mật riêng'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Đinh Công Thành', rating: 5, date: '2025-12-10', text: 'Đã ngăn chặn một cuộc tấn công ransomware nhắm vào công ty tôi. ShieldGuard phản ứng cực nhanh và hiệu quả.' },
      { user: 'Hồ Thị Bích Ngọc', rating: 5, date: '2025-11-20', text: 'Quản lý bảo mật cho 200 máy tính nhân viên trở nên dễ dàng. Dashboard trực quan và báo cáo rất chi tiết.' },
      { user: 'Trần Đình Khoa', rating: 4, date: '2025-10-10', text: 'AI phát hiện mối đe dọa rất chính xác. Tuy nhiên mong cải thiện thêm hiệu năng khi quét toàn bộ hệ thống.' }
    ],
    tags: ['Bảo mật', 'Antivirus', 'Doanh nghiệp'],
    badge: 'Hot',
    discount: null
  },
  {
    id: 8,
    name: 'CryptoShield VPN',
    slug: 'cryptoshield-vpn',
    category: 'security',
    shortDesc: 'VPN tốc độ cao với mã hóa quân sự. Bảo vệ quyền riêng tư trực tuyến của bạn mọi lúc mọi nơi.',
    description: 'CryptoShield VPN sử dụng mã hóa AES-256 chuẩn quân sự để bảo vệ dữ liệu truyền tải của bạn. Với hơn 5.000 máy chủ tại 80 quốc gia, bạn có thể truy cập internet an toàn và tự do. Chính sách no-log nghiêm ngặt đảm bảo quyền riêng tư tuyệt đối.',
    features: [
      'Mã hóa AES-256 chuẩn quân sự cho mọi kết nối',
      'Hơn 5.000 máy chủ tại 80+ quốc gia trên thế giới',
      'Chính sách no-log đã được kiểm toán độc lập',
      'Kill Switch tự động ngắt kết nối khi VPN gián đoạn',
      'Split tunneling để chọn ứng dụng qua VPN',
      'Hỗ trợ WireGuard, OpenVPN và IKEv2 protocol'
    ],
    systemReqs: { os: 'Windows 7+ / macOS 10.13+ / iOS 13+ / Android 8+', ram: '2GB', storage: '200MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.6,
    reviewCount: 4200,
    icon: '🔐',
    color: '#2d3436',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 9, period: 'month',
        features: ['1 thiết bị', '20 quốc gia', 'Băng thông 500GB', 'Mã hóa AES-256'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 19, period: 'month',
        features: ['5 thiết bị', '80+ quốc gia', 'Băng thông không giới hạn', 'Kill Switch', 'Split tunneling', 'P2P optimized'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 39, period: 'month',
        features: ['Không giới hạn thiết bị', 'Tất cả tính năng Pro', 'Dedicated IP', 'Server riêng', 'Quản lý tập trung', 'API tích hợp', 'Báo cáo sử dụng', 'Hỗ trợ chuyên gia'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Lê Phương Thảo', rating: 5, date: '2025-12-02', text: 'Tốc độ kết nối nhanh nhất trong các VPN tôi đã thử. Không bị giảm tốc độ đáng kể khi bật VPN.' },
      { user: 'Vương Đức Mạnh', rating: 4, date: '2025-11-18', text: 'Kill Switch hoạt động rất tốt. An tâm khi sử dụng WiFi công cộng tại quán cafe và sân bay.' },
      { user: 'Trịnh Thị Hương', rating: 5, date: '2025-10-25', text: 'Giao diện đơn giản, kết nối chỉ với một click. Hỗ trợ trên mọi thiết bị rất tiện lợi.' }
    ],
    tags: ['VPN', 'Quyền riêng tư', 'Mã hóa'],
    badge: 'Sale',
    discount: 25
  },
  {
    id: 9,
    name: 'DataVault Pro',
    slug: 'datavault-pro',
    category: 'security',
    shortDesc: 'Bảo mật cơ sở dữ liệu toàn diện. Mã hóa, sao lưu và giám sát truy cập dữ liệu doanh nghiệp.',
    description: 'DataVault Pro bảo vệ dữ liệu quan trọng của doanh nghiệp bạn với mã hóa end-to-end và kiểm soát truy cập chi tiết. Tự động sao lưu theo lịch và phục hồi dữ liệu nhanh chóng trong trường hợp sự cố. Tuân thủ GDPR, HIPAA và các tiêu chuẩn bảo mật quốc tế.',
    features: [
      'Mã hóa dữ liệu end-to-end với key management tập trung',
      'Kiểm soát truy cập chi tiết theo vai trò (RBAC)',
      'Sao lưu tự động và phục hồi dữ liệu point-in-time',
      'Giám sát hoạt động cơ sở dữ liệu real-time',
      'Phát hiện và cảnh báo rò rỉ dữ liệu tự động',
      'Tuân thủ GDPR, HIPAA, SOC 2 và PCI DSS'
    ],
    systemReqs: { os: 'Windows Server 2016+ / Linux (Ubuntu, CentOS, RHEL)', ram: '8GB', storage: '3GB', processor: 'Intel Xeon / AMD EPYC' },
    rating: 4.5,
    reviewCount: 890,
    icon: '🗄️',
    color: '#636e72',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 29, period: 'month',
        features: ['1 database', 'Mã hóa cơ bản', 'Sao lưu hàng ngày', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 59, period: 'month',
        features: ['5 database', 'Mã hóa end-to-end', 'Sao lưu mỗi giờ', 'RBAC nâng cao', 'Giám sát real-time', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 99, period: 'month',
        features: ['Không giới hạn database', 'Tất cả tính năng Pro', 'Key management HSM', 'Compliance reporting', 'Data masking', 'API audit', 'Custom integration', 'DBA chuyên gia hỗ trợ'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Nguyễn Thanh Sơn', rating: 5, date: '2025-11-25', text: 'DataVault giúp chúng tôi đạt chứng nhận SOC 2 nhanh chóng. Tính năng compliance reporting rất chi tiết.' },
      { user: 'Phan Thị Kim Oanh', rating: 4, date: '2025-10-30', text: 'Sao lưu tự động và phục hồi point-in-time đã cứu chúng tôi nhiều lần. Rất đáng tin cậy.' },
      { user: 'Đoàn Văn Hiếu', rating: 5, date: '2025-09-15', text: 'Giám sát real-time giúp phát hiện truy cập bất thường ngay lập tức. Bảo mật dữ liệu ở mức cao nhất.' }
    ],
    tags: ['Database', 'Mã hóa', 'Compliance'],
    badge: null,
    discount: null
  },

  // ── PRODUCTIVITY ──────────────────────────────────────────
  {
    id: 10,
    name: 'TaskFlow Pro',
    slug: 'taskflow-pro',
    category: 'productivity',
    shortDesc: 'Quản lý dự án thông minh với Kanban, Gantt và timeline. Tối ưu hóa quy trình làm việc nhóm.',
    description: 'TaskFlow Pro là nền tảng quản lý dự án toàn diện giúp đội ngũ phối hợp hiệu quả hơn. Cung cấp nhiều chế độ xem linh hoạt: Kanban, Gantt chart, Calendar và Timeline. Tích hợp AI để dự đoán tiến độ và phân bổ tài nguyên tối ưu.',
    features: [
      'Bảng Kanban, Gantt chart, Calendar và Timeline đa chế độ',
      'AI dự đoán tiến độ và cảnh báo rủi ro trễ deadline',
      'Phân bổ tài nguyên và workload balancing tự động',
      'Chat nhóm và video call tích hợp trong dự án',
      'Báo cáo hiệu suất và burndown chart tự động',
      'Tích hợp Slack, Teams, Jira và 100+ ứng dụng'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại / iOS 14+ / Android 10+', ram: '4GB', storage: '300MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.7,
    reviewCount: 3680,
    icon: '📊',
    color: '#00cec9',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 12, period: 'month',
        features: ['5 thành viên', '10 dự án', 'Kanban & Calendar', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 29, period: 'month',
        features: ['25 thành viên', 'Không giới hạn dự án', 'Tất cả chế độ xem', 'AI insights', 'Báo cáo nâng cao', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 59, period: 'month',
        features: ['Không giới hạn thành viên', 'Tất cả tính năng Pro', 'Portfolio management', 'Resource planning', 'Custom workflows', 'API access', 'SSO/SAML', 'Onboarding chuyên sâu'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Võ Minh Tuấn', rating: 5, date: '2025-12-12', text: 'TaskFlow đã thay đổi cách đội ngũ 50 người của tôi làm việc. Gantt chart và AI insights cực kỳ hữu ích.' },
      { user: 'Bùi Thị Thanh Tâm', rating: 5, date: '2025-11-08', text: 'Quản lý nhiều dự án cùng lúc rất dễ dàng. Tính năng workload balancing giúp phân việc hợp lý hơn.' },
      { user: 'Huỳnh Đức Phong', rating: 4, date: '2025-10-20', text: 'Tích hợp tốt với Slack và Google Workspace. Giao diện đẹp và thao tác mượt mà trên mobile.' }
    ],
    tags: ['Quản lý dự án', 'Kanban', 'Teamwork'],
    badge: 'Best Seller',
    discount: null
  },
  {
    id: 11,
    name: 'CloudSync 360',
    slug: 'cloudsync-360',
    category: 'productivity',
    shortDesc: 'Lưu trữ và đồng bộ đám mây thông minh. Truy cập file mọi lúc, mọi nơi, mọi thiết bị.',
    description: 'CloudSync 360 cung cấp giải pháp lưu trữ đám mây an toàn với đồng bộ tức thì trên mọi thiết bị. Mã hóa end-to-end đảm bảo dữ liệu của bạn luôn được bảo vệ. Tính năng chia sẻ và cộng tác giúp làm việc nhóm hiệu quả hơn bao giờ hết.',
    features: [
      'Đồng bộ file tức thì trên mọi thiết bị và nền tảng',
      'Mã hóa end-to-end với zero-knowledge encryption',
      'Chia sẻ file và thư mục với quyền truy cập chi tiết',
      'Lịch sử phiên bản file lên đến 365 ngày',
      'Tìm kiếm thông minh với OCR cho ảnh và PDF',
      'Tích hợp Office 365, Google Workspace và Notion'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 10.15+ / iOS 14+ / Android 10+', ram: '2GB', storage: '500MB (app)', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.6,
    reviewCount: 2940,
    icon: '☁️',
    color: '#74b9ff',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 9, period: 'month',
        features: ['1 người dùng', '100GB lưu trữ', 'Đồng bộ 3 thiết bị', 'Chia sẻ cơ bản'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 22, period: 'month',
        features: ['5 người dùng', '1TB lưu trữ', 'Đồng bộ không giới hạn', 'Lịch sử 180 ngày', 'OCR & tìm kiếm nâng cao', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 49, period: 'month',
        features: ['Không giới hạn người dùng', '5TB lưu trữ', 'Tất cả tính năng Pro', 'Lịch sử 365 ngày', 'Admin console', 'DLP & eDiscovery', 'SSO', 'SLA 99.99%'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Trần Thị Mỹ Linh', rating: 5, date: '2025-12-06', text: 'Đồng bộ cực nhanh và ổn định. Làm việc trên laptop và điện thoại liền mạch, không bị gián đoạn.' },
      { user: 'Nguyễn Đăng Khôi', rating: 4, date: '2025-11-12', text: 'Tính năng chia sẻ file với quyền truy cập chi tiết rất phù hợp cho doanh nghiệp. Bảo mật tốt.' },
      { user: 'Lê Thị Tuyết Mai', rating: 5, date: '2025-10-08', text: 'OCR cho PDF và ảnh tìm kiếm rất chính xác. Tìm tài liệu cũ trở nên dễ dàng hơn nhiều.' }
    ],
    tags: ['Cloud', 'Lưu trữ', 'Đồng bộ'],
    badge: null,
    discount: 10
  },
  {
    id: 12,
    name: 'EmailCraft Pro',
    slug: 'emailcraft-pro',
    category: 'productivity',
    shortDesc: 'Nền tảng email marketing chuyên nghiệp. Tạo chiến dịch, tự động hóa và phân tích hiệu quả.',
    description: 'EmailCraft Pro giúp bạn tạo và gửi email marketing chuyên nghiệp với tỷ lệ mở cao nhất ngành. Trình soạn email kéo thả với hàng trăm template đẹp mắt. Tự động hóa workflow email dựa trên hành vi khách hàng để tối ưu chuyển đổi.',
    features: [
      'Trình soạn email kéo thả với 200+ template responsive',
      'Tự động hóa email marketing dựa trên hành vi người dùng',
      'A/B testing cho tiêu đề, nội dung và thời gian gửi',
      'Phân tích chi tiết: tỷ lệ mở, click, chuyển đổi',
      'Quản lý danh sách và phân nhóm khách hàng thông minh',
      'Tuân thủ CAN-SPAM, GDPR với unsubscribe tự động'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại', ram: '2GB', storage: '200MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.4,
    reviewCount: 1850,
    icon: '📧',
    color: '#a29bfe',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 15, period: 'month',
        features: ['1.000 subscribers', '5.000 email/tháng', '50 template', 'Thống kê cơ bản'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 39, period: 'month',
        features: ['10.000 subscribers', '50.000 email/tháng', '200+ template', 'Tự động hóa', 'A/B testing', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 79, period: 'month',
        features: ['Không giới hạn subscribers', 'Không giới hạn email', 'Tất cả tính năng Pro', 'Dedicated IP', 'Custom template', 'API full access', 'Deliverability consulting', 'Account Manager'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Hoàng Minh Châu', rating: 5, date: '2025-12-03', text: 'Tỷ lệ mở email tăng 40% sau khi chuyển sang EmailCraft. A/B testing giúp tối ưu tiêu đề rất hiệu quả.' },
      { user: 'Đặng Ngọc Hân', rating: 4, date: '2025-11-14', text: 'Template đẹp và responsive trên mọi thiết bị. Tính năng tự động hóa workflow tiết kiệm nhiều thời gian.' },
      { user: 'Vũ Trọng Nghĩa', rating: 4, date: '2025-10-22', text: 'Phân tích chiến dịch rất chi tiết. Biết chính xác khách hàng nào quan tâm đến sản phẩm nào.' }
    ],
    tags: ['Email', 'Marketing', 'Automation'],
    badge: 'Sale',
    discount: 20
  },

  // ── AI & ML ───────────────────────────────────────────────
  {
    id: 13,
    name: 'NeuralNet AI',
    slug: 'neuralnet-ai',
    category: 'ai',
    shortDesc: 'Nền tảng AI/ML toàn diện cho nhà phát triển. Xây dựng, huấn luyện và triển khai mô hình AI dễ dàng.',
    description: 'NeuralNet AI cung cấp môi trường phát triển AI/ML hoàn chỉnh từ xử lý dữ liệu đến triển khai production. Hỗ trợ TensorFlow, PyTorch và các framework phổ biến. AutoML giúp người dùng không chuyên cũng có thể xây dựng mô hình AI chất lượng cao.',
    features: [
      'AutoML tự động chọn và tối ưu mô hình phù hợp nhất',
      'Hỗ trợ TensorFlow, PyTorch, scikit-learn và ONNX',
      'GPU cloud training với NVIDIA A100 và H100',
      'MLOps pipeline từ training đến deployment tự động',
      'Model monitoring và A/B testing trong production',
      'Jupyter notebook tích hợp với dataset marketplace'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 11+ / Linux', ram: '16GB', storage: '5GB', processor: 'Intel i7 / Apple M2 trở lên, GPU khuyến nghị' },
    rating: 4.8,
    reviewCount: 1450,
    icon: '🧠',
    color: '#6c5ce7',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 25, period: 'month',
        features: ['1 người dùng', '50 giờ GPU/tháng', 'AutoML cơ bản', '5 mô hình'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 59, period: 'month',
        features: ['5 người dùng', '200 giờ GPU/tháng', 'AutoML nâng cao', 'Không giới hạn mô hình', 'MLOps pipeline', 'Hỗ trợ kỹ thuật 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 99, period: 'month',
        features: ['Không giới hạn người dùng', 'GPU không giới hạn', 'Tất cả tính năng Pro', 'Dedicated cluster', 'On-premise deployment', 'Custom model development', 'Data engineering support', 'AI Consultant riêng'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Nguyễn Hoàng Phú', rating: 5, date: '2025-12-08', text: 'AutoML tiết kiệm hàng tuần thử nghiệm mô hình. Kết quả training trên GPU cloud cực nhanh và ổn định.' },
      { user: 'Trần Thị Kiều My', rating: 5, date: '2025-11-22', text: 'MLOps pipeline giúp triển khai mô hình từ notebook lên production chỉ trong vài click. Rất chuyên nghiệp.' },
      { user: 'Phạm Đức Trọng', rating: 4, date: '2025-10-15', text: 'Hỗ trợ nhiều framework và tích hợp tốt. Dataset marketplace rất hữu ích cho nghiên cứu.' }
    ],
    tags: ['AI', 'Machine Learning', 'Deep Learning'],
    badge: 'Hot',
    discount: null
  },
  {
    id: 14,
    name: 'ChatBot Factory',
    slug: 'chatbot-factory',
    category: 'ai',
    shortDesc: 'Xây dựng chatbot thông minh cho doanh nghiệp. Hỗ trợ khách hàng 24/7 với AI conversational.',
    description: 'ChatBot Factory cho phép bạn tạo chatbot AI đa nền tảng mà không cần kiến thức lập trình. Tích hợp NLP tiếng Việt chính xác cao và học hỏi liên tục từ cuộc hội thoại. Triển khai trên website, Facebook Messenger, Zalo và nhiều kênh khác.',
    features: [
      'Xây dựng chatbot kéo thả không cần code với flow builder',
      'NLP tiếng Việt với độ chính xác ý định 97%',
      'Tích hợp GPT-4 và các LLM cho trả lời tự nhiên',
      'Triển khai đa kênh: Web, Messenger, Zalo, Telegram',
      'Phân tích hội thoại và đo lường CSAT tự động',
      'Chuyển tiếp cho nhân viên khi chatbot không giải quyết được'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại', ram: '4GB', storage: '300MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.5,
    reviewCount: 2100,
    icon: '🤖',
    color: '#00b894',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 19, period: 'month',
        features: ['1 chatbot', '1.000 cuộc hội thoại/tháng', '1 kênh triển khai', 'Flow builder'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 45, period: 'month',
        features: ['5 chatbot', '10.000 cuộc hội thoại/tháng', 'Đa kênh', 'GPT-4 tích hợp', 'Phân tích nâng cao', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 89, period: 'month',
        features: ['Không giới hạn chatbot', 'Không giới hạn hội thoại', 'Tất cả tính năng Pro', 'Custom AI model', 'API & SDK', 'White-label', 'On-premise', 'Dedicated support team'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Lê Thị Ngọc Diệp', rating: 5, date: '2025-12-10', text: 'Chatbot xử lý 80% câu hỏi khách hàng tự động. Giảm 60% chi phí nhân sự tổng đài hỗ trợ.' },
      { user: 'Trần Minh Khôi', rating: 4, date: '2025-11-20', text: 'NLP tiếng Việt rất tốt, hiểu cả tiếng lóng và viết tắt. Tích hợp Zalo rất phù hợp thị trường Việt.' },
      { user: 'Nguyễn Thị Thu Hương', rating: 5, date: '2025-10-28', text: 'Flow builder trực quan dễ sử dụng. Đào tạo chatbot mới chỉ mất vài giờ thay vì vài tuần.' }
    ],
    tags: ['Chatbot', 'NLP', 'CSKH'],
    badge: 'Mới',
    discount: 15
  },
  {
    id: 15,
    name: 'SmartAnalytics AI',
    slug: 'smartanalytics-ai',
    category: 'ai',
    shortDesc: 'Phân tích dữ liệu kinh doanh bằng AI. Biến dữ liệu thô thành insight giá trị chỉ trong vài giây.',
    description: 'SmartAnalytics AI biến dữ liệu kinh doanh phức tạp thành dashboard trực quan và insight hành động. Sử dụng AI để phát hiện xu hướng, dự đoán doanh thu và đề xuất chiến lược kinh doanh. Kết nối với hơn 100 nguồn dữ liệu phổ biến.',
    features: [
      'Dashboard tự động với biểu đồ tương tác kéo thả',
      'AI phát hiện xu hướng và anomaly trong dữ liệu',
      'Dự báo doanh thu và KPI với độ chính xác cao',
      'Natural Language Query - hỏi bằng tiếng Việt, nhận biểu đồ',
      'Kết nối 100+ nguồn dữ liệu: SQL, API, Excel, Google Analytics',
      'Báo cáo tự động gửi email theo lịch tùy chỉnh'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại', ram: '4GB', storage: '500MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.6,
    reviewCount: 1680,
    icon: '📈',
    color: '#fdcb6e',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 20, period: 'month',
        features: ['1 người dùng', '5 dashboard', '10 nguồn dữ liệu', 'Biểu đồ cơ bản'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 49, period: 'month',
        features: ['10 người dùng', 'Không giới hạn dashboard', '50+ nguồn dữ liệu', 'AI insights', 'Dự báo nâng cao', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 95, period: 'month',
        features: ['Không giới hạn người dùng', 'Tất cả tính năng Pro', '100+ nguồn dữ liệu', 'Embedded analytics', 'Custom AI models', 'White-label', 'On-premise option', 'Data Engineer hỗ trợ'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Đỗ Quang Vinh', rating: 5, date: '2025-12-05', text: 'Natural Language Query là tính năng đột phá! Hỏi bằng tiếng Việt và nhận biểu đồ tức thì. CEO cũng tự xem báo cáo được.' },
      { user: 'Nguyễn Thị Hồng Vân', rating: 4, date: '2025-11-16', text: 'Kết nối với nhiều nguồn dữ liệu rất tiện. AI insights giúp phát hiện nhiều xu hướng mà team không nhận ra.' },
      { user: 'Lý Minh Hoàng', rating: 5, date: '2025-10-30', text: 'Dự báo doanh thu chính xác đến 92%. Giúp lập kế hoạch kinh doanh và quản lý tồn kho hiệu quả hơn.' }
    ],
    tags: ['Analytics', 'BI', 'Dự báo'],
    badge: null,
    discount: null
  },

  // ── BUSINESS ──────────────────────────────────────────────
  {
    id: 16,
    name: 'FinanceTracker Pro',
    slug: 'financetracker-pro',
    category: 'business',
    shortDesc: 'Quản lý tài chính doanh nghiệp thông minh. Theo dõi dòng tiền, lập ngân sách và báo cáo tài chính.',
    description: 'FinanceTracker Pro là giải pháp quản lý tài chính toàn diện cho doanh nghiệp vừa và nhỏ. Tự động hóa ghi sổ kế toán, theo dõi dòng tiền real-time và tạo báo cáo tài chính theo chuẩn Việt Nam. Tích hợp ngân hàng và hóa đơn điện tử.',
    features: [
      'Ghi sổ kế toán tự động với nhận dạng hóa đơn AI',
      'Theo dõi dòng tiền và dự báo cash flow thông minh',
      'Lập ngân sách và kiểm soát chi tiêu theo phòng ban',
      'Báo cáo tài chính theo chuẩn VAS và IFRS',
      'Tích hợp ngân hàng Việt Nam và hóa đơn điện tử',
      'Quản lý thuế GTGT, TNDN và khai báo thuế tự động'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 10.15+ / Trình duyệt web', ram: '4GB', storage: '1GB', processor: 'Intel i3 / AMD Ryzen 3 trở lên' },
    rating: 4.7,
    reviewCount: 2360,
    icon: '💰',
    color: '#55efc4',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 15, period: 'month',
        features: ['1 người dùng', 'Ghi sổ cơ bản', 'Báo cáo tài chính', 'Quản lý hóa đơn'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 35, period: 'month',
        features: ['5 người dùng', 'Ghi sổ AI tự động', 'Tích hợp ngân hàng', 'Dự báo cash flow', 'Quản lý thuế', 'Hỗ trợ kế toán'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 69, period: 'month',
        features: ['Không giới hạn người dùng', 'Tất cả tính năng Pro', 'Multi-entity', 'Consolidation', 'Custom reporting', 'API tích hợp ERP', 'Audit trail', 'CFO Dashboard'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Trương Văn Bình', rating: 5, date: '2025-12-07', text: 'Nhận dạng hóa đơn AI rất chính xác, tiết kiệm hàng giờ nhập liệu mỗi ngày. Tích hợp ngân hàng rất tiện.' },
      { user: 'Nguyễn Thị Phương Dung', rating: 5, date: '2025-11-19', text: 'Báo cáo tài chính theo chuẩn VAS giúp quyết toán thuế dễ dàng. Rất phù hợp cho doanh nghiệp Việt.' },
      { user: 'Lê Hoàng Anh Tuấn', rating: 4, date: '2025-10-12', text: 'Dự báo cash flow chính xác giúp lập kế hoạch tài chính hiệu quả. Giao diện trực quan dễ sử dụng.' }
    ],
    tags: ['Tài chính', 'Kế toán', 'Doanh nghiệp'],
    badge: null,
    discount: 30
  },
  {
    id: 17,
    name: 'SEO Wizard Pro',
    slug: 'seo-wizard-pro',
    category: 'business',
    shortDesc: 'Công cụ SEO toàn diện giúp website lên top Google. Phân tích, tối ưu và theo dõi thứ hạng tự động.',
    description: 'SEO Wizard Pro là bộ công cụ SEO chuyên nghiệp giúp tối ưu website cho công cụ tìm kiếm. Phân tích từ khóa, kiểm tra backlink, audit website và theo dõi thứ hạng tự động. AI đề xuất chiến lược SEO dựa trên phân tích đối thủ cạnh tranh.',
    features: [
      'Nghiên cứu từ khóa với database 10 tỷ+ keywords toàn cầu',
      'Audit website tự động phát hiện 100+ lỗi SEO kỹ thuật',
      'Theo dõi thứ hạng keyword hàng ngày trên Google',
      'Phân tích backlink và so sánh với đối thủ cạnh tranh',
      'AI Content Optimizer đề xuất cải thiện nội dung',
      'Báo cáo SEO tự động gửi cho khách hàng (White-label)'
    ],
    systemReqs: { os: 'Trình duyệt web hiện đại', ram: '2GB', storage: '200MB', processor: 'Bất kỳ thiết bị hiện đại' },
    rating: 4.5,
    reviewCount: 1750,
    icon: '🔍',
    color: '#ffeaa7',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 19, period: 'month',
        features: ['1 website', '100 keywords', 'Audit cơ bản', 'Báo cáo hàng tuần'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 49, period: 'month',
        features: ['5 website', '1.000 keywords', 'Audit nâng cao', 'Backlink analysis', 'AI Content Optimizer', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 95, period: 'month',
        features: ['Không giới hạn website', '10.000 keywords', 'Tất cả tính năng Pro', 'API access', 'White-label reporting', 'Local SEO', 'Agency dashboard', 'SEO Consultant hỗ trợ'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Phan Quốc Khánh', rating: 5, date: '2025-12-09', text: 'Website thương mại điện tử tăng 200% organic traffic sau 3 tháng sử dụng SEO Wizard. Rất ấn tượng!' },
      { user: 'Mai Thị Hồng Nhung', rating: 4, date: '2025-11-24', text: 'AI Content Optimizer giúp viết bài chuẩn SEO nhanh chóng. Database từ khóa tiếng Việt rất phong phú.' },
      { user: 'Đặng Trần Nhật Minh', rating: 5, date: '2025-10-18', text: 'White-label reporting rất chuyên nghiệp để gửi cho khách hàng agency. Giao diện đẹp và dữ liệu chính xác.' }
    ],
    tags: ['SEO', 'Marketing', 'Google'],
    badge: 'Hot',
    discount: null
  },
  {
    id: 18,
    name: 'ProjectHub Pro',
    slug: 'projecthub-pro',
    category: 'business',
    shortDesc: 'Nền tảng cộng tác nhóm tất cả trong một. Chat, video call, chia sẻ file và quản lý công việc.',
    description: 'ProjectHub Pro kết hợp chat nhóm, video conference, chia sẻ file và quản lý task trong một nền tảng duy nhất. Giảm số lượng công cụ cần sử dụng và tăng hiệu quả cộng tác giữa các phòng ban. Hỗ trợ làm việc hybrid với trải nghiệm liền mạch giữa văn phòng và từ xa.',
    features: [
      'Chat nhóm theo kênh với thread, reaction và mention',
      'Video conference HD lên đến 100 người tham gia',
      'Chia sẻ và đồng chỉnh sửa tài liệu thời gian thực',
      'Quản lý task với board, list và calendar view',
      'Wiki nội bộ và knowledge base cho tổ chức',
      'Tích hợp Google Workspace, Office 365 và 200+ apps'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 10.15+ / iOS 14+ / Android 10+', ram: '4GB', storage: '500MB', processor: 'Intel i3 / bất kỳ thiết bị hiện đại' },
    rating: 4.4,
    reviewCount: 2680,
    icon: '👥',
    color: '#fab1a0',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 10, period: 'month',
        features: ['10 thành viên', 'Chat & Video call', '10GB lưu trữ', 'Task cơ bản'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 25, period: 'month',
        features: ['50 thành viên', 'Tất cả tính năng chat', '100GB lưu trữ', 'Task nâng cao', 'Wiki & Knowledge base', 'Hỗ trợ ưu tiên'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 55, period: 'month',
        features: ['Không giới hạn thành viên', 'Tất cả tính năng Pro', '1TB lưu trữ', 'Admin console', 'SSO & SCIM', 'Data retention', 'Compliance controls', 'Onboarding & training'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Lâm Gia Hân', rating: 5, date: '2025-12-11', text: 'Thay thế cả Slack, Zoom và Trello bằng một công cụ duy nhất. Tiết kiệm chi phí và đơn giản hóa workflow.' },
      { user: 'Nguyễn Tuấn Kiệt', rating: 4, date: '2025-11-22', text: 'Video call chất lượng HD rất ổn định. Wiki nội bộ giúp onboarding nhân viên mới nhanh hơn nhiều.' },
      { user: 'Trần Thị Phương Anh', rating: 4, date: '2025-10-15', text: 'Tích hợp tốt với Google Workspace. Quản lý làm việc hybrid trở nên dễ dàng và hiệu quả.' }
    ],
    tags: ['Cộng tác', 'Team', 'Communication'],
    badge: null,
    discount: null
  },
  {
    id: 20,
    name: 'AI Content Flow',
    slug: 'ai-content-flow',
    category: 'ai',
    shortDesc: 'Tự động tạo nội dung đa kênh chuẩn SEO bằng AI. Lên lịch và tối ưu hóa bài viết tự động.',
    description: 'AI Content Flow là nền tảng quản lý và sản xuất nội dung tự động được vận hành bởi AI. Giúp doanh nghiệp tạo bài viết blog, bài đăng mạng xã hội, email marketing chỉ với một prompt. Tự động nghiên cứu từ khóa, tối ưu SEO và xuất bài lên WordPress, Facebook, LinkedIn.',
    features: [
      'Sinh nội dung SEO hàng loạt bằng GPT-4 & Claude 3.5',
      'Tự động lên kế hoạch và lịch đăng bài đa kênh',
      'Nghiên cứu từ khóa và phân tích đối thủ cạnh tranh',
      'Đo lường hiệu quả bài viết và đề xuất cải thiện tự động',
      'Tạo ảnh minh họa bằng DALL-E 3 & Midjourney API',
      'Tích hợp WordPress, Shopify, Facebook, LinkedIn, TikTok'
    ],
    systemReqs: { os: 'Web-based (Tương thích mọi thiết bị)', ram: 'Không yêu cầu', storage: 'Đám mây không giới hạn', processor: 'Không yêu cầu' },
    rating: 4.9,
    reviewCount: 1240,
    icon: '✍️',
    color: '#8b5cf6',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 19, period: 'month',
        features: ['100 bài viết/tháng', 'Tích hợp 2 mạng xã hội', 'Tạo ảnh AI cơ bản', 'Hỗ trợ qua Email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 49, period: 'month',
        features: ['Không giới hạn bài viết', 'Tích hợp 10 mạng xã hội', 'Tạo ảnh AI cao cấp', 'Nghiên cứu từ khóa Pro', 'Hỗ trợ ưu tiên 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 129, period: 'month',
        features: ['Tài khoản nhóm 5 người', 'API truy cập trực tiếp', 'Trình huấn luyện giọng điệu thương hiệu', 'Quản lý tài khoản riêng', 'Cam kết chất lượng SLA'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Nguyễn Văn Tiến', rating: 5, date: '2026-03-12', text: 'Tuyệt vời! Tôi đã tự động hóa được toàn bộ lịch đăng bài viết blog cho 3 website vệ tinh của mình.' },
      { user: 'Lê Thị Thu Thủy', rating: 5, date: '2026-02-18', text: 'Khả năng viết content rất tự nhiên, tối ưu SEO tốt. Rất khuyên dùng cho các digital marketer!' }
    ],
    tags: ['AI', 'Content', 'SEO', 'Automation'],
    badge: 'Best Seller',
    discount: 10
  },
  {
    id: 21,
    name: 'CRM Automation Pro',
    slug: 'crm-automation-pro',
    category: 'business',
    shortDesc: 'Đồng bộ hóa dữ liệu khách hàng, tự động chăm sóc và tối ưu hóa phễu bán hàng.',
    description: 'CRM Automation Pro giúp tự động hóa quy trình quản lý khách hàng từ lúc tiếp cận đến lúc mua hàng. Kết nối các biểu mẫu, landing page, tổng đài tự động lưu thông tin khách hàng, tự động phân chia cho nhân viên sale và gửi chuỗi email/tin nhắn chăm sóc khách hàng theo kịch bản.',
    features: [
      'Tự động thu thập lead từ Webhook, Form, Facebook Lead Ads',
      'Chu kỳ chăm sóc tự động bằng Email, SMS, Zalo ZNS',
      'Hệ thống chấm điểm Lead thông minh dựa trên hành vi',
      'Chia Lead tự động cho nhân viên Sale theo quy tắc',
      'Báo cáo hiệu suất phễu chuyển đổi thời gian thực',
      'API mở rộng kết nối với Kế toán, Kho hàng, Giao vận'
    ],
    systemReqs: { os: 'Web-based / iOS / Android', ram: 'Không yêu cầu', storage: 'Đám mây 50GB', processor: 'Không yêu cầu' },
    rating: 4.8,
    reviewCount: 980,
    icon: '📊',
    color: '#22d3ee',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 29, period: 'month',
        features: ['Quản lý 1,000 khách hàng', '3 phễu bán hàng', 'Tự động gửi email cơ bản', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 69, period: 'month',
        features: ['Quản lý 10,000 khách hàng', 'Không giới hạn phễu', 'Tự động gửi SMS/Zalo', 'Hệ thống chia lead tự động', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 199, period: 'month',
        features: ['Không giới hạn khách hàng', 'Tích hợp tổng đài VoIP', 'Bảo mật IP whitelist', 'Hỗ trợ kỹ thuật tại chỗ', 'Máy chủ riêng tùy chọn'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Hoàng Trung Hiếu', rating: 5, date: '2026-04-01', text: 'Từ khi dùng CRM Auto, đội ngũ sale của công ty không còn bỏ sót bất kỳ khách hàng tiềm năng nào.' }
    ],
    tags: ['CRM', 'Sales', 'Automation', 'Business'],
    badge: 'Hot',
    discount: null
  },
  {
    id: 22,
    name: 'Social Auto Manager',
    slug: 'social-auto-manager',
    category: 'business',
    shortDesc: 'Quản lý, lên lịch và tự động đăng bài trên 10+ mạng xã hội phổ biến từ một dashboard.',
    description: 'Social Auto Manager giải phóng bạn khỏi việc đăng bài thủ công mỗi ngày. Lên kế hoạch bài đăng cả tháng chỉ trong một buổi, tự động định dạng bài viết phù hợp với từng mạng xã hội, tự động tương tác và phản hồi bình luận khách hàng bằng trợ lý AI.',
    features: [
      'Hỗ trợ Facebook, Instagram, TikTok, LinkedIn, YouTube, X, Pinterest',
      'Lên lịch đăng bài trực quan theo dạng lịch (Calendar View)',
      'Tự động re-post bài viết cũ đạt tương tác cao để kéo traffic',
      'Trả lời comment và inbox tự động bằng trợ lý AI',
      'Báo cáo thống kê lượt tương tác và tốc độ tăng trưởng fanpage',
      'Chế độ xem trước bài viết chính xác trước khi xuất bản'
    ],
    systemReqs: { os: 'Web-based / Chrome Extension', ram: 'Không yêu cầu', storage: 'Lưu trữ media đám mây', processor: 'Không yêu cầu' },
    rating: 4.7,
    reviewCount: 1650,
    icon: '📱',
    color: '#fb7185',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 12, period: 'month',
        features: ['Quản lý 3 tài khoản', 'Lên lịch 30 bài viết/tháng', 'AI viết hộ caption cơ bản', 'Thống kê tương tác cơ bản'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 29, period: 'month',
        features: ['Quản lý 15 tài khoản', 'Không giới hạn bài viết', 'AI chatbot tự động trả lời comment', 'Phân tích đối thủ cạnh tranh', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 89, period: 'month',
        features: ['Không giới hạn tài khoản', 'Phân quyền kiểm duyệt bài viết cho team', 'Báo cáo nhãn trắng (White-label)', 'Tích hợp Slack/Teams', 'API riêng biệt'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Vũ Minh Hằng', rating: 5, date: '2026-05-15', text: 'Tuyệt đỉnh! Giúp tôi quản lý hệ thống 10 fanpage cửa hàng cực kỳ nhàn nhã.' }
    ],
    tags: ['Social Media', 'Marketing', 'Automation'],
    badge: 'Mới',
    discount: 15
  },
  {
    id: 23,
    name: 'Data Scraping Studio',
    slug: 'data-scraping-studio',
    category: 'development',
    shortDesc: 'Thu thập và cào dữ liệu từ bất kỳ website nào mà không cần viết code. Xuất dữ liệu sạch.',
    description: 'Data Scraping Studio là giải pháp đắc lực để thu thập thông tin sản phẩm, giá cả, lead, bài viết từ các website thương mại điện tử, mạng xã hội, diễn đàn. Giao diện click-and-select trực quan giúp bạn tạo chatbot, bot cào dữ liệu tự động chạy theo giờ.',
    features: [
      'Cào dữ liệu trực quan bằng cách click chọn phần tử trên web',
      'Vượt Cloudflare, captcha, proxy xoay vòng tự động',
      'Hỗ trợ cào các trang SPA dùng JavaScript/render chậm',
      'Lên lịch cào tự động hàng giờ/ngày/tuần',
      'Tự động làm sạch dữ liệu và định dạng lại cấu trúc',
      'Xuất file Excel, CSV, JSON hoặc đẩy thẳng vào Database qua API'
    ],
    systemReqs: { os: 'Windows 10+ / macOS 11+ / Ubuntu 20.04', ram: '8GB', storage: '500MB', processor: 'Intel i5 / Apple M1' },
    rating: 4.8,
    reviewCount: 720,
    icon: '🕷️',
    color: '#34d399',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 35, period: 'month',
        features: ['Cào 50,000 dòng/tháng', 'Chạy 1 bot đồng thời', 'Vượt captcha cơ bản', 'Hỗ trợ email'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 89, period: 'month',
        features: ['Cào 500,000 dòng/tháng', 'Chạy 5 bot đồng thời', 'Proxy xoay vòng miễn phí', 'Lên lịch cào đám mây', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 299, period: 'month',
        features: ['Không giới hạn dữ liệu', 'Dedicated proxy servers', 'Tùy chỉnh viết code script cào', 'Bảo trì bot theo yêu cầu', 'SLA 99.9%'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Phan Anh Vũ', rating: 5, date: '2026-03-22', text: 'Giúp tôi theo dõi giá đối thủ trên Shopee và Tiki tự động mỗi ngày cực kỳ chính xác.' }
    ],
    tags: ['Scraping', 'Data', 'Scraper', 'Developer'],
    badge: null,
    discount: null
  },
  {
    id: 24,
    name: 'Chatbot Support Pro',
    slug: 'chatbot-support-pro',
    category: 'ai',
    shortDesc: 'Chatbot AI thông minh tự trả lời khách hàng dựa trên file tài liệu và website của bạn.',
    description: 'Chatbot Support Pro là nhân viên hỗ trợ khách hàng thế hệ mới hoạt động 24/7. Chỉ cần tải lên tài liệu hướng dẫn sử dụng, file PDF sản phẩm hoặc nhập link website, chatbot AI sẽ tự động học kiến thức và trả lời chính xác, thông minh mọi câu hỏi của khách hàng trên Messenger, Website, Telegram.',
    features: [
      'Huấn luyện AI bằng cách tải tài liệu PDF, DOCX, TXT hoặc URL website',
      'Tự động nhận diện và trả lời bằng 50+ ngôn ngữ khác nhau',
      'Tích hợp Live Chat Web, Facebook Messenger, Zalo, Telegram, WhatsApp',
      'Chuyển tiếp hội thoại cho nhân viên thật khi gặp câu hỏi khó',
      'Phân tích biểu đồ các câu hỏi thường gặp của khách hàng',
      'Tùy biến giao diện chatbot, logo, màu sắc thương hiệu của bạn'
    ],
    systemReqs: { os: 'Web-based (Tương thích mọi thiết bị)', ram: 'Không yêu cầu', storage: 'Lưu trữ file kiến thức đám mây', processor: 'Không yêu cầu' },
    rating: 4.9,
    reviewCount: 1890,
    icon: '🤖',
    color: '#3b82f6',
    plans: [
      {
        type: 'basic', name: 'Basic', price: 15, period: 'month',
        features: ['1 chatbot AI', '100 file/link huấn luyện', '1,000 tin nhắn/tháng', 'Tích hợp website'],
        popular: false
      },
      {
        type: 'pro', name: 'Pro', price: 39, period: 'month',
        features: ['3 chatbot AI', '500 file/link huấn luyện', '10,000 tin nhắn/tháng', 'Tích hợp Messenger/Zalo/Telegram', 'Hỗ trợ 24/7'],
        popular: true
      },
      {
        type: 'enterprise', name: 'Enterprise', price: 149, period: 'month',
        features: ['Không giới hạn chatbot', 'Lượng tin nhắn tùy chỉnh', 'Không giới hạn dữ liệu huấn luyện', 'Máy chủ AI chuyên dụng', 'Hỗ trợ cấu hình trọn gói'],
        popular: false
      }
    ],
    reviews: [
      { user: 'Đỗ Hoàng My', rating: 5, date: '2026-05-19', text: 'Chatbot học kiến thức cực kỳ nhanh và trả lời rất khéo léo. Tiết kiệm 80% thời gian trực fanpage của nhân viên tư vấn.' }
    ],
    tags: ['AI', 'Chatbot', 'Support', 'Customer Care'],
    badge: 'Best Seller',
    discount: 20
  }
];

// ------------------------------------------------------------
// Categories
// ------------------------------------------------------------
const categories = [
  { id: 'all', name: 'Tất Cả', icon: 'grid' },
  { id: 'design', name: 'Thiết Kế', icon: 'palette' },
  { id: 'development', name: 'Lập Trình', icon: 'code' },
  { id: 'security', name: 'Bảo Mật', icon: 'shield' },
  { id: 'productivity', name: 'Năng Suất', icon: 'zap' },
  { id: 'ai', name: 'AI & ML', icon: 'brain' },
  { id: 'business', name: 'Kinh Doanh', icon: 'briefcase' }
];

// ------------------------------------------------------------
// Testimonials (6 items)
// ------------------------------------------------------------
const testimonials = [
  {
    user: 'Nguyễn Văn Thành',
    role: 'Giám đốc Công nghệ',
    company: 'TechViet Solutions',
    text: 'SoftwareStore đã giúp công ty chúng tôi tìm được những công cụ phần mềm tốt nhất với giá cả hợp lý. Quy trình mua hàng đơn giản và hỗ trợ kỹ thuật luôn sẵn sàng 24/7. Chúng tôi đã tiết kiệm hơn 40% chi phí phần mềm so với mua riêng lẻ.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    user: 'Trần Thị Minh Nguyệt',
    role: 'Trưởng phòng Thiết kế',
    company: 'Creative Hub Agency',
    text: 'Là một agency thiết kế, chúng tôi cần nhiều công cụ khác nhau. SoftwareStore tập hợp mọi thứ ở một nơi với license quản lý dễ dàng. Đội ngũ hỗ trợ rất chuyên nghiệp và tận tâm, luôn giải quyết vấn đề nhanh chóng.',
    rating: 5,
    avatar: '👩‍🎨'
  },
  {
    user: 'Lê Hoàng Đức',
    role: 'Founder & CEO',
    company: 'DataMind AI',
    text: 'Các sản phẩm AI trên SoftwareStore rất chất lượng và cập nhật liên tục theo công nghệ mới nhất. NeuralNet AI đã giúp startup của tôi xây dựng sản phẩm AI đầu tiên mà không cần đội ngũ ML chuyên sâu.',
    rating: 5,
    avatar: '👨‍🔬'
  },
  {
    user: 'Phạm Thị Thanh Hoa',
    role: 'Giám đốc Vận hành',
    company: 'Logistics Pro Việt Nam',
    text: 'TaskFlow Pro và FinanceTracker Pro đã số hóa toàn bộ quy trình vận hành của công ty logistics 500 nhân viên. Hiệu suất làm việc tăng 35% và giảm đáng kể lỗi do nhập liệu thủ công. SoftwareStore thực sự là đối tác tin cậy.',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    user: 'Đỗ Minh Quân',
    role: 'Lead Developer',
    company: 'FinTech Innovations',
    text: 'CodeForge IDE và DevOps Commander là bộ đôi hoàn hảo cho đội ngũ phát triển của chúng tôi. Tốc độ coding và deploy tăng gấp 3 lần. Chính sách giảm giá cho doanh nghiệp rất hấp dẫn và linh hoạt.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    user: 'Vũ Thị Hồng Ánh',
    role: 'Marketing Director',
    company: 'Digital Growth Agency',
    text: 'SEO Wizard Pro và EmailCraft Pro là hai công cụ không thể thiếu trong chiến lược digital marketing của chúng tôi. Khách hàng tăng organic traffic trung bình 150% sau 6 tháng. Giao diện SoftwareStore rất chuyên nghiệp và đáng tin cậy.',
    rating: 5,
    avatar: '👩‍🏫'
  }
];

// ------------------------------------------------------------
// FAQ Items (8 items)
// ------------------------------------------------------------
const faqItems = [
  {
    question: 'SoftwareStore hỗ trợ những phương thức thanh toán nào?',
    answer: 'Chúng tôi hỗ trợ đa dạng phương thức thanh toán bao gồm thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), chuyển khoản ngân hàng nội địa, ví điện tử MoMo, ZaloPay và VNPay. Tất cả giao dịch đều được mã hóa SSL 256-bit để đảm bảo an toàn tuyệt đối.',
    category: 'Thanh toán'
  },
  {
    question: 'Chính sách hoàn tiền của SoftwareStore như thế nào?',
    answer: 'Chúng tôi áp dụng chính sách hoàn tiền 30 ngày không điều kiện cho tất cả sản phẩm. Nếu bạn không hài lòng với sản phẩm, chỉ cần liên hệ bộ phận hỗ trợ và chúng tôi sẽ hoàn tiền đầy đủ trong vòng 5-7 ngày làm việc. Không cần giải thích lý do.',
    category: 'Chính sách'
  },
  {
    question: 'Phần mềm có được cập nhật thường xuyên không?',
    answer: 'Tất cả sản phẩm phần mềm trên SoftwareStore đều được cập nhật miễn phí trong suốt thời gian đăng ký. Các bản cập nhật bao gồm tính năng mới, sửa lỗi và cải thiện hiệu năng, được phát hành hàng tháng. Bạn sẽ nhận thông báo tự động mỗi khi có bản cập nhật mới.',
    category: 'Sản phẩm'
  },
  {
    question: 'Tôi có thể nhận hỗ trợ kỹ thuật ở đâu?',
    answer: 'Chúng tôi cung cấp hỗ trợ kỹ thuật qua nhiều kênh: live chat trên website (phản hồi trong 2 phút), email (phản hồi trong 4 giờ), hotline 1900-xxxx (8:00-22:00 hàng ngày). Gói Pro và Enterprise được hưởng hỗ trợ ưu tiên 24/7 với thời gian phản hồi cam kết.',
    category: 'Hỗ trợ'
  },
  {
    question: 'Có những loại license nào cho phần mềm?',
    answer: 'SoftwareStore cung cấp 3 loại license chính: Basic (cá nhân/freelancer), Pro (nhóm nhỏ/doanh nghiệp vừa) và Enterprise (doanh nghiệp lớn). Mỗi loại license có các tính năng và giới hạn người dùng khác nhau. Bạn có thể nâng cấp hoặc hạ cấp license bất cứ lúc nào mà không mất dữ liệu.',
    category: 'License'
  },
  {
    question: 'Quy trình cài đặt phần mềm như thế nào?',
    answer: 'Sau khi thanh toán thành công, bạn sẽ nhận email kích hoạt cùng hướng dẫn cài đặt chi tiết. Hầu hết phần mềm có installer tự động, chỉ cần tải về và chạy file cài đặt. Đối với ứng dụng web-based, bạn có thể truy cập ngay bằng tài khoản đã đăng ký mà không cần cài đặt.',
    category: 'Cài đặt'
  },
  {
    question: 'Yêu cầu cấu hình hệ thống tối thiểu là gì?',
    answer: 'Mỗi sản phẩm có yêu cầu cấu hình riêng được hiển thị chi tiết trên trang sản phẩm. Nhìn chung, hầu hết phần mềm yêu cầu tối thiểu Windows 10/macOS 10.15, RAM 4GB và 1GB dung lượng ổ cứng trống. Các phần mềm đồ họa và AI sẽ cần cấu hình cao hơn với GPU chuyên dụng.',
    category: 'Hệ thống'
  },
  {
    question: 'Có chương trình giảm giá cho sinh viên hoặc doanh nghiệp không?',
    answer: 'Có! Chúng tôi có chương trình giảm giá đặc biệt: sinh viên/giáo viên được giảm 50% cho tất cả gói Basic và Pro, doanh nghiệp mua từ 10 license trở lên được giảm 20-30%. Ngoài ra, hãy theo dõi các chương trình khuyến mãi theo mùa và sử dụng mã coupon để tiết kiệm thêm.',
    category: 'Khuyến mãi'
  }
];

// ------------------------------------------------------------
// Team Members (4)
// ------------------------------------------------------------
const teamMembers = [
  {
    name: 'Nguyễn Trung Kiên',
    role: 'Founder & CEO',
    bio: 'Hơn 15 năm kinh nghiệm trong ngành công nghệ phần mềm. Từng giữ vị trí CTO tại nhiều công ty công nghệ hàng đầu Việt Nam trước khi sáng lập SoftwareStore.',
    avatar: '👨‍💼'
  },
  {
    name: 'Trần Thị Phương Linh',
    role: 'Giám đốc Sản phẩm',
    bio: 'Chuyên gia UX/UI với đam mê tạo ra trải nghiệm người dùng xuất sắc. Dẫn dắt đội ngũ phát triển sản phẩm với triết lý "khách hàng là trung tâm".',
    avatar: '👩‍💻'
  },
  {
    name: 'Lê Đức Thắng',
    role: 'Giám đốc Công nghệ',
    bio: 'Kiến trúc sư hệ thống với chuyên môn về cloud computing và AI. Xây dựng nền tảng công nghệ vững chắc giúp SoftwareStore phục vụ hàng triệu người dùng.',
    avatar: '👨‍🔬'
  },
  {
    name: 'Phạm Ngọc Hà My',
    role: 'Giám đốc Kinh doanh',
    bio: 'Hơn 10 năm kinh nghiệm trong lĩnh vực kinh doanh phần mềm doanh nghiệp. Phát triển mạng lưới đối tác chiến lược và mở rộng thị trường ra khu vực Đông Nam Á.',
    avatar: '👩‍🏫'
  }
];

// ------------------------------------------------------------
// Partners
// ------------------------------------------------------------
const partners = ['Microsoft', 'Google', 'Adobe', 'Atlassian', 'JetBrains', 'GitHub'];

// ------------------------------------------------------------
// Coupons
// ------------------------------------------------------------
const coupons = {
  'SAVE10': 10,
  'SAVE20': 20,
  'WELCOME': 15,
  'VIP30': 30
};

// ------------------------------------------------------------
// Home Stats
// ------------------------------------------------------------
const stats = [
  { value: '500+', label: 'Công cụ tự động hóa' },
  { value: 'Tức thì', label: 'Giao sản phẩm kỹ thuật số' },
  { value: '24/7', label: 'Hỗ trợ người dùng thiết lập' }
];

// ------------------------------------------------------------
// Export to namespace
// ------------------------------------------------------------
SoftwareStore.Data = {
  products,
  categories,
  testimonials,
  faqItems,
  teamMembers,
  partners,
  coupons,
  stats
};
