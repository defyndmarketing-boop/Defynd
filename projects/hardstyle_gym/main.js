/* ==========================================================================
   HARDSTYLE STRENGTH & FITNESS - INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Opening Hours Current Day Highlight ---
    initHoursHighlight();
    
    // --- 2. Hardware-Accelerated Scroll Reveal Staggers ---
    initScrollReveals();
    
    // --- 3. Interactive Bento Card spotlight spotlights ---
    initBentoSpotlights();
    
    // --- 4. Mobile Floating CTA Visibility Logic ---
    initMobileStickyBar();
    
    // --- 5. Custom Navigation Anchors Smooth Scroll ---
    initSmoothScroll();
});

/**
 * Automatically detects the current weekday in the local system timezone
 * and highlights the corresponding row in the operating hours grid.
 */
function initHoursHighlight() {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const targetRow = document.querySelector(`.hours-row[data-day="${today}"]`);
    
    if (targetRow) {
        // Highlight current day
        targetRow.classList.add('hours-active');
        
        // Append a live indicator text/dot cleanly without layout shifts
        const timeCell = targetRow.querySelector('.day-time');
        if (timeCell) {
            const isClosed = targetRow.classList.contains('hours-closed');
            const statusLabel = document.createElement('span');
            statusLabel.style.fontSize = '0.7rem';
            statusLabel.style.fontWeight = '800';
            statusLabel.style.textTransform = 'uppercase';
            statusLabel.style.padding = '4px 8px';
            statusLabel.style.borderRadius = '3px';
            statusLabel.style.marginLeft = '12px';
            statusLabel.style.display = 'inline-block';
            statusLabel.style.verticalAlign = 'middle';
            
            if (isClosed) {
                statusLabel.style.backgroundColor = 'rgba(255, 59, 48, 0.15)';
                statusLabel.style.color = '#FF3B30';
                statusLabel.textContent = 'Closed Today';
            } else {
                statusLabel.style.backgroundColor = 'rgba(52, 199, 89, 0.15)';
                statusLabel.style.color = '#34C759';
                statusLabel.textContent = 'Open Today';
            }
            
            timeCell.appendChild(statusLabel);
        }
    }
}

/**
 * Uses high-performance IntersectionObserver to staggered reveal sections,
 * cards, headers, and visual graphics dynamically as they cross viewports.
 */
function initScrollReveals() {
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // If it's a staggered grid, stagger children reveals
                const cardGrid = entry.target.closest('.testimonials-grid, .bento-grid, .contact-info-blocks');
                if (cardGrid) {
                    const children = Array.from(cardGrid.querySelectorAll('.scroll-reveal'));
                    const childIndex = children.indexOf(entry.target);
                    if (childIndex !== -1) {
                        entry.target.style.transitionDelay = `${childIndex * 60}ms`;
                    }
                }
                
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * Enforces Vercel-core style Spotlight Cards inside the Bento layout.
 * Calculates cursor vectors dynamically and drives high-performance CSS gradient meshes.
 */
function initBentoSpotlights() {
    const bentoCards = document.querySelectorAll('.bento-card');
    
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set custom properties driving radial background overlay in CSS
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Controls sticky navigation/mobile sticky bar transitions.
 * Ensures floating docks are invisible at the very top fold and fade in gracefully on scrolling.
 */
function initMobileStickyBar() {
    const floatingBar = document.querySelector('.floating-sticky-bar');
    if (!floatingBar) return;
    
    // Add scroll listener with throttling to avoid layout painting overhead
    let lastScrollTime = 0;
    
    function checkScroll() {
        const scrollPosition = window.scrollY;
        
        // Past the initial top header/Hero fold
        if (scrollPosition > 160) {
            floatingBar.classList.add('visible');
        } else {
            floatingBar.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 30) {
            checkScroll();
            lastScrollTime = now;
        }
    });
    
    // Initial check on load
    checkScroll();
}

/**
 * Standard anchor intercept smooth scrolling targeting correct header heights.
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = 80; // Match CSS --header-height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
