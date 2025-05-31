/* battle.js - Autor: Valery Escobar
 * Fecha: 12/04/2025
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

async function startBattle(jugador1, jugador2) {
  const totalPoder1 = jugador1.reduce((sum, w) => sum + w.warrior_total_power, 0);
  const totalMagia1 = jugador1.reduce((sum, w) => sum + w.warrior_total_magic, 0);
  const totalPoder2 = jugador2.reduce((sum, w) => sum + w.warrior_total_power, 0);
  const totalMagia2 = jugador2.reduce((sum, w) => sum + w.warrior_total_magic, 0);

  const total1 = totalPoder1 + totalMagia1;
  const total2 = totalPoder2 + totalMagia2;

  let resultado = "";
  let ganadorDefault = "";

  if (total1 > total2) {
    resultado = "¡Jugador 1 gana la batalla! con un puntaje de: " + total1;
    ganadorDefault = "Jugador 1";
  } else if (total2 > total1) {
    resultado = "¡Jugador 2 gana la batalla! con un puntaje de: " + total2;
    ganadorDefault = "Jugador 2";
  } else {
    resultado = "¡Es un empate!";
    ganadorDefault = "";
  }

  // Mostrar resultado en el modal principal
  document.getElementById("battleResultText").textContent = resultado;
  const modalResultado = new bootstrap.Modal(document.getElementById('resultModal'));
  modalResultado.show();

  // Cuando se cierre el modal, mostrar input del nombre ganador si hubo uno
  document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => {
    if (ganadorDefault) {
      mostrarModalNombreGanador(ganadorDefault);
    }
  }, { once: true });
}

// Mostrar modal para ingresar nombre del ganador
function mostrarModalNombreGanador(ganadorDefault) {
  const inputNombre = document.getElementById("inputNombreGanador");
  inputNombre.value = ganadorDefault;

  const modalNombreGanadorEl = document.getElementById('modalNombreGanador');
  const modalNombreGanador = new bootstrap.Modal(modalNombreGanadorEl);
  modalNombreGanador.show();

  const btnGuardar = document.getElementById("btnGuardarGanador");

  btnGuardar.onclick = async () => {
    const nombreGanador = inputNombre.value.trim();
    if (!nombreGanador) {
      alert("Por favor, ingresa el nombre del ganador.");
      return;
    }

    const matchId = sessionStorage.getItem("current_match_id");

    try {
      // 1. Finalizar la partida
      await fetch(`http://localhost:3000/gamev1/matches/${matchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          match_status: "finalizada",
          match_winner: nombreGanador
        })
      });

      // 2. Registrar o actualizar ganador en tabla winners
      await fetch("http://localhost:3000/gamev1/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ winner_name: nombreGanador })
      });

      alert(`Partida finalizada. Ganador registrado: ${nombreGanador}`);
      modalNombreGanador.hide();

      // 👉 Redirigir a la vista de ranking
      window.location.href = "/ranking";

    } catch (error) {
      console.error("Error al finalizar la partida o registrar ganador:", error);
      alert("Ocurrió un error al guardar la información del ganador.");
    }
  };

}
