const API_URL = 'http://localhost:3000';
const searchButton = document.querySelector('#searchBtn');

if (searchButton) {
  searchButton.addEventListener('click', () => {
    const departure = document.querySelector('#departures').value;
    const arrival = document.querySelector('#arrivals').value;
    const date = document.querySelector('#dates').value;

    fetch(
      `${API_URL}/trips?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        displayTrips(data.trips || []);
      })
      .catch((err) => console.error('Fetch error:', err));
  });
}

function displayTrips(trips) {
  const rightCard = document.querySelector('.card2');
  rightCard.innerHTML = '';
  rightCard.classList.add('card2--results');

  if (!trips.length) {
    rightCard.classList.remove('card2--results');
    rightCard.innerHTML = `
      <img src="images/notfound.png" alt="No trips found" />
      <hr />
      <p>No trip found.</p>
    `;
    return;
  }

  trips.forEach((trip) => {
    const rawTime = pickFirstNonEmpty([
      trip.departureTime,
      trip.time,
      trip.hour,
      trip.date,
      trip.departureDate,
    ]);
    const formattedTime = formatTripTime(rawTime);

    const div = document.createElement('div');
    div.classList.add('trip');
    div.innerHTML = `
      <span class="trip-route">${trip.departure} → ${trip.arrival}</span>
      <span class="trip-time">${formattedTime}</span>
      <span class="trip-price">${trip.price}€</span>
      <button class="button">Book</button>
    `;
    div.querySelector('button').addEventListener('click', () => addToCart(trip._id));
    rightCard.appendChild(div);
  });
}

function formatTripTime(rawTime) {
  if (!rawTime) return '--:--';

  const hhmmss = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(rawTime);
  if (hhmmss) {
    return `${hhmmss[1]}:${hhmmss[2]}`;
  }

  const isoDateTime = /T(\d{2}):(\d{2})/.exec(rawTime);
  if (isoDateTime) {
    return `${isoDateTime[1]}:${isoDateTime[2]}`;
  }

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

function addToCart(tripId) {
  fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId, status: 'pending' }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to add trip to cart');
      return res.json();
    })
    .then(() => {
      window.location.href = 'cart.html';
    })
    .catch((err) => {
      console.error('Booking error:', err);
    });
}
