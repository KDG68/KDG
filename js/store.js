/* ==========================================================================
   SOFTZONE TECH UNIVERSE - STATE & CART MANAGER
   ========================================================================== */

(function() {
  // Cart State
  let cart = [];
  let couponCode = "";
  let discountPercent = 0;
  const cartListeners = [];

  // Initialize Cart from LocalStorage
  function initCart() {
    try {
      const storedCart = localStorage.getItem("softzone_cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
      const storedCoupon = localStorage.getItem("softzone_coupon");
      const storedDiscount = localStorage.getItem("softzone_discount");
      if (storedCoupon && storedDiscount) {
        couponCode = storedCoupon;
        discountPercent = parseFloat(storedDiscount);
      }
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng từ LocalStorage:", e);
      cart = [];
    }
  }

  // Save Cart to LocalStorage
  function saveCart() {
    try {
      localStorage.setItem("softzone_cart", JSON.stringify(cart));
      localStorage.setItem("softzone_coupon", couponCode);
      localStorage.setItem("softzone_discount", discountPercent.toString());
    } catch (e) {
      console.error("Lỗi ghi giỏ hàng vào LocalStorage:", e);
    }
    triggerCartChange();
  }

  // Pub/Sub for Cart Events
  function onCartChange(callback) {
    if (typeof callback === "function") {
      cartListeners.push(callback);
    }
  }

  function triggerCartChange() {
    cartListeners.forEach(listener => {
      try {
        listener(cart);
      } catch (e) {
        console.error("Lỗi chạy callback giỏ hàng:", e);
      }
    });
  }

  // Cart Operations
  function addItem(productId, licenseType = "monthly") {
    // Find product in AppData
    const product = window.AppData.products.find(p => p.id === productId);
    if (!product) return false;

    // Check if item with same license already exists
    const existingIndex = cart.findIndex(item => item.id === productId && item.license === licenseType);

    if (existingIndex > -1) {
      // For digital keys, count is 1. Just notify
      return { status: "already_exists", product };
    } else {
      const price = licenseType === "lifetime" ? product.priceLifetime : product.priceMonthly;
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        themeColor: product.themeColor,
        license: licenseType,
        price: price,
        product: product // Keep reference
      });
      saveCart();
      return { status: "added", product };
    }
  }

  function removeItem(productId, licenseType) {
    const initialLength = cart.length;
    cart = cart.filter(item => !(item.id === productId && item.license === licenseType));
    if (cart.length !== initialLength) {
      saveCart();
      return true;
    }
    return false;
  }

  function clearCart() {
    cart = [];
    couponCode = "";
    discountPercent = 0;
    saveCart();
  }

  function getCartItems() {
    return [...cart];
  }

  function getSubtotal() {
    return cart.reduce((total, item) => total + item.price, 0);
  }

  function applyCoupon(code) {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === "KDG50") {
      couponCode = formattedCode;
      discountPercent = 0.50; // 50% discount
      saveCart();
      return { success: true, discountPercent, message: "Áp dụng mã giảm giá 50% thành công!" };
    }
    return { success: false, message: "Mã giảm giá không hợp lệ." };
  }

  function removeCoupon() {
    couponCode = "";
    discountPercent = 0;
    saveCart();
  }

  function getDiscountAmount() {
    return getSubtotal() * discountPercent;
  }

  function getTotal() {
    return getSubtotal() - getDiscountAmount();
  }

  function getCount() {
    return cart.length;
  }

  function getCouponCode() {
    return couponCode;
  }

  function getDiscountPercent() {
    return discountPercent;
  }

  // Catalog Filtering & Search Logic
  function getFilteredProducts(filters = {}) {
    const {
      search = "",
      category = "all",
      priceMin = 0,
      priceMax = 1000,
      platforms = [], // Array: ['win', 'mac', 'linux', 'web']
      licenseType = "all", // 'all', 'monthly', 'lifetime'
      sort = "featured" // 'featured', 'price-asc', 'price-desc', 'rating'
    } = filters;

    let result = [...window.AppData.products];

    // 1. Search Query
    if (search.trim() !== "") {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    // 3. Price Filter (check against monthly or lifetime)
    result = result.filter(p => {
      const minPrice = p.priceMonthly; // Start pricing
      return minPrice >= priceMin && minPrice <= priceMax;
    });

    // 4. Platforms Filter
    if (platforms.length > 0) {
      result = result.filter(p => 
        platforms.some(plat => p.platforms.includes(plat))
      );
    }

    // 5. License Type Filter (some products might only support monthly)
    if (licenseType !== "all") {
      if (licenseType === "lifetime") {
        result = result.filter(p => p.priceLifetime !== undefined);
      } else if (licenseType === "monthly") {
        result = result.filter(p => p.priceMonthly !== undefined);
      }
    }

    // 6. Sorting
    if (sort === "price-asc") {
      result.sort((a, b) => a.priceMonthly - b.priceMonthly);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.priceMonthly - a.priceMonthly);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: featured (which has featured: true first)
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating; // tie-breaker
      });
    }

    return result;
  }

  // Initialize
  initCart();

  // Expose globally
  window.Store = {
    addItem,
    removeItem,
    clearCart,
    getCartItems,
    getSubtotal,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getTotal,
    getCount,
    getCouponCode,
    getDiscountPercent,
    onCartChange,
    getFilteredProducts
  };
})();
