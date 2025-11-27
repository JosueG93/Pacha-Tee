// --- ANIMACIONES AL HACER SCROLL (REVEAL) ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.1
});

// Observa elementos con clase reveal
const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((el) => observer.observe(el));

// Observa tarjetas y productos
const cards = document.querySelectorAll(".card, .item");
cards.forEach((card) => observer.observe(card));

// --- MENÚ SUAVE AL NAVEGAR ---
const links = document.querySelectorAll("a[href^='#']");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      // Cerrar menú móvil si está abierto
      if (mobileMenu && !mobileMenu.hasAttribute("hidden")) {
        mobileMenu.setAttribute("hidden", "");
      }
    }
  });
});

// --- NAVBAR PEGADA Y CON SOMBRA ---
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

// --- CARRITO DE COMPRAS MEJORADO ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
  // Actualizar contador del carrito
  const cartCount = document.getElementById('cart-count');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  if (cartCount) cartCount.textContent = totalItems;
  
  // Actualizar panel del carrito si está abierto
  if (window.cartPanel && !window.cartPanel.hasAttribute('hidden')) {
    renderizarCarrito();
  }
  
  // Guardar en localStorage
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
  
  // Mostrar notificación
  mostrarNotificacion(`"${producto}" agregado al carrito`);
}

function eliminarDelCarrito(producto) {
  carrito = carrito.filter(item => item.nombre !== producto);
  actualizarCarrito();
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
    cartItems.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">Tu carrito está vacío</p>';
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

function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = 'notification';
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--verde);
    color: var(--crema);
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1003;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notificacion);
  
  // Animación de entrada
  setTimeout(() => {
    notificacion.style.transform = 'translateY(0)';
    notificacion.style.opacity = '1';
  }, 10);
  
  // Animación de salida después de 3 segundos
  setTimeout(() => {
    notificacion.style.transform = 'translateY(100px)';
    notificacion.style.opacity = '0';
    
    // Eliminar del DOM después de la animación
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Botones "Agregar al carrito"
const botones = document.querySelectorAll(".btn-add");

botones.forEach((btn) => {
  btn.addEventListener("click", () => {
    const producto = btn.getAttribute("data-producto");
    const precio = btn.getAttribute("data-precio");
    agregarAlCarrito(producto, precio);
  });
});

// --- TOGGLE DROPDOWN (DESKTOP) ---
const btnNos = document.getElementById('btn-nosotros');
const dd = document.getElementById('dropdown-nosotros');
const submenuNosotros = document.getElementById('submenu-nosotros');

if (btnNos && dd && submenuNosotros) {
  btnNos.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !dd.hasAttribute('hidden');
    if(open) {
      dd.setAttribute('hidden','');
    } else {
      dd.removeAttribute('hidden');
    }
    btnNos.setAttribute('aria-expanded', String(!open));
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    if(!submenuNosotros.contains(e.target)) {
      dd.setAttribute('hidden','');
      btnNos.setAttribute('aria-expanded','false');
    }
  });
}

// --- CARRITO PANEL TOGGLE ---
const btnCarrito = document.getElementById('btn-carrito');
const cartPanel = document.getElementById('cart-panel');
const btnCloseCart = document.getElementById('btn-close-cart');
const btnCheckout = document.getElementById('btn-checkout');

// Hacer cartPanel global
window.cartPanel = cartPanel;

if (btnCarrito && cartPanel) {
  btnCarrito.addEventListener('click', () => {
    if(cartPanel.hasAttribute('hidden')) {
      cartPanel.removeAttribute('hidden');
      renderizarCarrito();
    } else {
      cartPanel.setAttribute('hidden','');
    }
  });
}

if (btnCloseCart) {
  btnCloseCart.addEventListener('click', () => {
    cartPanel.setAttribute('hidden','');
  });
}

// --- CHECKOUT MEJORADO ---
const checkoutModal = document.getElementById('checkout-modal');
const btnProcessPayment = document.getElementById('btn-process-payment');
const btnFinish = document.getElementById('btn-finish');
const btnCloseModal = document.getElementById('btn-close-modal');

// FUNCIONES MEJORADAS PARA EL MODAL
function abrirModalCheckout() {
  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío');
    return;
  }
  
  checkoutModal.removeAttribute('hidden');
  renderizarOrderSummary();
  goToCheckoutStep(1);
  
  // Prevenir scroll del body
  document.body.classList.add('modal-open');
}

function cerrarModalCheckout() {
  // Cerrar modal primero
  if (checkoutModal) {
    checkoutModal.setAttribute('hidden', '');
  }
  
  // RESTAURAR SCROLL DEL BODY - ESTO ES LO MÁS IMPORTANTE
  document.body.classList.remove('modal-open');
  
  // Limpiar formularios después de cerrar
  limpiarFormulariosCheckout();
}

function limpiarFormulariosCheckout() {
  // SOLO limpiar formularios, NO cerrar modal aquí
  const shippingForm = document.querySelector('.shipping-form');
  if (shippingForm) {
    shippingForm.reset();
  }
  
  const cardInputs = document.querySelectorAll('#card-form input');
  cardInputs.forEach(input => {
    input.value = '';
  });
  
  // Resetear al paso 1
  goToCheckoutStep(1);
}

// Abrir modal de checkout
if (btnCheckout) {
  btnCheckout.addEventListener('click', abrirModalCheckout);
}

// Navegación entre pasos del checkout
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const nextStep = e.target.getAttribute('data-next');
    if (validateStep(parseInt(nextStep) - 1)) {
      goToCheckoutStep(parseInt(nextStep));
    }
  });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const prevStep = e.target.getAttribute('data-prev');
    goToCheckoutStep(parseInt(prevStep));
  });
});

// Función para actualizar los pasos activos
function actualizarPasosCheckout(stepActual) {
  const steps = document.querySelectorAll('.checkout-steps .step');
  
  steps.forEach((step) => {
    const stepNumber = parseInt(step.getAttribute('data-step'));
    
    // Remover clase active de todos
    step.classList.remove('active');
    
    // Agregar clase active al paso actual y a los anteriores
    if (stepNumber <= stepActual) {
      step.classList.add('active');
    }
  });
}

// Función para navegar entre pasos - VERSIÓN CORREGIDA
function goToCheckoutStep(step) {
  // Ocultar todos los pasos del contenido
  document.querySelectorAll('.checkout-step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  
  // Mostrar paso actual del contenido
  const currentStep = document.getElementById(`step-${step}`);
  if (currentStep) {
    currentStep.classList.add('active');
  }
  
  // Actualizar indicadores de pasos (los círculos/indicadores visuales)
  actualizarPasosCheckout(step);
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
  switch(step) {
    case 1: // Carrito - siempre válido
      return true;
      
    case 2: // Envío
      const requiredFields = ['full-name', 'email', 'address', 'city', 'zip', 'phone'];
      let isValid = true;
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          if (field) field.style.borderColor = '#e74c3c';
          isValid = false;
        } else {
          if (field) field.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        mostrarNotificacion('Por favor completa todos los campos requeridos');
      }
      
      return isValid;
      
    case 3: // Pago
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
      if (paymentMethod) {
        const paymentMethodUsed = document.getElementById('payment-method-used');
        if (paymentMethodUsed) {
          paymentMethodUsed.textContent = 
            paymentMethod.value === 'card' ? 'Tarjeta de crédito' : 
            paymentMethod.value === 'paypal' ? 'PayPal' : 'Transferencia bancaria';
        }
      }
      return true;
      
    default:
      return true;
  }
}

function processPayment() {
  const btn = btnProcessPayment;
  if (!btn) return;
  
  const originalText = btn.textContent;
  
  // Mostrar estado de carga
  btn.innerHTML = '<span class="loading"></span> Procesando pago...';
  btn.disabled = true;
  
  // Simular procesamiento de pago
  setTimeout(() => {
    // Simular éxito del pago
    goToCheckoutStep(4);
    
    // Limpiar carrito después de pago exitoso
    carrito = [];
    actualizarCarrito();
    
    // Restaurar botón
    btn.textContent = originalText;
    btn.disabled = false;
    
  }, 2000);
}

// Procesar pago
if (btnProcessPayment) {
  btnProcessPayment.addEventListener('click', processPayment);
}

// Cerrar modal al hacer click en el botón "Volver a la tienda"
if (btnFinish) {
  btnFinish.addEventListener('click', function() {
    cerrarModalCheckout();
    
    // Limpiar carrito después de compra exitosa
    carrito = [];
    actualizarCarrito();
    
    mostrarNotificacion('¡Gracias por tu compra! Recibirás un email de confirmación.');
  });
}

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && checkoutModal && !checkoutModal.hasAttribute('hidden')) {
    cerrarModalCheckout();
  }
});

// Cerrar modal al hacer click fuera
if (checkoutModal) {
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      cerrarModalCheckout();
    }
  });
}

// Cerrar modal con el botón "×"
if (btnCloseModal) {
  btnCloseModal.addEventListener('click', function(e) {
    e.stopPropagation();
    cerrarModalCheckout();
  });
}

// Prevenir que el click dentro del modal content lo cierre
const modalContent = document.querySelector('.modal-content');
if (modalContent) {
  modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// --- BOTÓN DEMO AR ---
const btnDemo = document.getElementById('btn-demo');
if (btnDemo) {
  btnDemo.addEventListener('click', () => {
    alert('En una implementación real, aquí se mostraría un demo de realidad aumentada.');
  });
}

// --- SCROLL TO SECTION HELPER ---
function scrollToSection(id){
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({behavior:'smooth', block:'start'});
    if(mobileMenu && !mobileMenu.hasAttribute('hidden')) {
      mobileMenu.setAttribute('hidden','');
    }
    if(cartPanel && !cartPanel.hasAttribute('hidden')) {
      cartPanel.setAttribute('hidden','');
    }
  }
}

// --- FULLPAGE SCROLL CORREGIDO PARA SECCIÓN NOSOTROS ---
function initNosotrosFullpage() {
  const pages = document.querySelectorAll('.nosotros-page');
  const navigation = document.querySelector('.page-navigation');
  let currentPage = 0;
  let isAnimating = false;

  if (pages.length === 0) return;

  // Crear navegación si no existe
  if (navigation && navigation.children.length === 0) {
    const pageTitles = ['Misión', 'Visión', 'Objetivo'];
    pageTitles.forEach((title, index) => {
      const dot = document.createElement('div');
      dot.className = 'page-dot';
      dot.setAttribute('data-title', title);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToPage(index);
      });
      navigation.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.page-dot');
  const nosotrosSection = document.querySelector('.nosotros-fullpage');

  // Ocultar navegación inicialmente
  if (navigation) {
    navigation.style.opacity = '0';
    navigation.style.visibility = 'hidden';
    navigation.style.pointerEvents = 'none';
  }

  function goToPage(index) {
    if (index < 0 || index >= pages.length || isAnimating) return;
    
    isAnimating = true;
    currentPage = index;
    
    // Ocultar todas las páginas
    pages.forEach(page => {
      page.classList.remove('active');
      page.style.opacity = '0';
      page.style.visibility = 'hidden';
      page.style.pointerEvents = 'none';
    });
    
    // Mostrar página actual
    pages[currentPage].classList.add('active');
    pages[currentPage].style.opacity = '1';
    pages[currentPage].style.visibility = 'visible';
    pages[currentPage].style.pointerEvents = 'auto';
    
    // Actualizar dots de navegación
    dots.forEach((dot, i) => {
      if (i === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Scroll a la sección si no estamos ya en ella
    if (nosotrosSection) {
      const rect = nosotrosSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInView) {
        nosotrosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // Control de visibilidad de la navegación
  function toggleNavigationVisibility() {
    if (!navigation || !nosotrosSection) return;
    
    const rect = nosotrosSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Mostrar navegación solo cuando la sección esté visible en al menos 50% de la pantalla
    const isSectionVisible = rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;
    
    if (isSectionVisible) {
      navigation.style.opacity = '1';
      navigation.style.visibility = 'visible';
      navigation.style.pointerEvents = 'auto';
      navigation.classList.add('visible');
    } else {
      navigation.style.opacity = '0';
      navigation.style.visibility = 'hidden';
      navigation.style.pointerEvents = 'none';
      navigation.classList.remove('visible');
    }
  }

  // Hacer la función global para los enlaces del menú
  window.goToPage = goToPage;

  // Control con teclado - SOLO cuando estamos en la sección
  document.addEventListener('keydown', (event) => {
    if (isAnimating) return;
    
    if (!nosotrosSection) return;
    
    const rect = nosotrosSection.getBoundingClientRect();
    const isInSection = rect.top <= 100 && rect.bottom >= 100;
    
    if (!isInSection) return;
    
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      if (currentPage < pages.length - 1) {
        goToPage(currentPage + 1);
      }
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      if (currentPage > 0) {
        goToPage(currentPage - 1);
      }
    }
  });

  // Observar cambios de scroll para mostrar/ocultar navegación
  let scrollTimeout;
  function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(toggleNavigationVisibility, 50);
  }

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', toggleNavigationVisibility);

  // Inicializar visibilidad
  toggleNavigationVisibility();

  // Solo mostrar la primera página al inicio
  pages.forEach((page, index) => {
    if (index !== 0) {
      page.classList.remove('active');
      page.style.opacity = '0';
      page.style.visibility = 'hidden';
      page.style.pointerEvents = 'none';
    }
  });
}

// --- MOBILE MENU TOGGLE ---
const mobileMenu = document.getElementById('mobile-menu');
const btnMenu = document.getElementById('btn-menu');

if (btnMenu && mobileMenu) {
  btnMenu.addEventListener('click', () => {
    if (mobileMenu.hasAttribute('hidden')) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden', '');
    }
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
  initNosotrosFullpage();
  
  // Observar todas las tarjetas para animaciones
  const allCards = document.querySelectorAll('.card, .item, .step.card, .product-card');
  allCards.forEach((card) => observer.observe(card));
});
