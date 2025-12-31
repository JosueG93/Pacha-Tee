// ===== VARIABLES GLOBALES =====
let carrito = [];
let pasoCheckout = 1;
let inventario = {};
let ventas = [];

// Inventario inicial
const INVENTARIO_INICIAL = {
  'Camiseta Lirio': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Mujer': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Condor': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Medusa': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Floripondio': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Heliconia': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Rana': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Camiseta Passiflora': { categoria: 'Camisetas', precio: 13, stock: 12, vendidos: 0 },
  'Tote Bag Natural': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Ecológico': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Océano': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Selva': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Urbano': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Geométrico': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 },
  'Tote Bag Minimal': { categoria: 'Tote Bags', precio: 5, stock: 8, vendidos: 0 }
};

// ===== INICIALIZACIÃ"N =====
document.addEventListener('DOMContentLoaded', () => {
  inicializarEventos();
  actualizarCarrito();
  inicializarAnimaciones();
  inicializarParallax();
  inicializarContadores();
  inicializarTilt();
  inicializarCursorCustom();
  cargarDatosStorage();
});

// ===== EVENTOS =====
function inicializarEventos() {
  // Scroll navbar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
      });
    }
  });

  // Cerrar modales con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarCart();
      cerrarCheckout();
      cerrarMobileMenu();
    }
  });
}

// ===== STORAGE & DATOS =====
// Detectar si estamos en artifacts o en local
const esLocal = typeof window.storage === 'undefined';

async function cargarDatosStorage() {
  try {
    if (esLocal) {
      // Usar localStorage para desarrollo local
      const inventarioData = localStorage.getItem('pacha-inventario');
      if (inventarioData) {
        inventario = JSON.parse(inventarioData);
      } else {
        inventario = { ...INVENTARIO_INICIAL };
        guardarInventario();
      }

      const ventasData = localStorage.getItem('pacha-ventas');
      if (ventasData) {
        ventas = JSON.parse(ventasData);
      } else {
        ventas = [];
      }
    } else {
      // Usar window.storage para artifacts
      const inventarioData = await window.storage.get('pacha-inventario');
      if (inventarioData) {
        inventario = JSON.parse(inventarioData.value);
      } else {
        inventario = { ...INVENTARIO_INICIAL };
        await guardarInventario();
      }

      const ventasData = await window.storage.get('pacha-ventas');
      if (ventasData) {
        ventas = JSON.parse(ventasData.value);
      } else {
        ventas = [];
      }
    }
  } catch (error) {
    console.log('Inicializando datos nuevos...', error);
    inventario = { ...INVENTARIO_INICIAL };
    ventas = [];
    await guardarInventario();
    await guardarVentas();
  }
}

async function guardarInventario() {
  try {
    if (esLocal) {
      localStorage.setItem('pacha-inventario', JSON.stringify(inventario));
    } else {
      await window.storage.set('pacha-inventario', JSON.stringify(inventario));
    }
  } catch (error) {
    console.error('Error guardando inventario:', error);
  }
}

async function guardarVentas() {
  try {
    if (esLocal) {
      localStorage.setItem('pacha-ventas', JSON.stringify(ventas));
    } else {
      await window.storage.set('pacha-ventas', JSON.stringify(ventas));
    }
  } catch (error) {
    console.error('Error guardando ventas:', error);
  }
}

async function registrarVenta(datosCliente, metodoPago) {
  const venta = {
    id: 'PT-' + Date.now(),
    fecha: new Date().toISOString(),
    cliente: datosCliente,
    productos: [...carrito],
    subtotal: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
    envio: 3,
    total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) + 3,
    metodoPago: metodoPago,
    estado: 'Pendiente'
  };

  // Actualizar inventario
  carrito.forEach(item => {
    if (inventario[item.nombre]) {
      inventario[item.nombre].stock -= item.cantidad;
      inventario[item.nombre].vendidos += item.cantidad;
    }
  });

  ventas.push(venta);
  
  await guardarInventario();
  await guardarVentas();
  
  return venta;
}

// ===== PANEL ADMIN =====
function abrirLoginAdmin() {
  const modal = document.getElementById('admin-login-modal');
  modal.classList.add('active');
}

function cerrarLoginAdmin() {
  const modal = document.getElementById('admin-login-modal');
  modal.classList.remove('active');
  document.getElementById('admin-password').value = '';
}

function validarLoginAdmin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('admin-password');
  const password = passwordInput.value;
  
  if (password === 'admin123') {
    cerrarLoginAdmin();
    abrirPanelAdmin();
  } else {
    mostrarNotificacion('❌ Contraseña incorrecta');
    passwordInput.value = '';
    passwordInput.classList.add('input-error');
    passwordInput.focus();
    
    setTimeout(() => {
      passwordInput.classList.remove('input-error');
    }, 2000);
  }
}

async function abrirPanelAdmin() {
  await cargarDatosStorage();
  const modal = document.getElementById('admin-panel-modal');
  modal.classList.add('active');
  cambiarTabAdmin('ventas');
  actualizarPanelVentas();
}

function cerrarPanelAdmin() {
  const modal = document.getElementById('admin-panel-modal');
  modal.classList.remove('active');
}

function cambiarTabAdmin(tab) {
  // Cambiar tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Activar el botón correcto
  const btnActivo = event?.target || document.querySelector(`[onclick*="cambiarTabAdmin('${tab}')"]`);
  if (btnActivo) {
    btnActivo.classList.add('active');
  }

  // Cambiar contenido
  document.querySelectorAll('.admin-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`admin-tab-${tab}`).classList.add('active');

  // Cargar datos según tab
  if (tab === 'ventas') {
    actualizarPanelVentas();
  } else if (tab === 'inventario') {
    actualizarPanelInventario();
  } else if (tab === 'estadisticas') {
    actualizarPanelEstadisticas();
  }
}

// ===== PANEL VENTAS =====
function actualizarPanelVentas() {
  // Calcular totales
  const totalVendido = ventas.reduce((sum, v) => sum + v.total, 0);
  const totalPedidos = ventas.length;
  const totalProductos = ventas.reduce((sum, v) => 
    sum + v.productos.reduce((s, p) => s + p.cantidad, 0), 0);

  document.getElementById('total-vendido').textContent = `${totalVendido}`;
  document.getElementById('total-pedidos').textContent = totalPedidos;
  document.getElementById('total-productos').textContent = totalProductos;

  // Tabla de ventas
  const tbody = document.getElementById('ventas-tbody');
  
  if (ventas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">No hay ventas registradas aún</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = ventas.slice().reverse().map(venta => `
    <tr>
      <td><strong>${venta.id}</strong></td>
      <td>${new Date(venta.fecha).toLocaleDateString('es-ES')}<br>
          <small>${new Date(venta.fecha).toLocaleTimeString('es-ES')}</small></td>
      <td>${venta.cliente.nombre}<br>
          <small>${venta.cliente.email}</small></td>
      <td>
        ${venta.productos.map(p => `${p.nombre} (×${p.cantidad})`).join('<br>')}
      </td>
      <td><strong>${venta.total}</strong></td>
      <td><span class="status-badge status-${venta.estado.toLowerCase()}">${venta.estado}</span></td>
    </tr>
  `).join('');
}

function exportarVentas() {
  if (ventas.length === 0) {
    mostrarNotificacion('No hay ventas para exportar');
    return;
  }

  const csv = [
    ['ID', 'Fecha', 'Cliente', 'Email', 'Teléfono', 'Total', 'Estado', 'Método Pago'].join(','),
    ...ventas.map(v => [
      v.id,
      new Date(v.fecha).toLocaleString('es-ES'),
      v.cliente.nombre,
      v.cliente.email,
      v.cliente.telefono,
      v.total,
      v.estado,
      v.metodoPago
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ventas-pacha-tee-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  mostrarNotificacion('✓ Ventas exportadas correctamente');
}

// ===== PANEL INVENTARIO =====
function actualizarPanelInventario(filtro = 'todos') {
  const tbody = document.getElementById('inventario-tbody');
  
  let productos = Object.entries(inventario);
  
  // Filtrar
  if (filtro === 'camisetas') {
    productos = productos.filter(([nombre, data]) => data.categoria === 'Camisetas');
  } else if (filtro === 'tote-bags') {
    productos = productos.filter(([nombre, data]) => data.categoria === 'Tote Bags');
  } else if (filtro === 'bajo-stock') {
    productos = productos.filter(([nombre, data]) => data.stock < 10);
  }

  tbody.innerHTML = productos.map(([nombre, data]) => {
    const stockClass = data.stock >= 30 ? 'stock-alto' : data.stock >= 10 ? 'stock-medio' : 'stock-bajo';
    const stockIcon = data.stock >= 30 ? '✓' : data.stock >= 10 ? '⚠' : '❌';
    
    return `
      <tr>
        <td><strong>${nombre}</strong></td>
        <td>${data.categoria}</td>
        <td>${data.precio}</td>
        <td>
          <span class="stock-indicator ${stockClass}">
            ${stockIcon} ${data.stock} unidades
          </span>
        </td>
        <td>${data.vendidos}</td>
        <td class="action-btns">
          <button class="btn btn-primary btn-icon-small" onclick="ajustarStock('${nombre}', 10)" title="Agregar 10">
            +
          </button>
          <button class="btn btn-secondary btn-icon-small" onclick="ajustarStock('${nombre}', -10)" title="Quitar 10">
            −
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filtrarInventario(filtro) {
  document.querySelectorAll('.inventory-filters .filter-btn-small').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  actualizarPanelInventario(filtro);
}

async function ajustarStock(producto, cantidad) {
  if (inventario[producto]) {
    inventario[producto].stock += cantidad;
    if (inventario[producto].stock < 0) {
      inventario[producto].stock = 0;
    }
    await guardarInventario();
    actualizarPanelInventario();
    mostrarNotificacion(`✓ Stock actualizado: ${producto}`);
  }
}

async function inicializarInventario() {
  if (confirm('¿Estás seguro de reiniciar todo el inventario? Esto restaurará el stock inicial.')) {
    inventario = { ...INVENTARIO_INICIAL };
    await guardarInventario();
    actualizarPanelInventario();
    mostrarNotificacion('✓ Inventario reiniciado correctamente');
  }
}

// ===== PANEL ESTADÃSTICAS =====
function actualizarPanelEstadisticas() {
  // Top productos
  const productosVendidos = {};
  ventas.forEach(venta => {
    venta.productos.forEach(prod => {
      productosVendidos[prod.nombre] = (productosVendidos[prod.nombre] || 0) + prod.cantidad;
    });
  });

  const topProductos = Object.entries(productosVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topList = document.getElementById('top-productos-list');
  if (topProductos.length === 0) {
    topList.innerHTML = '<p class="empty-state-small">Sin datos disponibles</p>';
  } else {
    topList.innerHTML = topProductos.map(([nombre, cantidad], index) => `
      <div class="top-item">
        <div class="top-item-rank">${index + 1}</div>
        <div class="top-item-info">
          <div class="top-item-name">${nombre}</div>
        </div>
        <div class="top-item-value">${cantidad} vendidos</div>
      </div>
    `).join('');
  }

  // Métodos de pago
  const metodosPago = {};
  ventas.forEach(venta => {
    metodosPago[venta.metodoPago] = (metodosPago[venta.metodoPago] || 0) + 1;
  });

  const totalVentas = ventas.length || 1;
  const metodosChart = document.getElementById('metodos-pago-chart');
  
  if (Object.keys(metodosPago).length === 0) {
    metodosChart.innerHTML = '<p class="empty-state-small">Sin datos disponibles</p>';
  } else {
    metodosChart.innerHTML = Object.entries(metodosPago).map(([metodo, cantidad]) => {
      const porcentaje = (cantidad / totalVentas) * 100;
      return `
        <div class="chart-bar">
          <div class="chart-bar-label">${metodo}</div>
          <div class="chart-bar-container">
            <div class="chart-bar-fill" style="width: ${porcentaje}%"></div>
          </div>
          <div class="chart-bar-value">${cantidad}</div>
        </div>
      `;
    }).join('');
  }

  // Alertas de stock
  const alertasStock = Object.entries(inventario)
    .filter(([nombre, data]) => data.stock < 10)
    .sort((a, b) => a[1].stock - b[1].stock);

  const alertasContainer = document.getElementById('alertas-stock');
  if (alertasStock.length === 0) {
    alertasContainer.innerHTML = '<p class="empty-state-small">Todo el inventario está en orden ✓</p>';
  } else {
    alertasContainer.innerHTML = alertasStock.map(([nombre, data]) => `
      <div class="alert-item">
        <div class="alert-icon">⚠️</div>
        <div class="alert-text">
          <strong>${nombre}</strong><br>
          Solo quedan ${data.stock} unidades en stock
        </div>
      </div>
    `).join('');
  }
}

// ===== PARALLAX EFFECT =====
function inicializarParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');
  const shapes = document.querySelectorAll('.hero-shape');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      heroContent.style.opacity = 1 - (scrolled / 600);
    }
    
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    shapes.forEach((shape, index) => {
      const speed = 0.2 + (index * 0.1);
      shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
  });
}

// ===== CONTADOR ANIMADO =====
function inicializarContadores() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const speed = 200;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// ===== EFECTO TILT 3D =====
function inicializarTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ===== CURSOR PERSONALIZADO =====
function inicializarCursorCustom() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  const cursorFollower = document.createElement('div');
  cursorFollower.classList.add('cursor-follower');
  document.body.appendChild(cursorFollower);
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });
  
  // Smooth follower
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();
  
  // Efecto hover en elementos interactivos
  const interactiveElements = document.querySelectorAll('a, button, .product-card, [onclick]');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorFollower.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorFollower.classList.remove('cursor-hover');
    });
  });
}

// ===== ANIMACIONES =====
function inicializarAnimaciones() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
}

// ===== DROPDOWN MENUS =====
function toggleDropdown(dropdownId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const dropdown = document.getElementById(dropdownId);
  const allDropdowns = document.querySelectorAll('.dropdown-menu');
  
  // Cerrar todos los demás dropdowns
  allDropdowns.forEach(menu => {
    if (menu.id !== dropdownId) {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
    }
  });
  
  // Toggle el dropdown actual
  if (dropdown) {
    const isVisible = dropdown.style.visibility === 'visible';
    dropdown.style.opacity = isVisible ? '0' : '1';
    dropdown.style.visibility = isVisible ? 'hidden' : 'visible';
  }
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
    });
  }
});

// ===== NAVEGACIÃ"N =====
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  cerrarMobileMenu();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  
  menu.classList.toggle('active');
  btn.classList.toggle('active');
}

function cerrarMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  
  menu.classList.remove('active');
  btn.classList.remove('active');
}

// ===== TABS NOSOTROS =====
function cambiarTab(tab) {
  // Actualizar botones
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });

  // Actualizar contenido
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const contenido = document.getElementById(`tab-${tab}`);
  if (contenido) {
    contenido.classList.add('active');
  }
}

function mostrarNosotros(tab) {
  scrollToSection('nosotros');
  setTimeout(() => {
    cambiarTab(tab);
  }, 500);
  
  // Cerrar dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
  });
}

// ===== FILTROS TIENDA =====
function filtrarProductos(categoria) {
  // Actualizar botones
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === categoria) {
      btn.classList.add('active');
    }
  });

  // Mostrar/ocultar categorías
  const categorias = document.querySelectorAll('.category-section');
  
  categorias.forEach(cat => {
    const catId = cat.id.replace('categoria-', '');
    if (catId === categoria) {
      cat.classList.add('active');
    } else {
      cat.classList.remove('active');
    }
  });

  scrollToSection('tienda');
  cerrarMobileMenu();
  
  // Cerrar dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
  });
}

// ===== CARRITO =====
function agregarAlCarrito(nombre, precio) {
  const itemExistente = carrito.find(item => item.nombre === nombre);
  
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }
  
  actualizarCarrito();
  mostrarNotificacion('✓ Producto agregado al carrito');
}

function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  actualizarCarrito();
  mostrarNotificacion('Producto eliminado');
}

function cambiarCantidad(nombre, cambio) {
  const item = carrito.find(item => item.nombre === nombre);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(nombre);
    } else {
      actualizarCarrito();
    }
  }
}

function actualizarCarrito() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  // Actualizar contador
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  cartCount.textContent = totalItems;
  
  // Actualizar items
  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = carrito.map(item => {
      const stockDisponible = inventario[item.nombre]?.stock || 0;
      const stockWarning = item.cantidad >= stockDisponible ? 
        `<small style="color: #dc2626;">⚠️ Stock máximo alcanzado</small>` : 
        `<small style="color: #6b7280;">Stock disponible: ${stockDisponible}</small>`;
      
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.nombre}</div>
            <div class="cart-item-price">${item.precio}</div>
            ${stockWarning}
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="cambiarCantidad('${item.nombre}', -1)">−</button>
              <span>${item.cantidad}</span>
              <button class="qty-btn" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
            </div>
            <button class="remove-btn" onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Actualizar total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  cartTotal.textContent = `${total}`;
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.toggle('active');
}

function cerrarCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.remove('active');
}

// ===== CHECKOUT =====
function abrirCheckout() {
  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío');
    return;
  }
  
  cerrarCart();
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('active');
  pasoCheckout = 1;
  mostrarPasoCheckout(1);
  actualizarResumenCheckout();
}

function cerrarCheckout() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('active');
}

function siguientePaso(paso) {
  // Validar formulario si es paso 2
  if (pasoCheckout === 2 && paso === 3) {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  }
  
  pasoCheckout = paso;
  mostrarPasoCheckout(paso);
}

function mostrarPasoCheckout(paso) {
  // Actualizar steps
  document.querySelectorAll('.step').forEach((step, index) => {
    if (index < paso) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
  
  // Actualizar contenido
  document.querySelectorAll('.checkout-step').forEach(step => {
    step.classList.remove('active');
  });
  
  const stepActual = document.getElementById(`checkout-step-${paso}`);
  if (stepActual) {
    stepActual.classList.add('active');
  }
}

function actualizarResumenCheckout() {
  const orderSummary = document.getElementById('order-summary');
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const envio = 3;
  const total = subtotal + envio;
  
  orderSummary.innerHTML = carrito.map(item => `
    <div class="order-item">
      <span>${item.nombre} × ${item.cantidad}</span>
      <span>$${item.precio * item.cantidad}</span>
    </div>
  `).join('');
  
  document.getElementById('checkout-subtotal').textContent = `$${subtotal}`;
  document.getElementById('checkout-total').textContent = `$${total}`;
}

function seleccionarPago(element) {
  document.querySelectorAll('.payment-option').forEach(option => {
    option.classList.remove('active');
  });
  element.classList.add('active');
  
  const radio = element.querySelector('input[type="radio"]');
  if (radio) {
    radio.checked = true;
  }
}

async function completarPedido() {
  const metodoPago = document.querySelector('input[name="payment"]:checked');
  
  if (!metodoPago) {
    mostrarNotificacion('❌ Selecciona un método de pago');
    return;
  }
  
  // Validar que haya productos en el carrito
  if (carrito.length === 0) {
    mostrarNotificacion('❌ El carrito está vacío');
    return;
  }
  
  // Verificar stock de todos los productos antes de completar
  for (const item of carrito) {
    const stockDisponible = inventario[item.nombre]?.stock || 0;
    if (item.cantidad > stockDisponible) {
      mostrarNotificacion(`❌ Stock insuficiente para ${item.nombre}. Solo hay ${stockDisponible} unidades`);
      return;
    }
  }
  
  // Obtener datos del formulario - VALIDAR QUE EXISTAN
  const nombreInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const telefonoInput = document.getElementById('phone');
  const direccionInput = document.getElementById('address');
  const ciudadInput = document.getElementById('city');
  const codigoPostalInput = document.getElementById('zip');
  
  if (!nombreInput || !emailInput || !telefonoInput || !direccionInput || !ciudadInput) {
    mostrarNotificacion('❌ Error: Formulario no encontrado. Por favor completa el paso de envío primero');
    siguientePaso(2); // Volver al paso de envío
    return;
  }
  
  const nombreCliente = nombreInput.value.trim();
  const emailCliente = emailInput.value.trim();
  const telefonoCliente = telefonoInput.value.trim();
  const direccionCliente = direccionInput.value.trim();
  const ciudadCliente = ciudadInput.value.trim();
  const codigoPostalCliente = codigoPostalInput ? codigoPostalInput.value.trim() : '';
  
  if (!nombreCliente || !emailCliente || !telefonoCliente || !direccionCliente || !ciudadCliente) {
    mostrarNotificacion('❌ Por favor completa todos los campos requeridos (*)');
    siguientePaso(2); // Volver al paso de envío
    return;
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailCliente)) {
    mostrarNotificacion('❌ Por favor ingresa un email válido');
    siguientePaso(2);
    return;
  }
  
  const datosCliente = {
    nombre: nombreCliente,
    email: emailCliente,
    telefono: telefonoCliente,
    direccion: direccionCliente,
    ciudad: ciudadCliente,
    codigoPostal: codigoPostalCliente || 'No proporcionado'
  };
  
  const metodo = metodoPago.value === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
  
  try {
    // Registrar venta
    const venta = await registrarVenta(datosCliente, metodo);
    
    mostrarNotificacion('✓ ¡Pedido confirmado! ID: ' + venta.id);
    
    // Limpiar carrito
    carrito = [];
    actualizarCarrito();
    
    // Cerrar modal después de 2 segundos
    setTimeout(() => {
      cerrarCheckout();
      // Limpiar formulario
      const form = document.getElementById('shipping-form');
      if (form) form.reset();
    }, 2000);
    
  } catch (error) {
    console.error('Error al completar pedido:', error);
    mostrarNotificacion('❌ Error al procesar el pedido. Intenta nuevamente');
  }
}

// ===== NOTIFICACIONES =====
function mostrarNotificacion(mensaje) {
  const notification = document.getElementById('notification');
  notification.textContent = mensaje;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// ===== DEMO AR =====
function mostrarDemo() {
  mostrarNotificacion('Función de demo AR próximamente 🚀');
}

// ===== CERRAR MODALES AL HACER CLIC FUERA =====
document.addEventListener('click', (e) => {
  const cartPanel = document.getElementById('cart-panel');
  const cartBtn = document.getElementById('cart-btn');
  
  if (cartPanel && cartBtn) {
    if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target)) {
      cartPanel.classList.remove('active');
    }
  }
  
  const modal = document.getElementById('checkout-modal');
  if (modal && e.target === modal) {
    cerrarCheckout();
  }
});