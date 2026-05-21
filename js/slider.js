/**
 * =============================================
 *  SLIDER.JS — Hero Image Slider
 *  Lynpark Learning Centre
 * =============================================
 * 
 *  A pure vanilla JavaScript image slider.
 *  No libraries needed!
 * 
 *  Features:
 *  - Auto-rotation every 5 seconds
 *  - Pause on hover
 *  - Prev/Next arrow navigation
 *  - Dot indicators (auto-generated)
 *  - Touch/swipe support for mobile
 *  - Fade transitions via CSS
 * 
 *  KEY CONCEPTS:
 *  - setInterval / clearInterval for timers
 *  - Touch events for mobile swipe
 *  - Dynamic DOM creation (dots)
 *  - CSS class toggling for animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //  SETUP — Grab DOM elements
    // =========================================
    const slider = document.querySelector('.hero-slider');
    if (!slider) return; // Exit if no slider on this page

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');

    // State variables
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoRotateInterval = null;
    const AUTO_ROTATE_DELAY = 5000; // 5 seconds between slides

    // =========================================
    //  CORE FUNCTIONS
    // =========================================

    /**
     * Show a specific slide by index.
     * 
     * How it works:
     * 1. Remove 'active' class from all slides (hides them via CSS opacity: 0)
     * 2. Add 'active' class to the target slide (shows it via CSS opacity: 1)
     * 3. Update the dot indicators to match
     * 
     * The actual fade animation is handled purely by CSS transitions
     * on the .slide class — JS just toggles the class.
     */
    const goToSlide = (index) => {
        // Wrap around: if we go past the last slide, loop to first
        // The modulo operator (%) is perfect for circular navigation
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    /**
     * Move to the next slide.
     * Simple wrapper around goToSlide.
     */
    const nextSlide = () => goToSlide(currentSlide + 1);

    /**
     * Move to the previous slide.
     */
    const prevSlide = () => goToSlide(currentSlide - 1);


    // =========================================
    //  DOT INDICATORS — Auto-generated
    // =========================================
    // Instead of hardcoding dots in HTML, we create
    // them dynamically based on how many slides exist.
    // This means adding a new slide in HTML automatically
    // adds a new dot — no extra work needed!

    const createDots = () => {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);

            // Mark the first dot as active
            if (i === 0) dot.classList.add('active');

            // When a dot is clicked, go to that slide
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoRotate(); // Reset timer when user interacts
            });

            dotsContainer.appendChild(dot);
        }
    };


    // =========================================
    //  AUTO-ROTATION
    // =========================================
    // The slider automatically advances every 5 seconds.
    // We use setInterval which calls a function repeatedly
    // at a fixed time interval.

    const startAutoRotate = () => {
        // Clear any existing interval first to prevent
        // multiple intervals stacking up (a common bug!)
        stopAutoRotate();
        autoRotateInterval = setInterval(nextSlide, AUTO_ROTATE_DELAY);
    };

    const stopAutoRotate = () => {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    };

    // Reset = stop + start (resets the timer)
    const resetAutoRotate = () => {
        stopAutoRotate();
        startAutoRotate();
    };


    // =========================================
    //  EVENT LISTENERS — Buttons
    // =========================================
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoRotate();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoRotate();
        });
    }


    // =========================================
    //  PAUSE ON HOVER
    // =========================================
    // When the user hovers over the slider, we stop
    // auto-rotation so they can read the content.
    // When they move their mouse away, we resume.

    slider.addEventListener('mouseenter', stopAutoRotate);
    slider.addEventListener('mouseleave', startAutoRotate);


    // =========================================
    //  TOUCH/SWIPE SUPPORT (Mobile)
    // =========================================
    // On mobile, users swipe instead of clicking arrows.
    // We track where their finger starts and ends to
    // determine swipe direction.
    //
    // Touch events:
    // - touchstart: finger touches screen (record start position)
    // - touchmove:  finger moves (record current position)
    // - touchend:   finger lifts (calculate swipe direction)

    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50; // Minimum pixels to count as a swipe

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoRotate();
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        const swipeDistance = touchStartX - touchEndX;

        // Swipe left (finger moves left) → next slide
        if (swipeDistance > SWIPE_THRESHOLD) {
            nextSlide();
        }
        // Swipe right (finger moves right) → previous slide
        else if (swipeDistance < -SWIPE_THRESHOLD) {
            prevSlide();
        }

        resetAutoRotate();
    });


    // =========================================
    //  KEYBOARD NAVIGATION
    // =========================================
    // Arrow keys for accessibility
    document.addEventListener('keydown', (e) => {
        // Only respond when slider is in viewport
        const sliderRect = slider.getBoundingClientRect();
        const isVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;

        if (!isVisible) return;

        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoRotate();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoRotate();
        }
    });


    // =========================================
    //  INITIALIZE
    // =========================================
    createDots();
    goToSlide(0);
    startAutoRotate();

}); // End DOMContentLoaded
