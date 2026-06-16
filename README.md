# SoftZone — Website Tự Động Hóa & Cửa Hàng Phần Mềm Premium 💎

SoftZone là nền tảng thương mại điện tử cung cấp các giải pháp tự động hóa công việc và sản phẩm phần mềm bản quyền hàng đầu Việt Nam. Website được xây dựng với trải nghiệm người dùng cao cấp, tích hợp hiệu ứng cuộn điện ảnh (Cinematic Scrolling) và khu vực lập trình thử nghiệm kéo thả trực quan (Automation Playground).

---

## ✨ Tính Năng Nổi Bật

### 1. Cinematic Scroll Storytelling 🎬
* Trải nghiệm giới thiệu giải pháp tự động hóa bằng cách cuộn chuột, thay đổi nội dung linh hoạt nhờ thư viện hoạt ảnh **GSAP & ScrollTrigger**.
* Hệ thống **Automation Core** quỹ đạo xoay tròn 3D phản hồi trực quan khi di chuột qua các node nghiệp vụ (Email, AI, Database, CRM, Social, Analytics).
* Công thức Hold/Exit đặc biệt điều khiển cục bộ từng phân cảnh giúp người dùng đọc nội dung trọn vẹn, không bị biến mất quá nhanh.

### 2. Interactive Automation Playground ⚙️
* Sân chơi mô phỏng quy trình tự động hóa cho phép người dùng tự do **Kéo - Thả - Kết nối** các node trigger (Form, Webhook) với các node action (AI, CRM, Email, Slack...).
* Tích hợp các template mẫu tự động hóa kinh doanh (Chăm sóc khách hàng VIP, Đăng bài tự động, Chatbot Support).
* Tính năng **Chạy thử mô phỏng (Run Simulation)** hiển thị dòng dữ liệu nhấp nháy chuyển động thời gian thực cùng nhật ký hệ thống trực quan.
* Tối ưu hóa hoàn toàn cho **thiết bị di động** với hệ thống Bottom Sheets trượt mượt mà, chạm canvas tự động thu nhỏ và cơ chế nhấp chọn để thêm Node (Click-to-add).

### 3. Cửa Hàng Bản Quyền & Giỏ Hàng Hoạt Động Trơn Tru 🛍️
* Bộ lọc danh mục phần mềm, tìm kiếm thời gian thực thông minh cùng sắp xếp giá bán/đánh giá.
* Hỗ trợ đầy đủ luồng thêm sản phẩm vào giỏ hàng, cập nhật số lượng, áp mã giảm giá và trang thanh toán hóa đơn.
* Đăng ký & Đăng nhập tài khoản lưu trữ trạng thái mua sắm cục bộ.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core:** HTML5, CSS3 (Custom Variables, Flexbox, CSS Grid).
* **Logic:** Vanilla JavaScript (ES6+ Module Pattern).
* **Libraries:** 
  * [GSAP & ScrollTrigger](https://greensock.com/gsap/) - Xử lý hoạt ảnh cinematic scroll.
  * [Lucide Icons](https://lucide.dev/) - Hệ thống biểu tượng vector hiện đại.
* **Backend/Server:** Tĩnh (SPA client-side routing, lưu trữ dữ liệu sản phẩm và giỏ hàng qua LocalStorage).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Chạy qua Local Web Server
Do trang web sử dụng cơ chế chia module JS tĩnh (`type="module"`), bạn cần chạy thông qua một máy chủ local để tránh lỗi bảo mật CORS của trình duyệt.

#### Cách 1: Sử dụng tập tin server đi kèm (Windows PowerShell)
Bấm đúp chuột vào file `serve.ps1` hoặc mở PowerShell và gõ:
```powershell
./serve.ps1
```

#### Cách 2: Sử dụng VS Code Live Server
1. Mở thư mục dự án bằng **VS Code**.
2. Cài đặt extension **Live Server**.
3. Nhấp vào nút **Go Live** ở góc phải dưới cùng của VS Code.

#### Cách 3: Sử dụng Python
Nếu máy bạn đã cài sẵn Python, mở terminal tại thư mục dự án và chạy:
```bash
python -m http.server 8000
```
Sau đó truy cập địa chỉ: **http://localhost:8000/** trên trình duyệt.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
├── css/
│   ├── components.css     # Định nghĩa các component nút, thẻ sản phẩm, nav...
│   ├── pages.css          # Layout các trang con Store, Cart, Detail...
│   ├── playground.css     # Định nghĩa giao diện Playground & Mobile Bottom Sheets
│   ├── story.css          # Giao diện sân khấu Cinematic Scroll & Safe area
│   └── style.css          # Token màu sắc chính, typography hệ thống
├── js/
│   ├── app.js             # Bộ khởi chạy ứng dụng & quản lý Router trang
│   ├── components.js      # Templates HTML các thành phần giao diện
│   ├── data.js            # Dữ liệu sản phẩm, bài đánh giá mẫu
│   ├── pages.js           # Các hàm render cấu trúc HTML các trang con
│   ├── playground.js      # Logic quản lý Canvas, kết nối node & chạy simulation
│   ├── store.js           # Quản lý state giỏ hàng, wishlist & login
│   ├── story.js           # Cinematic Scroll Engine điều phối local progress
│   └── utils.js           # Các hàm helper định dạng tiền tệ, toast, bounce...
├── index.html             # Tập tin cấu trúc gốc của trang web
└── serve.ps1              # Script PowerShell khởi tạo server nhanh
```

---

## 📝 Bản Quyền
Dự án được bảo lưu mọi quyền bởi **SoftZone 2026**. Thiết kế sang trọng, tối giản và hiện đại.
