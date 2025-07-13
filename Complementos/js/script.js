window.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
actualizarContador();

function renderizarProductos(productos) {
  const contenedor = document.querySelector('.productos-container');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('producto-card');
    card.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <h3>${producto.title}</h3>
      <p>$${producto.price}</p>
      <button data-id="${producto.id}">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  if (contador) {
    const totalItems = (window.carrito || []).reduce((acc, item) => acc + item.cantidad, 0);
    contador.textContent = `(${totalItems})`;
  }
}

fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    renderizarProductos(data);
  })
  .catch(error => {
    console.error('Error al cargar los productos:', error);
  });

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
    const id = parseInt(e.target.dataset.id);
    agregarAlCarrito(id);
  }
});

function agregarAlCarrito(id) {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(productos => {
      const producto = productos.find(p => p.id === id);
      const existe = window.carrito.find(item => item.id === id);
      if (existe) {
        existe.cantidad += 1;
      } else {
        window.carrito.push({ ...producto, cantidad: 1 });
      }
      localStorage.setItem('carrito', JSON.stringify(window.carrito));
      actualizarContador();
      alert(`✅ ${producto.title} agregado al carrito`);
    });
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('nav ul');
  const icon = hamburger?.querySelector('i');

  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      navUl.classList.toggle('show');
      if (navUl.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = this.nombre.value.trim();
      const email = this.email.value.trim();
      const mensaje = this.mensaje.value.trim();

      const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

      let errorDiv = document.getElementById('form-error');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '1rem';
        this.appendChild(errorDiv);
      }
      errorDiv.textContent = '';

      if (nombre === '') {
        errorDiv.textContent = 'Por favor, ingresa tu nombre y apellido.';
        return;
      }

      if (!emailRegex.test(email)) {
        errorDiv.textContent = 'Por favor, ingresa un correo válido.';
        return;
      }

      if (mensaje === '') {
        errorDiv.textContent = 'Por favor, ingresa un mensaje.';
        return;
      }

      errorDiv.style.color = 'green';
      errorDiv.textContent = 'Enviando...';
      this.submit();
    });
  }
});
