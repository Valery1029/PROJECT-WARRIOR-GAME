/* Author: Valery Escobar
 * Date: 11/04/2025
 */

// Clase MainGame para manejar el juego
class MainGame {
  constructor() {
    this.maxCards = 5;
    this.selectedCards = [];
    this.currentPlayer = 1;
    this.players = {
      1: [],
      2: []
    };
  }

  // Renderiza las cartas en el contenedor especificado
  renderCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    data.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.className = "card card-game";
      cardElement.innerHTML = `
        <img src="${card.image}" class="card-img-top" alt="${card.name}">
        <div class="card-body text-center">
          <h5 class="card-title">${card.name}</h5>
          <p class="card-text">Poder: ${card.power}</p>
        </div>
      `;

      cardElement.onclick = () => this.selectCard(card.id, cardElement);
      container.appendChild(cardElement);
    });
  }

  // Seleccionar o deseleccionar una carta
  selectCard(cardId, cardElement) {
    if (this.selectedCards.includes(cardId)) {
      this.selectedCards = this.selectedCards.filter(id => id !== cardId);
      cardElement.classList.remove("selected");
    } else if (this.selectedCards.length < this.maxCards) {
      this.selectedCards.push(cardId);
      cardElement.classList.add("selected");
    }

    document.getElementById("counter").innerText = this.selectedCards.length;
  }

  // Confirma la selección de cartas y cambia al siguiente jugador o pantalla (en proceso)
  confirmSelection() {
    if (this.selectedCards.length !== this.maxCards) {
      alert("Debes seleccionar exactamente 5 cartas.");
      return;
    }
  
    // Guarda las cartas seleccionadas del jugador actual
    this.players[this.currentPlayer] = [...this.selectedCards];
    localStorage.setItem(`player${this.currentPlayer}`, JSON.stringify(this.players[this.currentPlayer]));
  
    this.selectedCards = [];
  
    // Alternar entre jugadores o pasar a la vista de batalla
    if (this.currentPlayer === 1) {
      // Cambiar a jugador 2 y recargar la página
      window.location.href = "../../views/game/cards_view.html?player=2";
    } else {
      // Ambos jugadores listos, pasar a la vista de batalla
      window.location.href = "../../views/game/battle_view.html";
    }
  }  
}

// Clase Main para manejar la comunicación con el API
class Main {
  constructor() {
    this.preloadElement = document.getElementById("preloadId");
    this.init();
  }

  // Inicializa el Main y oculta el precargador
  init() {
    this.hidePreload();
  }

  hidePreload() {
    if (this.preloadElement) {
      setTimeout(() => this.preloadElement.style.display = "none", 1000);
    }
  }

  // Obtiene datos desde un formulario
  getFormData(formId) {
    const form = document.getElementById(formId);
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  // Cambia la ubicación de la página
  setLocationPage(path) {
    window.location.href = path;
  }

  // Hace una petición fetch al API
  async fetchData(url, method = "GET", data = null) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json"
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(url, options);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error en la petición");
      return result;

    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }

  // Trae los guerreros desde el API y los mapea al formato de carta
  async fetchWarriors() {
    try {
      const data = await this.fetchData("http://localhost:3000/gamev1/warriors");
      return data.map(warrior => {
        // Genera la ruta de la imagen, reemplazando espacios por guiones bajos
        const imagePath = `../../public/img/cards/${warrior.warrior_name.toLowerCase().replace(/\s/g, '_')}.jpg`;
        return {
          id: warrior.warrior_id,
          name: warrior.warrior_name,
          power: warrior.warrior_total_power,
          image: imagePath // Ruta dinámica
        };
      });
    } catch (err) {
      console.error("Error al cargar los guerreros:", err.message);
      throw err;
    }
  }
}

// Instancias globales
const main = new Main(); // Instancia de la clase Main
const game = new MainGame(); // Instancia de la clase MainGame
window.game = game;

// Manejo de eventos al cargar la página
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const jugador = urlParams.get("player") || 1; // Por defecto, jugador 1
  document.getElementById("player").textContent = jugador;
  game.currentPlayer = parseInt(jugador);

  try {
    // Cargar cartas dinámicas desde el API
    const cartas = await main.fetchWarriors();
    game.renderCards(cartas, "card-container");
  } catch (error) {
    console.error("No se pudieron cargar las cartas:", error);
    alert("Hubo un problema al cargar las cartas.");
  }
};