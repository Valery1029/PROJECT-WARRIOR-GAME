class Dashboard {
  constructor() {
    this.apiUrl = "http://localhost:3000/gamev1/warriors";
    this.cardsContainer = document.getElementById("cardsContainer");
    this.cardForm = document.getElementById("cardForm");
    this.cardId = document.getElementById("card-id");
    this.name = document.getElementById("name");
    this.attack = document.getElementById("attack");
    this.defense = document.getElementById("defense");
    this.imageInput = document.getElementById("image");
    this.logoutBtn = document.getElementById("logoutBtn");
  }

  async init() {
    if (!this.cardsContainer || !this.cardForm) {
      console.error("Error: Elementos del DOM no encontrados.");
      return;
    }
    await this.loadCards();
    this.cardForm.addEventListener("submit", (e) => this.saveCard(e));
    this.logoutBtn.addEventListener("click", () => this.logout());
  }

  async loadCards() {
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) throw new Error("No se pudieron obtener las cartas");
      const cards = await res.json();
      this.renderCards(cards);
    } catch (error) {
      console.error("Error cargando las cartas:", error);
    }
  }

  renderCards(cards) {
    this.cardsContainer.innerHTML = "";
    cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "col";
      cardDiv.innerHTML = `
        <div class="card h-100 text-white bg-dark">
          <img src="${card.warrior_image}" class="card-img-top" alt="${card.warrior_name}"/>
          <div class="card-body">
            <h5 class="card-title">${card.warrior_name}</h5>
            <p class="card-text">Ataque: ${card.warrior_attack}</p>
            <p class="card-text">Defensa: ${card.warrior_defense}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-warning btn-sm" onclick='dashboard.editCard(${JSON.stringify(
              card
            )})'>Editar</button>
            <button class="btn btn-danger btn-sm" onclick='dashboard.deleteCard(${card.warrior_id})'>Eliminar</button>
          </div>
        </div>`;
      this.cardsContainer.appendChild(cardDiv);
    });
  }

  async saveCard(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("warrior_name", this.name.value);
    formData.append("warrior_attack", this.attack.value);
    formData.append("warrior_defense", this.defense.value);
    if (this.imageInput.files[0]) {
      formData.append("warrior_image", this.imageInput.files[0]);
    }

    const method = this.cardId.value ? "PUT" : "POST";
    const url = this.cardId.value ? `${this.apiUrl}/${this.cardId.value}` : this.apiUrl;

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (!res.ok) throw new Error("Error al guardar la carta");
      this.cardForm.reset();
      await this.loadCards();
    } catch (err) {
      console.error(err);
    }
  }

  editCard(card) {
    this.cardId.value = card.warrior_id;
    this.name.value = card.warrior_name;
    this.attack.value = card.warrior_attack;
    this.defense.value = card.warrior_defense;
    // Nota: La imagen no se precarga en el input de tipo file por seguridad.
  }

  async deleteCard(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta carta?")) return;
    try {
      const res = await fetch(`${this.apiUrl}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar la carta");
      await this.loadCards();
    } catch (err) {
      console.error(err);
    }
  }

  logout() {
    // Aquí puedes limpiar el localStorage y redirigir a login
    localStorage.clear();
    window.location.href = "login.html";
  }
}

const dashboard = new Dashboard();
document.addEventListener("DOMContentLoaded", () => {
  dashboard.init();
});
