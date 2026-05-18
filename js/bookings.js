const API_URL = 'http://localhost:3000';

const content = document.getElementById('content');
const CONFIRMED_STATUS = 'confirmed';

loadBookings();

function loadBookings() {
  fetch(`${API_URL}/bookings?status=${CONFIRMED_STATUS}`)
    .then((res) => res.json())
    .then((data) => {
      const bookings = normalizeBookings(data).filter((booking) => booking.status === CONFIRMED_STATUS);
      renderBookings(bookings);
    })
    .catch((err) => {
      console.error('Error loading bookings:', err);
      renderEmptyBookings();
    });
}

function renderEmptyBookings() {
  content.className = '';
  content.innerHTML = `
    <p class="empty-line">No booking yet.</p>
    <p class="empty-line">Why not plan a trip?</p>
  `;
}

function renderBookings(bookings) {
  if (!bookings.length) {
    renderEmptyBookings();
    return;
  }

  content.className = 'panel-card panel-card--filled panel-card--bookings';

  const listItems = bookings
    .map((booking) => {
      const trip = booking.trip || booking;
      const time = formatTripTime(
        pickFirstNonEmpty([trip.departureTime, trip.time, trip.hour, trip.date, trip.departureDate]),
      );
      const departureLabel = getDepartureLabel(trip);

      return `
        <li class="list-item booking-item-view">
          <span>${trip.departure} > ${trip.arrival}</span>
          <span>${time}</span>
          <span>${trip.price}€</span>
          <span>${departureLabel}</span>
        </li>
      `;
    })
    .join('');

  content.innerHTML = `
    <h1>My bookings</h1>
    <ul class="list bookings-list">${listItems}</ul>
    <hr class="bookings-separator" />
    <p class="bookings-signature">Enjoy your travels with Tickethack!</p>
  `;
}

function getDepartureLabel(trip) {
  const rawDate = pickFirstNonEmpty([trip.date, trip.departureDate]);
  if (!rawDate) return 'Departure soon';

  const departureDate = new Date(rawDate);
  if (Number.isNaN(departureDate.getTime())) return 'Departure soon';

  const hours = Math.max(0, Math.round((departureDate.getTime() - Date.now()) / 3600000));
  return `Departure in ${hours} hours`;
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
    status: booking.status || 'pending',
  }));
}
