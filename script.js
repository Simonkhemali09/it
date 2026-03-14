// Samuel Painting Services – Main JavaScript

(function () {
  'use strict';

  /* ---- Navbar: scroll behavior ---- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Smooth scrolling for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll-triggered fade-in animation ---- */
  const fadeEls = document.querySelectorAll(
    '.service-card, .stat-card, .gallery-item, .about-text, .about-image, .why-us-text, .why-us-stats, .section-header, .contact-info, .contact-form, .info-item'
  );

  fadeEls.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });

  /* ---- Staggered animation for service cards ---- */
  document.querySelectorAll('.service-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 80) + 'ms';
  });

  document.querySelectorAll('.gallery-item').forEach(function (item, i) {
    item.style.transitionDelay = (i * 80) + 'ms';
  });

  /* ---- Animated counter for statistics ---- */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const text = el.textContent;
    // Extract numeric target and any suffix
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const duration = 1800;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Brief flash at the end
        el.style.animation = 'countFlash 0.4s ease';
        setTimeout(function () { el.style.animation = ''; }, 400);
      }
    }

    requestAnimationFrame(step);
  }

  // Observe stat numbers; animate counter once when visible
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ---- Contact form submission ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Simulate a short delay to mimic network request
      setTimeout(function () {
        formSuccess.style.display = 'block';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        // Hide success message after 6 seconds
        setTimeout(function () {
          formSuccess.style.display = 'none';
        }, 6000);
      }, 900);
    });
  }

  /* ---- Active nav link highlighting on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
