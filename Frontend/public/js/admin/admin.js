document.addEventListener("DOMContentLoaded", () => {
  // --- Validar sesión y rol ---
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = Number(user?.role);

  if (!token || !user) {
    window.location.href = "/login";
    return;
  } else if (role !== 2) {  // suponiendo que 2 es admin
    window.location.href = "/home";
    return;
  }

  // --- Constantes y referencias DOM ---
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
  const warriorImageInput = document.getElementById("warriorImageInput");
  const typeWarriorInput = document.getElementById("type_warrior");
  const raceInput = document.getElementById("race");

  let cards = [];

  // --- Sidebar toggle ---
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => sidebarToggleBtn.style.display = "none");
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => sidebarToggleBtn.style.display = "block");

  // --- Activar link actual en el menú ---
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

  // --- Función para resetear formulario ---
  const resetForm = () => {
    cardForm.reset();
    cardIdInput.value = "";
    imageInput.value = "";
  };

  // --- Renderizar cartas en el contenedor ---
  const renderCards = () => {
    cardsContainer.innerHTML = "";
    cards.forEach(card => {
      // Aquí se establece la imagen predeterminada si card.warrior_image no está definido o es vacío
      const imgSrc = card.warrior_image && card.warrior_image.trim() !== ""
        ? card.warrior_image
        : "/img/cards/Back.jpg";

      const cardElement = document.createElement("div");
      cardElement.className = "col";
      cardElement.innerHTML = `
        <div class="card h-100">
          <img src="${imgSrc}" class="card-img-top" alt="Carta">
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

  // --- Cargar cartas desde API ---
  const loadCardsFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      cards = await response.json();
      renderCards();
    } catch (error) {
      console.error("Error cargando cartas:", error);
    }
  };

  // --- Editar carta ---
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

    // Actualizar input oculto imageInput con la imagen, usando la imagen predeterminada si está vacía
    imageInput.value = card.warrior_image && card.warrior_image.trim() !== ""
      ? card.warrior_image
      : "/img/cards/Back.jpg";

    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  };

  // --- Eliminar carta ---
  window.deleteCard = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta carta?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando carta");
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error al eliminar carta:", error);
    }
  };

  // --- Botón para agregar carta ---
  document.getElementById("addCardBtn").addEventListener("click", () => {
    modalTitle.textContent = "Agregar Carta";
    resetForm();
    const modal = new bootstrap.Modal(document.getElementById("cardModal"));
    modal.show();
  });

  // --- Guardar carta (crear o editar) ---
  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput.value,
      total_power: powerInput.value,
      total_magic: magicInput.value,
      health: lifeInput.value,
      speed: speedInput.value,
      intelligence: intelligenceInput.value,
      type_warrior_id: typeWarriorInput.value,
      race_id: raceInput.value,
      image: imageInput.value
    };

    const id = cardIdInput.value;

    try {
      let res;
      if (id) {
        res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("Error guardando carta");

      const modal = bootstrap.Modal.getInstance(document.getElementById("cardModal"));
      modal.hide();
      resetForm();
      await loadCardsFromAPI();
    } catch (error) {
      console.error("Error guardando carta:", error);
    }
  });

  // --- Subir imagen ---
  warriorImageInput.addEventListener("change", async () => {
    const file = warriorImageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await fetch("http://localhost:3000/gamev1/card", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) throw new Error("Error al subir la imagen");

      const { image } = await uploadRes.json();

      // Actualizar el valor del input con la ruta completa de la imagen subida
      imageInput.value = `/img/cards/${image}`;
      alert("Imagen subida correctamente");
    } catch (err) {
      console.error("Error subiendo imagen:", err.message);
      alert("Error al subir imagen");
    }
  });

  // --- Carga inicial ---
  loadCardsFromAPI();
  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil("sidebarImage");
  inicializarSidebar();
});