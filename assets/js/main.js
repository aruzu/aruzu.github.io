// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize all functionality
function initializeApp() {
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScroll();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuButton = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}

// Scroll Animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => observer.observe(element));
}

// Smooth Scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value) {
            if (!isValidEmail(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
        }
    });

    return isValid;
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const errorDiv = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : document.createElement('div');
    
    if (!input.nextElementSibling?.classList.contains('error-message')) {
        errorDiv.classList.add('error-message');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    
    errorDiv.textContent = message;
    input.classList.add('error');
}

// Remove error when user starts typing
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
        const errorMessage = e.target.nextElementSibling;
        if (errorMessage?.classList.contains('error-message')) {
            errorMessage.remove();
        }
    }
}); 