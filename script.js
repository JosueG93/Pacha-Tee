// --- CONFIGURACIÓN INICIAL ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let currentCheckoutStep = 1;
let selectedPaymentMethod = 'transfer';
let customerInfo = {};

// --- ELEMENTOS GLOBALES ---
const cartPanel = document.getElementById('cart-panel');
const checkoutModal = document.getElementById('checkout-modal');
const mobileMenu = document.getElementById('mobile-menu');
const btnMenu = document.getElementById('btn-menu');

// --- INICIALIZACIÓN COMPLETA ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando Pacha-Tee...');
  
  // Inicializar sistemas
  initSmoothNavigation();
  initNavbarScroll();
  initDropdowns();
  initCartPanel();
  initFiltrosTienda();
  initCheckout();
  initMobileMenu();
  initQuienesSomos();
  initDemoAR();
  initEventDelegation();
  
  // Estado inicial
  actualizarCarrito();
  mostrarCategoria('todos');
  
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
  if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
    mobileMenu.setAttribute('hidden', '');
    btnMenu.setAttribute('aria-expanded', 'false');
  }
  
  if (cartPanel && !cartPanel.hasAttribute('hidden')) {
    cartPanel.setAttribute('hidden', '');
  }
  
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

// --- DROPDOWNS ---
function initDropdowns() {
  const btnNos = document.getElementById('btn-nosotros');
  const ddNos = document.getElementById('dropdown-nosotros');
  const btnTienda = document.getElementById('btn-tienda');
  const ddTienda = document.getElementById('dropdown-tienda');
  
  if (btnNos && ddNos) {
    btnNos.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !ddNos.hasAttribute('hidden');
      
      if (ddTienda) ddTienda.setAttribute('hidden', '');
      if (btnTienda) btnTienda.setAttribute('aria-expanded', 'false');
      
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
      
      if (ddNos) ddNos.setAttribute('hidden', '');
      if (btnNos) btnNos.setAttribute('aria-expanded', 'false');
      
      if (isOpen) {
        ddTienda.setAttribute('hidden', '');
        btnTienda.setAttribute('aria-expanded', 'false');
      } else {
        ddTienda.removeAttribute('hidden');
        btnTienda.setAttribute('aria-expanded', 'true');
      }
    });
  }
  
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

// --- FILTROS DE TIENDA ---
function initFiltrosTienda() {
  const filtroBtns = document.querySelectorAll('.filtro-btn');
  
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-categoria');
      
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      mostrarCategoria(categoria);
      closeAllMenus();
    });
  });
}

function mostrarCategoria(categoria) {
  const categorias = document.querySelectorAll('.categoria-productos');
  
  categorias.forEach(cat => {
    cat.classList.remove('active');
  });
  
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

function filtrarProductos(categoria) {
  const filtroBtn = document.querySelector(`[data-categoria="${categoria}"]`);
  if (filtroBtn) {
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    filtroBtn.classList.add('active');
    mostrarCategoria(categoria);
  }
  closeAllMenus();
}

// --- QUIÉNES SOMOS CON BOTONES ---
function initQuienesSomos() {
  const qsFiltroBtns = document.querySelectorAll('.qs-filtro-btn');
  
  qsFiltroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pagina = btn.getAttribute('data-pagina');
      
      qsFiltroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      mostrarPagina(pagina);
    });
  });
}

function mostrarPagina(pagina) {
  // Cerrar menús si estamos en móvil
  closeAllMenus();
  
  // Scroll a la sección Quiénes Somos
  const quienesSomosSection = document.getElementById('quienes-somos');
  if (quienesSomosSection) {
    quienesSomosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Mostrar la página seleccionada después de un pequeño delay
  setTimeout(() => {
    const paginas = document.querySelectorAll('.qs-pagina');
    paginas.forEach(pag => pag.classList.remove('active'));
    
    const paginaSeleccionada = document.getElementById(`qs-${pagina}`);
    if (paginaSeleccionada) {
      paginaSeleccionada.classList.add('active');
    }
  }, 300);
}

// Hacer la función global para el menú
window.mostrarPagina = mostrarPagina;

// --- CHECKOUT MEJORADO ---
function initCheckout() {
  const btnCheckout = document.getElementById('btn-checkout');
  const btnCompleteOrder = document.getElementById('btn-complete-order');
  const btnFinish = document.getElementById('btn-finish');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnToPayment = document.getElementById('btn-to-payment');
  const btnPaypal = document.getElementById('btn-paypal');
  
  // Abrir modal de checkout
  if (btnCheckout) {
    btnCheckout.addEventListener('click', abrirModalCheckout);
  }
  
  // Completar pedido
  if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener('click', completarPedido);
  }
  
  // Finalizar compra
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      cerrarModalCheckout();
      mostrarNotificacion('¡Gracias por tu compra! Revisa tu email para más detalles.');
    });
  }
  
  // Cerrar modal
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', cerrarModalCheckout);
  }
  
  // Ir a pago
  if (btnToPayment) {
    btnToPayment.addEventListener('click', (e) => {
      if (validarFormularioEnvio()) {
        goToCheckoutStep(3);
        guardarInformacionCliente();
      }
    });
  }
  
  // Botón PayPal
  if (btnPaypal) {
    btnPaypal.addEventListener('click', procesarPagoPaypal);
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
  
  // Manejar selección de método de pago
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedPaymentMethod = e.target.value;
      actualizarOpcionesPago();
    });
  });
  
  // Inicializar opciones de pago
  actualizarOpcionesPago();
}

function actualizarOpcionesPago() {
  const paymentCards = document.querySelectorAll('.payment-option-card');
  
  paymentCards.forEach(card => {
    card.classList.remove('active');
    if (card.getAttribute('data-method') === selectedPaymentMethod) {
      card.classList.add('active');
    }
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

function validarFormularioEnvio() {
  const requiredFields = ['full-name', 'email', 'phone', 'address', 'city', 'zip'];
  let isValid = true;
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  
  if (!isValid) {
    mostrarNotificacion('Por favor completa todos los campos requeridos');
  }
  
  return isValid;
}

function guardarInformacionCliente() {
  customerInfo = {
    nombre: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('phone').value,
    direccion: document.getElementById('address').value,
    ciudad: document.getElementById('city').value,
    codigoPostal: document.getElementById('zip').value
  };
}

function validateStep(step) {
  switch(step) {
    case 1:
      return true;
    case 2:
      return validarFormularioEnvio();
    case 3:
      return true;
    default:
      return true;
  }
}

function completarPedido() {
  const orderNumber = 'PT-' + Date.now().toString().slice(-6);
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) + 3;
  
  // Actualizar información en la confirmación
  document.getElementById('order-number').textContent = orderNumber;
  document.getElementById('paid-amount').textContent = `$${total.toFixed(2)}`;
  document.getElementById('payment-method-used').textContent = 
    selectedPaymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
  
  // Mostrar instrucciones según el método de pago
  const instructions = document.getElementById('confirmation-instructions');
  if (selectedPaymentMethod === 'transfer') {
    instructions.innerHTML = `
      <h5>Instrucciones para transferencia:</h5>
      <ul>
        <li>Realiza la transferencia por $${total.toFixed(2)} a la cuenta proporcionada</li>
        <li>Envía el comprobante por WhatsApp</li>
        <li>Tu pedido será procesado una vez confirmemos el pago</li>
        <li>Tiempo de entrega: 3-5 días hábiles</li>
      </ul>
    `;
  } else {
    instructions.innerHTML = `
      <h5>Instrucciones para PayPal:</h5>
      <ul>
        <li>Tu pedido ha sido confirmado</li>
        <li>Recibirás un email con los detalles de tu compra</li>
        <li>Tiempo de entrega: 3-5 días hábiles</li>
      </ul>
    `;
  }
  
  goToCheckoutStep(4);
  
  // Limpiar carrito después de completar el pedido
  carrito = [];
  actualizarCarrito();
}

function procesarPagoPaypal() {
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) + 3;
  
  // Simular procesamiento de PayPal
  const btn = document.getElementById('btn-paypal');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<span class="loading"></span> Redirigiendo a PayPal...';
  btn.disabled = true;
  
  setTimeout(() => {
    // En un caso real, aquí redirigirías a PayPal
    mostrarNotificacion('Redirigiendo a PayPal para completar el pago...');
    
    // Simular pago exitoso
    setTimeout(() => {
      completarPedido();
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }, 1000);
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

// --- SCROLL TO SECTION ---
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    closeAllMenus();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
// --- FUNCIONES PARA NOSOTROS ---
function mostrarPaginaNosotros(pagina) {
  // Primero hacer scroll a la sección
  const seccionNosotros = document.getElementById('quienes-somos');
  if (seccionNosotros) {
    seccionNosotros.scrollIntoView({ behavior: 'smooth' });
    
    // Luego cambiar a la página específica después de un delay
    setTimeout(() => {
      const botones = document.querySelectorAll('.qs-filtro-btn');
      const paginas = document.querySelectorAll('.qs-pagina');
      
      // Remover activo de todos los botones y páginas
      botones.forEach(btn => btn.classList.remove('active'));
      paginas.forEach(pag => pag.classList.remove('active'));
      
      // Activar el botón y página correspondiente
      const botonActivo = document.querySelector(`[data-pagina="${pagina}"]`);
      const paginaActiva = document.getElementById(`qs-${pagina}`);
      
      if (botonActivo) botonActivo.classList.add('active');
      if (paginaActiva) paginaActiva.classList.add('active');
    }, 500);
  }
  closeAllMenus();
}

// --- MEJORAS EN EL CHECKOUT ---
function initCheckout() {
  const btnCheckout = document.getElementById('btn-checkout');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnFinish = document.getElementById('btn-finish');
  const btnCompleteOrder = document.getElementById('btn-complete-order');
  
  if (btnCheckout) {
    btnCheckout.addEventListener('click', abrirModalCheckout);
  }
  
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', cerrarModalCheckout);
  }
  
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      cerrarModalCheckout();
      mostrarNotificacion('¡Gracias por tu compra! Recibirás un email de confirmación.');
    });
  }
  
  if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener('click', procesarPedido);
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
  
  // Manejar cambios en método de pago
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      actualizarOpcionPago(e.target.value);
    });
  });
  
  // Botón PayPal (solo demo)
  const btnPaypal = document.getElementById('btn-paypal');
  if (btnPaypal) {
    btnPaypal.addEventListener('click', () => {
      mostrarNotificacion('🚧 Integración PayPal en desarrollo');
    });
  }
}

function actualizarOpcionPago(metodo) {
  const opciones = document.querySelectorAll('.payment-option-card');
  opciones.forEach(opcion => {
    opcion.classList.remove('active');
    if (opcion.getAttribute('data-method') === metodo) {
      opcion.classList.add('active');
    }
  });
}

function procesarPedido() {
  const metodoPago = document.querySelector('input[name="payment-method"]:checked').value;
  const total = calcularTotalCarrito() + 3; // + envío
  
  if (metodoPago === 'transfer') {
    // Para transferencia, mostrar información bancaria y WhatsApp
    const orderNumber = 'PT-' + Date.now().toString().slice(-6);
    
    // Actualizar información en el paso 4
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('paid-amount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('payment-method-used').textContent = 'Transferencia Bancaria';
    
    // Crear mensaje para WhatsApp
    const mensajeWhatsApp = `Hola Pacha-Tee! Acabo de realizar mi pedido #${orderNumber} por un total de $${total.toFixed(2)}. Adjunto comprobante de transferencia.`;
    const urlWhatsApp = `https://wa.me/593987654321?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    // Actualizar instrucciones de confirmación
    const instrucciones = document.getElementById('confirmation-instructions');
    instrucciones.innerHTML = `
      <div class="transfer-instructions">
        <h5>Instrucciones para completar tu pedido:</h5>
        <div class="bank-details">
          <p><strong>Banco:</strong> Banco del Pacífico</p>
          <p><strong>Cuenta Corriente:</strong> 2105678901</p>
          <p><strong>Cuenta de Ahorros:</strong> 1234567890</p>
          <p><strong>Titular:</strong> Pacha-Tee Ecuador S.A.</p>
          <p><strong>RUC:</strong> 1234567890001</p>
          <p><strong>Total a transferir:</strong> $${total.toFixed(2)}</p>
        </div>
        <a href="${urlWhatsApp}" class="btn btn-success whatsapp-btn" target="_blank" style="margin-top: 15px;">
          <span>📱 Enviar comprobante por WhatsApp</span>
        </a>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
          Una vez enviado el comprobante, procesaremos tu pedido en 24-48 horas.
        </p>
      </div>
    `;
    
    goToCheckoutStep(4);
    
  } else if (metodoPago === 'paypal') {
    // Para PayPal (demo)
    mostrarNotificacion('🔧 Integración PayPal en desarrollo - Usa transferencia bancaria');
  }
  
  // Limpiar carrito después de completar pedido
  carrito = [];
  actualizarCarrito();
}

function calcularTotalCarrito() {
  return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Agregar al final del archivo las funciones globales
window.mostrarPaginaNosotros = mostrarPaginaNosotros;
window.mostrarPagina = mostrarPaginaNosotros; // Para compatibilidad
// --- FUNCIONES GLOBALES ---
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.filtrarProductos = filtrarProductos;
window.scrollToSection = scrollToSection;
window.cerrarModalCheckout = cerrarModalCheckout;
window.mostrarCategoria = mostrarCategoria;
