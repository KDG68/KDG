window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.Components = {

  productCard(product) {
    const { Utils, Store, Data } = SoftwareStore;
    const proPlan = product.plans.find(p => p.type === 'pro') || product.plans[0];
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount ? proPlan.price * (1 - product.discount / 100) : proPlan.price;
    const isWished = Store.isInWishlist(product.id);
    const categoryName = Data.categories.find(c => c.id === product.category)?.name || product.category;

    return `
      <div class="product-card scroll-reveal" data-product-id="${product.id}">
        <div class="product-card__image" style="background: linear-gradient(135deg, ${product.color}20, ${product.color}50); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
          ${(product.icon.includes('.') || product.icon.startsWith('http')) 
            ? `<img src="${product.icon}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.2);">` 
            : `<span class="product-card__icon">${product.icon}</span>`}
          ${product.badge ? `<span class="badge badge--${product.badge === 'Best Seller' ? 'warning' : product.badge === 'Mới' ? 'info' : product.badge === 'Hot' ? 'danger' : 'success'}">${product.badge}</span>` : ''}
          ${hasDiscount ? `<span class="product-card__discount">-${product.discount}%</span>` : ''}
          <button class="product-card__wishlist ${isWished ? 'is-active' : ''}" data-action="toggleWishlist" data-product-id="${product.id}" title="Yêu thích">
            <i data-lucide="heart"></i>
          </button>
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${categoryName}</span>
          <h3 class="product-card__title">
            <a href="#/product/${product.id}" class="product-card__link">${product.name}</a>
          </h3>
          <p class="product-card__desc">${Utils.truncateText(product.shortDesc, 85)}</p>
          <div class="product-card__footer">
            <div class="product-card__price-wrap">
              ${hasDiscount ? `<span class="product-card__original-price">${Utils.formatCurrency(proPlan.price)}</span>` : ''}
              <span class="product-card__price">${Utils.formatCurrency(discountedPrice)}</span>
              <span class="product-card__period">/tháng</span>
            </div>
            <div class="product-card__rating">
              ${Utils.renderStars(product.rating)}
              <span class="product-card__rating-count">(${Utils.formatNumber(product.reviewCount)})</span>
            </div>
          </div>
          <div class="product-card__actions">
            <button class="btn btn--primary btn--sm" data-action="addToCart" data-product-id="${product.id}" data-plan="pro">
              <i data-lucide="shopping-cart"></i> Thêm vào giỏ
            </button>
            <a href="#/product/${product.id}" class="btn btn--ghost btn--sm">Chi tiết</a>
          </div>
        </div>
      </div>
    `;
  },

  cartItem(item) {
    const { Utils } = SoftwareStore;
    const { product, plan } = item;
    let unitPrice = plan.price;
    if (product.discount) {
      unitPrice = unitPrice * (1 - product.discount / 100);
    }

    return `
      <div class="cart-item" data-product-id="${item.productId}" data-plan="${item.planType}">
        <div class="cart-item__image" style="background: linear-gradient(135deg, ${product.color}20, ${product.color}50); display: flex; align-items: center; justify-content: center; overflow: hidden;">
          ${(product.icon.includes('.') || product.icon.startsWith('http')) 
            ? `<img src="${product.icon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` 
            : `<span>${product.icon}</span>`}
        </div>
        <div class="cart-item__info">
          <h4 class="cart-item__name">${product.name}</h4>
          <span class="cart-item__plan">Gói ${plan.name}</span>
        </div>
        <div class="cart-item__quantity">
          <button class="cart-item__qty-btn" data-action="decreaseQty" data-product-id="${item.productId}" data-plan="${item.planType}">−</button>
          <span class="cart-item__qty-value">${item.quantity}</span>
          <button class="cart-item__qty-btn" data-action="increaseQty" data-product-id="${item.productId}" data-plan="${item.planType}">+</button>
        </div>
        <div class="cart-item__price">${Utils.formatCurrency(unitPrice * item.quantity)}</div>
        <button class="cart-item__remove" data-action="removeFromCart" data-product-id="${item.productId}" data-plan="${item.planType}" title="Xóa">
          <i data-lucide="x"></i>
        </button>
      </div>
    `;
  },

  reviewCard(review) {
    const { Utils } = SoftwareStore;
    return `
      <div class="review-card">
        <div class="review-card__header">
          <div class="review-card__avatar">${Utils.getInitials(review.user)}</div>
          <div class="review-card__meta">
            <strong class="review-card__name">${review.user}</strong>
            <span class="review-card__date">${review.date}</span>
          </div>
          <div class="review-card__rating">${Utils.renderStars(review.rating)}</div>
        </div>
        <p class="review-card__text">${review.text}</p>
      </div>
    `;
  },

  testimonialCard(testimonial) {
    return `
      <div class="testimonial-card scroll-reveal">
        <div class="testimonial-card__quote">
          <i data-lucide="quote"></i>
        </div>
        <p class="testimonial-card__text">"${testimonial.text}"</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${testimonial.avatar}</div>
          <div class="testimonial-card__author-info">
            <strong class="testimonial-card__name">${testimonial.user}</strong>
            <span class="testimonial-card__role">${testimonial.role} — ${testimonial.company}</span>
          </div>
        </div>
      </div>
    `;
  },

  pricingCard(plan, product) {
    const { Utils } = SoftwareStore;
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount ? plan.price * (1 - product.discount / 100) : plan.price;

    return `
      <div class="pricing-card ${plan.popular ? 'pricing-card--popular' : ''}">
        ${plan.popular ? '<span class="pricing-card__badge">🔥 Phổ Biến Nhất</span>' : ''}
        <div class="pricing-card__header">
          <h3 class="pricing-card__name">${plan.name}</h3>
          <div class="pricing-card__price">
            ${hasDiscount ? `<span class="pricing-card__original">${Utils.formatCurrency(plan.price)}</span>` : ''}
            <span class="pricing-card__amount">${Utils.formatCurrency(discountedPrice)}</span>
            <span class="pricing-card__period">/ tháng</span>
          </div>
        </div>
        <ul class="pricing-card__features">
          ${plan.features.map(f => `<li><i data-lucide="check-circle"></i> ${f}</li>`).join('')}
        </ul>
        <button class="btn ${plan.popular ? 'btn--primary' : 'btn--outline'} pricing-card__action"
          data-action="addToCart" data-product-id="${product.id}" data-plan="${plan.type}">
          Chọn Gói ${plan.name}
        </button>
      </div>
    `;
  },

  teamCard(member) {
    return `
      <div class="team-card scroll-reveal">
        <div class="team-card__avatar">${member.avatar}</div>
        <h3 class="team-card__name">${member.name}</h3>
        <p class="team-card__role">${member.role}</p>
        <p class="team-card__bio">${member.bio}</p>
      </div>
    `;
  },

  faqItem(item, index) {
    return `
      <div class="faq-item" data-faq-index="${index}">
        <button class="faq-item__question" data-action="toggleFaq" data-index="${index}">
          <span>${item.question}</span>
          <i data-lucide="chevron-down" class="faq-item__chevron"></i>
        </button>
        <div class="faq-item__answer">
          <p>${item.answer}</p>
        </div>
      </div>
    `;
  },

  categoryFilter(categories, activeCategory = 'all') {
    return `
      <div class="category-filter">
        ${categories.map(cat => `
          <button class="category-filter__item ${cat.id === activeCategory ? 'is-active' : ''}"
            data-action="filterCategory" data-category="${cat.id}">
            <i data-lucide="${cat.icon}"></i>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  searchBar(value = '', placeholder = 'Tìm kiếm phần mềm...') {
    return `
      <div class="search-bar">
        <i data-lucide="search" class="search-bar__icon"></i>
        <input type="text" class="search-bar__input" id="search-input"
          placeholder="${placeholder}" value="${value}" autocomplete="off">
      </div>
    `;
  },

  sortSelect(currentSort = 'default') {
    return `
      <select class="form-select sort-select" id="sort-select">
        <option value="default" ${currentSort === 'default' ? 'selected' : ''}>Mặc định</option>
        <option value="price-asc" ${currentSort === 'price-asc' ? 'selected' : ''}>Giá: Thấp → Cao</option>
        <option value="price-desc" ${currentSort === 'price-desc' ? 'selected' : ''}>Giá: Cao → Thấp</option>
        <option value="rating" ${currentSort === 'rating' ? 'selected' : ''}>Đánh giá cao nhất</option>
        <option value="name" ${currentSort === 'name' ? 'selected' : ''}>Tên A-Z</option>
        <option value="popular" ${currentSort === 'popular' ? 'selected' : ''}>Phổ biến nhất</option>
      </select>
    `;
  },

  pagination(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    let html = '<div class="pagination">';

    html += `<button class="pagination__btn" data-action="goToPage" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
      <i data-lucide="chevron-left"></i>
    </button>`;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        html += `<button class="pagination__btn ${i === currentPage ? 'is-active' : ''}"
          data-action="goToPage" data-page="${i}">${i}</button>`;
      } else if (i === 2 && currentPage > 3) {
        html += '<span class="pagination__dots">…</span>';
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        html += '<span class="pagination__dots">…</span>';
      }
    }

    html += `<button class="pagination__btn" data-action="goToPage" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
      <i data-lucide="chevron-right"></i>
    </button>`;

    html += '</div>';
    return html;
  },

  orderCard(order) {
    const { Utils } = SoftwareStore;
    const statusMap = {
      completed: { label: 'Hoàn thành', badge: 'success' },
      pending: { label: 'Đang xử lý', badge: 'warning' },
      cancelled: { label: 'Đã hủy', badge: 'danger' }
    };
    const status = statusMap[order.status] || statusMap.completed;
    const paymentLabels = {
      credit_card: '💳 Thẻ tín dụng',
      paypal: '🅿️ PayPal',
      bank_transfer: '🏦 Chuyển khoản'
    };

    return `
      <div class="order-card">
        <div class="order-card__header">
          <div>
            <strong class="order-card__id">${order.id}</strong>
            <span class="order-card__date">${Utils.formatDate(order.date)}</span>
          </div>
          <span class="badge badge--${status.badge}">${status.label}</span>
        </div>
        <div class="order-card__items">
          ${order.items.map(item => {
            const isImage = item.productIcon && (item.productIcon.includes('.') || item.productIcon.startsWith('http'));
            const iconHtml = isImage 
              ? `<img src="${item.productIcon}" style="width: 20px; height: 20px; object-fit: cover; border-radius: 50%; vertical-align: middle; margin-right: 6px;">`
              : `<span style="margin-right: 6px;">${item.productIcon || '📦'}</span>`;
            return `
              <div class="order-card__item">
                <span style="display: inline-flex; align-items: center;">
                  ${iconHtml}
                  <span>${item.productName} (${item.planName})</span>
                </span>
                <span>×${item.quantity}</span>
                <span>${Utils.formatCurrency(item.price * item.quantity * (1 - (item.discount || 0) / 100))}</span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="order-card__footer">
          <span class="order-card__payment">${paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
          <strong class="order-card__total">Tổng: ${Utils.formatCurrency(order.total)}</strong>
        </div>
      </div>
    `;
  },

  emptyState(icon, title, message, actionText = null, actionHash = null) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon-wrap">
          <i data-lucide="${icon}" class="empty-state__icon"></i>
        </div>
        <h3 class="empty-state__title">${title}</h3>
        <p class="empty-state__message">${message}</p>
        ${actionText && actionHash ? `<a href="${actionHash}" class="btn btn--primary">${actionText}</a>` : ''}
      </div>
    `;
  },

  breadcrumb(items) {
    return `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        ${items.map((item, i) => `
          ${i > 0 ? '<i data-lucide="chevron-right" class="breadcrumb__sep"></i>' : ''}
          ${item.href
            ? `<a href="${item.href}" class="breadcrumb__link">${item.label}</a>`
            : `<span class="breadcrumb__current">${item.label}</span>`
          }
        `).join('')}
      </nav>
    `;
  },

  productGrid(products) {
    if (!products || products.length === 0) {
      return this.emptyState(
        'package',
        'Không tìm thấy sản phẩm',
        'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.',
        'Xem tất cả',
        '#/store'
      );
    }
    return `<div class="store-grid">${products.map(p => this.productCard(p)).join('')}</div>`;
  },

  statsCard(number, label, icon, suffix = '') {
    return `
      <div class="hero__stat scroll-reveal">
        <div class="hero__stat-icon-wrap">
          <i data-lucide="${icon}" class="hero__stat-icon"></i>
        </div>
        <span class="hero__stat-number" data-count="${number}" data-suffix="${suffix}">0${suffix}</span>
        <span class="hero__stat-label">${label}</span>
      </div>
    `;
  },

  featureItem(icon, title, desc) {
    return `
      <div class="feature-item scroll-reveal">
        <div class="feature-item__icon">
          <i data-lucide="${icon}"></i>
        </div>
        <h3 class="feature-item__title">${title}</h3>
        <p class="feature-item__desc">${desc}</p>
      </div>
    `;
  }
};
