// MeridianAI Product Site - Main JavaScript

(function () {
  "use strict";

  // DOM Ready
  function domReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // Smooth scrolling for navigation links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Scroll-triggered animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-fade").forEach((el) => {
      observer.observe(el);
    });
  }

  // Navbar background on scroll
  function initNavbarScroll() {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    function updateNavbar() {
      if (window.scrollY > 50) {
        nav.style.background = "rgba(26, 26, 26, 0.95)";
      } else {
        nav.style.background = "rgba(26, 26, 26, 0.9)";
      }
    }

    window.addEventListener("scroll", updateNavbar);
    updateNavbar(); // Initial call
  }

  // Animate counter numbers
  function animateCounter(element, target, suffix = "") {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      let displayValue = Math.floor(current);
      if (suffix === "+" && displayValue >= target) displayValue = target;
      element.textContent = displayValue + suffix;
    }, 40);
  }

  // Initialize counter animations
  function initCounterAnimations() {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll(".stat-number");
            // Animate all stats with their respective targets
            statNumbers.forEach((statNumber) => {
              const target = parseInt(statNumber.getAttribute("data-target"));
              if (!isNaN(target)) {
                animateCounter(statNumber, target, "");
              }
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // Enhanced form handling for contact forms
  function initContactForms() {
    const contactButtons = document.querySelectorAll('[href="#contact"]');
    contactButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        // Add analytics tracking here
        if (typeof gtag !== "undefined") {
          gtag("event", "contact_click", {
            event_category: "engagement",
            event_label: "Contact Button Click",
          });
        }
      });
    });
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Web Vitals monitoring (placeholder)
    if ("PerformanceObserver" in window) {
      // Monitor LCP, FID, CLS
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // Fallback for browsers that don't support this
      }
    }
  }

  // Lazy loading for images
  function initLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // Mobile-specific optimizations
  function initMobileOptimizations() {
    // Add touch-friendly class to body for CSS targeting
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add("touch-device");
    }

    // Improve scroll performance on mobile
    let ticking = false;
    function updateOnScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Use passive listeners for better mobile performance
    window.addEventListener("scroll", updateOnScroll, { passive: true });

    // Add touch feedback for buttons
    document
      .querySelectorAll(".cta-button, .primary-cta, .secondary-cta")
      .forEach((button) => {
        button.addEventListener(
          "touchstart",
          function () {
            this.style.transform = "scale(0.98)";
            this.style.opacity = "0.9";
          },
          { passive: true }
        );

        button.addEventListener(
          "touchend",
          function () {
            this.style.transform = "";
            this.style.opacity = "";
          },
          { passive: true }
        );
      });

    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      function (event) {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // Improve mobile navigation
    const nav = document.querySelector(".nav");
    if (nav) {
      let lastScrollTop = 0;
      window.addEventListener(
        "scroll",
        function () {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

          // Hide/show navbar on scroll for mobile
          if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
              nav.style.transform = "translateY(-100%)";
            } else {
              nav.style.transform = "translateY(0)";
            }
          }

          lastScrollTop = scrollTop;
        },
        { passive: true }
      );
    }
  }

  // Enhanced smooth scrolling for mobile
  function initMobileSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          // Add offset for fixed navbar on mobile
          const offset = window.innerWidth <= 768 ? 80 : 100;
          const targetPosition = target.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Mobile-friendly counter animations
  function initMobileCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number");

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      if (isNaN(target)) return; // Skip if no valid target

      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    // Use Intersection Observer for better mobile performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  // Initialize everything when DOM is ready
  domReady(function () {
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();
    initCounterAnimations();
    initContactForms();
    initPerformanceMonitoring();
    initLazyLoading();
    initMobileOptimizations();
    initMobileSmoothScrolling();
    initMobileCounterAnimations();

    // Add loaded class to body for CSS animations
    document.body.classList.add("loaded");

    console.log("MeridianAI website initialized successfully");
  });

  // Export functions for external use
  window.MeridianAI = {
    initSmoothScrolling,
    initScrollAnimations,
    animateCounter,
  };
})();
