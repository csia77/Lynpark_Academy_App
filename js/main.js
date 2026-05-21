/**
 * =============================================
 *  MAIN.JS — Global site functionality
 *  Lynpark Learning Centre
 * =============================================
 * 
 *  This file handles:
 *  1. Mobile hamburger menu (open/close)
 *  2. Sticky navigation on scroll
 *  3. Active nav link highlighting
 *  4. Smooth scrolling for anchor links
 *  5. Back-to-top button
 * 
 *  KEY CONCEPTS for learning:
 *  - Event delegation
 *  - requestAnimationFrame for scroll performance
 *  - classList API for toggling CSS classes
 *  - DOMContentLoaded event
 */

// ============================================
// Wait for the DOM to be fully loaded before
// running any JavaScript. This is crucial
// because JS runs top-to-bottom, and the HTML
// elements need to exist before we can select them.
// ============================================
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //  1. MOBILE HAMBURGER MENU
    // =========================================
    // We grab references to the DOM elements we need.
    // These are stored in constants because they
    // never change — a good habit.
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const body = document.body;

    // Toggle menu open/close when hamburger is clicked
    const toggleMenu = () => {
        const isOpen = body.classList.toggle('nav-open');
        // Update ARIA attribute for accessibility
        // Screen readers use this to announce menu state
        hamburger.setAttribute('aria-expanded', isOpen);
    };

    // Close the menu — used by overlay click and ESC key
    const closeMenu = () => {
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking the dark overlay behind it
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on ESC key press
    // This is an accessibility best practice — users expect
    // ESC to close overlays and modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('nav-open')) {
            closeMenu();
        }
    });

    // Close menu when a nav link is clicked (for single-page anchors)
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('nav-open')) {
                closeMenu();
            }
        });
    });


    // =========================================
    //  2. STICKY NAVIGATION ON SCROLL
    // =========================================
    // When the user scrolls past a certain point,
    // we add a class to the navbar that changes its
    // background and adds a shadow. This creates the
    // "sticky header" effect you see on modern sites.
    //
    // We use a flag (ticking) to ensure we only run
    // our scroll handler once per animation frame.
    // This is called "throttling with rAF" and it's
    // a performance optimization you should know.
    const navbar = document.getElementById('navbar');
    let ticking = false;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Add/remove 'scrolled' class based on scroll position
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide back-to-top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        ticking = false;
    };

    // Listen for scroll events, but throttle with rAF
    window.addEventListener('scroll', () => {
        if (!ticking) {
            // requestAnimationFrame tells the browser:
            // "Run this function before the next repaint"
            // This syncs our JS with the browser's render cycle
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });


    // =========================================
    //  3. ACTIVE NAV LINK HIGHLIGHTING
    // =========================================
    // We check which page we're on by looking at
    // the current URL, then add the 'active' class
    // to the matching navigation link.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        // Remove any existing active class first
        link.parentElement.classList.remove('active');

        // Check if this link matches the current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });


    // =========================================
    //  4. SMOOTH SCROLLING FOR ANCHOR LINKS
    // =========================================
    // When someone clicks a link like "#about",
    // instead of jumping instantly, we scroll
    // smoothly to that section.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            // Skip if it's just "#" (no target)
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // scrollIntoView with 'smooth' behavior is the modern
                // way to do animated scrolling — no libraries needed!
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // =========================================
    //  5. BACK TO TOP BUTTON
    // =========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // =========================================
    //  6. DROPDOWN MENUS (Desktop hover + Mobile click)
    // =========================================
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        // On mobile, toggle dropdown on click instead of navigating
        link.addEventListener('click', (e) => {
            // Only intercept on mobile (when hamburger is visible)
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                item.classList.toggle('dropdown-open');
            }
        });
    });

    // Run scroll handler once on page load
    // (in case the page loads already scrolled)
    handleScroll();

}); // End DOMContentLoaded
