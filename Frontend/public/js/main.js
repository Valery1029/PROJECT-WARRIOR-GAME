/* Author: Valery Escobar
 * Date: 11/04/2025
 */

class Main {

  async fetchWarriors() {
    try {
      const res = await fetch("http://localhost:3000/gamev1/warriors");
      if (!res.ok) throw new Error("Error al obtener los guerreros");
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

class Game {
  constructor() {
    this.selectedCards = [];
    this.currentPlayer = 1;
  }

  renderCards(cartas, containerId) {
    const container = document.getElementById(containerId);
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

      card.onclick = () => this.toggleCardSelection(card, warrior);

      container.appendChild(card);
    });

    this.selectedCards = [];
    document.getElementById("counter").textContent = "0";
  }

  toggleCardSelection(cardElement, warrior) {
    const index = this.selectedCards.findIndex(w => w.warrior_id === warrior.warrior_id);
    if (index >= 0) {
      this.selectedCards.splice(index, 1);
      cardElement.classList.remove('selected'); // Quita el borde rojo
    } else if (this.selectedCards.length < 5) {
      this.selectedCards.push(warrior);
      cardElement.classList.add('selected'); // Agrega el borde rojo
    } else {
      alert("Solo puedes seleccionar 5 cartas.");
    }
  
    document.getElementById("counter").textContent = this.selectedCards.length;
  }  

  confirmSelection() {
    if (this.selectedCards.length !== 5) {
      alert("Debes seleccionar exactamente 5 cartas.");
      return;
    }

    const jugadorActual = this.currentPlayer;
    const storageKey = `jugador${jugadorActual}_cartas`;
    localStorage.setItem(storageKey, JSON.stringify(this.selectedCards));

    if (jugadorActual === 1) {
      window.location.href = `cards_view.html?player=2`;
    } else {
      window.location.href = `battle_view.html`;
    }
  }

  

}

const main = new Main();
const game = new Game();

const sidebar = document.getElementById("sidebarOffcanvas");
  const toggleBtn = document.querySelector(".sidebar-toggle-btn");

  sidebar.addEventListener("shown.bs.offcanvas", () => {
    toggleBtn.style.display = "none";
  });

  sidebar.addEventListener("hidden.bs.offcanvas", () => {
    toggleBtn.style.display = "block";
  });