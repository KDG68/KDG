window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.Store = (() => {
  const STORAGE_KEY = 'softwareStoreState';
  const USERS_KEY = 'softwareStoreUsers';
  const listeners = {};

  let state = {
    cart: [],
    user: null,
    wishlist: [],
    orders: [],
    isLoggedIn: false,
    appliedCoupon: null
  };

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }

  function emit(event, data) {
    (listeners[event] || []).forEach(cb => {
      try { cb(data); } catch (e) { console.error('Event listener error:', e); }
    });
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return {
    init() {
      load();
    },

    get state() {
      return state;
    },

    // Event system
    on(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },

    off(event, callback) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    },

    // ========================
    // CART
    // ========================
    addToCart(productId, planType = 'pro') {
      const existing = state.cart.find(
        item => item.productId === productId && item.planType === planType
      );
      if (existing) {
        existing.quantity++;
      } else {
        state.cart.push({ productId, planType, quantity: 1 });
      }
      save();
      emit('cartUpdated', state.cart);
    },

    removeFromCart(productId, planType) {
      state.cart = state.cart.filter(
        item => !(item.productId === productId && item.planType === planType)
      );
      save();
      emit('cartUpdated', state.cart);
    },

    updateCartQuantity(productId, planType, quantity) {
      const item = state.cart.find(
        i => i.productId === productId && i.planType === planType
      );
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId, planType);
          return;
        }
        item.quantity = quantity;
        save();
        emit('cartUpdated', state.cart);
      }
    },

    getCartItems() {
      return state.cart
        .map(item => {
          const product = SoftwareStore.Data.products.find(p => p.id === item.productId);
          const plan = product?.plans.find(p => p.type === item.planType);
          return { ...item, product, plan };
        })
        .filter(item => item.product && item.plan);
    },

    getCartSubtotal() {
      return this.getCartItems().reduce((total, item) => {
        let price = item.plan.price;
        if (item.product.discount) {
          price = price * (1 - item.product.discount / 100);
        }
        return total + price * item.quantity;
      }, 0);
    },

    getCartDiscount() {
      if (!state.appliedCoupon) return 0;
      return this.getCartSubtotal() * (state.appliedCoupon.discount / 100);
    },

    getCartTotal() {
      return this.getCartSubtotal() - this.getCartDiscount();
    },

    getCartCount() {
      return state.cart.reduce((count, item) => count + item.quantity, 0);
    },

    clearCart() {
      state.cart = [];
      state.appliedCoupon = null;
      save();
      emit('cartUpdated', state.cart);
    },

    // ========================
    // USER AUTH
    // ========================
    register(name, email, password) {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email đã được sử dụng!' };
      }

      const user = {
        id: SoftwareStore.Utils.generateId(),
        name,
        email,
        password: btoa(password),
        avatar: null,
        joinDate: new Date().toISOString()
      };

      users.push(user);
      saveUsers(users);

      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.joinDate
      };
      state.isLoggedIn = true;
      save();
      emit('userChanged', state.user);
      return { success: true, message: 'Đăng ký thành công! Chào mừng bạn!' };
    },

    login(email, password) {
      const users = getUsers();
      const user = users.find(
        u => u.email === email && u.password === btoa(password)
      );
      if (!user) {
        return { success: false, message: 'Email hoặc mật khẩu không đúng!' };
      }

      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.joinDate
      };
      state.isLoggedIn = true;
      save();
      emit('userChanged', state.user);
      return { success: true, message: 'Đăng nhập thành công!' };
    },

    logout() {
      state.user = null;
      state.isLoggedIn = false;
      save();
      emit('userChanged', null);
    },

    updateProfile(data) {
      if (state.user) {
        state.user = { ...state.user, ...data };
        // Also update in users storage
        const users = getUsers();
        const idx = users.findIndex(u => u.id === state.user.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          saveUsers(users);
        }
        save();
        emit('userChanged', state.user);
      }
    },

    isLoggedIn() {
      return state.isLoggedIn && state.user !== null;
    },

    // ========================
    // WISHLIST
    // ========================
    toggleWishlist(productId) {
      const index = state.wishlist.indexOf(productId);
      if (index === -1) {
        state.wishlist.push(productId);
      } else {
        state.wishlist.splice(index, 1);
      }
      save();
      emit('wishlistChanged', state.wishlist);
    },

    isInWishlist(productId) {
      return state.wishlist.includes(productId);
    },

    getWishlistItems() {
      return state.wishlist
        .map(id => SoftwareStore.Data.products.find(p => p.id === id))
        .filter(Boolean);
    },

    // ========================
    // ORDERS
    // ========================
    createOrder(paymentInfo) {
      const order = {
        id: 'ORD-' + SoftwareStore.Utils.generateId().toUpperCase().slice(0, 8),
        items: this.getCartItems().map(item => ({
          productId: item.productId,
          productName: item.product.name,
          productIcon: item.product.icon,
          planType: item.planType,
          planName: item.plan.name,
          price: item.plan.price,
          quantity: item.quantity,
          discount: item.product.discount || 0
        })),
        subtotal: this.getCartSubtotal(),
        discount: this.getCartDiscount(),
        coupon: state.appliedCoupon ? state.appliedCoupon.code : null,
        total: this.getCartTotal(),
        date: new Date().toISOString(),
        status: 'completed',
        paymentMethod: paymentInfo.method || 'credit_card',
        customerInfo: paymentInfo.customerInfo || {}
      };

      state.orders.unshift(order);
      this.clearCart();
      save();
      emit('orderCreated', order);
      return order;
    },

    getOrders() {
      return state.orders;
    },

    // ========================
    // COUPONS
    // ========================
    applyCoupon(code) {
      const coupons = SoftwareStore.Data.coupons;
      const upperCode = code.toUpperCase().trim();
      if (coupons[upperCode]) {
        state.appliedCoupon = { code: upperCode, discount: coupons[upperCode] };
        save();
        emit('couponApplied', state.appliedCoupon);
        return {
          success: true,
          message: `Áp dụng mã "${upperCode}" thành công! Giảm ${coupons[upperCode]}%`,
          discount: coupons[upperCode]
        };
      }
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn!' };
    },

    removeCoupon() {
      state.appliedCoupon = null;
      save();
      emit('couponApplied', null);
    }
  };
})();
