// Preloader
let preloadProgress = 0;
const preloader = document.getElementById('preloader');
const progressText = document.getElementById('progress-value');
const progressFill = document.getElementById('progress-bar-fill');
const pageParams = new URLSearchParams(window.location.search);
const skipPreloader = pageParams.has('skipPreloader');
const captureSection = pageParams.get('capture');

if (skipPreloader && preloader && progressText && progressFill) {
    preloadProgress = 100;
    progressText.textContent = '100%';
    progressFill.style.width = '100%';
    preloader.classList.add('preloader-hide');
    document.body.classList.remove('loading');
} else if (preloader && progressText && progressFill) {
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
        const scrollTarget = target.classList.contains('section')
            ? target.querySelector('.section-title') || target
            : target;
        const targetRect = scrollTarget.getBoundingClientRect();
        const targetY = targetRect.top + window.pageYOffset - (navbarHeight + 20);

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

if (skipPreloader) {
    document.querySelectorAll('.section, .timeline-item, .education-card').forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

function projectCard(project) {
    const technologies = (project.technologies || [])
        .map(tech => `<span>${escapeHtml(tech)}</span>`)
        .join('');

    return `
        <article class="project-card">
            <div class="project-header">
                <span class="project-type">${escapeHtml(project.type)}</span>
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
            </div>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tech">${technologies}</div>
            <a class="project-link" href="${escapeHtml(project.github_url)}" target="_blank" rel="noopener noreferrer">
                GitHub'da İncele
            </a>
        </article>
    `;
}

function repoCard(project) {
    const technologies = (project.technologies || []).slice(0, 3).join(' / ');
    return `
        <a class="repo-card" href="${escapeHtml(project.github_url)}" target="_blank" rel="noopener noreferrer">
            <span class="repo-language">${escapeHtml(technologies || project.type)}</span>
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.description)}</p>
        </a>
    `;
}

async function loadProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    const repoContainer = document.getElementById('repo-projects');
    if (!featuredContainer || !repoContainer) return;

    try {
        const response = await fetch('api/projects.php', {
            headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Projects API failed');
        }

        const payload = await response.json();
        if (!payload.ok) {
            throw new Error(payload.message || 'Projects could not be loaded');
        }

        if (Array.isArray(payload.featured) && payload.featured.length > 0) {
            featuredContainer.innerHTML = payload.featured.map(projectCard).join('');
        }

        if (Array.isArray(payload.repositories) && payload.repositories.length > 0) {
            repoContainer.innerHTML = payload.repositories.map(repoCard).join('');
        }
    } catch (error) {
        console.warn('Static project cards are being used as fallback.', error);
    }
}

loadProjects();

// Expand all GitHub repositories inside the projects section
const toggleAllProjects = document.getElementById('toggle-all-projects');
const allProjectsPanel = document.getElementById('all-projects');

if (toggleAllProjects && allProjectsPanel) {
    toggleAllProjects.addEventListener('click', () => {
        const willOpen = !allProjectsPanel.classList.contains('is-open');
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;

        if (willOpen) {
            allProjectsPanel.hidden = false;
            requestAnimationFrame(() => {
                allProjectsPanel.classList.add('is-open');
                toggleAllProjects.setAttribute('aria-expanded', 'true');
                toggleAllProjects.textContent = 'Tüm Repoları Gizle';

                const targetY = allProjectsPanel.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 16);
                smoothScrollTo(targetY, 700);
            });
        } else {
            allProjectsPanel.classList.remove('is-open');
            toggleAllProjects.setAttribute('aria-expanded', 'false');
            toggleAllProjects.textContent = 'Tüm Repoları Sayfada Göster';

            setTimeout(() => {
                allProjectsPanel.hidden = true;
            }, 700);
        }
    });
}

// Dynamic contact form submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formStatus.textContent = 'Mesajınız gönderiliyor...';
        formStatus.className = 'form-status is-info';

        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('api/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.message || 'Mesaj gönderilemedi.');
            }

            formStatus.textContent = result.message || 'Mesajınız başarıyla gönderildi.';
            formStatus.className = 'form-status is-success';
            contactForm.reset();
        } catch (error) {
            formStatus.textContent = error.message || 'Mesaj gönderilirken bir hata oluştu.';
            formStatus.className = 'form-status is-error';
        }
    });
}

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
        background: rgba(37, 99, 235, 0.12);
    }
`;
document.head.appendChild(style);

if (skipPreloader && captureSection) {
    setTimeout(() => {
        const target = document.getElementById(captureSection);
        if (!target) return;

        if (captureSection !== 'anasayfa') {
            document.querySelectorAll('section').forEach(section => {
                if (section.id !== captureSection) {
                    section.style.display = 'none';
                }
            });
            target.style.display = 'block';
            target.style.minHeight = '100vh';
            target.style.paddingTop = '120px';
            document.querySelector('.footer')?.style.setProperty('display', 'none');
        }

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const scrollTarget = target.classList.contains('section')
            ? target.querySelector('.section-title') || target
            : target;
        const targetY = scrollTarget.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 20);
        window.scrollTo(0, targetY);
    }, 300);
}
