// Preloader
let preloadProgress = 0;
const preloader = document.getElementById('preloader');
const progressText = document.getElementById('progress-value');
const progressFill = document.getElementById('progress-bar-fill');

if (preloader && progressText && progressFill) {
    const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 4) + 1; // 1–4 arası artış
        preloadProgress = Math.min(preloadProgress + increment, 100);

        progressText.textContent = preloadProgress + '%';
        progressFill.style.width = preloadProgress + '%';

        if (preloadProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('preloader-hide');
                document.body.classList.remove('loading');
            }, 400);
        }
    }, 40);

    // Güvenlik için maksimum süre (ör. 8 saniye)
    setTimeout(() => {
        if (preloadProgress < 100) {
            preloadProgress = 100;
            progressText.textContent = '100%';
            progressFill.style.width = '100%';
            preloader.classList.add('preloader-hide');
            document.body.classList.remove('loading');
        }
    }, 8000);
}

// Smooth scroll for navigation links (daha yavaş ve yumuşak)
function smoothScrollTo(targetY, duration = 1100) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeInOut (cosine)
        const eased = 0.5 * (1 - Math.cos(Math.PI * progress));
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetRect = target.getBoundingClientRect();
        const targetY = targetRect.top + window.pageYOffset - (navbarHeight + 16);

        smoothScrollTo(targetY);

        // Close mobile menu if open
        const navMenuEl = document.querySelector('.nav-menu');
        const hamburgerEl = document.querySelector('.hamburger');
        if (navMenuEl && hamburgerEl) {
            navMenuEl.classList.remove('active');
            hamburgerEl.classList.remove('active');
        }
    });
});

// Logo click -> scroll to top / hero
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.addEventListener('click', () => {
        const hero = document.getElementById('anasayfa') || document.querySelector('.hero');
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetY = hero
            ? hero.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 16)
            : 0;

        smoothScrollTo(targetY);

        const navMenuEl = document.querySelector('.nav-menu');
        const hamburgerEl = document.querySelector('.hamburger');
        if (navMenuEl && hamburgerEl) {
            navMenuEl.classList.remove('active');
            hamburgerEl.classList.remove('active');
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress + '%';
            skillObserver.unobserve(progressBar);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// Fade in animation for sections
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(section);
});

// Timeline items animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    if (index % 2 === 0) {
        item.style.transform = 'translateX(-50px)';
    } else {
        item.style.transform = 'translateX(50px)';
    }
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    timelineObserver.observe(item);
});

// Education cards animation
const educationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.education-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    educationObserver.observe(card);
});

// İletişim formu: Doğrudan FormSubmit'e gider (sayfa http/https ile açıldığında çalışır)

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles via JavaScript
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--text-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
