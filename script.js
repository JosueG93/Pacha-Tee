// script.js - VERSIÓN ESTABLE Y FUNCIONAL

// ===== VARIABLES GLOBALES =====
let cart = [];
let btnMenu, mobileMenu, btnCarrito, cartPanel, btnCloseCart;
let checkoutModal, btnCheckout, btnCloseModal, btnFinish;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    updateCartCount();
    updateCartDisplay();
});

function initializeElements() {
    // Elementos del DOM
    btnMenu = document.getElementById('btn-menu');
    mobileMenu = document.getElementById('mobile-menu');
    btnCarrito = document.getElementById('btn-carrito');
    cartPanel = document.getElementById('cart-panel');
    btnCloseCart = document.getElementById('btn-close-cart');
    checkoutModal = document.getElementById('checkout-modal');
    btnCheckout = document.getElementById('btn-checkout');
    btnCloseModal = document.getElementById('btn-close-modal');
    btnFinish = document.getElementById('btn-finish');
}

function initializeEventListeners() {
    // Navegación suave
    document.querySelectorAll('a[data-target]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            scrollToSection(target);
            closeMobileMenu();
        });
    });

    // Submenús desktop
    initializeSubmenus();
    
    // Menú móvil
    if (btnMenu && mobileMenu) {
        btnMenu.addEventListener('click', toggleMobileMenu);
    }

    // Carrito
    if (btnCarrito && cartPanel) {
        btnCarrito.addEventListener('click', toggleCartPanel);
    }

    if (btnCloseCart && cartPanel) {
        btnCloseCart.addEventListener('click', closeCartPanel);
    }

    // Checkout
    if (btnCheckout && checkoutModal) {
        btnCheckout.addEventListener('click', openCheckoutModal);
    }

    if (btnCloseModal && checkoutModal) {
        btnCloseModal.addEventListener('click', closeCheckoutModal);
    }

    if (btnFinish && checkoutModal) {
        btnFinish.addEventListener('click', finishCheckout);
    }

    // Botones agregar al carrito
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.getAttribute('data-producto');
            const price = parseFloat(this.getAttribute('data-precio'));
            addToCart(productName, price);
        });
    });

    // Filtros de tienda
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            filtrarProductos(categoria);
        });
    });

    // Botones Quiénes Somos
    document.querySelectorAll('.qs-filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pagina = this.getAttribute('data-pagina');
            mostrarPaginaNosotros(pagina);
        });
    });

    // Navegación checkout
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

    // Métodos de pago
    document.querySelectorAll('.payment-option-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });

    // Completar pedido
    const btnCompleteOrder = document.getElementById('btn-complete-order');
    if (btnCompleteOrder) {
        btnCompleteOrder.addEventListener('click', completeOrder);
    }

    // Demo AR
    const btnDemo = document.getElementById('btn-demo');
    if (btnDemo) {
        btnDemo.addEventListener('click', function() {
            showCartNotification('Función de demo AR próximamente');
        });
    }

    // Cerrar modales con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', function() {
        closeAllDropdowns();
    });
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== SUBMENÚS DESKTOP =====
function initializeSubmenus() {
    const btnNosotros = document.getElementById('btn-nosotros');
    const dropdownNosotros = document.getElementById('dropdown-nosotros');
    const btnTienda = document.getElementById('btn-tienda');
    const dropdownTienda = document.getElementById('dropdown-tienda');

    if (btnNosotros && dropdownNosotros) {
        btnNosotros.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown(this, dropdownNosotros, dropdownTienda, btnTienda);
        });
    }

    if (btnTienda && dropdownTienda) {
        btnTienda.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown(this, dropdownTienda, dropdownNosotros, btnNosotros);
        });
    }

    // Prevenir cierre al hacer clic dentro de dropdowns
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
}

function toggleDropdown(button, dropdown, otherDropdown, otherButton) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Cerrar otros dropdowns
    if (otherDropdown && otherButton) {
        otherDropdown.hidden = true;
        otherButton.setAttribute('aria-expanded', 'false');
    }
    
    // Toggle este dropdown
    button.setAttribute('aria-expanded', !isExpanded);
    dropdown.hidden = isExpanded;
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.hidden = true;
    });
    document.querySelectorAll('.submenu button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
}

// ===== MENÚ MÓVIL =====
function toggleMobileMenu() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.hidden = isExpanded;
    
    // Animación hamburguesa - SIN CLASE ACTIVE PARA EVITAR CONFLICTOS
    const spans = this.querySelectorAll('span');
    if (!isExpanded) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    closeAllDropdowns();
}

function closeMobileMenu() {
    if (mobileMenu) mobileMenu.hidden = true;
    if (btnMenu) {
        btnMenu.setAttribute('aria-expanded', 'false');
        const spans = btnMenu.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ===== FUNCIONES ESPECÍFICAS =====
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
    
    scrollToSection('quienes-somos');
    closeMobileMenu();
    closeAllDropdowns();
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
    
    scrollToSection('tienda');
    closeMobileMenu();
    closeAllDropdowns();
}

// ===== CARRITO DE COMPRAS =====
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

function toggleCartPanel(e) {
    e.stopPropagation();
    cartPanel.hidden = !cartPanel.hidden;
}

function closeCartPanel() {
    cartPanel.hidden = true;
}

// ===== CHECKOUT =====
function openCheckoutModal() {
    if (cart.length === 0) {
        closeCartPanel();  // Cerrar el carrito primero
        showCartNotification('El carrito está vacío');
        return;
    }
    
    checkoutModal.hidden = false;
    updateOrderSummary();
    goToStep(1);
}

function closeCheckoutModal() {
    checkoutModal.hidden = true;
}

function finishCheckout() {
    checkoutModal.hidden = true;
    if (cartPanel) cartPanel.hidden = true;
    reiniciarCarrito();
}

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
    
    const paidAmount = document.getElementById('paid-amount');
    if (paidAmount) {
        paidAmount.textContent = `$${total}`;
    }
}

function selectPaymentMethod(card) {
    document.querySelectorAll('.payment-option-card').forEach(c => {
        c.classList.remove('active');
    });
    card.classList.add('active');
    
    const method = card.getAttribute('data-method');
    const radio = document.querySelector(`#${method}-method`);
    if (radio) {
        radio.checked = true;
    }
}

function completeOrder() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedMethod) return;
    
    const paymentMethodUsed = document.getElementById('payment-method-used');
    if (paymentMethodUsed) {
        paymentMethodUsed.textContent = 
            selectedMethod.value === 'transfer' ? 'Transferencia Bancaria' : 'PayPal';
    }
    
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
    reiniciarCarrito();
}

function reiniciarCarrito() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    showCartNotification('¡Pedido completado! El carrito ha sido reiniciado.');
}

// ===== UTILIDADES =====
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;  /* Un poco más abajo para que no se superponga con el navbar */
        right: 20px;
        background: var(--verde);
        color: var(--crema);
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1003;  /* Mayor que el carrito (1002) y checkout (1004) */
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function closeAllModals() {
    if (checkoutModal) checkoutModal.hidden = true;
    if (cartPanel) cartPanel.hidden = true;
    closeMobileMenu();
    closeAllDropdowns();
}

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function(e) {
    if (cartPanel && btnCarrito) {
        if (!cartPanel.contains(e.target) && !btnCarrito.contains(e.target)) {
            cartPanel.hidden = true;
        }
    }
});
