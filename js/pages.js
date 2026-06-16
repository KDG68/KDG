window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.Pages = (() => {
  const { Data, Store, Utils, Components } = SoftwareStore;

  // ========================
  // MUTABLE STATE (exposed on the returned object)
  // ========================
  const _storeState = { category: 'all', search: '', sort: 'default', page: 1 };
  let _accountTab = 'profile';

  // ========================
  // HELPERS
  // ========================
  function sectionTitle(text) {
    return `<h2 class="section__title scroll-reveal"><span class="text-gradient">${text}</span></h2>`;
  }

  function pageHero(title, subtitle) {
    return `
      <section class="page-hero">
        <div class="container">
          <h1 class="page-hero__title scroll-reveal"><span class="text-gradient">${title}</span></h1>
          ${subtitle ? `<p class="page-hero__subtitle scroll-reveal">${subtitle}</p>` : ''}
        </div>
      </section>
    `;
  }

  // ========================
  // PAGE FUNCTIONS
  // ========================

  function home() {
    const products = Data.products;
    const testimonials = Data.testimonials;
    const partners = Data.partners;

    return `
      <!-- SYSTEM INITIALIZATION SCROLL STORYSTAGE -->
      ${SoftwareStore.Story.render()}

      <!-- STATIC SECTIONS (REST OF HOMEPAGE) -->
      <div style="position: relative; z-index: 12; background: var(--bg-main); box-shadow: 0 -20px 40px rgba(0,0,0,0.8);">
        
        <!-- MOBILE PLAYGROUND SECTION -->
        <section class="section mobile-playground-section" id="mobile-playground-section" style="padding: 2.5rem 0 0.5rem 0;">
          <div class="container">
            ${sectionTitle('SoftZone Playground')}
            <div id="mobile-playground-viewport" style="width: 100%; margin-top: 1.5rem;"></div>
          </div>
        </section>

        <section class="section" id="featured-products-section">
          <div class="container">
            ${sectionTitle('Sản Phẩm Tự Động Hóa Bán Chạy')}
            <div class="featured-grid">
              ${products.slice(0, 6).map(p => Components.productCard(p)).join('')}
            </div>
            <div class="section__action scroll-reveal">
              <a href="#/store" class="btn btn--outline btn--lg">
                <i data-lucide="arrow-right"></i> Xem Tất Cả Sản Phẩm
              </a>
            </div>
          </div>
        </section>

        <section class="section section--alt">
          <div class="container">
            ${sectionTitle('Giải Pháp Tiên Phong')}
            <div class="features-grid">
              ${Components.featureItem(
                'shield-check',
                'An Toàn & Bản Quyền',
                '100% phần mềm và tool tự động hóa được kiểm tra mã độc, cung cấp giấy phép bản quyền chính hãng an toàn.'
              )}
              ${Components.featureItem(
                'cpu',
                'Hệ Sinh Thái AI',
                'Các công cụ thông minh tích hợp API GPT-4, Claude 3.5 giúp tự động hóa quy trình nghiệp vụ phức tạp.'
              )}
              ${Components.featureItem(
                'headphones',
                'Hỗ Trợ Thiết Lập',
                'Đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ cài đặt, cấu hình và kết nối hệ thống 24/7.'
              )}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            ${sectionTitle('Ý Kiến Khách Hàng')}
            <div class="testimonials-grid">
              ${testimonials.slice(0, 3).map(t => Components.testimonialCard(t)).join('')}
            </div>
          </div>
        </section>

        <section class="section section--alt">
          <div class="container">
            ${sectionTitle('Kết Nối Với Đối Tác')}
            <div class="partners-grid scroll-reveal">
              ${partners.map(p => `<span class="partner-logo">${p}</span>`).join('')}
            </div>
          </div>
        </section>

        <section class="cta-section">
          <div class="container">
            <div class="cta-section__content scroll-reveal">
              <h2 class="cta-section__title"><span class="text-gradient">Khởi Động Doanh Nghiệp Tự Động</span></h2>
              <p class="cta-section__subtitle">
                Giải phóng sức lao động, giảm thiểu sai sót và tăng tốc độ xử lý công việc gấp 10 lần ngay hôm nay.
              </p>
              <a href="#/store" class="btn btn--primary btn--lg" style="box-shadow: var(--glow-purple)">
                <i data-lucide="rocket"></i> Bắt đầu ngay
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function store() {
    const allProducts = Data.products;
    const categories = Data.categories;
    const { category, search, sort, page } = _storeState;
    const ITEMS_PER_PAGE = 9;

    // Filter by category
    let filtered = category === 'all'
      ? [...allProducts]
      : allProducts.filter(p => p.category === category);

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case 'price-asc': {
        filtered.sort((a, b) => {
          const pa = (a.plans.find(p => p.type === 'pro') || a.plans[0]).price;
          const pb = (b.plans.find(p => p.type === 'pro') || b.plans[0]).price;
          return pa - pb;
        });
        break;
      }
      case 'price-desc': {
        filtered.sort((a, b) => {
          const pa = (a.plans.find(p => p.type === 'pro') || a.plans[0]).price;
          const pb = (b.plans.find(p => p.type === 'pro') || b.plans[0]).price;
          return pb - pa;
        });
        break;
      }
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageProducts = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return `
      ${pageHero('Cửa Hàng Phần Mềm', 'Tìm kiếm và khám phá bộ sưu tập phần mềm chất lượng cao')}
      <section class="section">
        <div class="container">
          <div class="store-header">
            ${Components.searchBar(search)}
            ${Components.sortSelect(sort)}
          </div>
          ${Components.categoryFilter(categories, category)}
          <div class="store-results scroll-reveal">
            <span class="store-results__count">Hiển thị <strong>${pageProducts.length}</strong> / <strong>${filtered.length}</strong> sản phẩm</span>
          </div>
          ${Components.productGrid(pageProducts)}
          ${Components.pagination(currentPage, totalPages)}
        </div>
      </section>
    `;
  }

  function productDetail(productId) {
    const product = Data.products.find(p => p.id === productId);
    if (!product) return notFound();

    const categoryName = Data.categories.find(c => c.id === product.category)?.name || product.category;
    const related = Data.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);

    return `
      <section class="section">
        <div class="container">
          ${Components.breadcrumb([
            { label: 'Trang Chủ', href: '#/' },
            { label: 'Cửa Hàng', href: '#/store' },
            { label: product.name }
          ])}

          <div class="product-detail">
            <div class="product-detail__gallery scroll-reveal">
              <div class="product-detail__image" style="background: linear-gradient(135deg, ${product.color}20, ${product.color}60); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                ${(product.icon.includes('.') || product.icon.startsWith('http')) 
                  ? `<img src="${product.icon}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.2);">` 
                  : `<span class="product-detail__gallery-icon" style="font-size: 6rem;">${product.icon}</span>`}
              </div>
            </div>

            <div class="product-detail__info scroll-reveal">
              <span class="product-detail__category">${categoryName}</span>
              <h1 class="product-detail__title">${product.name}</h1>
              <div class="product-detail__rating">
                ${Utils.renderStars(product.rating)}
                <span class="product-detail__rating-text">${product.rating} (${Utils.formatNumber(product.reviewCount)} đánh giá)</span>
              </div>
              ${(product.id === 20 || product.id === 21 || product.id === 24) ? `
                <div style="margin: 1.25rem 0;">
                  <button class="btn btn--primary btn--sm" onclick="SoftwareStore.Story.tryProductInPlayground(${product.id})">
                    <i data-lucide="play-circle" style="display:inline; width:16px; height:16px; vertical-align:middle; margin-right:4px;"></i> Thử trong Automation Playground
                  </button>
                </div>
              ` : ''}
              <p class="product-detail__desc">${product.description || product.shortDesc}</p>

              ${product.features && product.features.length > 0 ? `
                <div class="product-detail__features">
                  <h3>Tính Năng Nổi Bật</h3>
                  <div class="product-detail__features-grid">
                    ${product.features.map(f => `
                      <div class="product-detail__feature">
                        <i data-lucide="check" class="product-detail__feature-icon"></i>
                        <span>${f}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="pricing-section scroll-reveal">
            ${sectionTitle('Chọn Gói Phù Hợp')}
            <div class="pricing-grid">
              ${product.plans.map(plan => Components.pricingCard(plan, product)).join('')}
            </div>
          </div>

          ${product.requirements ? `
            <div class="requirements-section scroll-reveal">
              <h3 class="requirements-section__title">Yêu Cầu Hệ Thống</h3>
              <div class="requirements-grid">
                ${Object.entries(product.requirements).map(([key, val]) => `
                  <div class="requirements-item">
                    <span class="requirements-item__label">${key}</span>
                    <span class="requirements-item__value">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${product.reviews && product.reviews.length > 0 ? `
            <div class="reviews-section scroll-reveal">
              ${sectionTitle('Đánh Giá Từ Người Dùng')}
              <div class="reviews-grid">
                ${product.reviews.map(r => Components.reviewCard(r)).join('')}
              </div>
            </div>
          ` : ''}

          ${related.length > 0 ? `
            <div class="related-section scroll-reveal">
              ${sectionTitle('Sản Phẩm Liên Quan')}
              <div class="related-grid">
                ${related.map(p => Components.productCard(p)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  function cart() {
    const items = Store.getCartItems();
    const subtotal = Store.getCartSubtotal();
    const discount = Store.getCartDiscount();
    const total = Store.getCartTotal();
    const coupon = Store.state.appliedCoupon;

    return `
      <section class="section">
        <div class="container">
          ${Components.breadcrumb([
            { label: 'Trang Chủ', href: '#/' },
            { label: 'Giỏ Hàng' }
          ])}

          <h1 class="page-title scroll-reveal"><i data-lucide="shopping-cart"></i> Giỏ Hàng</h1>

          ${items.length === 0 ? `
            ${Components.emptyState(
              'shopping-cart',
              'Giỏ hàng trống',
              'Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá cửa hàng!',
              'Mua Sắm Ngay',
              '#/store'
            )}
          ` : `
            <div class="cart-layout">
              <div class="cart-layout__items scroll-reveal">
                ${items.map(item => Components.cartItem(item)).join('')}
              </div>

              <div class="cart-layout__summary scroll-reveal">
                <div class="cart-summary-card">
                  <h3 class="cart-summary-card__title">Tóm Tắt Đơn Hàng</h3>
                  <div class="cart-summary-card__row">
                    <span>Tạm tính</span>
                    <span>${Utils.formatCurrency(subtotal)}</span>
                  </div>
                  <div class="cart-summary-card__coupon">
                    ${coupon ? `
                      <div class="cart-summary-card__coupon-applied">
                        <span><i data-lucide="tag"></i> ${coupon.code} (-${coupon.discount}%)</span>
                        <button class="btn btn--ghost btn--sm" data-action="removeCoupon">
                          <i data-lucide="x"></i>
                        </button>
                      </div>
                    ` : `
                      <form id="coupon-form" class="cart-summary-card__coupon-form">
                        <input type="text" id="coupon-input" class="form-input" placeholder="Mã giảm giá...">
                        <button type="submit" class="btn btn--outline btn--sm">Áp dụng</button>
                      </form>
                    `}
                  </div>
                  ${discount > 0 ? `
                    <div class="cart-summary-card__row cart-summary-card__row--discount">
                      <span>Giảm giá</span>
                      <span>-${Utils.formatCurrency(discount)}</span>
                    </div>
                  ` : ''}
                  <div class="cart-summary-card__row cart-summary-card__row--total">
                    <span>Tổng cộng</span>
                    <strong>${Utils.formatCurrency(total)}</strong>
                  </div>
                  <a href="#/checkout" class="btn btn--primary btn--lg cart-summary-card__checkout-btn">
                    <i data-lucide="credit-card"></i> Tiến Hành Thanh Toán
                  </a>
                  <a href="#/store" class="btn btn--ghost cart-summary-card__continue-btn">
                    <i data-lucide="arrow-left"></i> Tiếp Tục Mua Sắm
                  </a>
                </div>
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  }

  function checkout() {
    const items = Store.getCartItems();
    const total = Store.getCartTotal();

    if (items.length === 0) {
      return `
        <section class="section">
          <div class="container">
            ${Components.emptyState(
              'shopping-bag',
              'Giỏ hàng trống',
              'Bạn cần thêm sản phẩm trước khi thanh toán.',
              'Đến Cửa Hàng',
              '#/store'
            )}
          </div>
        </section>
      `;
    }

    return `
      <section class="section">
        <div class="container">
          ${Components.breadcrumb([
            { label: 'Trang Chủ', href: '#/' },
            { label: 'Giỏ Hàng', href: '#/cart' },
            { label: 'Thanh Toán' }
          ])}

          <h1 class="page-title scroll-reveal"><i data-lucide="credit-card"></i> Thanh Toán</h1>

          <div class="checkout-layout">
            <div class="checkout-layout__form scroll-reveal">
              <form id="checkout-form">
                <div class="checkout-section">
                  <h3 class="checkout-section__title"><i data-lucide="user"></i> Thông Tin Khách Hàng</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="checkout-name">Họ và tên *</label>
                      <input type="text" class="form-input" id="checkout-name" placeholder="Nguyễn Văn A" required
                        value="${Store.isLoggedIn() && Store.state.user ? Store.state.user.name : ''}">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-email">Email *</label>
                      <input type="email" class="form-input" id="checkout-email" placeholder="email@example.com" required
                        value="${Store.isLoggedIn() && Store.state.user ? Store.state.user.email : ''}">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-phone">Số điện thoại *</label>
                      <input type="tel" class="form-input" id="checkout-phone" placeholder="0912 345 678" required>
                    </div>
                    <div class="form-group form-group--full">
                      <label class="form-label" for="checkout-address">Địa chỉ</label>
                      <input type="text" class="form-input" id="checkout-address" placeholder="Số nhà, đường, quận/huyện, thành phố">
                    </div>
                  </div>
                </div>

                <div class="checkout-section">
                  <h3 class="checkout-section__title"><i data-lucide="wallet"></i> Phương Thức Thanh Toán</h3>
                  <div class="payment-methods">
                    <label class="payment-method">
                      <input type="radio" name="payment" value="credit_card" checked>
                      <span class="payment-method__content">
                        <span class="payment-method__icon">💳</span>
                        <span class="payment-method__label">Thẻ tín dụng / Ghi nợ</span>
                      </span>
                    </label>
                    <label class="payment-method">
                      <input type="radio" name="payment" value="paypal">
                      <span class="payment-method__content">
                        <span class="payment-method__icon">🅿️</span>
                        <span class="payment-method__label">PayPal</span>
                      </span>
                    </label>
                    <label class="payment-method">
                      <input type="radio" name="payment" value="bank_transfer">
                      <span class="payment-method__content">
                        <span class="payment-method__icon">🏦</span>
                        <span class="payment-method__label">Chuyển khoản ngân hàng</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button type="submit" class="btn btn--primary btn--lg checkout-submit">
                  <i data-lucide="lock"></i> Đặt Hàng
                </button>
              </form>
            </div>

            <div class="checkout-layout__summary scroll-reveal">
              <div class="cart-summary-card">
                <h3 class="cart-summary-card__title">Đơn Hàng Của Bạn</h3>
                <div class="checkout-items">
                  ${items.map(item => {
                    let unitPrice = item.plan.price;
                    if (item.product.discount) unitPrice = unitPrice * (1 - item.product.discount / 100);
                    return `
                      <div class="checkout-item">
                        <div class="checkout-item__info">
                          <span class="checkout-item__icon">${item.product.icon}</span>
                          <div>
                            <span class="checkout-item__name">${item.product.name}</span>
                            <span class="checkout-item__plan">Gói ${item.plan.name} × ${item.quantity}</span>
                          </div>
                        </div>
                        <span class="checkout-item__price">${Utils.formatCurrency(unitPrice * item.quantity)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
                <div class="cart-summary-card__divider"></div>
                <div class="cart-summary-card__row cart-summary-card__row--total">
                  <span>Tổng thanh toán</span>
                  <strong>${Utils.formatCurrency(total)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function account() {
    if (!Store.isLoggedIn()) {
      return `
        <section class="section">
          <div class="container">
            ${Components.emptyState(
              'user-x',
              'Chưa đăng nhập',
              'Vui lòng đăng nhập hoặc đăng ký để xem tài khoản của bạn.',
              'Đăng Nhập',
              '#/'
            )}
          </div>
        </section>
      `;
    }

    const user = Store.state.user;
    const orders = Store.getOrders();
    const wishlistItems = Store.getWishlistItems();
    const tabs = [
      { id: 'profile', label: 'Hồ Sơ', icon: 'user' },
      { id: 'orders', label: 'Đơn Hàng', icon: 'package' },
      { id: 'wishlist', label: 'Yêu Thích', icon: 'heart' }
    ];

    let tabContent = '';

    if (_accountTab === 'profile') {
      tabContent = `
        <div class="account__profile-card">
          <div class="account__profile-header">
            <div class="account__avatar-large">${Utils.getInitials(user.name)}</div>
            <div class="account-profile__meta">
              <h2 class="account-profile__name">${user.name}</h2>
              <p class="account-profile__email">${user.email}</p>
              <p class="account-profile__joined">
                <i data-lucide="calendar"></i> Tham gia: ${Utils.formatDate(user.joinDate)}
              </p>
            </div>
          </div>
          <form id="profile-form" class="account-profile__form">
            <h3>Chỉnh Sửa Hồ Sơ</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="profile-name">Họ và tên</label>
                <input type="text" class="form-input" id="profile-name" value="${user.name}" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="profile-email">Email</label>
                <input type="email" class="form-input" id="profile-email" value="${user.email}" required>
              </div>
            </div>
            <div class="account-profile__actions">
              <button type="submit" class="btn btn--primary">
                <i data-lucide="save"></i> Lưu Thay Đổi
              </button>
              <button type="button" class="btn btn--outline btn--danger" data-action="logout">
                <i data-lucide="log-out"></i> Đăng Xuất
              </button>
            </div>
          </form>
        </div>
      `;
    } else if (_accountTab === 'orders') {
      tabContent = orders.length > 0
        ? `<div class="account-orders">${orders.map(o => Components.orderCard(o)).join('')}</div>`
        : Components.emptyState('package', 'Chưa có đơn hàng', 'Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm!', 'Mua Sắm Ngay', '#/store');
    } else if (_accountTab === 'wishlist') {
      tabContent = wishlistItems.length > 0
        ? `<div class="wishlist-grid">${wishlistItems.map(p => Components.productCard(p)).join('')}</div>`
        : Components.emptyState('heart', 'Danh sách trống', 'Bạn chưa thêm sản phẩm nào vào yêu thích.', 'Khám Phá Ngay', '#/store');
    }

    return `
      ${pageHero('Tài Khoản', 'Quản lý tài khoản và đơn hàng của bạn')}
      <section class="section">
        <div class="container">
          <div class="account">
            <aside class="account__sidebar scroll-reveal">
              ${tabs.map(tab => `
                <button class="account__sidebar-btn ${_accountTab === tab.id ? 'is-active' : ''}"
                  data-action="accountTab" data-tab="${tab.id}">
                  <i data-lucide="${tab.icon}"></i>
                  <span>${tab.label}</span>
                </button>
              `).join('')}
            </aside>
            <div class="account__content scroll-reveal">
              ${tabContent}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function about() {
    const teamMembers = Data.teamMembers;

    return `
      ${pageHero('Về Chúng Tôi', 'SoftZone — Đối tác công nghệ tin cậy của bạn')}

      <section class="section">
        <div class="container">
          <div class="about-mission scroll-reveal" style="max-width: 800px; margin: 0 auto; text-align: justify;">
            <h2 class="about-mission__title" style="text-align: center; margin-bottom: 2rem;"><span class="text-gradient">KIỆT TÁC CÔNG NGHỆ – KIẾN TẠO TƯƠNG LAI</span></h2>
            <p class="about-mission__text" style="margin-bottom: 1.5rem; line-height: 1.8;">
              Giữa kỷ nguyên số chuyển dịch không ngừng, chúng tôi không định vị mình là một đơn vị phân phối công nghệ thuần túy, mà là những nhà lữ hành kiến tạo tương lai, nơi mỗi dòng code được viết ra là một nét cọ vẽ nên bức tranh toàn cảnh của kỷ nguyên mới.
            </p>
            <p class="about-mission__text" style="margin-bottom: 1.5rem; line-height: 1.8;">
              Tự hào là điểm giao thoa tối thượng giữa tư duy logic sắc bén và nghệ thuật số hóa đỉnh cao, Premium Software Store mang đến một hệ sinh thái giải pháp phần mềm độc bản, được nghệ nghệ tinh tuyển dành riêng cho những tổ chức và cá nhân tiên phong. Chúng tôi thấu hiểu rằng, một phần mềm xuất sắc không chỉ nằm ở tốc độ xử lý hay giao diện trực quan, mà nó phải là một thể sống chuyển động, sở hữu sự mượt mà tuyệt đối như một bản giao hưởng, và sự chuẩn xác kiên định như những cỗ máy thời gian của Thụy Sĩ.
            </p>
            <p class="about-mission__text" style="margin-bottom: 1.5rem; line-height: 1.8;">
              Mỗi giải pháp chúng tôi cung ứng là kết tinh của hàng vạn giờ lao động trí tuệ, được mài giũa dưới lăng kính của những chuyên gia công nghệ hàng đầu. Từ những hệ thống quản trị vận hành mang tầm vóc vĩ mô cho đến các công cụ tối ưu hóa hiệu suất vi mô, tất cả đều được chế tác với sự tỉ mỉ tối thượng, đảm bảo khả năng khai phóng tối đa tiềm năng ẩn sâu của mọi doanh nghiệp.
            </p>
            <p class="about-mission__text" style="line-height: 1.8;">
              Bước vào không gian của chúng tôi, bạn không chỉ tìm thấy những công cụ tối tân nhất, mà bạn đang chạm vào tuyệt tác của sự tiến hóa. Hãy cùng chúng tôi tái định nghĩa giới hạn của hiệu suất, biến những ý tưởng điên rồ nhất thành hiện thực số hóa, và khắc tên mình vào chương tiếp theo của lịch sử công nghệ toàn cầu.
            </p>
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          ${sectionTitle('Con Số Ấn Tượng')}
          <div class="hero__stats">
            ${Components.statsCard(6, 'Năm Kinh Nghiệm', 'calendar', '+')}
            ${Components.statsCard(150, 'Sản Phẩm', 'package', '+')}
            ${Components.statsCard(50000, 'Khách Hàng', 'users', '+')}
            ${Components.statsCard(30, 'Quốc Gia', 'globe', '+')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionTitle('Giá Trị Cốt Lõi')}
          <div class="features-grid">
            ${Components.featureItem(
              'lightbulb',
              'Đổi Mới Sáng Tạo',
              'Luôn tìm tòi và áp dụng những công nghệ mới nhất để mang đến trải nghiệm tốt nhất cho khách hàng.'
            )}
            ${Components.featureItem(
              'award',
              'Chất Lượng Hàng Đầu',
              'Mỗi sản phẩm đều được kiểm tra kỹ lưỡng, đảm bảo đáp ứng tiêu chuẩn chất lượng cao nhất.'
            )}
            ${Components.featureItem(
              'heart',
              'Khách Hàng Là Trọng Tâm',
              'Mọi quyết định của chúng tôi đều hướng đến sự hài lòng và thành công của khách hàng.'
            )}
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          ${sectionTitle('Đội Ngũ Của Chúng Tôi')}
          <div class="team-grid">
            ${teamMembers.map(m => Components.teamCard(m)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function contact() {
    return `
      ${pageHero('Liên Hệ', 'Chúng tôi luôn sẵn sàng lắng nghe bạn')}

      <section class="section">
        <div class="container">
          <div class="contact-layout">
            <div class="contact-info scroll-reveal">
              <div class="contact-info-card">
                <div class="contact-info-card__icon"><i data-lucide="mail"></i></div>
                <h3 class="contact-info-card__title">Email</h3>
                <p class="contact-info-card__text">kduongstore@gmail.com</p>
              </div>
              <div class="contact-info-card">
                <div class="contact-info-card__icon"><i data-lucide="phone"></i></div>
                <h3 class="contact-info-card__title">Điện thoại</h3>
                <p class="contact-info-card__text">0336803471</p>
              </div>
              <div class="contact-info-card">
                <div class="contact-info-card__icon"><i data-lucide="map-pin"></i></div>
                <h3 class="contact-info-card__title">Địa chỉ</h3>
                <p class="contact-info-card__text">Hà Nội, Việt Nam</p>
              </div>
              <div class="contact-info-card">
                <div class="contact-info-card__icon"><i data-lucide="clock"></i></div>
                <h3 class="contact-info-card__title">Giờ làm việc</h3>
                <p class="contact-info-card__text">8:00 - 22:00</p>
              </div>
            </div>

            <div class="contact-form-wrap scroll-reveal">
              <h2 class="contact-form-wrap__title">Gửi Tin Nhắn</h2>
              <form id="contact-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="contact-name">Họ và tên *</label>
                    <input type="text" class="form-input" id="contact-name" placeholder="Nguyễn Văn A" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="contact-email">Email *</label>
                    <input type="email" class="form-input" id="contact-email" placeholder="email@example.com" required>
                  </div>
                  <div class="form-group form-group--full">
                    <label class="form-label" for="contact-subject">Chủ đề *</label>
                    <input type="text" class="form-input" id="contact-subject" placeholder="Tiêu đề tin nhắn" required>
                  </div>
                  <div class="form-group form-group--full">
                    <label class="form-label" for="contact-message">Nội dung *</label>
                    <textarea class="form-input form-textarea" id="contact-message" rows="5" placeholder="Nội dung tin nhắn của bạn..." required></textarea>
                  </div>
                </div>
                <button type="submit" class="btn btn--primary btn--lg">
                  <i data-lucide="send"></i> Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function faq() {
    const faqItems = Data.faqItems;

    return `
      ${pageHero('Câu Hỏi Thường Gặp', 'Giải đáp những thắc mắc phổ biến nhất')}

      <section class="section">
        <div class="container">
          <div class="faq-list scroll-reveal">
            ${faqItems.map((item, index) => Components.faqItem(item, index)).join('')}
          </div>

          <div class="faq-cta scroll-reveal">
            <div class="faq-cta__content">
              <h3 class="faq-cta__title">Vẫn Cần Hỗ Trợ?</h3>
              <p class="faq-cta__text">Nếu bạn không tìm thấy câu trả lời, đừng ngại liên hệ với chúng tôi.</p>
              <a href="#/contact" class="btn btn--primary">
                <i data-lucide="message-circle"></i> Liên Hệ Ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function orderSuccess(orderId) {
    return `
      <section class="section">
        <div class="container">
          <div class="success-card scroll-reveal">
            <div class="success-card__icon-wrap">
              <div class="success-card__checkmark">
                <i data-lucide="check-circle"></i>
              </div>
            </div>
            <h1 class="success-card__title"><span class="text-gradient">Đặt Hàng Thành Công!</span></h1>
            <p class="success-card__message">
              Cảm ơn bạn đã tin tưởng SoftZone. Đơn hàng của bạn đã được xử lý thành công.
            </p>
            ${orderId ? `<p class="success-card__order-id">Mã đơn hàng: <strong>${orderId}</strong></p>` : ''}
            <div class="success-card__actions">
              <a href="#/account" class="btn btn--primary" onclick="SoftwareStore.Pages._accountTab = 'orders'">
                <i data-lucide="package"></i> Xem Đơn Hàng
              </a>
              <a href="#/store" class="btn btn--outline">
                <i data-lucide="shopping-bag"></i> Tiếp Tục Mua Sắm
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function notFound() {
    return `
      <section class="section">
        <div class="container">
          <div class="not-found scroll-reveal">
            <h1 class="not-found__code"><span class="text-gradient">404</span></h1>
            <h2 class="not-found__title">Trang Không Tồn Tại</h2>
            <p class="not-found__message">Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
            <a href="#/" class="btn btn--primary btn--lg">
              <i data-lucide="home"></i> Về Trang Chủ
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // ========================
  // PUBLIC API
  // ========================
  return {
    _storeState,
    get _accountTab() { return _accountTab; },
    set _accountTab(val) { _accountTab = val; },
    home,
    store,
    productDetail,
    cart,
    checkout,
    account,
    about,
    contact,
    faq,
    orderSuccess,
    notFound
  };
})();
