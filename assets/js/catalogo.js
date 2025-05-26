// Constantes y configuración
const CONFIG = {
    productsPerPage: 12,
    dataPath: '../assets/data/perfumes.json', // Ruta al archivo JSON local
    imageBasePath: '../assets/images/perfumes/'
};

// Estado de la aplicación
const state = {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    filters: {
        category: '',
        priceRange: '',
        brand: ''
    },
    loading: false,
    currentGalleryIndex: {} // Para mantener el índice de la galería por producto
};

// Utilidades
const utils = {
    formatPrice: (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(price);
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Función para manejar errores de manera consistente
    handleError: (error, context) => {
        console.error(`Error en ${context}:`, error);
        // Aquí podrías implementar un sistema de notificación al usuario
    }
};

// Gestión del DOM
const DOM = {
    elements: {
        productsGrid: document.querySelector('.products-grid'),
        filterForm: document.querySelector('.filter-form'),
        loadingIndicator: document.querySelector('.loading-indicator')
    },

    // Crear tarjeta de producto
    createProductCard: (product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('itemscope', '');
        card.setAttribute('itemtype', 'https://schema.org/Product');

        // Badge dinámico para el primer producto
        let badgeHTML = '';
        if (index === 0) {
            badgeHTML = '<span class="badge">Nuevo</span>';
        }
        // Badge de género
        let genderBadge = '';
        if (product.categories.includes('mujer')) genderBadge = '<span class="badge-gender">♀</span>';
        else if (product.categories.includes('hombre')) genderBadge = '<span class="badge-gender">♂</span>';
        else if (product.categories.includes('unisex')) genderBadge = '<span class="badge-gender">⚧</span>';

        // Notas olfativas como chips
        const notes = product.notes ? `
            <div class="product-notes">
                <span class="note-chip note-top" title="Notas de salida">${product.notes.top.join(', ')}</span>
                <span class="note-chip note-middle" title="Notas de corazón">${product.notes.middle.join(', ')}</span>
                <span class="note-chip note-base" title="Notas de fondo">${product.notes.base.join(', ')}</span>
            </div>
        ` : '';

        // Inicializar el índice de galería para este producto
        state.currentGalleryIndex[product.id] = 0;

        card.innerHTML = `
            ${badgeHTML}
            <div class="product-image-container">
            <div class="product-image">
                <img 
                    src="${CONFIG.imageBasePath}${product.images.main}" 
                    alt="${product.name}"
                    loading="lazy"
                    width="300"
                    height="300"
                    itemprop="image"
                        class="main-image premium-img"
                        data-product-id="${product.id}"
                    >
                </div>
                <div class="image-gallery">
                    <button class="gallery-nav prev" aria-label="Imagen anterior" data-product-id="${product.id}">❮</button>
                    <div class="gallery-thumbnails">
                        <img 
                            src="${CONFIG.imageBasePath}${product.images.main}" 
                            alt="${product.name} - Vista principal"
                            class="thumbnail active"
                            data-product-id="${product.id}"
                            data-image-type="main"
                            data-image-path="${product.images.main}"
                        >
                        ${product.images.gallery.map((img, idx) => `
                            <img 
                                src="${CONFIG.imageBasePath}${img}" 
                                alt="${product.name} - Vista ${idx + 1}"
                                class="thumbnail"
                                data-product-id="${product.id}"
                                data-image-type="gallery"
                                data-image-path="${img}"
                            >
                        `).join('')}
                    </div>
                    <button class="gallery-nav next" aria-label="Siguiente imagen" data-product-id="${product.id}">❯</button>
                </div>
            </div>
            <div class="product-info">
                <meta itemprop="sku" content="${product.id}">
                <span class="product-brand" itemprop="brand">${product.brand} ${genderBadge}</span>
                <h3 class="product-name" itemprop="name">${product.name}</h3>
                <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="COP">
                    <span itemprop="price" style="display:none;">${product.price.amount}</span>
                    <span class="product-price-cop">${utils.formatPrice(product.price.amount)} COP</span>
                    <link itemprop="availability" href="https://schema.org/InStock">
                </div>
                <div class="product-notes" itemprop="description">
                  Notas de salida: ${product.notes?.top?.join(', ') || ''}. Notas de corazón: ${product.notes?.middle?.join(', ') || ''}. Notas de fondo: ${product.notes?.base?.join(', ') || ''}.
                </div>
                <div class="product-actions">
                    ${Object.entries(product.storeLinks).map(([store, url]) => `
                        <a href="${url}" 
                           class="store-link" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           data-store="${store}"
                           itemprop="url"
                           aria-label="Comprar en ${store}">
                            <svg class="buy-icon" width="20" height="20" fill="none" stroke="#bfa76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="9"/><path d="M6 10l2 2 4-4"/></svg>
                            ${store.charAt(0).toUpperCase() + store.slice(1)}
                        </a>
                    `).join('')}
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <svg class="cart-icon" width="22" height="22" fill="none" stroke="#bfa76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="10"/><path d="M7 11l2 2 4-4"/></svg>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;

        // Agregar event listeners para la galería
        const thumbnails = card.querySelectorAll('.thumbnail');
        const mainImage = card.querySelector('.main-image');
        const prevButton = card.querySelector('.gallery-nav.prev');
        const nextButton = card.querySelector('.gallery-nav.next');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const productId = thumbnail.dataset.productId;
                const imagePath = thumbnail.dataset.imagePath;
                
                // Actualizar imagen principal
                mainImage.src = `${CONFIG.imageBasePath}${imagePath}`;
                
                // Actualizar thumbnails activos
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                
                // Actualizar índice de galería
                state.currentGalleryIndex[productId] = Array.from(thumbnails).indexOf(thumbnail);
            });
        });

        // Navegación con botones
        prevButton.addEventListener('click', () => {
            const productId = prevButton.dataset.productId;
            const currentIndex = state.currentGalleryIndex[productId];
            const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
            thumbnails[newIndex].click();
        });

        nextButton.addEventListener('click', () => {
            const productId = nextButton.dataset.productId;
            const currentIndex = state.currentGalleryIndex[productId];
            const newIndex = (currentIndex + 1) % thumbnails.length;
            thumbnails[newIndex].click();
        });

        return card;
    },

    // Mostrar estado de carga
    showLoading: () => {
        if (DOM.elements.loadingIndicator) {
            DOM.elements.loadingIndicator.classList.remove('hidden');
        }
    },

    // Ocultar estado de carga
    hideLoading: () => {
        if (DOM.elements.loadingIndicator) {
            DOM.elements.loadingIndicator.classList.add('hidden');
        }
    },

    // Crear controles de paginación
    createPagination: () => {
        let pagination = document.querySelector('.catalog-pagination');
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.className = 'catalog-pagination';
            DOM.elements.productsGrid.parentNode.appendChild(pagination);
        }
        pagination.innerHTML = '';

        const maxPage = Math.ceil(state.filteredProducts.length / CONFIG.productsPerPage);
        if (maxPage <= 1) {
            pagination.style.display = 'none';
            return;
        } else {
            pagination.style.display = 'flex';
        }

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Anterior';
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = state.currentPage === 1;
        prevBtn.onclick = () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                DOM.updateProductsView();
            }
        };

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Siguiente';
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = state.currentPage === maxPage;
        nextBtn.onclick = () => {
            if (state.currentPage < maxPage) {
                state.currentPage++;
                DOM.updateProductsView();
            }
        };

        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        pageInfo.textContent = `Página ${state.currentPage} de ${maxPage}`;

        pagination.appendChild(prevBtn);
        pagination.appendChild(pageInfo);
        pagination.appendChild(nextBtn);
    },

    // Actualizar la vista con productos filtrados
    updateProductsView: () => {
        if (!DOM.elements.productsGrid) return;
        DOM.elements.productsGrid.innerHTML = '';
        const startIndex = (state.currentPage - 1) * CONFIG.productsPerPage;
        const endIndex = startIndex + CONFIG.productsPerPage;
        const productsToShow = state.filteredProducts.slice(startIndex, endIndex);
        productsToShow.forEach((product, idx) => {
            const card = DOM.createProductCard(product, startIndex + idx);
            DOM.elements.productsGrid.appendChild(card);
        });
        DOM.createPagination();
    }
};

// Gestión de datos
const dataManager = {
    // Cargar productos
    async loadProducts() {
        try {
            state.loading = true;
            DOM.showLoading();

            // Cargar datos desde el archivo JSON local
            const response = await fetch(CONFIG.dataPath);
            if (!response.ok) throw new Error('Error al cargar productos');
            
            const data = await response.json();
            state.products = data.products; // Acceder a la propiedad 'products' del JSON
            state.filteredProducts = data.products;
            
            // Actualizar el select de marcas
            this.updateBrandsFilter();
            
            DOM.updateProductsView();
        } catch (error) {
            utils.handleError(error, 'loadProducts');
            // Mostrar mensaje de error al usuario
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al cargar los productos. Por favor, intente más tarde.';
            DOM.elements.productsGrid.appendChild(errorMessage);
        } finally {
            state.loading = false;
            DOM.hideLoading();
        }
    },

    // Actualizar el select de marcas con las marcas disponibles
    updateBrandsFilter() {
        const brandSelect = document.getElementById('brand');
        if (!brandSelect) return;

        // Obtener marcas únicas
        const brands = [...new Set(state.products.map(product => product.brand))];
        
        // Limpiar opciones existentes excepto la primera
        while (brandSelect.options.length > 1) {
            brandSelect.remove(1);
        }

        // Agregar nuevas opciones
        brands.sort().forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    },

    // Aplicar filtros
    applyFilters() {
        state.filteredProducts = state.products.filter(product => {
            const matchesCategory = !state.filters.category || 
                                  product.categories.includes(state.filters.category);
            
            const matchesPrice = !state.filters.priceRange || 
                               this.isInPriceRange(product.price.amount, state.filters.priceRange);
            
            const matchesBrand = !state.filters.brand || 
                               product.brand === state.filters.brand;

            return matchesCategory && matchesPrice && matchesBrand;
        });

        state.currentPage = 1;
        DOM.updateProductsView();

        // Mostrar/ocultar mensaje de no resultados
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.classList.toggle('hidden', state.filteredProducts.length > 0);
        }
    },

    // Verificar si un precio está en el rango seleccionado
    isInPriceRange(price, range) {
        const ranges = {
            '0-50': [0, 50000],
            '51-100': [50001, 100000],
            '101-200': [100001, 200000],
            '201+': [200001, Infinity]
        };

        const [min, max] = ranges[range] || [0, Infinity];
        return price >= min && price <= max;
    }
};

// Event Listeners
const setupEventListeners = () => {
    // Filtros
    if (DOM.elements.filterForm) {
        DOM.elements.filterForm.addEventListener('change', utils.debounce(() => {
            const formData = new FormData(DOM.elements.filterForm);
            state.filters = {
                category: formData.get('category'),
                priceRange: formData.get('price-range'),
                brand: formData.get('brand')
            };
            dataManager.applyFilters();
        }, 300));
    }

    // Reset de filtros
    const resetButton = document.querySelector('.reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (DOM.elements.filterForm) {
                DOM.elements.filterForm.reset();
                state.filters = {
                    category: '',
                    priceRange: '',
                    brand: ''
                };
                dataManager.applyFilters();
            }
        });
    }
};

// Inicialización
const init = async () => {
    try {
        await dataManager.loadProducts();
        setupEventListeners();
    } catch (error) {
        utils.handleError(error, 'initialization');
    }
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init); 

// Partículas doradas animadas para el banner (más doradas y brillantes)
function goldParticlesInit() {
  const canvas = document.getElementById('goldParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  
  // Crear partículas
  const N = 60; // Aumentado el número de partículas
  particles = Array.from({length: N}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 8 + Math.random() * 24, // Ajustado el tamaño
    dx: (Math.random() - 0.5) * 0.22,
    dy: (Math.random() - 0.5) * 0.16,
    o: 0.35 + Math.random() * 0.45, // Aumentada la opacidad
    g: Math.random() > 0.5 // algunos serán destellos
  }));

  function draw() {
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      if (p.g) {
        // Destellos más brillantes
        gradient.addColorStop(0, `rgba(255,233,179,${p.o * 1.2})`);
        gradient.addColorStop(0.4, `rgba(230,185,128,${p.o * 0.8})`);
        gradient.addColorStop(1, `rgba(191,167,106,0)`);
      } else {
        // Partículas doradas normales
        gradient.addColorStop(0, `rgba(230,185,128,${p.o})`);
        gradient.addColorStop(0.6, `rgba(191,167,106,${p.o * 0.6})`);
        gradient.addColorStop(1, `rgba(191,167,106,0)`);
      }
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      
      // Actualizar posición
      p.x += p.dx;
      p.y += p.dy;
      
      // Rebote en los bordes
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  goldParticlesInit();
}); 

// === LÓGICA DEL CARRITO DE COMPRAS ===
(function() {
  const cartKey = 'esenciaPuraCart';
  let cart = [];

  // Elementos del DOM
  const cartModal = document.getElementById('cartModal');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  // Cargar carrito desde localStorage
  function loadCart() {
    try {
      const data = localStorage.getItem(cartKey);
      cart = data ? JSON.parse(data) : [];
    } catch (e) {
      cart = [];
    }
  }

  // Guardar carrito en localStorage
  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  // Actualizar contador
  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
  }

  // Calcular total
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Renderizar carrito
  function renderCart() {
    cartItemsList.innerHTML = '';
    if (cart.length === 0) {
      cartItemsList.innerHTML = '<li style="color:#fffbe6;text-align:center;padding:2em 0;">Tu carrito está vacío.</li>';
      cartTotal.textContent = '$0';
      return;
    }
    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-brand">${item.brand || ''}</span>
        </div>
        <div class="cart-item-actions">
          <button class="cart-qty-btn" data-idx="${idx}" data-action="decrease" aria-label="Disminuir cantidad">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="cart-qty-btn" data-idx="${idx}" data-action="increase" aria-label="Aumentar cantidad">+</button>
          <span class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</span>
          <button class="cart-remove-btn" data-idx="${idx}" aria-label="Eliminar del carrito">&times;</button>
        </div>
      `;
      cartItemsList.appendChild(li);
    });
    cartTotal.textContent = '$' + getCartTotal().toLocaleString();
  }

  // Abrir/cerrar panel
  function openCart() {
    if (!cartModal) return;
    // Cerrar modal de métodos de pago si está abierto
    if (paymentModal && paymentModal.classList.contains('open')) {
      paymentModal.classList.remove('open');
      paymentModal.style.display = 'none';
    }
    cartModal.style.display = 'flex';
    cartModal.classList.add('open');
    if (cartOverlay) {
      cartOverlay.classList.add('open');
      cartOverlay.style.display = 'block';
    }
    cartModal.focus();
  }
  function closeCart() {
    if (!cartModal) return;
    cartModal.classList.remove('open');
    cartModal.style.display = 'none';
    if (cartOverlay) {
      cartOverlay.classList.remove('open');
      cartOverlay.style.display = 'none';
    }
  }

  // Agregar producto al carrito
  function addToCart(product) {
    const idx = cart.findIndex(item => item.id === product.id);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    renderCart();
  }

  // Eliminar producto
  function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartCount();
    renderCart();
  }

  // Cambiar cantidad
  function changeQty(idx, delta) {
    if (cart[idx]) {
      cart[idx].quantity += delta;
      if (cart[idx].quantity < 1) cart[idx].quantity = 1;
      saveCart();
      updateCartCount();
      renderCart();
    }
  }

  // Eventos
  openCartBtn && openCartBtn.addEventListener('click', openCart);
  closeCartBtn && closeCartBtn.addEventListener('click', closeCart);
  cartOverlay && cartOverlay.addEventListener('click', closeCart);
  cartModal && cartModal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });
  cartItemsList && cartItemsList.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (btn.classList.contains('cart-remove-btn')) {
      removeFromCart(idx);
    } else if (btn.classList.contains('cart-qty-btn')) {
      const action = btn.dataset.action;
      changeQty(idx, action === 'increase' ? 1 : -1);
    }
  });

  // Integrar con los botones de productos
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const card = btn.closest('.product-card');
    if (!card) return;
    // Obtener datos del producto desde el DOM o dataset
    const id = btn.dataset.productId;
    const name = card.querySelector('.product-name')?.textContent?.trim() || 'Perfume';
    const brand = card.querySelector('.product-brand')?.textContent?.trim() || '';
    const price = parseInt(card.querySelector('[itemprop="price"]')?.textContent, 10) || 0;
    addToCart({ id, name, brand, price });
  });

  // Inicializar
  loadCart();
  updateCartCount();
  renderCart();
})(); 

// === LÓGICA DEL MODAL DE MÉTODOS DE PAGO ===
(function() {
  const paymentModal = document.getElementById('paymentModal');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
  const paymentInfo = document.getElementById('paymentInfo');

  if (!paymentModal || !checkoutBtn) return;

  function openPaymentModal() {
    // Cerrar modal del carrito si está abierto
    if (cartModal && cartModal.classList.contains('open')) {
      cartModal.classList.remove('open');
      cartModal.style.display = 'none';
    }
    paymentModal.classList.add('open');
    paymentModal.style.display = 'flex';
    paymentModal.focus();
    paymentInfo.textContent = '';
  }
  function closeModal() {
    paymentModal.classList.remove('open');
    paymentModal.style.display = 'none';
    paymentInfo.textContent = '';
  }

  checkoutBtn.addEventListener('click', openPaymentModal);
  closePaymentModal && closePaymentModal.addEventListener('click', closeModal);
  paymentModal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
  paymentMethodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.dataset.method;
      let msg = '';
      switch (method) {
        case 'pse':
          msg = 'Serás redirigido a PSE para completar tu pago.';
          break;
        case 'tarjeta':
          msg = 'Serás redirigido a la pasarela de tarjetas para completar tu pago.';
          break;
        case 'nequi':
          msg = 'Recibirás instrucciones para pagar con Nequi.';
          break;
        case 'daviplata':
          msg = 'Recibirás instrucciones para pagar con Daviplata.';
          break;
        default:
          msg = 'Método de pago seleccionado.';
      }
      paymentInfo.textContent = msg;
    });
  });
})(); 