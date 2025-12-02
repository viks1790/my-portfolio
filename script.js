// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggle = document.getElementById('theme-toggle');
    this.navbar = document.getElementById('navbar');
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Update toggle icon
    const icon = this.themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      icon.style.color = '#fbbf24';
    } else {
      icon.className = 'fas fa-moon';
      icon.style.color = '#6b7280';
    }
    
    // Update navbar background immediately
    this.updateNavbarBackground();
  }
  
  updateNavbarBackground() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (window.scrollY > 100) {
      this.navbar.style.background = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(248, 250, 252, 0.95)';
    } else {
      this.navbar.style.background = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(248, 250, 252, 0.95)';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    this.init();
  }

  init() {
    this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateActiveNavLink();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
        this.navMenu.classList.remove('active');
      }
    });
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
  }

  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    // Allow default navigation for non-hash links (e.g., showcase.html)
    if (!href || !href.startsWith('#')) {
      return; // do not prevent default
    }
    e.preventDefault();
    const targetSection = document.querySelector(href);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu after click
    this.navMenu.classList.remove('active');
  }

  handleScroll() {
    // Add/remove navbar background on scroll
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (window.scrollY > 100) {
      this.navbar.style.background = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(248, 250, 252, 0.95)';
    } else {
      this.navbar.style.background = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(248, 250, 252, 0.95)';
    }
  }

  updateActiveNavLink() {
    let current = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    this.init();
  }

  init() {
    // Initial check for elements in view
    this.checkElementsInView();
    
    // Set up intersection observer for better performance
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      window.addEventListener('scroll', () => this.checkElementsInView());
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  checkElementsInView() {
    this.animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('visible');
      }
    });
  }
}

// Smooth Scrolling for anchor links
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Typing Animation for Frontend Lead Title
class TitleTypingAnimation {
  constructor() {
    this.titles = [
      'Frontend Lead',
      'React Native Expert', 
      'Mobile Developer',
      'Tech Innovator',
      'Team Leader',
      'Architecture Expert'
    ];
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.typeSpeed = 120;
    this.deleteSpeed = 80;
    this.pauseTime = 2000;
    this.titleElement = document.querySelector('.title-primary');
    
    if (this.titleElement) {
      this.init();
    }
  }

  init() {
    // Start typing animation after a delay
    setTimeout(() => {
      this.type();
    }, 1500);
  }

  type() {
    const currentTitle = this.titles[this.currentIndex];
    
    if (this.isDeleting) {
      this.currentText = currentTitle.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = currentTitle.substring(0, this.currentText.length + 1);
    }
    
    this.titleElement.innerHTML = this.currentText + '<span class="typing-cursor">|</span>';
    
    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    
    if (!this.isDeleting && this.currentText === currentTitle) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.titles.length;
      speed = 300;
    }
    
    setTimeout(() => this.type(), speed);
  }
}

// Statistics Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      this.counters.forEach(counter => observer.observe(counter));
    }
  }

  animateCounter(counter) {
    const target = counter.textContent;
    const numericValue = parseInt(target.replace(/\D/g, ''));
    
    // Skip animation if no numeric value found (e.g., "On-site", "Industrial", "Hardware")
    if (isNaN(numericValue) || numericValue === 0) {
      return;
    }
    
    const suffix = target.replace(/[\d.]/g, '');
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }
}

// Parallax Effect for Hero Section
class ParallaxManager {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.floatingElements = document.querySelectorAll('.floating-element');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const heroHeight = this.hero.offsetHeight;
    
    if (scrolled < heroHeight) {
      // Move floating elements at different speeds
      this.floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  }
}

// Form Validation (if contact form is added later)
class FormManager {
  constructor() {
    this.contactForm = document.getElementById('contact-form');
    if (this.contactForm) {
      this.init();
    }
  }

  init() {
    this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted');
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize scroll listeners
    this.throttleScrollEvents();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  throttleScrollEvents() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Trigger scroll-dependent functions here
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// Easter Egg - Console Message
class EasterEgg {
  constructor() {
    this.init();
  }

  init() {
    console.log(`
    %c👋 Hello there, fellow developer!
    
    %cWelcome to Vikrant's Portfolio!
    
    %c🚀 If you're inspecting the code, you must be curious about the technical implementation.
    
    %c💡 This portfolio is built with:
    • Vanilla JavaScript (ES6+)
    • Modern CSS (Grid, Flexbox, Custom Properties)
    • Responsive Design
    • Performance Optimizations
    • Accessibility Features
    
    %c🔗 Let's connect: viks1790@gmail.com
    `, 
    'color: #2563eb; font-size: 16px; font-weight: bold;',
    'color: #374151; font-size: 14px;',
    'color: #059669; font-size: 14px;',
    'color: #7c3aed; font-size: 14px;',
    'color: #dc2626; font-size: 14px;'
    );
  }
}

// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  window.themeManagerInstance = new ThemeManager();
  new NavigationManager();
  new AnimationManager();
  new SmoothScrollManager();
  new TitleTypingAnimation();
  new CounterAnimation();
  new ParallaxManager();
  new FormManager();
  new PerformanceManager();
  new EasterEgg();
  
  // Add enhanced animation classes to elements
  setTimeout(() => {
    // Timeline animations with staggered delays
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
      item.style.animation = `fadeInUp 0.8s ease forwards`;
      item.style.animationDelay = `${index * 0.3}s`;
      item.style.opacity = '0';
      
      // Add hover wiggle animation to timeline markers
      const marker = item.querySelector('.timeline-marker');
      if (marker) {
        marker.addEventListener('mouseenter', () => {
          marker.style.animation = 'wiggle 0.6s ease';
        });
      }
    });
    
    // Skills section animations
    document.querySelectorAll('.skill-category-creative').forEach((category, index) => {
      category.style.animation = `bounceIn 0.8s ease forwards`;
      category.style.animationDelay = `${index * 0.15}s`;
      category.style.opacity = '0';
    });
    
    // Project cards animations
    document.querySelectorAll('.project-card').forEach((card, index) => {
      card.style.animation = `slideInRight 0.7s ease forwards`;
      card.style.animationDelay = `${index * 0.2}s`;
      card.style.opacity = '0';
      
      // Add rotation effect on hover for tech tags
      card.querySelectorAll('.tech-tag').forEach((tag, tagIndex) => {
        tag.addEventListener('mouseenter', () => {
          tag.style.animation = `rotateIn 0.4s ease`;
          tag.style.animationDelay = `${tagIndex * 0.05}s`;
        });
      });
    });
    
    // About highlights
    document.querySelectorAll('.highlight').forEach((highlight, index) => {
      highlight.style.animation = `slideInLeft 0.6s ease forwards`;
      highlight.style.animationDelay = `${index * 0.15}s`;
      highlight.style.opacity = '0';
    });
    
    // Hero elements
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    if (heroText) {
      heroText.style.animation = 'slideInLeft 1s ease forwards';
    }
    if (heroImage) {
      heroImage.style.animation = 'slideInRight 1s ease forwards';
      heroImage.style.animationDelay = '0.3s';
      heroImage.style.opacity = '0';
    }
    
    // Section headers animation
    document.querySelectorAll('.section-header').forEach((header, index) => {
      header.style.animation = `slideInDown 0.8s ease forwards`;
      header.style.animationDelay = `${index * 0.1}s`;
      header.style.opacity = '0';
    });
    
    // Tech items hover animations
    document.querySelectorAll('.tech-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        item.style.animation = 'bounceIn 0.4s ease';
      });
    });
    
    // Circular tech icons additional interactions
    document.querySelectorAll('.circular-tech-icon').forEach((icon, index) => {
      icon.addEventListener('click', () => {
        icon.style.animation = `orbitalRotation 30s linear infinite, pulseGlow 0.6s ease, wiggle 0.8s ease 0.2s`;
      });
    });
    
  }, 500);
  
  // Smooth reveal animation on page load
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });
});

// --- Showcase Work Dynamic Rendering ---
function initShowcaseIfPresent() {
  const start = () => {
    fetch('work.json')
      .then(resp => resp.json())
      .then(data => { renderShowcaseGallery(data.work || []); })
      .catch(e => console.error('Error loading work.json', e));
  };
  if (document.getElementById('gallery')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }
}

function renderShowcaseGallery(workArr) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  (workArr || []).forEach(workItem => {
    const section = document.createElement('div');
    section.className = 'work-section';
    const title = document.createElement('h3');
    title.innerHTML = `<strong>${workItem.title}</strong>`;
    section.appendChild(title);

    const thumbGrid = document.createElement('div');
    thumbGrid.className = 'thumbnails-container';

    (workItem.images || []).forEach((imgUrl, idx) => {
      const a = document.createElement('a');
      a.href = imgUrl;
      a.dataset.src = imgUrl;
      a.setAttribute('data-lg-size', '1400-900');
      a.style.position = 'relative';
      a.style.display = 'inline-block';

      const img = document.createElement('img');
      img.className = 'showcase-thumbnail loading';
      img.alt = `${workItem.title} ${idx + 1}`;
      img.setAttribute('decoding', 'async');
      img.setAttribute('loading', 'lazy');

      const skeleton = document.createElement('div');
      skeleton.className = 'showcase-thumbnail-skeleton';

      const hideSkeleton = () => {
        img.classList.remove('loading');
        skeleton.style.display = 'none';
      };

      img.addEventListener('load', hideSkeleton, { once: true });
      img.addEventListener('error', () => { /* keep skeleton visible on error */ }, { once: true });

      // Start actual load
      img.src = imgUrl;
      // If the image was served from cache and is already complete, hide immediately
      if (img.complete && img.naturalWidth > 0) {
        hideSkeleton();
      }

      a.appendChild(img);
      a.appendChild(skeleton);
      thumbGrid.appendChild(a);
    });

    section.appendChild(thumbGrid);
    gallery.appendChild(section);
  });

  if (window.lightGallery) {
    window.lgGalleryInstance && window.lgGalleryInstance.destroy && window.lgGalleryInstance.destroy();
    window.lgGalleryInstance = window.lightGallery(gallery, {
      selector: '.thumbnails-container a',
      plugins: (typeof lgZoom !== 'undefined' && typeof lgThumbnail !== 'undefined') ? [lgZoom, lgThumbnail] : [],
      speed: 600,
      download: false,
      mode: 'lg-fade',
      hideBarsDelay: 2000,
      mobileSettings: { controls: true, showCloseIcon: true, download: false, rotate: false }
    });
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function sendPrefetchToSW(urls) {
  if (!('serviceWorker' in navigator)) return;
  if (!Array.isArray(urls) || urls.length === 0) return;
  navigator.serviceWorker.ready.then((reg) => {
    if (reg && reg.active) {
      reg.active.postMessage({ type: 'PREFETCH_IMAGES', urls });
    }
  }).catch(() => {});
}

function precacheWorkImagesOnHome() {
  const path = (location.pathname || '').toLowerCase();
  const isHome = path.endsWith('/') || path.endsWith('/index.html') || path === '' || path.endsWith('/my-portfolio');
  if (!isHome) return;

  const start = () => {
    fetch('work.json')
      .then(r => r.json())
      .then(data => {
        const all = (data.work || []).flatMap(w => w.images || []);
        const dispatch = () => sendPrefetchToSW(all);
        if ('requestIdleCallback' in window) {
          requestIdleCallback(dispatch, { timeout: 1500 });
        } else {
          setTimeout(dispatch, 300);
        }
      })
      .catch(() => {});
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

// Ensure background prefetch and showcase bootstrapping
initShowcaseIfPresent();
registerServiceWorker();
precacheWorkImagesOnHome();

// Utility Functions
const utils = {
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { utils };
}