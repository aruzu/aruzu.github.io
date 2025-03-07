// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const modalTriggers = document.querySelectorAll('.open-modal');
const closeModal = document.querySelector('.close-modal');
const contactForm = document.getElementById('contactForm');
const header = document.querySelector('.header');
const serviceCards = document.querySelectorAll('.service-card');
const featureBlocks = document.querySelectorAll('.feature-block');
const scrollTopButton = document.querySelector('.scroll-top');

// Mobile Menu Toggle
menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Modal functionality - update to handle multiple buttons
modalTriggers.forEach(trigger => {
    trigger?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Position modal at 25% from the top
        setTimeout(() => {
            const viewportHeight = window.innerHeight;
            const modalHeight = modalContent.offsetHeight;
            
            // Always position at 25% from top
            modalContent.style.top = '25vh';
            modalContent.style.transform = 'none';
            
            // Adjust height if modal is too tall
            if (modalHeight > viewportHeight * 0.7) {
                modalContent.style.height = '70vh';
                modalContent.style.overflowY = 'auto';
            } else {
                modalContent.style.height = 'auto';
                modalContent.style.overflowY = 'visible';
            }
        }, 10);
    });
});

closeModal?.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form submission
contactForm?.addEventListener('submit', async (e) => {
    // Don't prevent default form submission - let Formspree handle it
    
    if (!validateForm(contactForm)) {
        e.preventDefault();
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // The form will be submitted to Formspree
    // We'll handle the success/error states when the page returns from Formspree
    // This is just for UX while the form is submitting
    
    // Add a hidden field with the current page URL so Formspree can redirect back
    if (!contactForm.querySelector('input[name="_next"]')) {
        const nextInput = document.createElement('input');
        nextInput.type = 'hidden';
        nextInput.name = '_next';
        nextInput.value = window.location.href;
        contactForm.appendChild(nextInput);
    }
});

// Handle form submission response (this will run when redirected back from Formspree)
document.addEventListener('DOMContentLoaded', () => {
    // Check if we've been redirected back from Formspree
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('submitted')) {
        // Show success message
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        contactForm.innerHTML = `
            <div class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you shortly.</p>
                <button type="button" class="btn btn-primary close-success">Close</button>
            </div>
        `;
        
        // Add event listener to the close button
        document.querySelector('.close-success')?.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset form for next time
            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="_replyto" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="How can we help you?" required></textarea>
                    </div>
                    <input type="hidden" name="_subject" value="New Contact Form Submission from Lexel Group Website">
                    <input type="text" name="_gotcha" style="display:none">
                    <button type="submit" class="btn btn-primary">Send Message</button>
                `;
            }, 500);
        });
        
        // Remove the query parameter from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Enhanced scroll animations with intersection observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation for service cards and feature blocks
            if (entry.target.classList.contains('service-card') || 
                entry.target.classList.contains('feature-block')) {
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Service card hover effects
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Header scroll behavior
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        // Remove any existing error messages first
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
        
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
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    
    input.classList.add('error');
    input.parentNode.appendChild(errorDiv);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
});

// Remove error when user starts typing
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
        const errorMessage = e.target.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
});

// Scroll to top button
scrollTopButton?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll behavior
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTopButton?.classList.add('visible');
    } else {
        scrollTopButton?.classList.remove('visible');
    }
});

// Adjust modal on window resize
window.addEventListener('resize', function() {
    if (modal && modal.style.display === 'flex') {
        // Ensure modal is properly sized for the viewport
        const viewportWidth = window.innerWidth;
        if (viewportWidth < 640) {
            modalContent.style.width = '100%';
        }
    }
}); 