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
      if (!mobileMenu.hasAttribute("hidden")) {
        mobileMenu.setAttribute("hidden", "");
      }
    }
  });
});

// --- NAVBAR PEGADA Y CON SOMBRA ---
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- CARRITO DE COMPRAS MEJORADO ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
  // Actualizar contador del carrito
  const cartCount = document.getElementById('cart-count');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  cartCount.textContent = totalItems;
  
  // Actualizar panel del carrito si está abierto
  if (!cartPanel.hasAttribute('hidden')) {
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

btnNos?.addEventListener('click', (e) => {
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
  if(!document.getElementById('submenu-nosotros').contains(e.target)) {
    dd?.setAttribute('hidden','');
    btnNos?.setAttribute('aria-expanded','false');
  }
});

// --- MOBILE MENU TOGGLE ---
const btnMenu = document.getElementById('btn-menu');
const mobileMenu = document.getElementById('mobile-menu');

btnMenu?.addEventListener('click', () => {
  if(mobileMenu.hasAttribute('hidden')) {
    mobileMenu.removeAttribute('hidden');
  } else {
    mobileMenu.setAttribute('hidden','');
  }
});

// --- CARRITO PANEL TOGGLE ---
const btnCarrito = document.getElementById('btn-carrito');
const cartPanel = document.getElementById('cart-panel');
const btnCloseCart = document.getElementById('btn-close-cart');
const btnCheckout = document.getElementById('btn-checkout');

btnCarrito?.addEventListener('click', () => {
  if(cartPanel.hasAttribute('hidden')) {
    cartPanel.removeAttribute('hidden');
    renderizarCarrito();
  } else {
    cartPanel.setAttribute('hidden','');
  }
});

btnCloseCart?.addEventListener('click', () => {
  cartPanel.setAttribute('hidden','');
});

btnCheckout?.addEventListener('click', () => {
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

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!cartPanel.contains(e.target) && !btnCarrito.contains(e.target) && !cartPanel.hasAttribute('hidden')) {
    cartPanel.setAttribute('hidden','');
  }
});

// --- BOTÓN DEMO AR ---
const btnDemo = document.getElementById('btn-demo');
btnDemo?.addEventListener('click', () => {
  alert('En una implementación real, aquí se mostraría un demo de realidad aumentada.');
});

// --- SCROLL TO SECTION HELPER ---
function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
  if(mobileMenu && !mobileMenu.hasAttribute('hidden')) {
    mobileMenu.setAttribute('hidden','');
  }
  if(cartPanel && !cartPanel.hasAttribute('hidden')) {
    cartPanel.setAttribute('hidden','');
  }
}

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
});

// --- SCROLL ANIMATION PARA SECCIÓN NOSOTROS ---
function initNosotrosScroll() {
  const nosotrosSection = document.querySelector('.nosotros-scroll-section');
  const slides = document.querySelectorAll('.nosotros-slide');
  const progressDots = document.querySelector('.scroll-progress');
  
  // Crear puntos de progreso
  if (progressDots) {
    const slideTitles = ['Misión', 'Visión', 'Objetivo'];
    slideTitles.forEach((title, index) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.setAttribute('data-title', title);
      dot.addEventListener('click', () => {
        scrollToSlide(index);
      });
      progressDots.appendChild(dot);
    });
  }
  
  const dots = document.querySelectorAll('.progress-dot');
  
  function updateActiveSlide() {
    const scrollTop = window.pageYOffset;
    const sectionTop = nosotrosSection.offsetTop;
    const sectionHeight = nosotrosSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calcular slide activo basado en scroll
    const scrollProgress = (scrollTop - sectionTop + windowHeight * 0.5) / sectionHeight;
    const activeIndex = Math.max(0, Math.min(slides.length - 1, Math.floor(scrollProgress * slides.length)));
    
    // Actualizar slides
    slides.forEach((slide, index) => {
      if (index === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Actualizar puntos de progreso
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  function scrollToSlide(index) {
    const sectionTop = nosotrosSection.offsetTop;
    const slideHeight = window.innerHeight;
    const targetScroll = sectionTop + (index * slideHeight);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }
  
  // Inicializar
  updateActiveSlide();
  window.addEventListener('scroll', updateActiveSlide);
  window.addEventListener('resize', updateActiveSlide);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // ... código existente ...
  initNosotrosScroll();
});
