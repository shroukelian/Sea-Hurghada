document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Element selectors
    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const langFlags = document.querySelectorAll('.lang-flag');
    const contactForm = document.getElementById("contactForm");
    const testimonialForm = document.getElementById('testimonialForm');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const currentYearSpan = document.getElementById('currentYear');
    const galleryContainer = document.querySelector('.gallery-container');
    const whatsappFab = document.getElementById('whatsapp-fab');

    // Language settings
    const supportedLanguages = ['en', 'ar', 'de', 'ru', 'ro', 'it'];
    let currentLang = localStorage.getItem('preferredLang') || 'en';

    // Multilingual messages
    const messages = {
        fillFields: { en: 'Please fill all fields.', ar: 'يرجى ملء جميع الحقول.', de: 'Bitte füllen Sie alle Felder aus.', ro: 'Vă rugăm să completați toate câmpurile.', it: 'Si prega di compilare tutti i campi.', ru: 'Пожалуйста, заполните все поля.' },
        redirecting: { en: 'Redirecting to WhatsApp...', ar: 'جارٍ التحويل إلى واتساب...', de: 'Weiterleitung zu WhatsApp...', ro: 'Redirecționare către WhatsApp...', it: 'Reindirizzamento a WhatsApp...' },
        invalidEmail: { en: 'Please enter a valid email.', ar: 'يرجى إدخال بريد إلكتروني صحيح.', de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', ro: 'Vă rugăm să introduceți un email valid.', it: 'Inserisci un\'email valida.' },
        reviewSubmitted: { en: 'Thank you for your review!', ar: 'شكراً لك على رأيك!', de: 'Vielen Dank für Ihre Bewertung!', ro: 'Mulțumim pentru recenzia ta!', it: 'Grazie per la tua recensione!' },
        fillReviewFields: { en: 'Please fill all review fields.', ar: 'يرجى ملء جميع حقول الرأي.', de: 'Bitte füllen Sie alle Bewertungsfelder aus.', ro: 'Vă rugăm să completați toate câmpurile recenziei.', it: 'Si prega di compilare tutti i campi della recensione.' }
    };

    // Initialize Animations on Scroll
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // Navbar scroll effect
    if (navbar) {
        if (!document.querySelector('.hero-section')) {
            navbar.classList.add('nav-scrolled');
        }
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                if (document.querySelector('.hero-section')) {
                    navbar.classList.remove('nav-scrolled');
                }
            }
        });
    }

    // Mobile menu functionality
    if (mobileMenuButton && mobileMenu) {
        const menuIcon = mobileMenuButton.querySelector('i');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
            if (menuIcon) menuIcon.classList.replace('fa-times', 'fa-bars');
        };

        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (menuIcon) menuIcon.classList.replace('fa-bars', 'fa-times');
        };

        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (closeMobileMenuButton) {
            closeMobileMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    }


    // Language switching function
    function updateLanguage(lang) {
        if (!supportedLanguages.includes(lang)) return;

        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
            if (translation) el.innerHTML = translation;
        });

        document.querySelectorAll('[data-placeholder-en]').forEach(el => {
            const placeholderLang = `data-placeholder-${lang}`;
            const translation = el.getAttribute(placeholderLang) || el.getAttribute('data-placeholder-en');
            if (translation) el.placeholder = translation;
        });

        document.body.classList.toggle('font-cairo', lang === 'ar');

        langFlags.forEach(flag => {
            flag.classList.toggle('active', flag.dataset.lang === lang);
        });
    }

    langFlags.forEach(flag => {
        flag.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLanguage(flag.dataset.lang)
        });
    });

    // Scroll-based functionality
    window.addEventListener('scroll', () => {
        // Active nav link highlighting
        let currentSection = '';
        document.querySelectorAll('section[id]').forEach(section => {
            if (pageYOffset >= section.offsetTop - 120) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(currentSection));
        });

        // Scroll to top button visibility
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle("hidden", window.scrollY <= 300);
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // Notification handler
    function showNotification(message, type = 'success') {
        if (!notification || !notificationMessage) return;
        notificationMessage.textContent = message;
        notification.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 text-white py-2 px-6 rounded-full shadow-lg z-50 transition-all duration-300 transform opacity-0 -translate-y-4';
        setTimeout(() => {
            notification.classList.remove('hidden');
            notification.classList.add(type === 'error' ? 'bg-red-500' : 'bg-green-500');
            notification.classList.remove('opacity-0', '-translate-y-4');
        }, 100);
        setTimeout(() => {
            notification.classList.add('opacity-0', '-translate-y-4');
            setTimeout(() => notification.classList.add('hidden'), 300);
        }, 3000);
    }


    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("UserName").value.trim();
            const email = document.getElementById("UserEmail").value.trim();
            const message = document.getElementById("message").value.trim();
            if (!name || !email || !message) {
                showNotification(messages.fillFields[currentLang], 'error');
                return;
            }
            if (!validateEmail(email)) {
                showNotification(messages.invalidEmail[currentLang], 'error');
                return;
            }
            const whatsappNumber = "201124943927";
            const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            showNotification(messages.redirecting[currentLang], 'success');
            setTimeout(() => {
                window.open(whatsappURL, "_blank");
                contactForm.reset();
            }, 1500);
        });
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function (e) {
            const name = document.getElementById('testimonialName').value.trim();
            const country = document.getElementById('testimonialCountry').value.trim();
            const message = document.getElementById('testimonialMessage').value.trim();
            if (!name || !country || !message) {
                e.preventDefault();
                showNotification(messages.fillReviewFields[currentLang], 'error');
                return;
            }
            showNotification(messages.reviewSubmitted[currentLang], 'success');
        });
    }

    if (galleryContainer) {
        const photoCards = document.querySelectorAll('.photo-card');
        const galleryOverlay = document.getElementById('gallery-overlay');
        let activeCard = null;
        const layouts = [[30, 38, 28, 5], [8, 18, 22, -12], [12, 60, 20, 10], [38, 8, 20, 18], [42, 72, 24, -15], [65, 12, 20, -8], [60, 45, 26, 3], [70, 70, 22, 16], [5, 42, 24, -2], [78, 25, 18, 11], [75, 58, 18, -10]];

        photoCards.forEach((card, index) => {
            if (index < layouts.length) {
                const [top, left, width, rotation] = layouts[index];
                card.style.top = `${top}%`;
                card.style.left = `${left}%`;
                card.style.width = `${width}vw`;
                card.style.maxWidth = '350px';
                card.style.height = 'auto';
                const transform = `rotate(${rotation}deg)`;
                card.style.transform = transform;
                card.dataset.originalTransform = transform;
                card.style.zIndex = index;
            }
            card.addEventListener('click', () => {
                if (galleryOverlay.classList.contains('active')) {
                    closeViewer();
                    return;
                }
                activeCard = card;
                galleryOverlay.classList.add('active');
                const cardRect = card.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const scale = Math.min(viewportWidth / cardRect.width, viewportHeight / cardRect.height) * 0.9;
                const translateX = (viewportWidth / 2) - (cardRect.left + cardRect.width / 2);
                const translateY = (viewportHeight / 2) - (cardRect.top + cardRect.height / 2);
                card.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(0deg)`;
                card.classList.add('is-active');
            });
        });

        const closeViewer = () => {
            galleryOverlay.classList.remove('active');
            if (activeCard) {
                activeCard.style.transform = activeCard.dataset.originalTransform;
                setTimeout(() => {
                    if (activeCard) {
                        activeCard.classList.remove('is-active');
                        activeCard = null;
                    }
                }, 600);
            }
        };
        galleryOverlay.addEventListener('click', closeViewer);
    }
    if (whatsappFab) {
        whatsappFab.addEventListener('click', () => {
            const whatsappNumber = "201124943927"; 
            const defaultMessage = {
                en: "Hello, I'm interested in your trips.",
                ar: "مرحباً، أنا مهتم برحلاتكم.",
                de: "Hallo, ich interessiere mich für Ihre Reisen.",
                ro: "Bună, sunt interesat(ă) de excursiile dvs.",
                it: "Salve, sono interessato/a ai vostri viaggi.",
                ru: "Здравствуйте, меня интересуют ваши поездки." 

            };
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage[currentLang] || defaultMessage['en'])}`;
            window.open(whatsappURL, "_blank");
        });
    }
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    updateLanguage(currentLang);
});