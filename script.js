// Simple progressive site (no frameworks). Handles:
// - Mobile menu toggle
// - Smooth scrolling when clicking nav links
// - Reveal on scroll for sections (Misión/Visión/Objetivos)
// - Small in-memory cart (localStorage persistence)

const q = sel => document.querySelector(sel);
const qa = sel => Array.from(document.querySelectorAll(sel));

// Mobile menu
const btnMenu = q('#btn-menu');
const mobileMenu = q('#mobile-menu');
if(btnMenu && mobileMenu){
  btnMenu.addEventListener('click', () => {
    const open = mobileMenu.hasAttribute('hidden') ? true : false;
    if(open) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden','');
  });
}

// Smooth scroll for all links with data-target
document.querySelectorAll('[data-target]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const t = a.getAttribute('data-target');
    const el = document.getElementById(t);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    // Close mobile menu if open
    if(mobileMenu && !mobileMenu.hasAttribute('hidden')) mobileMenu.setAttribute('hidden','');
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('visible');
  });
},{threshold:0.2});
revealEls.forEach(el=>revealObserver.observe(el));

// Demo products (replace with your images if available)
const products = [
  {id:1,name:'Camiseta Ecológica AR',price:13,cat:'Camisetas'},
  {id:2,name:'Tote Bag Natural',price:5,cat:'Tote Bags'},
  {id:3,name:'Camiseta Selva Digital',price:13,cat:'Camisetas'},
  {id:4,name:'Tote Bag Urbano',price:5,cat:'Tote Bags'},
  {id:5,name:'Camiseta Océano AR',price:13,cat:'Camisetas'}
];

const featuredList = q('#featured-list');
const productGrid = q('#product-grid');

function renderFeatured(){
  if(!featuredList) return;
  featuredList.innerHTML = '';
  products.filter(p=>p.id===1||p.id===5).forEach(p=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="left"><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#20432a">Imagen</div></div>
      <div class="right">
        <h3>${p.name}</h3>
        <p class="muted">Precio: $${p.price}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
          <span class="tag">${p.cat}</span>
          <button class="btn btn-primary" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    featuredList.appendChild(el);
  });
}

function renderProducts(){
  if(!productGrid) return;
  productGrid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="media">${p.name}</div>
      <div class="body">
        <div>
          <h4 style="color:var(--verde)">${p.name}</h4>
          <p class="muted">${p.cat}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="muted">$${p.price}</div>
          <button class="btn btn-primary" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// CART (simple localStorage)
let cart = JSON.parse(localStorage.getItem('pacha_cart') || '[]');
const cartCount = q('#cart-count');
const cartPanel = q('#cart-panel');
const cartBody = q('#cart-body');
const cartTotal = q('#cart-total');

function updateCartUI(){
  const totalQty = cart.reduce((s,i)=>s+i.quantity,0);
  if(cartCount) {
    if(totalQty>0){ cartCount.textContent = totalQty; cartCount.hidden=false; }
    else cartCount.hidden=true;
  }
  if(cartBody){
    cartBody.innerHTML = '';
    if(cart.length===0){
      cartBody.innerHTML = `<p class="muted center">Tu carrito está vacío</p>`;
    } else {
      cart.forEach(item=>{
        const row = document.createElement('div');
        row.style.display='flex';
        row.style.justifyContent='space-between';
        row.style.alignItems='center';
        row.style.padding='8px 0';
        row.innerHTML = `<div>${item.name} x ${item.quantity}</div><div>$${(item.price*item.quantity).toFixed(2)}</div>`;
        cartBody.appendChild(row);
      });
    }
  }
  if(cartTotal) cartTotal.textContent = `$${cart.reduce((s,i)=>s+i.price*i.quantity,0).toFixed(2)}`;
  localStorage.setItem('pacha_cart', JSON.stringify(cart));
}

document.addEventListener('click', (e)=>{
  const add = e.target.closest('[data-add]');
  if(add){
    const id = Number(add.getAttribute('data-add'));
    const prod = products.find(p=>p.id===id);
    if(!prod) return;
    const found = cart.find(c=>c.id===id);
    if(found) found.quantity+=1; else cart.push({ ...prod, quantity: 1 });
    updateCartUI();
    alert('Producto agregado al carrito');
  }
});

// Cart open/close
q('#btn-cart')?.addEventListener('click', ()=> {
  if(cartPanel.hasAttribute('hidden')) cartPanel.removeAttribute('hidden');
  else cartPanel.setAttribute('hidden','');
});
q('#cart-close')?.addEventListener('click', ()=> cartPanel.setAttribute('hidden',''));

// Checkout (demo)
q('#checkout')?.addEventListener('click', ()=> alert('Simulación de pago — integra Stripe o PayPal en producción.'));

// initialize UI
renderFeatured();
renderProducts();
updateCartUI();

// small helper for header scroll active class
function scrollToSection(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'}); }
