// script.js

// ===== NAVEGACIÓN Y MENÚ =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navegación por enlaces
document.querySelectorAll('a[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('data-target');
        scrollToSection(target);
    });
});

// Menú móvil
const btnMenu = document.getElementById('btn-menu');
const mobileMenu = document.getElementById('mobile-menu');

btnMenu.addEventListener('click', () => {
    const isExpanded = btnMenu.getAttribute('aria-expanded') === 'true';
    btnMenu.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.hidden = isExpanded;
    
    // Animación hamburguesa
    btnMenu.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.hidden = true;
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.classList.remove('active');
    });
});

// Submenús desktop
document.querySelectorAll('.submenu').forEach(submenu => {
    const button = submenu.querySelector('button');
    const dropdown = submenu.querySelector('.dropdown');
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        dropdown.hidden = isExpanded;
    });
});

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.hidden = true;
    });
    document.querySelectorAll('.submenu button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
});

// ===== CARRITO DE COMPRAS =====
let cart = [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
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

btnCarrito.addEventListener('click', () => {
    cartPanel.hidden = false;
});

btnCloseCart.addEventListener('click', () => {
    cartPanel.hidden = true;
});

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target) && !btnCarrito.contains(e.target)) {
        cartPanel.hidden = true;
    }
});

// ===== BOTONES AGREGAR AL CARRITO =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productName = button.getAttribute('data-producto');
            const price = parseFloat(button.getAttribute('data-precio'));
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

// ===== FILTROS DE TIENDA =====
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
}

// Inicializar filtros
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const categoria = btn.getAttribute('data-categoria');
        filtrarProductos(categoria);
    });
});

// ===== QUIÉNES SOMOS - PÁGINAS =====
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
}

// Inicializar botones de Quiénes Somos
document.querySelectorAll('.qs-filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pagina = btn.getAttribute('data-pagina');
        mostrarPaginaNosotros(pagina);
    });
});

// ===== CHECKOUT MODAL =====
const checkoutModal = document.getElementById('checkout-modal');
const btnCheckout = document.getElementById('btn-checkout');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnFinish = document.getElementById('btn-finish');

btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
        showCartNotification('El carrito está vacío');
        return;
    }
    
    checkoutModal.hidden = false;
    updateOrderSummary();
});

btnCloseModal.addEventListener('click', () => {
    checkoutModal.hidden = true;
});

btnFinish.addEventListener('click', () => {
    checkoutModal.hidden = true;
    cartPanel.hidden = true;
});

// Navegación entre pasos del checkout
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
        const nextStep = btn.getAttribute('data-next');
        goToStep(nextStep);
    });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
        const prevStep = btn.getAttribute('data-prev');
        goToStep(prevStep);
    });
});

function goToStep(stepNumber) {
    // Ocultar todos los pasos
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar paso actual
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
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
    document.getElementById('paid-amount').textContent = `$${total}`;
}

// Métodos de pago
document.querySelectorAll('.payment-option-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.payment-option-card').forEach(c => {
            c.classList.remove('active');
        });
        card.classList.add('active');
        
        const method = card.getAttribute('data-method');
        document.querySelector(`#${method}-method`).checked = true;
    });
});

// Completar pedido
document.getElementById('btn-complete-order').addEventListener('click', () => {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Actualizar información en el paso de confirmación
    document.getElementById('payment-method-used').textContent = 
        selectedMethod === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
    
    // Mostrar instrucciones según el método de pago
    const instructions = document.getElementById('confirmation-instructions');
    if (selectedMethod === 'transfer') {
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
    
    goToStep(4);
});

// ===== DEMO AR =====
document.getElementById('btn-demo').addEventListener('click', () => {
    showCartNotification('Función de demo AR próximamente');
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    
    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            checkoutModal.hidden = true;
            cartPanel.hidden = true;
            mobileMenu.hidden = true;
            btnMenu.setAttribute('aria-expanded', 'false');
            btnMenu.classList.remove('active');
        }
    });
});
