// script.js - VERSIÓN CORREGIDA PARA ESCRITORIO

// ===== NAVEGACIÓN Y MENÚ ESCRITORIO =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navegación por enlaces principales
document.querySelectorAll('a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('data-target');
        scrollToSection(target);
        
        // Cerrar menú móvil si está abierto
        mobileMenu.hidden = true;
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.classList.remove('active');
    });
});

// ===== SUBMENÚS ESCRITORIO - MEJORADO =====
document.addEventListener('DOMContentLoaded', function() {
    // Submenú Nosotros
    const btnNosotros = document.getElementById('btn-nosotros');
    const dropdownNosotros = document.getElementById('dropdown-nosotros');
    
    // Submenú Tienda
    const btnTienda = document.getElementById('btn-tienda');
    const dropdownTienda = document.getElementById('dropdown-tienda');
    
    // Función para cerrar todos los dropdowns
    function cerrarTodosLosDropdowns() {
        if (dropdownNosotros) {
            dropdownNosotros.hidden = true;
            btnNosotros.setAttribute('aria-expanded', 'false');
        }
        if (dropdownTienda) {
            dropdownTienda.hidden = true;
            btnTienda.setAttribute('aria-expanded', 'false');
        }
    }
    
    if (btnNosotros && dropdownNosotros) {
        btnNosotros.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Cerrar otros dropdowns primero
            if (dropdownTienda) {
                dropdownTienda.hidden = true;
                btnTienda.setAttribute('aria-expanded', 'false');
            }
            
            // Toggle este dropdown
            this.setAttribute('aria-expanded', !isExpanded);
            dropdownNosotros.hidden = isExpanded;
        });
    }
    
    if (btnTienda && dropdownTienda) {
        btnTienda.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Cerrar otros dropdowns primero
            if (dropdownNosotros) {
                dropdownNosotros.hidden = true;
                btnNosotros.setAttribute('aria-expanded', 'false');
            }
            
            // Toggle este dropdown
            this.setAttribute('aria-expanded', !isExpanded);
            dropdownTienda.hidden = isExpanded;
        });
    }
    
    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', function() {
        cerrarTodosLosDropdowns();
    });
    
    // Prevenir que los dropdowns se cierren al hacer clic dentro
    if (dropdownNosotros) {
        dropdownNosotros.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (dropdownTienda) {
        dropdownTienda.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// ===== REINICIAR CARRITO AL FINALIZAR COMPRA =====
function reiniciarCarrito() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    
    // Mostrar notificación
    showCartNotification('¡Pedido completado! El carrito ha sido reiniciado.');
}

// Modificar el evento del botón finalizar
const btnFinish = document.getElementById('btn-finish');
if (btnFinish) {
    btnFinish.addEventListener('click', function() {
        checkoutModal.hidden = true;
        if (cartPanel) cartPanel.hidden = true;
        reiniciarCarrito(); // ← Aquí se reinicia el carrito
    });
}

// También reiniciar cuando se completa el pedido en el paso 4
const btnCompleteOrder = document.getElementById('btn-complete-order');
if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener('click', function() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) return;
        
        // Actualizar información en el paso de confirmación
        const paymentMethodUsed = document.getElementById('payment-method-used');
        if (paymentMethodUsed) {
            paymentMethodUsed.textContent = 
                selectedMethod.value === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
        }
        
        // Mostrar instrucciones según el método de pago
        const instructions = document.getElementById('confirmation-instructions');
        if (instructions) {
            if (selectedMethod.value === 'transfer') {
                instructions.innerHTML = `
                    <p><strong>Instrucciones:</strong></p>
                    <p>1. Realiza la transferencia a la cuenta proporcionada</p>
                    <p>2. Envía el comprobante por WhatsApp</p>
                    <p>3. Tu pedido será procesado una vez confirmado el pago</p>
                `;
            } else {
                instructions.innerHTML = `
                    <p><strong>Instrucciones:</strong></p>
                    <p>Tu pedido será procesado una vez confirmado el pago a través de PayPal</p>
                `;
            }
        }
        
        goToStep(4);
        
        // Reiniciar carrito automáticamente cuando llega al paso 4
        reiniciarCarrito();
    });
}

// ===== MENÚ MÓVIL =====
const btnMenu = document.getElementById('btn-menu');
const mobileMenu = document.getElementById('mobile-menu');

if (btnMenu && mobileMenu) {
    btnMenu.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.hidden = isExpanded;
        
        // Animación hamburguesa
        this.classList.toggle('active');
        
        // Cerrar dropdowns de escritorio al abrir menú móvil
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.hidden = true;
        });
        document.querySelectorAll('.submenu button').forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });
    });
}

// Cerrar menú móvil al hacer clic en enlaces
document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-link').forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.hidden = true;
        if (btnMenu) {
            btnMenu.setAttribute('aria-expanded', 'false');
            btnMenu.classList.remove('active');
        }
    });
});

// ===== FUNCIONES DE NAVEGACIÓN ESPECÍFICAS =====
function mostrarPaginaNosotros(pagina) {
    const botones = document.querySelectorAll('.qs-filtro-btn');
    const paginas = document.querySelectorAll('.qs-pagina');
    
    // Actualizar botones activos
    botones.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-pagina') === pagina) {
            btn.classList.add('active');
        }
    });
    
    // Mostrar página correspondiente
    paginas.forEach(pag => {
        pag.classList.remove('active');
        if (pag.id === `qs-${pagina}`) {
            pag.classList.add('active');
        }
    });
    
    // Scroll a la sección
    scrollToSection('quienes-somos');
    
    // Cerrar menús
    mobileMenu.hidden = true;
    if (btnMenu) {
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.classList.remove('active');
    }
    
    // Cerrar dropdowns desktop
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.hidden = true;
    });
    document.querySelectorAll('.submenu button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
}

function filtrarProductos(categoria) {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const categorias = document.querySelectorAll('.categoria-productos');
    
    // Actualizar botones activos
    filtroBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-categoria') === categoria) {
            btn.classList.add('active');
        }
    });
    
    // Mostrar/ocultar categorías
    categorias.forEach(cat => {
        if (categoria === 'todos') {
            cat.classList.add('active');
        } else {
            const catId = cat.id.replace('categoria-', '');
            if (catId === categoria) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        }
    });
    
    // Scroll a la tienda
    scrollToSection('tienda');
    
    // Cerrar menús
    mobileMenu.hidden = true;
    if (btnMenu) {
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.classList.remove('active');
    }
    
    // Cerrar dropdowns desktop
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.hidden = true;
    });
    document.querySelectorAll('.submenu button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
}

// ===== CARRITO DE COMPRAS =====
let cart = [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartDisplay();
    showCartNotification('Producto agregado al carrito');
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItems || !cartTotalPrice) return;
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-total">$${itemTotal}</span>
                <button class="btn-remove" onclick="removeFromCart('${item.name}')" aria-label="Eliminar producto">
                    ×
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `$${total}`;
}

// Panel del carrito
const btnCarrito = document.getElementById('btn-carrito');
const cartPanel = document.getElementById('cart-panel');
const btnCloseCart = document.getElementById('btn-close-cart');

if (btnCarrito && cartPanel) {
    btnCarrito.addEventListener('click', function(e) {
        e.stopPropagation();
        cartPanel.hidden = !cartPanel.hidden;
    });
}

if (btnCloseCart && cartPanel) {
    btnCloseCart.addEventListener('click', function() {
        cartPanel.hidden = true;
    });
}

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function(e) {
    if (cartPanel && btnCarrito) {
        if (!cartPanel.contains(e.target) && !btnCarrito.contains(e.target)) {
            cartPanel.hidden = true;
        }
    }
});

// ===== BOTONES AGREGAR AL CARRITO =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.getAttribute('data-producto');
            const price = parseFloat(this.getAttribute('data-precio'));
            addToCart(productName, price);
        });
    });
});

// Notificación de carrito
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== INICIALIZACIÓN BOTONES QUIÉNES SOMOS =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.qs-filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pagina = this.getAttribute('data-pagina');
            mostrarPaginaNosotros(pagina);
        });
    });
    
    // Inicializar filtros de tienda
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            filtrarProductos(categoria);
        });
    });
});

// ===== CHECKOUT MODAL =====
const checkoutModal = document.getElementById('checkout-modal');
const btnCheckout = document.getElementById('btn-checkout');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnFinish = document.getElementById('btn-finish');

if (btnCheckout && checkoutModal) {
    btnCheckout.addEventListener('click', function() {
        if (cart.length === 0) {
            showCartNotification('El carrito está vacío');
            return;
        }
        
        checkoutModal.hidden = false;
        updateOrderSummary();
        goToStep(1);
    });
}

if (btnCloseModal && checkoutModal) {
    btnCloseModal.addEventListener('click', function() {
        checkoutModal.hidden = true;
    });
}

if (btnFinish && checkoutModal) {
    btnFinish.addEventListener('click', function() {
        checkoutModal.hidden = true;
        if (cartPanel) cartPanel.hidden = true;
    });
}

// Navegación entre pasos del checkout
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', function() {
        const nextStep = this.getAttribute('data-next');
        goToStep(nextStep);
    });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', function() {
        const prevStep = this.getAttribute('data-prev');
        goToStep(prevStep);
    });
});

function goToStep(stepNumber) {
    // Ocultar todos los pasos
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar paso actual
    const currentStep = document.getElementById(`step-${stepNumber}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    // Actualizar indicadores de progreso
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) <= stepNumber) {
            step.classList.add('active');
        }
    });
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const subtotalPrice = document.getElementById('subtotal-price');
    const finalTotalPrice = document.getElementById('final-total-price');
    
    if (!orderSummary || !subtotalPrice || !finalTotalPrice) return;
    
    orderSummary.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal}</span>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    const shipping = 3;
    const total = subtotal + shipping;
    
    subtotalPrice.textContent = `$${subtotal}`;
    finalTotalPrice.textContent = `$${total}`;
    
    // Actualizar también en el paso de confirmación
    const paidAmount = document.getElementById('paid-amount');
    if (paidAmount) {
        paidAmount.textContent = `$${total}`;
    }
}

// Métodos de pago
document.querySelectorAll('.payment-option-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.payment-option-card').forEach(c => {
            c.classList.remove('active');
        });
        this.classList.add('active');
        
        const method = this.getAttribute('data-method');
        const radio = document.querySelector(`#${method}-method`);
        if (radio) {
            radio.checked = true;
        }
    });
});

// Completar pedido
const btnCompleteOrder = document.getElementById('btn-complete-order');
if (btnCompleteOrder) {
    btnCompleteOrder.addEventListener('click', function() {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) return;
        
        // Actualizar información en el paso de confirmación
        const paymentMethodUsed = document.getElementById('payment-method-used');
        if (paymentMethodUsed) {
            paymentMethodUsed.textContent = 
                selectedMethod.value === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
        }
        
        // Mostrar instrucciones según el método de pago
        const instructions = document.getElementById('confirmation-instructions');
        if (instructions) {
            if (selectedMethod.value === 'transfer') {
                instructions.innerHTML = `
                    <p><strong>Instrucciones:</strong></p>
                    <p>1. Realiza la transferencia a la cuenta proporcionada</p>
                    <p>2. Envía el comprobante por WhatsApp</p>
                    <p>3. Tu pedido será procesado una vez confirmado el pago</p>
                `;
            } else {
                instructions.innerHTML = `
                    <p><strong>Instrucciones:</strong></p>
                    <p>Tu pedido será procesado una vez confirmado el pago a través de PayPal</p>
                `;
            }
        }
        
        goToStep(4);
    });
}

// ===== DEMO AR =====
const btnDemo = document.getElementById('btn-demo');
if (btnDemo) {
    btnDemo.addEventListener('click', function() {
        showCartNotification('Función de demo AR próximamente');
    });
}

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartDisplay();
    
    // Cerrar modales con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (checkoutModal) checkoutModal.hidden = true;
            if (cartPanel) cartPanel.hidden = true;
            if (mobileMenu) mobileMenu.hidden = true;
            if (btnMenu) {
                btnMenu.setAttribute('aria-expanded', 'false');
                btnMenu.classList.remove('active');
            }
        }
    });
});
