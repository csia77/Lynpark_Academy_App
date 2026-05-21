/**
 * =============================================
 *  GALLERY.JS — Photo Gallery with Lightbox
 *  Lynpark Learning Centre
 * =============================================
 * 
 *  Features:
 *  1. Category filter tabs
 *  2. Lightbox popup for full-size images
 *  3. Keyboard navigation (arrows, ESC)
 *  4. Touch/swipe in lightbox
 * 
 *  KEY CONCEPTS:
 *  - Event delegation for dynamic elements
 *  - Data attributes for filtering
 *  - CSS class toggling for show/hide
 *  - Array methods (filter, forEach)
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //  1. CATEGORY FILTER
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length === 0) return; // Exit if not on gallery page

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            // Show/hide items based on category
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || itemCategory === category) {
                    item.style.display = '';
                    // Re-trigger animation
                    item.classList.remove('animated');
                    // Use requestAnimationFrame to ensure the class removal
                    // is processed before re-adding
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            item.classList.add('animated');
                        });
                    });
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // =========================================
    //  2. LIGHTBOX
    // =========================================
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let currentImageIndex = 0;
    let visibleItems = []; // Track currently visible (filtered) items

    /**
     * Get all currently visible gallery items.
     * This is recalculated each time because the filter
     * might have hidden some items.
     */
    const getVisibleItems = () => {
        return Array.from(galleryItems).filter(
            item => item.style.display !== 'none'
        );
    };

    /**
     * Open the lightbox with a specific image.
     */
    const openLightbox = (index) => {
        visibleItems = getVisibleItems();
        currentImageIndex = index;

        const item = visibleItems[index];
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;

        lightboxImg.src = img.src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
        lightboxCounter.textContent = `${index + 1} / ${visibleItems.length}`;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    /**
     * Close the lightbox.
     */
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    /**
     * Navigate to next/previous image in lightbox.
     */
    const navigateLightbox = (direction) => {
        visibleItems = getVisibleItems();
        currentImageIndex = ((currentImageIndex + direction) % visibleItems.length + visibleItems.length) % visibleItems.length;

        const item = visibleItems[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;

        // Add a brief fade effect
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = caption;
            lightboxCaption.textContent = caption;
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleItems.length}`;
            lightboxImg.style.opacity = '1';
        }, 200);
    };

    // Click on gallery item to open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Recalculate the index based on visible items
            const visible = getVisibleItems();
            const visibleIndex = visible.indexOf(item);
            openLightbox(visibleIndex);
        });
    });

    // Lightbox controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on overlay click (but not on image click)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Touch/swipe in lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const swipeDistance = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(swipeDistance) > 50) {
            navigateLightbox(swipeDistance > 0 ? 1 : -1);
        }
    });

}); // End DOMContentLoaded
