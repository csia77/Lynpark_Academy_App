/**
 * =============================================
 *  CONTACT-FORM.JS — Form Validation & Submit
 *  Lynpark Learning Centre
 * =============================================
 * 
 *  KEY CONCEPTS:
 *  - Form validation (both HTML5 and custom JS)
 *  - Regular expressions for email validation
 *  - DOM manipulation for error messages
 *  - Async simulation (setTimeout as placeholder)
 *  - Toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!form) return; // Exit if not on contact page

    // =========================================
    //  1. HELPER: Validate Email Format
    // =========================================
    /**
     * Uses a regex pattern to check if email is valid.
     * 
     * REGEX BREAKDOWN:
     * ^        — Start of string
     * [^\s@]+  — One or more characters that are NOT whitespace or @
     * @        — The @ symbol
     * [^\s@]+  — Domain name (no spaces or @)
     * \.       — A literal dot
     * [^\s@]+  — Top-level domain
     * $        — End of string
     */
    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    // =========================================
    //  2. HELPER: Show/Hide Field Errors
    // =========================================
    const showError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.add('error');
        error.classList.add('visible');
    };

    const clearError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.remove('error');
        error.classList.remove('visible');
    };

    // =========================================
    //  3. REAL-TIME VALIDATION
    // =========================================
    /**
     * Clear error styling when user starts typing.
     * This provides immediate feedback that their
     * correction is being recognized.
     */
    const fields = ['name', 'email', 'subject', 'message'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', () => {
                clearError(field, `${field}Error`);
            });
            // Also clear on focus for select elements
            input.addEventListener('focus', () => {
                clearError(field, `${field}Error`);
            });
        }
    });

    // =========================================
    //  4. FORM SUBMIT HANDLER
    // =========================================
    form.addEventListener('submit', (e) => {
        // Prevent default form submission (page reload)
        e.preventDefault();

        // Get form values (trim removes whitespace)
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Track if form is valid
        let isValid = true;

        // Validate each required field
        if (!name) {
            showError('name', 'nameError');
            isValid = false;
        }

        if (!email || !isValidEmail(email)) {
            showError('email', 'emailError');
            isValid = false;
        }

        if (!subject) {
            showError('subject', 'subjectError');
            isValid = false;
        }

        if (!message) {
            showError('message', 'messageError');
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) return;

        // =========================================
        //  5. SIMULATE FORM SUBMISSION
        // =========================================
        /**
         * For now, we simulate an API call with setTimeout.
         * In the future, this will be replaced with EmailJS
         * or a Firebase Cloud Function to actually send emails.
         */
        
        // Show loading state
        submitBtn.classList.add('loading');

        // Simulate a 1.5-second network request
        setTimeout(() => {
            // Remove loading state
            submitBtn.classList.remove('loading');

            // Reset the form
            form.reset();

            // Show success toast
            showToast('Message sent successfully! We will get back to you soon.', 'success');
        }, 1500);
    });

    // =========================================
    //  6. TOAST NOTIFICATION
    // =========================================
    /**
     * Shows a temporary notification at the bottom
     * of the screen. Auto-hides after 4 seconds.
     * 
     * @param {string} message — Text to display
     * @param {string} type — 'success' or 'error'
     */
    const showToast = (message, type = 'success') => {
        // Update toast content and style
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;

        // Update the icon based on type
        const icon = toast.querySelector('i');
        icon.className = type === 'success' 
            ? 'fas fa-check-circle' 
            : 'fas fa-exclamation-circle';

        // Show the toast
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // Auto-hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 4000);
    };

}); // End DOMContentLoaded
