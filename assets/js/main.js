document.addEventListener('DOMContentLoaded', () => {
    // --- Menú Responsive ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        // Crear overlay para el menú
        let menuOverlay = document.querySelector('.menu-overlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            body.appendChild(menuOverlay);
        }

        // Función para alternar el menú
        function toggleMenu() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.style.overflow = !isExpanded ? 'hidden' : '';
        }

        // Event listeners
        menuToggle.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMenu();
                }
            });
        });

        // Cerrar menú al redimensionar la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // --- Carrusel ---
    const slides = document.querySelectorAll('.slide');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    if (slides.length > 0 && prevSlideBtn && nextSlideBtn) {
        let currentSlide = 0;
        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        }
        function moveSlide(step) {
            currentSlide = (currentSlide + step + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        showSlide(currentSlide);
        prevSlideBtn.addEventListener('click', () => moveSlide(-1));
        nextSlideBtn.addEventListener('click', () => moveSlide(1));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') moveSlide(-1);
            if (e.key === 'ArrowRight') moveSlide(1);
        });
    }

    // --- Theme Toggle ---
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    if (toggleBtn) {
        const isDark = root.classList.contains('dark-theme');
        toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
        toggleBtn.addEventListener('click', () => {
            const isDark = root.classList.contains('dark-theme');
            root.classList.toggle('dark-theme', !isDark);
            root.classList.toggle('light-theme', isDark);
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            toggleBtn.innerHTML = isDark ? '🌙' : '☀️';
        });
    }
}); 