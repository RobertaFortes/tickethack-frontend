const API_URL = 'http://localhost:3000';

const content = document.getElementById('content');
const CART_STATUS = 'pending';
const CONFIRMED_STATUS = 'confirmed';

loadCart();

function loadCart() {
  fetch(`${API_URL}/bookings?status=${CART_STATUS}`)
    .then((res) => res.json())
    .then((data) => {
      const cartItems = normalizeBookings(data).filter((booking) => booking.status === CART_STATUS);
      renderCart(cartItems);
    })
    .catch((err) => {
      console.error('Error loading cart:', err);
      renderEmptyCart();
    });
}

function renderEmptyCart() {
  content.className = '';
  content.innerHTML = `
    <p class="empty-line">No tickets in your cart.</p>
    <p class="empty-line">Why not plan a trip?</p>
  `;
}

function renderCart(cartItems) {
  if (!cartItems.length) {
    renderEmptyCart();
    return;
  }

  content.className = 'panel-card panel-card--filled panel-card--cart';

  const total = cartItems.reduce((sum, item) => {
    const trip = item.trip || item;
    return sum + Number(trip.price || 0);
  }, 0);

  const listItems = cartItems
    .map((item) => {
      const trip = item.trip || item;
      const time = formatTripTime(
        pickFirstNonEmpty([trip.departureTime, trip.time, trip.hour, trip.date, trip.departureDate]),
      );

      return `
        <li class="list-item cart-item" data-id="${item._id}">
          <span>${trip.departure} > ${trip.arrival}</span>
          <span>${time}</span>
          <span>${trip.price}€</span>
          <button class="button btn-delete" data-id="${item._id}">X</button>
        </li>
      `;
    })
    .join('');

  content.innerHTML = `
    <h1>My cart</h1>
    <ul class="list cart-list">${listItems}</ul>
    <div class="cart-footer">
      <p>Total : ${total}€</p>
      <button id="purchaseBtn" class="button purchase-btn">Purchase</button>
    </div>
  `;

  document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', () => {
      deleteCartItem(button.dataset.id);
    });
  });

  document.getElementById('purchaseBtn').addEventListener('click', () => {
    purchaseCart(cartItems);
  });
}

function deleteCartItem(cartId) {
  fetch(`${API_URL}/bookings/${cartId}`, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete cart item');
      loadCart();
    })
    .catch((err) => console.error('Delete error:', err));
}

function purchaseCart(cartItems) {
  const requests = cartItems.map((item) =>
    fetch(`${API_URL}/bookings/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: CONFIRMED_STATUS }),
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to purchase item');
      return res.json();
    }),
  );

  Promise.all(requests)
    .then(() => {
      window.location.href = 'bookings.html';
    })
    .catch((err) => {
      console.error('Purchase error:', err);
    });
}

function formatTripTime(rawTime) {
  if (!rawTime) return '--:--';

  const hhmmss = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(rawTime);
  if (hhmmss) return `${hhmmss[1]}:${hhmmss[2]}`;

  const isoDateTime = /T(\d{2}):(\d{2})/.exec(rawTime);
  if (isoDateTime) return `${isoDateTime[1]}:${isoDateTime[2]}`;

  const parsedDate = new Date(rawTime);
  if (Number.isNaN(parsedDate.getTime())) return rawTime;

  return parsedDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function pickFirstNonEmpty(values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');
}

function normalizeBookings(data) {
  const bookings = data.bookings || data.items || data || [];

  return bookings.map((booking) => ({
    ...booking,
    status: booking.status || CART_STATUS,
  }));
}
