// --- ANIMACIONES AL HACER SCROLL (REVEAL) ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

// Observa tarjetas y productos
const cards = document.querySelectorAll(".card, .item");
cards.forEach((card) => observer.observe(card));

// --- MENÚ SUAVE AL NAVEGAR ---
const links = document.querySelectorAll("a[href^='#']");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// --- CARRITO DE COMPRAS BÁSICO ---
let carrito = [];

function agregarAlCarrito(producto) {
  carrito.push(producto);
  alert(`Producto agregado: ${producto}`);
}

// Botones "Agregar al carrito"
const botones = document.querySelectorAll(".btn-add");

botones.forEach((btn) => {
  btn.addEventListener("click", () => {
    const producto = btn.getAttribute("data-producto");
    agregarAlCarrito(producto);
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
