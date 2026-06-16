window.SoftwareStore = window.SoftwareStore || {};

SoftwareStore.Utils = {
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  },

  truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}"></i>
      <span class="toast__message">${message}</span>
      <button class="toast__close" onclick="this.parentElement.remove()">
        <i data-lucide="x"></i>
      </button>
    `;

    container.appendChild(toast);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ nodes: [toast] });
    }

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  },

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  renderStars(rating) {
    let html = '<span class="stars">';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i data-lucide="star" class="star star--filled"></i>';
      } else if (i - 0.5 <= rating) {
        html += '<i data-lucide="star-half" class="star star--half"></i>';
      } else {
        html += '<i data-lucide="star" class="star star--empty"></i>';
      }
    }
    html += '</span>';
    return html;
  },

  scrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  },

  animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  },

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
  },

  smoothScrollTo(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  getProductPrice(product, planType = 'pro') {
    const plan = product.plans.find(p => p.type === planType) || product.plans[0];
    const price = plan.price;
    if (product.discount) {
      return { original: price, discounted: price * (1 - product.discount / 100), plan };
    }
    return { original: price, discounted: null, plan };
  },

  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};
