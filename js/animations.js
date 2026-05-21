/**
 * =============================================
 *  ANIMATIONS.JS — Scroll-triggered Animations
 *  Lynpark Learning Centre
 * =============================================
 * 
 *  This file uses the IntersectionObserver API to
 *  trigger animations when elements scroll into view.
 * 
 *  KEY CONCEPT — IntersectionObserver:
 *  Instead of listening to the 'scroll' event (which fires
 *  hundreds of times per second and is expensive), the
 *  IntersectionObserver is a browser API that efficiently
 *  tells us when an element enters or leaves the viewport.
 * 
 *  Think of it as setting up a "tripwire" — when an element
 *  crosses that line, the browser notifies us. Much more
 *  performant than checking positions on every scroll!
 * 
 *  Features:
 *  1. Fade-in animations on scroll
 *  2. Staggered animations for child elements
 *  3. Animated number counters for statistics
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //  1. SCROLL-TRIGGERED FADE ANIMATIONS
    // =========================================

    /**
     * Create an IntersectionObserver instance.
     * 
     * The callback receives an array of "entries" — each entry
     * represents an observed element and tells us:
     * - entry.isIntersecting: is the element visible?
     * - entry.target: which DOM element triggered this
     * - entry.intersectionRatio: how much is visible (0 to 1)
     * 
     * Options:
     * - threshold: 0.15 means "trigger when 15% of the element is visible"
     * - rootMargin: adds extra margin around the viewport for triggering
     */
    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add the 'animated' class which triggers CSS transitions
                    entry.target.classList.add('animated');

                    // Once animated, stop observing this element
                    // (we only want to animate once, not every time
                    // the user scrolls past)
                    scrollObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element reaches viewport edge
        }
    );

    // Find all elements with the 'animate-on-scroll' class
    // and start observing them
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => scrollObserver.observe(el));


    // =========================================
    //  2. STAGGERED ANIMATIONS
    // =========================================
    // When a container has the 'stagger-children' class,
    // its children should animate one after another with
    // a slight delay between each one.
    //
    // We use CSS custom properties (variables) to set
    // the delay on each child, which the CSS animation
    // uses via var(--stagger-delay).

    const staggerContainers = document.querySelectorAll('.stagger-children');
    
    staggerContainers.forEach((container) => {
        const children = container.querySelectorAll('.animate-on-scroll');
        children.forEach((child, index) => {
            // Each child gets an incrementally larger delay
            // First child: 0ms, second: 100ms, third: 200ms, etc.
            child.style.setProperty('--stagger-delay', `${index * 100}ms`);
        });
    });


    // =========================================
    //  3. ANIMATED NUMBER COUNTERS
    // =========================================
    // The stats section has numbers that "count up" from 0
    // to their target value when scrolled into view.
    //
    // KEY CONCEPT — requestAnimationFrame:
    // Instead of using setInterval for the animation, we use
    // requestAnimationFrame (rAF). rAF is synchronized with
    // the display's refresh rate (usually 60fps), making the
    // animation buttery smooth. It also pauses when the tab
    // is hidden, saving battery life.

    /**
     * Easing function: easeOutExpo
     * 
     * Instead of counting linearly (1, 2, 3, 4, 5...),
     * this function makes the counting start fast and
     * slow down near the end — it feels more natural.
     * 
     * @param {number} t - Progress from 0 to 1
     * @returns {number} - Eased progress from 0 to 1
     */
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    /**
     * Animate a number from 0 to target.
     * 
     * @param {HTMLElement} element - The element to update
     * @param {number} target - The target number to count to
     * @param {number} duration - Animation duration in ms
     */
    const animateCounter = (element, target, duration = 2000) => {
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            // Calculate how far through the animation we are (0 to 1)
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Apply easing to make it feel smooth
            const easedProgress = easeOutExpo(progress);

            // Calculate and display the current number
            const currentValue = Math.floor(easedProgress * target);
            element.textContent = currentValue.toLocaleString();

            // Keep animating until we reach 100% progress
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure we end on the exact target number
                element.textContent = target.toLocaleString();
            }
        };

        // Start the animation loop
        requestAnimationFrame(updateCounter);
    };

    // Set up an observer specifically for the stat counters
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find all stat numbers inside this section
                    const statNumbers = entry.target.querySelectorAll('.stat-number');

                    statNumbers.forEach((numEl, index) => {
                        // Get the target number from the data attribute
                        const target = parseInt(numEl.getAttribute('data-target'), 10);

                        // Stagger the start of each counter slightly
                        setTimeout(() => {
                            animateCounter(numEl, target);
                        }, index * 200); // 200ms delay between each counter
                    });

                    // Only animate once
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 } // Trigger when 30% of the stats section is visible
    );

    // Observe the stats section
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

}); // End DOMContentLoaded
