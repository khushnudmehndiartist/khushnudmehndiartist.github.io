/**
 * Khushnud Mehndi Artist — Main JavaScript
 * Features: Shuffle Hero Carousel, Gallery Lightbox, Scroll Animations,
 *           Reviews Slider, Mobile Menu, WhatsApp Form Integration
 */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. MOBILE MENU TOGGLE
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const bars = menuToggle.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on link click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // ========================================
    // 2. NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // 3. SHUFFLE HERO CAROUSEL
    // ========================================
    const heroTrack = document.getElementById('heroTrack');
    const slides = document.querySelectorAll('.slide[data-shuffle]');
    const nextBtn = document.getElementById('heroNext');
    const prevBtn = document.getElementById('heroPrev');
    const dotsContainer = document.getElementById('heroDots');

    if (slides.length > 0 && heroTrack) {
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds
        let autoSlideTimer;

        // --- Fisher-Yates Shuffle ---
        function shuffleSlides() {
            const slidesArray = Array.from(slides);
            for (let i = slidesArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                // Swap DOM positions
                if (i !== j) {
                    heroTrack.insertBefore(slidesArray[i], slidesArray[j]);
                    heroTrack.insertBefore(slidesArray[j], slidesArray[i].nextSibling || null);
                    // Also swap in our array to keep consistent
                    [slidesArray[i], slidesArray[j]] = [slidesArray[j], slidesArray[i]];
                }
            }
        }

        // Shuffle on page load
        shuffleSlides();

        // Re-query after shuffle
        const shuffledSlides = heroTrack.querySelectorAll('.slide[data-shuffle]');

        // Create indicator dots
        shuffledSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        // Initialize first slide
        shuffledSlides.forEach(s => s.classList.remove('active'));
        shuffledSlides[0].classList.add('active');

        function updateSlides() {
            shuffledSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (dots[index]) dots[index].classList.remove('active');
            });
            shuffledSlides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % shuffledSlides.length;
            updateSlides();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + shuffledSlides.length) % shuffledSlides.length;
            updateSlides();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlides();
            resetTimer();
        }

        function startTimer() {
            autoSlideTimer = setInterval(nextSlide, slideInterval);
        }

        function resetTimer() {
            clearInterval(autoSlideTimer);
            startTimer();
        }

        // Button listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
        }

        // Pause on hover
        heroTrack.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        heroTrack.addEventListener('mouseleave', () => startTimer());

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        heroTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) { nextSlide(); } else { prevSlide(); }
                resetTimer();
            }
        }, { passive: true });

        // Start auto-slide
        startTimer();
    }

    // ========================================
    // 4. GALLERY LIGHTBOX
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentGalleryIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            galleryImages.push(img.src);
            item.addEventListener('click', () => openLightbox(index));
        }
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        lightboxImg.src = galleryImages[index];
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function lightboxNavigate(direction) {
        currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentGalleryIndex];
        lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => lightboxNavigate(1));

    // Close on backdrop click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNavigate(-1);
        if (e.key === 'ArrowRight') lightboxNavigate(1);
    });

    // ========================================
    // 5. REVIEWS CAROUSEL
    // ========================================
    const reviewTrack = document.getElementById('testimonialTrack');
    const reviewNextBtn = document.getElementById('reviewNext');
    const reviewPrevBtn = document.getElementById('reviewPrev');

    if (reviewTrack && reviewNextBtn && reviewPrevBtn) {
        let scrollAmount = 0;

        function getCardWidth() {
            const card = reviewTrack.querySelector('.testimonial-card');
            if (!card) return 300;
            const style = window.getComputedStyle(card);
            return card.offsetWidth + parseInt(style.marginRight || 0) + 25; // card + gap
        }

        reviewNextBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const maxScroll = reviewTrack.scrollWidth - reviewTrack.parentElement.offsetWidth;
            if (scrollAmount < maxScroll) {
                scrollAmount += cardWidth;
                if (scrollAmount > maxScroll) scrollAmount = maxScroll;
            } else {
                scrollAmount = 0;
            }
            reviewTrack.style.transform = `translateX(-${scrollAmount}px)`;
        });

        reviewPrevBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            if (scrollAmount > 0) {
                scrollAmount -= cardWidth;
                if (scrollAmount < 0) scrollAmount = 0;
            }
            reviewTrack.style.transform = `translateX(-${scrollAmount}px)`;
        });

        // Touch/swipe for reviews
        let rTouchStartX = 0;
        reviewTrack.addEventListener('touchstart', (e) => {
            rTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        reviewTrack.addEventListener('touchend', (e) => {
            const diff = rTouchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) reviewNextBtn.click();
                else reviewPrevBtn.click();
            }
        }, { passive: true });

        // Reset on resize
        window.addEventListener('resize', () => {
            scrollAmount = 0;
            reviewTrack.style.transform = 'translateX(0px)';
        });
    }

    // ========================================
    // 6. SCROLL-TRIGGERED ANIMATIONS
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ========================================
    // 7. CONTACT FORM → WHATSAPP
    // ========================================
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const city = document.getElementById('city').value.trim();
            const date = document.getElementById('date').value;
            const type = document.getElementById('type').value;

            if (!name) {
                alert('Please enter your name.');
                return;
            }

            // Format date nicely
            let formattedDate = date;
            if (date) {
                const d = new Date(date);
                formattedDate = d.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            // Build WhatsApp message
            let message = `🌿 *Mehndi Booking Inquiry*\n\n`;
            message += `👤 *Name:* ${name}\n`;
            if (city) message += `📍 *City/Area:* ${city}\n`;
            if (date) message += `📅 *Event Date:* ${formattedDate}\n`;
            message += `🎨 *Mehndi Type:* ${type}\n\n`;
            message += `Hi, I'd like to book a mehndi appointment. Please let me know about availability and pricing. Thank you! 🙏`;

            const whatsappUrl = `https://wa.me/919152584828?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ========================================
    // 8. WORKSHOP FORM → WHATSAPP
    // ========================================
    const workshopForm = document.getElementById('workshopForm');

    if (workshopForm) {
        workshopForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const wsName = document.getElementById('wsName').value.trim();
            const wsCity = document.getElementById('wsCity').value.trim();
            const wsMode = document.getElementById('wsMode').value;

            if (!wsName) {
                alert('Please enter your name.');
                return;
            }

            // Build WhatsApp message
            let message = `🎓 *Mehndi Workshop Registration*\n\n`;
            message += `👤 *Student Name:* ${wsName}\n`;
            if (wsCity) message += `📍 *City:* ${wsCity}\n`;
            message += `📖 *Workshop Mode:* ${wsMode} Class\n\n`;
            message += `Hi Khushnud! I am interested in registering for the Mehndi workshop. Please provide further details and payment instructions for the Rs. 1500/- fee. Thank you!`;

            const whatsappUrl = `https://wa.me/919152584828?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ========================================
    // 9. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
