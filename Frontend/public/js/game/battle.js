/* Author: Valery Escobar
 * Date: 12/04/2025
 */
const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");

// Sidebar
sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
  sidebarToggleBtn.style.display = "none";
});
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
  sidebarToggleBtn.style.display = "block";
});


window.onload = () => {
  // Mostrar nombre del usuario en sidebar
  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil("sidebarImage");

  const jugador1 = JSON.parse(localStorage.getItem('jugador1_cartas')) || [];
  const jugador2 = JSON.parse(localStorage.getItem('jugador2_cartas')) || [];

  renderBattleCards(jugador1, "player1-container");
  renderBattleCards(jugador2, "player2-container");

  document.getElementById("startBattleBtn").onclick = () => {
    startBattle(jugador1, jugador2);
  };
};

function mostrarNombreUsuario(idElemento) {
  const userJSON = sessionStorage.getItem("user");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    const el = document.getElementById(idElemento);
    if (el) {
      el.textContent = user.name || user.username || "Jugador";
    }
  }
}

function renderBattleCards(cartas, containerId) {
  const container = document.querySelector(`#${containerId} .d-flex`);
  container.innerHTML = '';

  cartas.forEach(warrior => {
    const card = document.createElement('div');
      card.classList.add('card', 'm-2', 'bg-secondary', 'text-white', 'card-game');
      card.style.width = '12rem';
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <img src="${warrior.warrior_image}" class="card-img-top" alt="${warrior.warrior_name}">
        <div class="card-body">
          <h5 class="card-title">${warrior.warrior_name}</h5>
        </div>
      `;

    container.appendChild(card);
  });
}

function startBattle(jugador1, jugador2) {
  const totalPoder1 = jugador1.reduce((sum, w) => sum + w.warrior_total_power, 0);
  const totalMagia1 = jugador1.reduce((sum, w) => sum + w.warrior_total_magic, 0);

  const totalPoder2 = jugador2.reduce((sum, w) => sum + w.warrior_total_power, 0);
  const totalMagia2 = jugador2.reduce((sum, w) => sum + w.warrior_total_magic, 0);

  const total1 = totalPoder1 + totalMagia1;
  const total2 = totalPoder2 + totalMagia2;

  // En la consola se ve la sumatoria de los poderes y magia de los guerreros
  console.log("Resultado jugador1", total1);
  console.log("Resultado jugador2", total2);
  let resultado = "";
  
  if (total1 > total2) {
    resultado = "¡Jugador 1 gana la batalla! con un puntaje de: " + total1;
  } else if (total2 > total1) {
    resultado = "¡Jugador 2 gana la batalla! con un puntaje de: " + total2;
  } else {
    resultado = "¡Es un empate!";
  }

  document.getElementById("battleResultText").textContent = resultado;
  const modal = new bootstrap.Modal(document.getElementById('resultModal'));
  modal.show();
}