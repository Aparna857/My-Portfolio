/**
 * Portfolio Website — Main JavaScript
 * Features: Particles, Typing Animation, Dark Mode, Scroll Effects,
 *           Form Validation, Navigation, and Accessibility
 */

'use strict';

/* ==========================================================================
   CONFIGURATION — Customize these values for your portfolio
   ========================================================================== */
const CONFIG = {
  typingPhrases: [
    'Java Development',
    'Python & AI/ML',
    'Spring Boot & REST APIs',
    'Database Design',
    'Full-Stack Development',
    'Problem Solving'
  ],
  typingSpeed: 80,
  deletingSpeed: 40,
  pauseDuration: 2000,
  particleCount: 60,
  particleColor: { light: 'rgba(37, 99, 235, 0.35)', dark: 'rgba(96, 165, 250, 0.25)' },
  particleLineDistance: 120,
  scrollOffset: 80
};

/* ==========================================================================
   DOM ELEMENT REFERENCES
   ========================================================================== */
const DOM = {
  loader: document.getElementById('loader'),
  scrollProgress: document.getElementById('scroll-progress'),
  particleCanvas: document.getElementById('particle-canvas'),
  header: document.getElementById('header'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav__link'),
  themeToggle: document.getElementById('theme-toggle'),
  typingText: document.getElementById('typing-text'),
  backToTop: document.getElementById('back-to-top'),
  contactForm: document.getElementById('contact-form'),
  formSuccess: document.getElementById('form-success'),
  revealElements: document.querySelectorAll('.reveal')
};

/* ==========================================================================
   PAGE LOADER
   ========================================================================== */
function initLoader() {
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      DOM.loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 600);
  });
}

/* ==========================================================================
   SCROLL PROGRESS INDICATOR
   ========================================================================== */
function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    DOM.scrollProgress.style.width = `${progress}%`;
    DOM.scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
  }, { passive: true });
}

/* ==========================================================================
   STICKY HEADER & BACK TO TOP
   ========================================================================== */
function initScrollHandlers() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky header shadow
    DOM.header.classList.toggle('scrolled', scrollY > 50);

    // Back to top visibility
    if (scrollY > 400) {
      DOM.backToTop.classList.add('visible');
      DOM.backToTop.removeAttribute('hidden');
    } else {
      DOM.backToTop.classList.remove('visible');
      DOM.backToTop.setAttribute('hidden', '');
    }

    // Active nav link highlighting
    updateActiveNavLink();
  }, { passive: true });

  DOM.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Highlight the nav link matching the current scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - CONFIG.scrollOffset;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  DOM.navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

/* ==========================================================================
   NAVIGATION — Mobile Toggle & Smooth Scroll
   ========================================================================== */
function initNavigation() {
  // Mobile menu toggle
  DOM.navToggle.addEventListener('click', () => {
    const isOpen = DOM.navMenu.classList.toggle('open');
    DOM.navToggle.classList.toggle('active', isOpen);
    DOM.navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  DOM.navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }

      DOM.navMenu.classList.remove('open');
      DOM.navToggle.classList.remove('active');
      DOM.navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (
      DOM.navMenu.classList.contains('open') &&
      !DOM.navMenu.contains(e.target) &&
      !DOM.navToggle.contains(e.target)
    ) {
      DOM.navMenu.classList.remove('open');
      DOM.navToggle.classList.remove('active');
      DOM.navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   DARK MODE TOGGLE
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  DOM.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* ==========================================================================
   TYPING ANIMATION
   ========================================================================== */
function initTypingAnimation() {
  if (!DOM.typingText) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = CONFIG.typingPhrases[phraseIndex];

    if (isDeleting) {
      DOM.typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      DOM.typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = CONFIG.pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % CONFIG.typingPhrases.length;
      speed = 300;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   PARTICLE BACKGROUND (Canvas)
   ========================================================================== */
function initParticles() {
  const canvas = DOM.particleCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(CONFIG.particleCount, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
  }

  function getParticleColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? CONFIG.particleColor.dark : CONFIG.particleColor.light;
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getParticleColor();

    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.particleLineDistance) {
          const opacity = 1 - dist / CONFIG.particleLineDistance;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${opacity * 0.4})`);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(animationId);
    canvas.style.display = 'none';
  }
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    DOM.revealElements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  DOM.revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  if (!DOM.contactForm) return;

  const fields = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length >= 2 || 'Name must be at least 2 characters'
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (val) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(val.trim()) || 'Please enter a valid email address';
      }
    },
    subject: {
      el: document.getElementById('subject'),
      error: document.getElementById('subject-error'),
      validate: (val) => val.trim().length >= 3 || 'Subject must be at least 3 characters'
    },
    message: {
      el: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (val) => val.trim().length >= 10 || 'Message must be at least 10 characters'
    }
  };

  /**
   * Validate a single form field
   * @param {string} fieldName
   * @returns {boolean}
   */
  function validateField(fieldName) {
    const field = fields[fieldName];
    const result = field.validate(field.el.value);
    const isValid = result === true;

    field.el.classList.toggle('error', !isValid);
    field.error.textContent = isValid ? '' : result;

    return isValid;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) {
        validateField(key);
      }
    });
  });

  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    Object.keys(fields).forEach((key) => {
      if (!validateField(key)) isFormValid = false;
    });

    if (!isFormValid) return;

    // Simulate form submission (replace with actual backend integration)
    const submitBtn = DOM.contactForm.querySelector('.form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
      DOM.formSuccess.hidden = false;
      DOM.contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

      setTimeout(() => {
        DOM.formSuccess.hidden = true;
      }, 5000);
    }, 1500);
  });
}

/* ==========================================================================
   INITIALIZE ALL MODULES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initScrollHandlers();
  initNavigation();
  initTheme();
  initTypingAnimation();
  initParticles();
  initScrollReveal();
  initContactForm();
});
