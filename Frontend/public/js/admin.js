document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/warriors";

  const cardsContainer = document.getElementById("cardsContainer");
  const cardForm = document.getElementById("cardForm");
  const modalTitle = document.getElementById("modalTitle");
  const cardIdInput = document.getElementById("card-id");
  const nameInput = document.getElementById("name");
  const powerInput = document.getElementById("power");
  const magicInput = document.getElementById("magic");
  const lifeInput = document.getElementById("life");
  const speedInput = document.getElementById("speed");
  const intelligenceInput = document.getElementById("intelligence");
  const imageInput = document.getElementById("image");
  const typeWarriorInput = document.getElementById("type_warrior");
  const raceInput = document.getElementById("race");

  let cards = [];

  const resetForm = () => {
    cardForm.reset();
    cardIdInput.value = "";
  };

  const renderCards = () => {
    cardsContainer.innerHTML = "";
    cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = "col";
      cardElement.innerHTML = `
        <div class="card h-100">
          <img src="${card.warrior_image}" class="card-img-top" alt="Carta">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${card.warrior_name}</h5>
            <p class="card-text">
              Poder: ${card.warrior_total_power} <br>
              Magia: ${card.warrior_total_magic} <br>
              Vida: ${card.warrior_health} <br>
              Velocidad: ${card.warrior_speed} <br>
              Inteligencia: ${card.warrior_intelligence} <br>
              Tipo de Guerrero: ${card.type_warrior_id} <br>
              Raza: ${card.race_id}
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editCard(${card.warrior_id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCard(${card.warrior_id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      cardsContainer.appendChild(cardElement);
    });
  };

  const loadCardsFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      cards = await response.json();
      renderCards();
    } catch (error) {
      console.error("Error cargando cartas:", error);
    }
  };

  window.editCard = async (id) => {
    const card = cards.find(c => c.warrior_id === id);
    if (!card) return;

    modalTitle.textContent = "Editar Carta";
    cardIdInput.value = card.warrior_id;
    nameInput.value = card.warrior_name;
    powerInput.value = card.warrior_total_power;
    magicInput.value = card.warrior_total_magic;
    lifeInput.value = card.warrior_health;
    speedInput.value = card.warrior_speed;
    intelligenceInput.value = card.warrior_intelligence;
    typeWarriorInput.value = card.type_warrior_id;
    raceInput.value = card.race_id;

    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  };

  window.deleteCard = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta carta?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error al eliminar carta:", error);
    }
  };

  document.getElementById("addCardBtn").addEventListener("click", () => {
    modalTitle.textContent = "Agregar Carta";
    resetForm();
    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  });

  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput.value,
      total_power: +powerInput.value,
      total_magic: +magicInput.value,
      health: +lifeInput.value,
      speed: +speedInput.value,
      intelligence: +intelligenceInput.value,
      type_warrior_id: +typeWarriorInput.value,
      race_id: +raceInput.value,
      image: imageInput.files[0] ? `../img/cards${imageInput.files[0].name}` : ""
    };

    const id = cardIdInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("cardModal"));
      modal.hide();
      resetForm();
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error guardando carta:", error);
    }
  });
  
  loadCardsFromAPI();
  document.getElementById('logoutBtn').addEventListener('click', () => {
  // Limpia cualquier dato en localStorage (si usas uno)
  localStorage.clear();
  // Redirige a la pantalla de login
  window.location.href = '../../views/login/login_view.html';
  });
});

//Cargue de imagenes
document.getElementById('cardForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Agrega manualmente el ID (en caso de edición)
  const cardId = document.getElementById('card-id').value;
  if (cardId) {
    formData.append('id', cardId);
  }

  try {
    const method = cardId ? 'PUT' : 'POST';
    const url = cardId
      ? `http://localhost:3000/gamev1/warriors/${cardId}`
      : `http://localhost:3000/gamev1/warriors`;

    const response = await fetch(url, {
      method,
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Error al guardar la carta.');

    alert('Carta guardada correctamente');
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('cardModal'));
    modal.hide();
    // Recargar lista de cartas o actualizar la vista aquí
    loadCards();
  } catch (error) {
    console.error(error);
    alert('Hubo un error al guardar la carta.');
  }
});