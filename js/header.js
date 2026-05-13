(function () {
  const template = `
    <nav class="header-nav">
      <a href="index.html" class="header-logo">Tickethack</a>
      <ul class="header-links">
        <li><a href="cart.html">Cart</a></li>
        <li><a href="bookings.html">Bookings</a></li>
      </ul>
    </nav>
  `;

  function mountHeader() {
    const el = document.getElementById('header');
    if (el) el.innerHTML = template;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHeader);
  } else {
    mountHeader();
  }
})();
