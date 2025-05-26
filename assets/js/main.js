document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

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
}); 