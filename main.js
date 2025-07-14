// Main JavaScript file for BellaVita Beauty Salon

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Navbar background on scroll
    initNavbarScroll();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Form validation and submission
    initFormValidation();
    
    // Mobile menu handling
    initMobileMenu();
    
    // Set minimum date for booking form
    initDatePicker();
    
    // Initialize WhatsApp chat functionality
    initWhatsAppChat();
    
    console.log('BellaVita website initialized successfully');
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                const navbarToggler = document.querySelector('.navbar-toggler');
                
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
}

/**
 * Initialize navbar background change on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .team-card, .pricing-card');
    
    // Add animation class to elements
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize form validation and submission handling
 */
function initFormValidation() {
    const bookingForm = document.querySelector('#prenota form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const isValid = validateForm(this);
            
            if (isValid) {
                // Add loading state to button
                submitBtn.classList.add('btn-loading');
                submitBtn.disabled = true;
                
                // Form will submit normally via Flask
                // The loading state will be reset on page reload
            } else {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = bookingForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Inserisci un indirizzo email valido');
            isValid = false;
        }
    }
    
    // Validate phone format
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        if (!isValidPhone(phoneField.value)) {
            showFieldError(phoneField, 'Inserisci un numero di telefono valido');
            isValid = false;
        }
    }
    
    // Validate date (must be in the future)
    const dateField = form.querySelector('input[type="date"]');
    if (dateField && dateField.value) {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(dateField, 'Seleziona una data futura');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Questo campo è obbligatorio');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format (Italian phone numbers)
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+39|0039|39)?\s?[0-9]{8,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Initialize mobile menu handling
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && 
                !navbarCollapse.contains(e.target) && 
                navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}

/**
 * Initialize date picker with minimum date
 */
function initDatePicker() {
    const dateInput = document.querySelector('input[type="date"]');
    
    if (dateInput) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
        
        // Set max date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateString = maxDate.toISOString().split('T')[0];
        dateInput.setAttribute('max', maxDateString);
    }
}

/**
 * Utility function to scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Show notification (can be used for future enhancements)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Handle service card clicks (for future enhancement)
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h4').textContent;
            
            // Scroll to booking form and pre-select service
            const bookingSection = document.querySelector('#prenota');
            const serviceSelect = document.querySelector('#servizio');
            
            if (bookingSection && serviceSelect) {
                // Find matching option
                const options = serviceSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent.includes(serviceName)) {
                        serviceSelect.value = option.value;
                    }
                });
                
                // Scroll to booking form
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = bookingSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize WhatsApp chat functionality
 */
function initWhatsAppChat() {
    const whatsappButton = document.querySelector('#whatsapp-chat');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Phone number for BellaVita salon (replace with actual number)
            const phoneNumber = '+390612345678'; // Example: Italian phone number
            const message = encodeURIComponent('Ciao! Vorrei prenotare un appuntamento presso BellaVita. Potreste aiutarmi?');
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Open WhatsApp in new window/tab
            window.open(whatsappUrl, '_blank');
        });
        
        // Add click animation
        whatsappButton.addEventListener('click', function() {
            const button = this.querySelector('.whatsapp-button');
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    }
}

// Initialize service card clicks when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initServiceCards();
});
