// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const paginationInfo = document.querySelector('.pagination-info');

    // Estado de la aplicación
    let currentPage = 1;
    let currentCategory = 'all';
    const itemsPerPage = 6;
    let filteredPosts = Array.from(blogCards);

    // Función para filtrar posts por categoría
    function filterPosts(category) {
        currentCategory = category;
        currentPage = 1;

        if (category === 'all') {
            filteredPosts = Array.from(blogCards);
        } else {
            filteredPosts = Array.from(blogCards).filter(card => {
                const cardCategory = card.querySelector('.blog-category').textContent.toLowerCase();
                return cardCategory === category.toLowerCase();
            });
        }

        updatePagination();
        renderPosts();
    }

    // Función para renderizar los posts
    function renderPosts() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        // Ocultar todos los posts
        blogCards.forEach(card => {
            card.style.display = 'none';
        });

        // Mostrar los posts filtrados
        postsToShow.forEach(card => {
            card.style.display = 'flex';
        });

        // Actualizar estado de los botones de paginación
        updatePaginationButtons();
    }

    // Función para actualizar la paginación
    function updatePagination() {
        const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    // Función para actualizar el estado de los botones de paginación
    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
        
        paginationButtons[0].disabled = currentPage === 1;
        paginationButtons[1].disabled = currentPage === totalPages;
    }

    // Event Listeners para los botones de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            // Filtrar posts
            filterPosts(button.dataset.category);
        });
    });

    // Event Listeners para los botones de paginación
    paginationButtons[0].addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    paginationButtons[1].addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });

    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Animaciones suaves al hacer scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.blog-card').forEach(card => {
        animateOnScroll.observe(card);
    });

    // Inicializar el estado
    filterPosts('all');
}); 