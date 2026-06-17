window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.App = (() => {

  function parseRoute() {
    const hash = window.location.hash || '#/';
    const clean = hash.slice(2); // remove '#/'
    const parts = clean.split('/');
    return {
      path: parts[0] || '',
      params: parts.slice(1)
    };
  }

  function renderPage() {
    // Run storytelling cleanup before navigating to avoid ScrollTrigger leaks
    if (SoftwareStore.Story && typeof SoftwareStore.Story.cleanup === 'function') {
      SoftwareStore.Story.cleanup();
    }

    const route = parseRoute();
    const { Pages } = SoftwareStore;
    const app = document.getElementById('app');
    if (!app) return;

    let html = '';
    let pageClass = '';

    switch (route.path) {
      case '':
      case 'home':
        html = Pages.home();
        pageClass = 'page-home';
        break;
      case 'store':
        html = Pages.store();
        pageClass = 'page-store';
        break;
      case 'product':
        html = Pages.productDetail(parseInt(route.params[0]));
        pageClass = 'page-product';
        break;
      case 'cart':
        html = Pages.cart();
        pageClass = 'page-cart';
        break;
      case 'checkout':
        html = Pages.checkout();
        pageClass = 'page-checkout';
        break;
      case 'account':
        html = Pages.account();
        pageClass = 'page-account';
        break;
      case 'about':
        html = Pages.about();
        pageClass = 'page-about';
        break;
      case 'contact':
        html = Pages.contact();
        pageClass = 'page-contact';
        break;
      case 'faq':
        html = Pages.faq();
        pageClass = 'page-faq';
        break;
      case 'order-success':
        html = Pages.orderSuccess(route.params[0]);
        pageClass = 'page-success';
        break;
      default:
        html = Pages.notFound();
        pageClass = 'page-404';
    }

    // Apply with fade transition
    app.style.opacity = '0';
    app.style.transform = 'translateY(10px)';

    setTimeout(() => {
      const isStoryRoute = route.path === '' || route.path === 'home';
      app.className = `main-content ${pageClass}${isStoryRoute ? ' main-content--story' : ''}`;
      app.innerHTML = html;
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Post-render
      if (typeof lucide !== 'undefined') lucide.createIcons();
      SoftwareStore.Utils.scrollReveal();

      // Animate counters on home page
      if (isStoryRoute) {
        setTimeout(() => SoftwareStore.Utils.animateCounters(), 600);
        
        // Initialize cinematic scroll storytelling & playground
        setTimeout(() => {
          SoftwareStore.Story.init();
          
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          if (!isMobile) {
            SoftwareStore.Playground.init();
            SoftwareStore.Playground.render('playground-viewport');
          }
          
          // Check for auto-run product template redirect
          const autoRunId = localStorage.getItem('softZone_autoRunProduct');
          if (autoRunId) {
            localStorage.removeItem('softZone_autoRunProduct');
            setTimeout(() => {
              SoftwareStore.Story.scrollToPlayground();
              SoftwareStore.Playground.loadProductTemplate(parseInt(autoRunId));
            }, 800);
          }
        }, 50);
      }

      // Fade in
      requestAnimationFrame(() => {
        app.style.opacity = '1';
        app.style.transform = 'translateY(0)';
      });
    }, 150);

    updateNav();
    closeMobileMenu();
  }

  function updateNav() {
    const route = parseRoute();

    // Update active link
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = href ? href.slice(2) : '';
      const isActive = linkPath === route.path || (route.path === '' && linkPath === '');
      link.classList.toggle('nav__link--active', isActive);
    });

    updateCartCount();
    updateUserNav();
  }

  function updateCartCount() {
    const count = SoftwareStore.Store.getCartCount();
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function updateUserNav() {
    const { Store, Utils } = SoftwareStore;
    const userArea = document.getElementById('user-nav-area');
    if (!userArea) return;

    if (Store.isLoggedIn()) {
      userArea.innerHTML = `
        <a href="#/account" class="nav__user-btn" title="${Store.state.user.name}">
          <span class="nav__user-avatar">${Utils.getInitials(Store.state.user.name)}</span>
        </a>
      `;
    } else {
      userArea.innerHTML = `
        <button class="btn btn--ghost btn--sm nav__auth-btn" data-action="openAuthModal">
          <i data-lucide="log-in"></i> <span class="nav__auth-text">Đăng nhập</span>
        </button>
      `;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [userArea] });
  }

  // ========================
  // CART PANEL
  // ========================
  function toggleCart(open) {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel && overlay) {
      panel.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (open) renderCartPanel();
  }

  function renderCartPanel() {
    const { Store, Components, Utils } = SoftwareStore;
    const itemsContainer = document.getElementById('cart-panel-items');
    const totalEl = document.getElementById('cart-panel-total');
    const checkoutBtn = document.getElementById('cart-panel-checkout');

    if (!itemsContainer) return;

    const items = Store.getCartItems();

    if (items.length === 0) {
      itemsContainer.innerHTML = Components.emptyState('shopping-cart', 'Giỏ hàng trống', 'Hãy thêm sản phẩm bạn yêu thích!');
      if (totalEl) totalEl.textContent = '$0.00';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
      itemsContainer.innerHTML = items.map(item => Components.cartItem(item)).join('');
      if (totalEl) totalEl.textContent = Utils.formatCurrency(Store.getCartTotal());
      if (checkoutBtn) checkoutBtn.style.display = '';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [itemsContainer] });
  }

  // ========================
  // AUTH MODAL
  // ========================
  function openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      renderAuthModal(tab);
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function renderAuthModal(tab = 'login') {
    const content = document.getElementById('auth-modal-content');
    if (!content) return;

    content.innerHTML = `
      <div class="auth-modal__tabs">
        <button class="auth-modal__tab ${tab === 'login' ? 'is-active' : ''}" data-action="switchAuthTab" data-tab="login">Đăng Nhập</button>
        <button class="auth-modal__tab ${tab === 'register' ? 'is-active' : ''}" data-action="switchAuthTab" data-tab="register">Đăng Ký</button>
      </div>
      ${tab === 'login' ? `
        <form id="login-form" class="auth-modal__form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="email@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Mật khẩu</label>
            <input type="password" class="form-input" id="login-password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%">
            <i data-lucide="log-in"></i> Đăng Nhập
          </button>
        </form>
      ` : `
        <form id="register-form" class="auth-modal__form">
          <div class="form-group">
            <label class="form-label" for="register-name">Họ và tên</label>
            <input type="text" class="form-input" id="register-name" placeholder="Nguyễn Văn A" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-email">Email</label>
            <input type="email" class="form-input" id="register-email" placeholder="email@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="register-password">Mật khẩu</label>
            <input type="password" class="form-input" id="register-password" placeholder="Tối thiểu 6 ký tự" required minlength="6">
          </div>
          <button type="submit" class="btn btn--primary btn--lg" style="width:100%">
            <i data-lucide="user-plus"></i> Đăng Ký
          </button>
        </form>
      `}
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [content] });
  }

  function closeMobileMenu() {
    document.getElementById('mobile-menu')?.classList.remove('is-open');
  }

  // ========================
  // GLOBAL EVENT LISTENERS
  // ========================
  function setupGlobalListeners() {

    // Click delegation
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const productId = parseInt(target.dataset.productId);
      const plan = target.dataset.plan;

      switch (action) {
        case 'addToCart':
          SoftwareStore.Store.addToCart(productId, plan || 'pro');
          SoftwareStore.Utils.showToast('Đã thêm vào giỏ hàng! 🛒', 'success');
          updateCartCount();
          renderCartPanel();
          break;

        case 'removeFromCart':
          SoftwareStore.Store.removeFromCart(productId, plan);
          SoftwareStore.Utils.showToast('Đã xóa khỏi giỏ hàng', 'info');
          updateCartCount();
          renderCartPanel();
          if (parseRoute().path === 'cart') renderPage();
          break;

        case 'increaseQty': {
          const item = SoftwareStore.Store.state.cart.find(i => i.productId === productId && i.planType === plan);
          if (item) SoftwareStore.Store.updateCartQuantity(productId, plan, item.quantity + 1);
          updateCartCount();
          renderCartPanel();
          if (parseRoute().path === 'cart') renderPage();
          break;
        }

        case 'decreaseQty': {
          const item = SoftwareStore.Store.state.cart.find(i => i.productId === productId && i.planType === plan);
          if (item) SoftwareStore.Store.updateCartQuantity(productId, plan, item.quantity - 1);
          updateCartCount();
          renderCartPanel();
          if (parseRoute().path === 'cart') renderPage();
          break;
        }

        case 'toggleWishlist':
          SoftwareStore.Store.toggleWishlist(productId);
          const isNowWished = SoftwareStore.Store.isInWishlist(productId);
          SoftwareStore.Utils.showToast(
            isNowWished ? 'Đã thêm vào yêu thích! ❤️' : 'Đã xóa khỏi yêu thích',
            isNowWished ? 'success' : 'info'
          );
          renderPage();
          break;

        case 'openCart':
          toggleCart(true);
          break;

        case 'closeCart':
          toggleCart(false);
          break;

        case 'openAuthModal':
          openAuthModal('login');
          break;

        case 'closeModal':
          closeAuthModal();
          break;

        case 'switchAuthTab':
          renderAuthModal(target.dataset.tab);
          break;

        case 'toggleFaq': {
          const faqItem = target.closest('.faq-item');
          if (faqItem) faqItem.classList.toggle('is-open');
          break;
        }

        case 'filterCategory':
          if (SoftwareStore.Pages._storeState) {
            SoftwareStore.Pages._storeState.category = target.dataset.category;
            SoftwareStore.Pages._storeState.page = 1;
            renderPage();
          }
          break;

        case 'goToPage':
          if (SoftwareStore.Pages._storeState) {
            SoftwareStore.Pages._storeState.page = parseInt(target.dataset.page);
            renderPage();
          }
          break;

        case 'accountTab':
          if (SoftwareStore.Pages._accountTab !== undefined) {
            SoftwareStore.Pages._accountTab = target.dataset.tab;
            renderPage();
          }
          break;

        case 'logout':
          SoftwareStore.Store.logout();
          SoftwareStore.Utils.showToast('Đã đăng xuất thành công!', 'info');
          window.location.hash = '#/';
          break;

        case 'removeCoupon':
          SoftwareStore.Store.removeCoupon();
          renderPage();
          break;

        case 'closeCartNav':
          toggleCart(false);
          break;
      }
    });

    // Form submissions
    document.body.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;

      if (form.id === 'login-form') {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        if (email && password) {
          const result = SoftwareStore.Store.login(email, password);
          SoftwareStore.Utils.showToast(result.message, result.success ? 'success' : 'error');
          if (result.success) {
            closeAuthModal();
            renderPage();
          }
        }
      }

      if (form.id === 'register-form') {
        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        if (name && email && password) {
          const result = SoftwareStore.Store.register(name, email, password);
          SoftwareStore.Utils.showToast(result.message, result.success ? 'success' : 'error');
          if (result.success) {
            closeAuthModal();
            renderPage();
          }
        }
      }

      if (form.id === 'checkout-form') {
        const customerInfo = {
          name: document.getElementById('checkout-name')?.value,
          email: document.getElementById('checkout-email')?.value,
          phone: document.getElementById('checkout-phone')?.value,
          address: document.getElementById('checkout-address')?.value
        };
        const method = document.querySelector('input[name="payment"]:checked')?.value || 'credit_card';
        const order = SoftwareStore.Store.createOrder({ method, customerInfo });
        SoftwareStore.Utils.showToast('🎉 Đặt hàng thành công!', 'success');
        window.location.hash = `#/order-success/${order.id}`;
      }

      if (form.id === 'coupon-form') {
        const code = document.getElementById('coupon-input')?.value;
        if (code) {
          const result = SoftwareStore.Store.applyCoupon(code);
          SoftwareStore.Utils.showToast(result.message, result.success ? 'success' : 'error');
          if (result.success) renderPage();
        }
      }

      if (form.id === 'contact-form') {
        SoftwareStore.Utils.showToast('Tin nhắn đã được gửi thành công! 📧', 'success');
        form.reset();
      }

      if (form.id === 'profile-form') {
        const name = document.getElementById('profile-name')?.value;
        const email = document.getElementById('profile-email')?.value;
        if (name && email) {
          SoftwareStore.Store.updateProfile({ name, email });
          SoftwareStore.Utils.showToast('Cập nhật hồ sơ thành công!', 'success');
          updateUserNav();
        }
      }
    });

    // Search input with debounce
    document.body.addEventListener('input', SoftwareStore.Utils.debounce((e) => {
      if (e.target && e.target.id === 'search-input' && SoftwareStore.Pages._storeState) {
        SoftwareStore.Pages._storeState.search = e.target.value;
        SoftwareStore.Pages._storeState.page = 1;
        renderPage();
        // Restore focus
        setTimeout(() => {
          const input = document.getElementById('search-input');
          if (input) {
            input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
          }
        }, 200);
      }
    }, 300));

    // Sort select change
    document.body.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'sort-select' && SoftwareStore.Pages._storeState) {
        SoftwareStore.Pages._storeState.sort = e.target.value;
        SoftwareStore.Pages._storeState.page = 1;
        renderPage();
      }
    });

    // Cart overlay click
    document.getElementById('cart-overlay')?.addEventListener('click', () => toggleCart(false));

    // Auth modal backdrop click
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal') closeAuthModal();
    });

    // Hash change
    window.addEventListener('hashchange', renderPage);

    // Nav scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('main-nav');
      if (nav) {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
      }
    });

    // Mobile menu toggle
    document.getElementById('mobile-toggle')?.addEventListener('click', () => {
      document.getElementById('mobile-menu')?.classList.toggle('is-open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleCart(false);
        closeAuthModal();
        closeMobileMenu();
      }
    });
  }

  return {
    init() {
      SoftwareStore.Store.init();
      setupGlobalListeners();
      renderPage();
    },
    renderPage,
    updateCartCount,
    toggleCart
  };
})();

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  SoftwareStore.App.init();
});
