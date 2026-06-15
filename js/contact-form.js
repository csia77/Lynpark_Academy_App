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
    //  API CONFIGURATION
    // =========================================
    /**
     * TODO(maintainer): To enable real form submission, choose ONE:
     *
     * Option A — EmailJS (free tier: 200 emails/month, no server needed)
     *   1. Sign up at https://www.emailjs.com (free)
     *   2. Create an email service and template
     *   3. Set the constants below
     *   4. Add EmailJS SDK script to contact.html:
     *      <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
     *   5. Change USE_REAL_API to true
     *
     * Option B — Formspree (free tier: 50 submissions/month)
     *   1. Sign up at https://formspree.io (free)
     *   2. Create a form and get your endpoint URL
     *   3. Set API_ENDPOINT below
     *   4. Change USE_REAL_API to true
     */
    const USE_REAL_API = false;
    const API_ENDPOINT = ''; // TODO(maintainer): Set your API endpoint URL
    const EMAILJS_SERVICE_ID = ''; // TODO(maintainer): Set your EmailJS service ID
    const EMAILJS_TEMPLATE_ID = ''; // TODO(maintainer): Set your EmailJS template ID
    const EMAILJS_PUBLIC_KEY = ''; // TODO(maintainer): Set your EmailJS public key

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

        const formData = { name, email, subject, message };

        if (USE_REAL_API) {
            submitFormToAPI(formData);
        } else {
            simulateSubmit();
        }
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
    // =========================================
    //  5a. SIMULATED SUBMIT (Demo Mode)
    // =========================================
    const simulateSubmit = () => {
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            form.reset();
            showToast('Demo mode: Message recorded locally. Connect an email service to send for real.', 'success');
        }, 1500);
    };

    // =========================================
    //  5b. REAL API SUBMIT (When configured)
    // =========================================
    /**
     * TODO(maintainer): This function sends form data to a real endpoint.
     * Configure USE_REAL_API and the endpoint constants above.
     */
    const submitFormToAPI = (formData) => {
        // Check if EmailJS is configured
        if (EMAILJS_SERVICE_ID && typeof emailjs !== 'undefined') {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
            }, EMAILJS_PUBLIC_KEY)
            .then(() => {
                submitBtn.classList.remove('loading');
                form.reset();
                showToast('Message sent successfully! We will get back to you soon.', 'success');
            })
            .catch((err) => {
                submitBtn.classList.remove('loading');
                showToast('Failed to send message. Please try again or call us directly.', 'error');
                console.error('EmailJS Error:', err);
            });
        }
        // Fallback to Formspree / generic endpoint
        else if (API_ENDPOINT) {
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData),
            })
            .then(response => {
                submitBtn.classList.remove('loading');
                if (response.ok) {
                    form.reset();
                    showToast('Message sent successfully! We will get back to you soon.', 'success');
                } else {
                    throw new Error('Server error');
                }
            })
            .catch(() => {
                submitBtn.classList.remove('loading');
                showToast('Failed to send message. Please try again or call us directly.', 'error');
            });
        }
        // No API configured — fall back to simulation
        else {
            console.warn('No API endpoint configured. Falling back to demo mode.');
            simulateSubmit();
        }
    };

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
