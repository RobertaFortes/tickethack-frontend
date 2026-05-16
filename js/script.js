const searchButton = document.querySelector('#searchBtn'); // ou le sélecteur de ton bouton

searchButton.addEventListener('click', () => {
  const departure = document.querySelector('#departures').value;
  const arrival = document.querySelector('#arrivals').value;
  const date = document.querySelector('#dates').value;

  // Appel au backend
  fetch(`http://localhost:3000/trips?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}`)
    .then((res) => res.json())
    .then((data) => {
      displayTrips(data.trips);
    })
    .catch((err) => console.error('Fetch error:', err));
});

function displayTrips(trips) {
  const rightCard = document.querySelector('.card2');
  rightCard.innerHTML = '';
  rightCard.classList.add('card2--results');

  trips.forEach((trip) => {
    const div = document.createElement('div');
    div.classList.add('trip');
    div.innerHTML = `
      <span class="trip-route">${trip.departure} → ${trip.arrival}</span>
      <span class="trip-time">${trip.departureTime}</span>
      <span class="trip-price">${trip.price}€</span>
      <button class="button">Book</button>
    `;
    div.querySelector('button').addEventListener('click', () => addToCart(trip._id));
    rightCard.appendChild(div);
  });
}

function addToCart(tripId) {
  fetch('http://localhost:3000/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Booking confirmed:', data);
    })
    .catch((err) => console.error('Booking error:', err));
}
