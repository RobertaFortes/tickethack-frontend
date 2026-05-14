const searchButton = document.querySelector('#searchBtn'); // ou le sélecteur de ton bouton

searchButton.addEventListener('click', () => {
  const departure = document.querySelector('#departures').value;
  const arrival = document.querySelector('#arrivals').value;
  const date = document.querySelector('#dates').value;

  // Appel au backend
  fetch(`http://localhost:3000/trips?${departure}&${arrival}&${date}`)
    .then((res) => res.json())
    .then((data) => {
      displayTrips(data.trips); // on affiche les résultats dans la card de droite
    });
});

function displayTrips(trips) {
  const rightCard = document.querySelector('.card2'); // ta card de droite

  // On vide le contenu par défaut (le train + "It's time to book...")
  rightCard.innerHTML = '';

  trips.forEach((trip) => {
    rightCard.innerHTML += `
      <div class="trip">
        <p>${trip.from} → ${trip.to}</p>
        <p>${trip.date}</p>
        <p>${trip.price}€</p>
        <button onclick="addToCart('${trip._id}')">Add to cart</button>
      </div>
    `;
  });
}
