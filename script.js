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

// --- MOBILE MENU TOGGLE ---
const btnMenu = document.getElementById('btn-menu');
const mobileMenu = document.getElementById('mobile-menu');

if (btnMenu && mobileMenu) {
  btnMenu.addEventListener('click', () => {
    if(mobileMenu.hasAttribute('hidden')) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden','');
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

if (btnCheckout) {
  btnCheckout.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Aquí iría la lógica de checkout
    alert('¡Gracias por tu compra! En un entorno real, esto procesaría el pago.');
    carrito = [];
    actualizarCarrito();
    cartPanel.setAttribute('hidden','');
  });
}

// Cerrar carrito SOLO cuando se hace click fuera del carrito y NO es una acción del carrito
document.addEventListener('click', (e) => {
  if (!cartPanel || !btnCarrito || cartPanel.hasAttribute('hidden')) return;
  
  // Verificar si el click es en elementos relacionados con el carrito
  const isCartElement = 
    cartPanel.contains(e.target) || 
    btnCarrito.contains(e.target) ||
    e.target.closest('.quantity-btn') ||
    e.target.closest('.remove-btn') ||
    e.target.closest('.btn-add') ||
    e.target.closest('.cart-item') ||
    e.target.closest('.cart-header') ||
    e.target.closest('.cart-footer');
  
  // Solo cerrar si NO es un elemento del carrito
  if (!isCartElement) {
    cartPanel.setAttribute('hidden','');
  }
});

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

// --- FULLPAGE SCROLL SIMPLE PARA SECCIÓN NOSOTROS ---
// --- FULLPAGE SCROLL SIMPLE PARA SECCIÓN NOSOTROS ---
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
  }

  function goToPage(index) {
    if (index < 0 || index >= pages.length || isAnimating) return;
    
    isAnimating = true;
    currentPage = index;
    
    // Ocultar todas las páginas
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar página actual
    pages[currentPage].classList.add('active');
    
    // Actualizar dots de navegación
    dots.forEach((dot, i) => {
      if (i === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Scroll a la sección
    if (nosotrosSection) {
      nosotrosSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Permitir animación nuevamente después de un tiempo
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // Mostrar/ocultar navegación basado en scroll
  function toggleNavigationVisibility() {
    if (!navigation || !nosotrosSection) return;
    
    const rect = nosotrosSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Mostrar navegación si la sección está visible en al menos 50% de la pantalla
    const isSectionVisible = rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;
    
    if (isSectionVisible) {
      navigation.style.opacity = '1';
      navigation.style.visibility = 'visible';
    } else {
      navigation.style.opacity = '0';
      navigation.style.visibility = 'hidden';
    }
  }

  // Hacer la función global para los enlaces del menú
  window.goToPage = goToPage;

  // Control con teclado
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
  window.addEventListener('scroll', toggleNavigationVisibility);
  window.addEventListener('resize', toggleNavigationVisibility);

  // También mostrar navegación cuando se navega directamente a la sección
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && navigation) {
        navigation.style.opacity = '1';
        navigation.style.visibility = 'visible';
      } else if (navigation) {
        navigation.style.opacity = '0';
        navigation.style.visibility = 'hidden';
      }
    });
  }, {
    threshold: 0.3
  });

  if (nosotrosSection) {
    observer.observe(nosotrosSection);
  }

  // NO inicializar automáticamente - solo cuando el usuario navegue a esa sección
  // goToPage(0); // ESTA LÍNEA ESTÁ COMENTADA
}
    
    // Scroll a la sección
    const nosotrosSection = document.querySelector('.nosotros-fullpage');
    if (nosotrosSection) {
      nosotrosSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Permitir animación nuevamente después de un tiempo
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  // Hacer la función global para los enlaces del menú
  window.goToPage = goToPage;

  // Control con teclado
  document.addEventListener('keydown', (event) => {
    if (isAnimating) return;
    
    const nosotrosSection = document.querySelector('.nosotros-fullpage');
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

  // NO inicializar automáticamente - solo cuando el usuario navegue a esa sección
  // goToPage(0); // ESTA LÍNEA ESTÁ COMENTADA
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
  initNosotrosFullpage();
  
  // Observar todas las tarjetas para animaciones
  const allCards = document.querySelectorAll('.card, .item, .step, .product-card');
  allCards.forEach((card) => observer.observe(card));
});
