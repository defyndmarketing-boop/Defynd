/* =========================================================
   Healing Hands RSA — App JS
   - Floating nav scroll behaviour
   - Mobile menu toggle
   - Intersection Observer reveal animations
   ========================================================= */

(function () {
  'use strict';

  /* ── Floating Nav: shrink on scroll ── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 80) {
      nav.style.top = '0.75rem';
    } else {
      nav.style.top = '1.5rem';
    }

    lastScroll = y;
  }, { passive: true });

  /* ── Mobile Menu ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobLinks    = document.querySelectorAll('.mob-link');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── Scroll Reveal via IntersectionObserver ── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

})();
