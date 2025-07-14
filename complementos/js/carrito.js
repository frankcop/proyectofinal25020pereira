let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const tbody = document.getElementById('carrito-items');
const totalGeneral = document.getElementById('total-general');

renderCarrito();

function renderCarrito() {
  tbody.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5">🛒 El carrito está vacío</td>`;
    tbody.appendChild(tr);
  }

  carrito.forEach(item => {
    const tr = document.createElement('tr');
    const subtotal = item.price * item.cantidad;
    total += subtotal;

    tr.innerHTML = `
      <td style="display: flex; align-items: center; gap: 0.5rem;">
        <img src="${item.image}" alt="${item.title}" style="width:40px; height:auto;"> 
        ${item.title}
      </td>
      <td>
        <button onclick="cambiarCantidad(${item.id}, -1)">➖</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${item.id}, 1)">➕</button>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td>
        <button onclick="eliminar(${item.id})">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalGeneral.textContent = `$${total.toFixed(2)}`;
  sincronizarYActualizarContador();
}

function cambiarCantidad(id, delta) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  if (item.cantidad + delta <= 0) {
    if (confirm(`¿Deseas eliminar "${item.title}" del carrito?`)) {
      carrito = carrito.filter(p => p.id !== id);
    }
  } else {
    item.cantidad += delta;
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
}

function eliminar(id) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  if (confirm(`¿Deseas eliminar "${item.title}" del carrito?`)) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
  }
}

const btnFinalizar = document.getElementById('finalizar-compra');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito ya está vacío.');
      return;
    }
    if (confirm('¿Confirmas tu compra?')) {
      carrito = [];
      localStorage.removeItem('carrito');
      renderCarrito();
      alert('✅ ¡Gracias por tu compra!');
    }
  });
}

// 🔄 sincroniza con window.carrito y actualiza el contador
function sincronizarYActualizarContador() {
  window.carrito = carrito;
  if (typeof actualizarContador === 'function') {
    actualizarContador();
  }
}
