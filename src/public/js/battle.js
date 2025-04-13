/* Author: Valery Escobar
 * Date: 12/04/2025
 */

window.onload = () => {
  const jugador1 = JSON.parse(localStorage.getItem('jugador1_cartas')) || [];
  const jugador2 = JSON.parse(localStorage.getItem('jugador2_cartas')) || [];

  renderBattleCards(jugador1, "player1-container");
  renderBattleCards(jugador2, "player2-container");

  document.getElementById("startBattleBtn").onclick = () => {
    startBattle(jugador1, jugador2);
  };
};

function renderBattleCards(cartas, containerId) {
  const container = document.querySelector(`#${containerId} .d-flex`);
  container.innerHTML = '';

  cartas.forEach(warrior => {
    const card = document.createElement('div');
    card.classList.add('card', 'm-2', 'bg-secondary', 'text-white', 'card-game');
    card.style.width = '10rem';

    card.innerHTML = `
      <img src="${warrior.warrior_image}" class="card-img-top" alt="${warrior.warrior_name}">
      <div class="card-body">
        <h6>${warrior.warrior_name}</h6>
        <small>Poder: ${warrior.warrior_total_power}</small><br>
        <small>Magia: ${warrior.warrior_total_magic}</small>
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

  console.log("Resultado", total1);
  let resultado = "";
  
  if (total1 > total2) {
    resultado = "¡Jugador 1 gana la batalla!";
  } else if (total2 > total1) {
    resultado = "¡Jugador 2 gana la batalla!";
  } else {
    resultado = "¡Es un empate!";
  }

  document.getElementById("battleResultText").textContent = resultado;
  const modal = new bootstrap.Modal(document.getElementById('resultModal'));
  modal.show();
}