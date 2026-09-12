
  /**
 * Frontend Developer Portfolio - JavaScript Logic
 * Ragipindi Abhinay Reddy Portfolio
 * 
 * Features:
 * 1. Dark/Light Theme Switcher with localStorage & System Preference
 * 2. Responsive Mobile Drawer Navigation with Keyboard & Outside Click Handling
 * 3. IntersectionObserver Active Navigation Scroll Spy
 * 4. Interactive Project Category Filtering
 * 5. Comprehensive Client-Side Contact Form Validation with Real-Time Feedback
 * 6. Smooth Scroll & Back-to-Top Control
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Theme Switcher (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Detect saved preference or default to Black & White dark mode
  const getPreferredTheme = () => {
    try {
      const savedTheme = localStorage.getItem('portfolio-theme-mode');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (e) {}
    return 'dark'; // Default to Black & White
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme-mode', theme);
    } catch (e) {}
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'white' : 'black'} background`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'white' : 'black'} background`);
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = htmlRoot.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('portfolio-theme-mode')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  }


  /* ==========================================================================
     2. Mobile Navigation Drawer
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');
  const body = document.body;

  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (shouldOpen) {
      mobileDrawer.classList.add('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      body.classList.add('drawer-open');
    } else {
      mobileDrawer.classList.remove('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      body.classList.remove('drawer-open');
    }
  };

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile drawer when link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
        mobileToggleBtn.focus();
      }
    });
  }


  /* ==========================================================================
     3. Active Navigation Scroll Spy (IntersectionObserver)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }


  /* ==========================================================================
     4. Project Category Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Active button styles
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category') || '';
          const categories = cardCategory.split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.classList.remove('hidden');
            // Subtle entrance transition
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }


  /* ==========================================================================
     5. Contact Form Client-Side Validation
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  // Character counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCounter.textContent = `${currentLength} / 500`;
      if (currentLength > 500) {
        charCounter.style.color = 'var(--status-error)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Field validation rules
  const validators = {
    name: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Please enter your full name.';
      }
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters long.';
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
        return 'Name contains invalid characters.';
      }
      return '';
    },

    email: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Please enter your email address.';
      }
      // Standard RFC-compliant email regex
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(trimmed)) {
        return 'Please enter a valid email address (e.g. alex@example.com).';
      }
      return '';
    },

    subject: (value) => {
      if (!value || value === '') {
        return 'Please select an inquiry subject.';
      }
      return '';
    },

    message: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Please enter your message.';
      }
      if (trimmed.length < 15) {
        return `Message is too short (${trimmed.length}/15 characters minimum).`;
      }
      if (trimmed.length > 500) {
        return `Message exceeds 500 character limit (${trimmed.length}/500).`;
      }
      return '';
    }
  };

  // Helper to display or clear error for a specific field
  const validateField = (field, validatorKey) => {
    const errorSpan = document.getElementById(`${field.id}-error`);
    const errorMsg = validators[validatorKey](field.value);

    if (errorMsg) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      field.setAttribute('aria-invalid', 'true');
      if (errorSpan) errorSpan.textContent = errorMsg;
      return false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      field.setAttribute('aria-invalid', 'false');
      if (errorSpan) errorSpan.textContent = '';
      return true;
    }
  };

  // Attach real-time validation on blur & input
  if (contactForm) {
    [
      { element: nameInput, key: 'name' },
      { element: emailInput, key: 'email' },
      { element: subjectInput, key: 'subject' },
      { element: messageInput, key: 'message' }
    ].forEach(({ element, key }) => {
      if (!element) return;

      element.addEventListener('blur', () => {
        validateField(element, key);
      });

      element.addEventListener('input', () => {
        if (element.classList.contains('is-invalid')) {
          validateField(element, key);
        }
      });
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isNameValid = validateField(nameInput, 'name');
      const isEmailValid = validateField(emailInput, 'email');
      const isSubjectValid = validateField(subjectInput, 'subject');
      const isMessageValid = validateField(messageInput, 'message');

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        // Focus the first invalid field
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();

        if (formAlert) {
          formAlert.className = 'form-alert error';
          formAlert.textContent = 'Please review and resolve the errors highlighted above before submitting.';
          formAlert.style.display = 'block';
        }
        return;
      }

      // Hide previous alert
      if (formAlert) formAlert.style.display = 'none';

      // Simulation of async submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Display success confirmation message
        if (formAlert) {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `
            <strong>Thank you, ${nameInput.value.trim()}!</strong> Your message has been received. I will review your note and get back to you within 24 hours.
          `;
          formAlert.style.display = 'block';
        }

        // Reset form & state
        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
          input.classList.remove('is-valid');
          input.removeAttribute('aria-invalid');
        });
        if (charCounter) charCounter.textContent = '0 / 500';

        // Scroll smoothly to alert if out of view
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }


  /* ==========================================================================
     6. Back to Top Button & Footer Year
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
