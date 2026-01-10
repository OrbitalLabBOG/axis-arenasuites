// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroVideo = document.querySelector('.hero-video');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Garantiza reproducción automática del video de hero
    if (heroVideo) {
        const playHeroVideo = () => {
            heroVideo.muted = true;
            heroVideo.setAttribute('muted', '');
            heroVideo.setAttribute('playsinline', '');
            heroVideo.setAttribute('webkit-playsinline', '');
            const playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {
                    const resumeOnInteraction = () => {
                        heroVideo.play().finally(() => {
                            document.removeEventListener('click', resumeOnInteraction);
                            document.removeEventListener('touchstart', resumeOnInteraction);
                        });
                    };
                    document.addEventListener('click', resumeOnInteraction, { once: true });
                    document.addEventListener('touchstart', resumeOnInteraction, { once: true });
                });
            }
        };

        heroVideo.addEventListener('loadeddata', playHeroVideo, { once: true });
        playHeroVideo();
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const header = document.querySelector('.header');
        
        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }
        
        lastScroll = currentScroll;
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                this.reset();
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('¡Gracias por suscribirte! Recibirás nuestras ofertas especiales.');
                this.reset();
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe room cards
    document.querySelectorAll('.room-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Observe amenity cards
    document.querySelectorAll('.amenity-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Gallery Carousel Logic
    const track = document.querySelector('.gallery-carousel-track');
    const items = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-nav-next');
    const prevButton = document.querySelector('.carousel-nav-prev');

    let currentIndex = 0;
    const itemsPerView = 4;
    const totalItems = items.length;

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalItems - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const itemWidth = items[0].getBoundingClientRect().width;
        const gap = 16; // 1rem gap
        const moveAmount = (itemWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;
    }

    // Recalculate on resize
    window.addEventListener('resize', updateCarousel);

    // Lazy loading for images
    const images = document.querySelectorAll('img');

    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 300px 0px'
    };

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        imageObserver.observe(img);
    });
});

// Google Maps initialization - Exposed globally for Maps API callback
window.initMap = function() {
    // Coordinates for Carrera 30 No. 63-57 Bogotá, Colombia
    const arenaSuitesLocation = { lat: 4.652594284550544, lng: -74.07891573349986 };

    // Map options
    const mapOptions = {
        zoom: 15,
        center: arenaSuitesLocation,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"weight": "2.00"}]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#9c9c9c"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {"saturation": -100},
                    {"lightness": 45}
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {"color": "#d4a574"}, // Using new accent color for water
                    {"visibility": "on"}
                ]
            }
        ]
    };

    // Create map
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Single marker for Arena Suites location
    const marker = new google.maps.Marker({
        position: arenaSuitesLocation,
        map: map,
        title: 'Arena Suites',
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: "#1a365d",
            fillOpacity: 1,
            strokeColor: "#d4a574",
            strokeWeight: 4
        }
    });

    // Info window for Arena Suites
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 12px;">
                <h4 style="margin: 0 0 8px 0; color: #1a365d; font-size: 16px;">Arena Suites</h4>
                <p style="margin: 0; color: #4a5568;">Calle 63 #30-10<br>Teusaquillo, Bogotá</p>
            </div>
        `
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}
