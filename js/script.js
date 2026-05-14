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
  const rightCard = document.querySelector('.card2'); // ta card de droite

  // On vide le contenu par défaut (le train + "It's time to book...")
  rightCard.innerHTML = '';

  trips.forEach((trip) => {
    rightCard.innerHTML += `
      <div class="trip">
        <p>${trip.departure} → ${trip.arrival}</p>
        <p>${trip.date}</p>
        <p>${trip.price}€</p>
        <button onclick="addToCart('${trip._id}')">Add to cart</button>
      </div>
    `;
  });
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
}
