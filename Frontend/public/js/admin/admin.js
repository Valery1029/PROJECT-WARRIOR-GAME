document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Protección y verificación de usuario
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = Number(user?.role);

  if (!token || !user) {
    window.location.href = "/login";
    return;
  } else if (role !== 2) {
    window.location.href = "/home";
    return;
  }

  const API_URL = "http://localhost:3000/gamev1/warriors";

  // 🔹 Elementos de la UI
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");
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

  // 🔹 Ocultar y mostrar el botón del sidebar
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => sidebarToggleBtn.style.display = "none");
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => sidebarToggleBtn.style.display = "block");

  // 🔹 Resaltar la opción activa en el sidebar
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    if (link.getAttribute("href").split("/").pop() === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", () => {
      navLinks.forEach(nav => nav.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 🔹 Función para limpiar el formulario
  const resetForm = () => {
    cardForm.reset();
    cardIdInput.value = "";
  };

  // 🔹 Renderizar cartas en la UI
  const renderCards = () => {
    cardsContainer.innerHTML = "";
    cards.forEach(card => {
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

  // 🔹 Cargar cartas desde la API
  const loadCardsFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      cards = await response.json();
      renderCards();
    } catch (error) {
      console.error("Error cargando cartas:", error);
    }
  };

  // 🔹 Editar carta
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
    imageInput.value = card.warrior_image;

    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  };

  // 🔹 Eliminar carta
  window.deleteCard = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta carta?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error al eliminar carta:", error);
    }
  };

  // 🔹 Agregar nueva carta
  document.getElementById("addCardBtn").addEventListener("click", () => {
    modalTitle.textContent = "Agregar Carta";
    cardForm.reset();
    cardIdInput.value = "";

    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  });

  // 🔹 Guardar carta (Crear / Editar)
  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      warrior_name: nameInput.value,
      warrior_total_power: powerInput.value,
      warrior_total_magic: magicInput.value,
      warrior_health: lifeInput.value,
      warrior_speed: speedInput.value,
      warrior_intelligence: intelligenceInput.value,
      type_warrior_id: typeWarriorInput.value,
      race_id: raceInput.value,
      warrior_image: imageInput.value
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
      cardForm.reset();
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error guardando carta:", error);
    }
  });

  // 🔹 Inicializar la carga de cartas
  loadCardsFromAPI();
  mostrarNombreUsuario("playerName");
  resetForm;
});
