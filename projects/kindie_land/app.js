/**
 * KINDIE LAND - Playful Web Interactions & Core Logic Engine
 * Includes: Scroll-state nav morphing, IntersectionObserver navigation track,
 * Elastic testimonial selector deck, and smooth mobile overlay transitions.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SCROLL-ACTIVATED FLOATING NAVIGATION BAR ADJUSTMENT
     ========================================================================== */
  const navbar = document.querySelector('.nav-bar');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Call once immediately in case page is reloaded scrolled down
  handleScroll();


  /* ==========================================================================
     2. MOBILE MENU FULLSCREEN OVERLAY MORPH
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const body = document.body;

  const toggleMobileMenu = (forceClose = false) => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = !isExpanded && !forceClose;

    menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    
    if (shouldOpen) {
      mobileOverlay.classList.add('open');
      mobileOverlay.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
      mobileOverlay.classList.remove('open');
      mobileOverlay.setAttribute('aria-hidden', 'true');
      body.style.overflow = ''; // Restore scrolling
    }
  };

  menuToggle.addEventListener('click', () => toggleMobileMenu());

  // Close mobile menu when links are tapped
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });


  /* ==========================================================================
     3. INTERACTIVE ELASTIC TESTIMONIALS SWAP SYSTEM
     ========================================================================== */
  const testimonials = [
    {
      quote: "The owner was extremely accommodating, opening the center especially for us on a day they are usually closed. Amended food according to our dietary restrictions. The toddlers had an amazing time.",
      author: "Meesha T.",
      tag: "Verified Google Review"
    },
    {
      quote: "Love the location! Kids in this area really needed something like this.",
      author: "Tarusha A.",
      tag: "Verified Local Parent"
    },
    {
      quote: "Activities for kids while parents chill at the coffee shop. Caterpillar Club also provides tactile activities for kids.",
      author: "Zarina Essop",
      tag: "Local Guide"
    }
  ];

  const selectorBubbles = document.querySelectorAll('.selector-bubble');
  const quoteCard = document.getElementById('testimonial-card');
  const quoteContent = document.getElementById('quote-content');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteTag = document.getElementById('quote-tag');

  selectorBubbles.forEach((bubble) => {
    bubble.addEventListener('click', (e) => {
      // Find the button (could be clicking sub-element inside button)
      const btn = e.currentTarget;
      const index = parseInt(btn.getAttribute('data-index'), 10);

      // Avoid double triggering if already active
      if (btn.classList.contains('active')) return;

      // Update active bubble state
      selectorBubbles.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Trigger elastic transition swap
      quoteCard.classList.remove('elastic-swap');
      void quoteCard.offsetWidth; // Force CSS reflow to re-trigger keyframes

      // Apply bouncy elastic class
      quoteCard.classList.add('elastic-swap');

      // Swap the text content
      setTimeout(() => {
        quoteContent.textContent = testimonials[index].quote;
        quoteAuthor.textContent = testimonials[index].author;
        if (quoteTag) {
          quoteTag.textContent = testimonials[index].tag;
        }
      }, 100); // Small delay to align text swap with scaling animation dip
    });
  });


  /* ==========================================================================
     4. INTERSECTION OBSERVER FOR ACTIVE SCROLL NAVIGATION HIGHLIGHTS
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Center active window threshold
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));


  /* ==========================================================================
     5. DYNAMIC MAGNETIC FEEDBACK EFFECTS ON CALL TO ACTIONS
     ========================================================================== */
  const playfulBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-party');

  playfulBtns.forEach(button => {
    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.97)';
    });

    button.addEventListener('mouseup', () => {
      button.style.transform = '';
    });
  });

});
