// Mobile menu toggle
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Dark mode toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById('darkModeIcon');
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Copy code function for course pages
function copyCode(btn) {
    const code = btn.closest('.code-block').querySelector('pre').textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copié !';
        setTimeout(() => btn.textContent = 'Copier', 2000);
    });
}


// REACTIVE COURSE NAVIGATION (Scroll Spy)
function initCourseNavigation() {
    const courseNavLinks = document.querySelectorAll('.course-nav ul li a[href^="#"]');
    const lessonSections = document.querySelectorAll('.lesson-section[id]');

    if (!courseNavLinks.length || !lessonSections.length) return;

    // Map sections to nav links
    const sectionMap = new Map();
    lessonSections.forEach(section => {
        const id = section.id;
        const link = document.querySelector(`.course-nav ul li a[href="#${id}"]`);
        if (link) {
            sectionMap.set(section, link);
        }
    });

    // Intersection Observer for scroll spy
    const observerOptions = {
        root: null,
        rootMargin: '-90px 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all nav links
                courseNavLinks.forEach(link => link.classList.remove('active'));
                // Add active to current section's nav link
                const activeLink = sectionMap.get(entry.target);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    lessonSections.forEach(section => observer.observe(section));

    // Update progress bar based on scroll position
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial call
    }

    // Smooth scroll for course nav links
    courseNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}


// MOBILE DROPDOWN TOGGLE


function initMobileDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function(e) {
            // Only on mobile (when dropdown-menu is static positioned)
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu && getComputedStyle(menu).position === 'static') {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}


// ANIMATIONS ON SCROLL


function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .course-card, .testimonial-card, .team-card, .stat-item');

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animObserver.observe(el);
    });
}


// HEADER SCROLL EFFECT


function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.06)';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}


// INITIALIZE EVERYTHING ON DOM READY


document.addEventListener('DOMContentLoaded', function() {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const icon = document.getElementById('darkModeIcon');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const nav = document.getElementById('navLinks');
        const toggle = document.querySelector('.mobile-toggle');
        if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links (general)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Initialize course navigation (scroll spy)
    initCourseNavigation();

    // Initialize mobile dropdown
    initMobileDropdown();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize header scroll effect
    initHeaderScroll();
});

// EmailJS integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        const statusDiv = document.getElementById('form-status');

        btn.textContent = 'Envoi en cours...';
        btn.disabled = true;

        emailjs.sendForm('service_mtct1om', 'template_2j8apgk', contactForm)
            .then(function() {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
                statusDiv.style.color = '#22c55e';
                statusDiv.style.border = '1px solid #22c55e';
                statusDiv.textContent = '✅ Message envoyé avec succès ! Nous vous répondrons sous 24h.';
                contactForm.reset();
            }, function(error) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                statusDiv.style.color = '#ef4444';
                statusDiv.style.border = '1px solid #ef4444';
                statusDiv.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
                console.error('EmailJS error:', error);
            })
            .finally(function() {
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });
});