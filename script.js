// --- CONFIGURACIÓN INICIAL ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let currentCheckoutStep = 1;
let isAnimating = false;

// --- ELEMENTOS GLOBALES ---
const cartPanel = document.getElementById('cart-panel');
const checkoutModal = document.getElementById('checkout-modal');
const mobileMenu = document.getElementById('mobile-menu');
const btnMenu = document.getElementById('btn-menu');

// --- INICIALIZACIÓN COMPLETA ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando Pacha-Tee...');
  
  // Asegurar que el carrito esté cerrado al inicio
  if (cartPanel) {
    cartPanel.setAttribute('hidden', '');
  }
  
  // Inicializar sistemas en orden
  initSmoothNavigation();
  initNavbarScroll();
  initDropdowns();
  initCartPanel();
  initFiltrosTienda();
  initCheckout();
  initMobileMenu();
  initNosotrosFullpage();
  initDemoAR();
  initEventDelegation();
  
  // Estado inicial
  actualizarCarrito();
  mostrarCategoria('todos'); // Mostrar todos los productos al inicio
  
  console.log('✅ Pacha-Tee inicializado correctamente');
});


// --- NAVEGACIÓN SUAVE ---
function initSmoothNavigation() {
  const links = document.querySelectorAll("a[href^='#']");
  
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        closeAllMenus();
        target.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

function closeAllMenus() {
  // Cerrar menú móvil
  if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
    mobileMenu.setAttribute('hidden', '');
    btnMenu.setAttribute('aria-expanded', 'false');
  }
  
  // Cerrar carrito
  if (cartPanel && !cartPanel.hasAttribute('hidden')) {
    cartPanel.setAttribute('hidden', '');
  }
  
  // Cerrar dropdowns
  closeAllDropdowns();
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  const dropdownButtons = document.querySelectorAll('.submenu button');
  
  dropdowns.forEach(dd => dd.setAttribute('hidden', ''));
  dropdownButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
}

// --- NAVBAR SCROLL ---
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
}

// --- DROPDOWNS CORREGIDOS ---
function initDropdowns() {
  // Dropdown Nosotros
  const btnNos = document.getElementById('btn-nosotros');
  const ddNos = document.getElementById('dropdown-nosotros');
  
  // Dropdown Tienda
  const btnTienda = document.getElementById('btn-tienda');
  const ddTienda = document.getElementById('dropdown-tienda');
  
  if (btnNos && ddNos) {
    btnNos.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !ddNos.hasAttribute('hidden');
      
      // Cerrar el otro dropdown
      if (ddTienda) ddTienda.setAttribute('hidden', '');
      if (btnTienda) btnTienda.setAttribute('aria-expanded', 'false');
      
      // Toggle este dropdown
      if (isOpen) {
        ddNos.setAttribute('hidden', '');
        btnNos.setAttribute('aria-expanded', 'false');
      } else {
        ddNos.removeAttribute('hidden');
        btnNos.setAttribute('aria-expanded', 'true');
      }
    });
  }
  
  if (btnTienda && ddTienda) {
    btnTienda.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !ddTienda.hasAttribute('hidden');
      
      // Cerrar el otro dropdown
      if (ddNos) ddNos.setAttribute('hidden', '');
      if (btnNos) btnNos.setAttribute('aria-expanded', 'false');
      
      // Toggle este dropdown
      if (isOpen) {
        ddTienda.setAttribute('hidden', '');
        btnTienda.setAttribute('aria-expanded', 'false');
      } else {
        ddTienda.removeAttribute('hidden');
        btnTienda.setAttribute('aria-expanded', 'true');
      }
    });
  }
  
  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
}

// --- CARRITO DE COMPRAS ---
function actualizarCarrito() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  if (cartPanel && !cartPanel.hasAttribute('hidden')) {
    renderizarCarrito();
  }
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto, precio) {
  const productoExistente = carrito.find(item => item.nombre === producto);
  
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      nombre: producto,
      precio: parseFloat(precio),
      cantidad: 1
    });
  }
  
  actualizarCarrito();
  mostrarNotificacion(`"${producto}" agregado al carrito`);
}

function eliminarDelCarrito(producto) {
  carrito = carrito.filter(item => item.nombre !== producto);
  actualizarCarrito();
  mostrarNotificacion(`"${producto}" eliminado del carrito`);
}

function cambiarCantidad(producto, cambio) {
  const productoCarrito = carrito.find(item => item.nombre === producto);
  
  if (productoCarrito) {
    productoCarrito.cantidad += cambio;
    
    if (productoCarrito.cantidad <= 0) {
      eliminarDelCarrito(producto);
    } else {
      actualizarCarrito();
    }
  }
}

function renderizarCarrito() {
  const cartItems = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  
  if (!cartItems || !cartTotalPrice) return;
  
  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Tu carrito está vacío</p>
        <button class="btn btn-outline" onclick="mostrarCategoria('todos')">Explorar productos</button>
      </div>
    `;
    cartTotalPrice.textContent = '$0';
    return;
  }
  
  let total = 0;
  let itemsHTML = '';
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <div class="cart-item-price">$${item.precio} c/u</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
            <span>${item.cantidad}</span>
            <button class="quantity-btn" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
          </div>
          <button class="remove-btn" onclick="eliminarDelCarrito('${item.nombre}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  
  cartItems.innerHTML = itemsHTML;
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// --- NOTIFICACIONES ---
function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'notification';
  notificacion.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${mensaje}</span>
    </div>
  `;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notificacion.classList.remove('show');
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// --- CARRITO PANEL ---
function initCartPanel() {
  const btnCarrito = document.getElementById('btn-carrito');
  const btnCloseCart = document.getElementById('btn-close-cart');
  
  if (btnCarrito && cartPanel) {
    btnCarrito.addEventListener('click', () => {
      if (cartPanel.hasAttribute('hidden')) {
        closeAllMenus();
        cartPanel.removeAttribute('hidden');
        renderizarCarrito();
        document.body.style.overflow = 'hidden';
      } else {
        cartPanel.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }
    });
  }
  
  if (btnCloseCart) {
    btnCloseCart.addEventListener('click', () => {
      cartPanel.setAttribute('hidden', '');
      document.body.style.overflow = '';
    });
  }
}

// --- FILTROS DE TIENDA CORREGIDOS ---
function initFiltrosTienda() {
  const filtroBtns = document.querySelectorAll('.filtro-btn');
  
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-categoria');
      
      // Actualizar botones activos
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Mostrar categoría
      mostrarCategoria(categoria);
      
      // Cerrar menús
      closeAllMenus();
    });
  });
}

function mostrarCategoria(categoria) {
  const categorias = document.querySelectorAll('.categoria-productos');
  
  // Ocultar todas las categorías primero
  categorias.forEach(cat => {
    cat.classList.remove('active');
  });
  
  // Mostrar la categoría seleccionada
  if (categoria === 'todos') {
    categorias.forEach(cat => {
      cat.classList.add('active');
    });
  } else {
    const categoriaSeleccionada = document.getElementById(`categoria-${categoria}`);
    if (categoriaSeleccionada) {
      categoriaSeleccionada.classList.add('active');
    }
  }
}

// Función global para filtrado desde el menú
function filtrarProductos(categoria) {
  const filtroBtn = document.querySelector(`[data-categoria="${categoria}"]`);
  if (filtroBtn) {
    // Actualizar botón activo
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    filtroBtn.classList.add('active');
    
    // Mostrar categoría
    mostrarCategoria(categoria);
  }
  
  closeAllMenus();
}

// --- CHECKOUT ---
function initCheckout() {
  const btnCheckout = document.getElementById('btn-checkout');
  const btnProcessPayment = document.getElementById('btn-process-payment');
  const btnFinish = document.getElementById('btn-finish');
  const btnCloseModal = document.getElementById('btn-close-modal');
  
  if (btnCheckout) {
    btnCheckout.addEventListener('click', abrirModalCheckout);
  }
  
  if (btnProcessPayment) {
    btnProcessPayment.addEventListener('click', processPayment);
  }
  
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      cerrarModalCheckout();
      mostrarNotificacion('¡Gracias por tu compra! Recibirás un email de confirmación.');
    });
  }
  
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', cerrarModalCheckout);
  }
  
  // Navegación entre pasos
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextStep = parseInt(e.target.getAttribute('data-next'));
      if (validateStep(currentCheckoutStep)) {
        goToCheckoutStep(nextStep);
      }
    });
  });
  
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prevStep = parseInt(e.target.getAttribute('data-prev'));
      goToCheckoutStep(prevStep);
    });
  });
}

function abrirModalCheckout() {
  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío');
    return;
  }
  
  checkoutModal.removeAttribute('hidden');
  renderizarOrderSummary();
  goToCheckoutStep(1);
  document.body.style.overflow = 'hidden';
}

function cerrarModalCheckout() {
  if (checkoutModal) {
    checkoutModal.setAttribute('hidden', '');
  }
  document.body.style.overflow = '';
  goToCheckoutStep(1);
}

function goToCheckoutStep(step) {
  currentCheckoutStep = step;
  
  document.querySelectorAll('.checkout-step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  
  const currentStep = document.getElementById(`step-${step}`);
  if (currentStep) {
    currentStep.classList.add('active');
  }
  
  actualizarPasosCheckout(step);
}

function actualizarPasosCheckout(stepActual) {
  const steps = document.querySelectorAll('.checkout-steps .step');
  
  steps.forEach((step) => {
    const stepNumber = parseInt(step.getAttribute('data-step'));
    step.classList.remove('active', 'completed');
    
    if (stepNumber < stepActual) {
      step.classList.add('completed');
    } else if (stepNumber === stepActual) {
      step.classList.add('active');
    }
  });
}

function renderizarOrderSummary() {
  const orderSummary = document.getElementById('order-summary');
  const subtotalPrice = document.getElementById('subtotal-price');
  const finalTotalPrice = document.getElementById('final-total-price');
  const paidAmount = document.getElementById('paid-amount');
  
  let subtotal = 0;
  let summaryHTML = '';
  
  carrito.forEach(item => {
    const itemTotal = item.precio * item.cantidad;
    subtotal += itemTotal;
    
    summaryHTML += `
      <div class="order-item">
        <div class="order-item-info">
          <h5>${item.nombre}</h5>
          <p>Cantidad: ${item.cantidad}</p>
        </div>
        <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
      </div>
    `;
  });
  
  const shipping = 3;
  const total = subtotal + shipping;
  
  if (orderSummary) orderSummary.innerHTML = summaryHTML;
  if (subtotalPrice) subtotalPrice.textContent = `$${subtotal.toFixed(2)}`;
  if (finalTotalPrice) finalTotalPrice.textContent = `$${total.toFixed(2)}`;
  if (paidAmount) paidAmount.textContent = `$${total.toFixed(2)}`;
}

function validateStep(step) {
  return true; // Simplificado para demo
}

function processPayment() {
  const btn = document.getElementById('btn-process-payment');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<span class="loading"></span> Procesando pago...';
  btn.disabled = true;
  
  setTimeout(() => {
    goToCheckoutStep(4);
    carrito = [];
    actualizarCarrito();
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 2000);
}

// --- MENÚ MÓVIL ---
function initMobileMenu() {
  if (btnMenu && mobileMenu) {
    btnMenu.addEventListener('click', () => {
      const isExpanded = btnMenu.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        mobileMenu.setAttribute('hidden', '');
        btnMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        closeAllMenus();
        mobileMenu.removeAttribute('hidden');
        btnMenu.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

// --- NOSOTROS FULLPAGE SIMPLIFICADO ---
function initNosotrosFullpage() {
  const pages = document.querySelectorAll('.nosotros-page');
  const navigation = document.querySelector('.page-navigation');
  let currentPage = 0;
  let isScrolling = false;

  // Crear navegación si no existe
  if (navigation && navigation.children.length === 0) {
    const pageTitles = ['Misión', 'Visión', 'Objetivo'];
    pageTitles.forEach((title, index) => {
      const dot = document.createElement('button');
      dot.className = 'page-dot';
      dot.setAttribute('data-title', title);
      dot.setAttribute('aria-label', `Ir a ${title}`);
      dot.setAttribute('data-index', index);
      
      if (index === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToPage(index);
      });
      
      navigation.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.page-dot');
  const nosotrosSection = document.querySelector('.nosotros-fullpage');

  function goToPage(index) {
    if (index < 0 || index >= pages.length || isScrolling) return;
    
    isScrolling = true;
    currentPage = index;
    
    // Ocultar todas las páginas
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Mostrar página actual
    pages[currentPage].classList.add('active');
    
    // Actualizar dots de navegación
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
    
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // Control con rueda del mouse
  nosotrosSection.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    e.preventDefault();
    
    if (e.deltaY > 0 && currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
    } else if (e.deltaY < 0 && currentPage > 0) {
      goToPage(currentPage - 1);
    }
  });

  // Hacer la función global para los enlaces del menú
  window.goToPage = goToPage;

  // Control de visibilidad de la navegación
  function toggleNavigationVisibility() {
    if (!navigation || !nosotrosSection) return;
    
    const rect = nosotrosSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Mostrar navegación solo cuando la sección esté visible
    const isSectionVisible = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;
    
    if (isSectionVisible) {
      navigation.classList.add('visible');
    } else {
      navigation.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleNavigationVisibility);
  window.addEventListener('resize', toggleNavigationVisibility);

  // Inicializar visibilidad
  toggleNavigationVisibility();
}
// --- DEMO AR ---
function initDemoAR() {
  const btnDemo = document.getElementById('btn-demo');
  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      mostrarNotificacion('🔍 Apunta tu cámara a cualquier diseño Pacha-Tee para activar la realidad aumentada');
    });
  }
}

// --- EVENT DELEGATION ---
function initEventDelegation() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-add') || e.target.closest('.btn-add')) {
      const btn = e.target.matches('.btn-add') ? e.target : e.target.closest('.btn-add');
      const producto = btn.getAttribute('data-producto');
      const precio = btn.getAttribute('data-precio');
      
      if (producto && precio) {
        agregarAlCarrito(producto, precio);
      }
    }
  });
}

// --- FUNCIONES GLOBALES ---
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.filtrarProductos = filtrarProductos;
window.scrollToSection = scrollToSection;
window.cerrarModalCheckout = cerrarModalCheckout;
window.mostrarCategoria = mostrarCategoria;
