document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/warriors";

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

  // Ocultar el botón cuando el sidebar esté abierto
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", function () {
    sidebarToggleBtn.style.display = "none";
  });

  // Mostrar el botón cuando el sidebar se cierre
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", function () {
    sidebarToggleBtn.style.display = "block";
  });

  // Resaltar la opción activa en el sidebar
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const href = link.getAttribute("href").split("/").pop();

    if (href === currentPage) {
      link.classList.add("active");
    }

    link.addEventListener("click", () => {
      navLinks.forEach(nav => nav.classList.remove("active"));
      link.classList.add("active");
    });
  });

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

  loadCardsFromAPI();
});