document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/races";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link"); 
  const racesContainer = document.getElementById("racesContainer");
  const addRaceBtn = document.getElementById("addRaceBtn");
  const modalTitle = document.getElementById("modalTitle");
  const raceIdInput = document.getElementById("race-id");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const raceForm = document.getElementById("raceForm");

  let races = [];

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

  // Renderizar lista de razas
  const renderRaces = () => {
    racesContainer.innerHTML = "";
    races.forEach((races) => {
      const racesElement = document.createElement("div");
      racesElement.className = "col";
      racesElement.innerHTML = `
        <div class="card h-100">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${races.race_name}</h5>
            <p class="card-text">
              Descripción: ${races.race_description}
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editRace(${races.race_id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteRace(${races.race_id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      racesContainer.appendChild(racesElement);
    });
  };

  // Cargar razas desde la API
  const loadRacesFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      races = await response.json();
      renderRaces();
    } catch (error) {
      console.error("Error cargando razas:", error);
    }
  };

  // Editar raza
  window.editRace = async (id) => {
    const race = races.find(p => p.race_id === id);
    if (!race) return;

    modalTitle.textContent = "Editar Raza";
    raceIdInput.value = race.race_id;
    nameInput.value = race.race_name;
    descriptionInput.value = race.race_description;

    const modal = new bootstrap.Modal(document.getElementById("raceModal"));
    modal.show();
  };

  // Eliminar raza
  window.deleteRace = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta raza?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadRacesFromAPI();
    } catch (error) {
      console.error("Error al eliminar raza:", error);
    }
  };

  // Agregar nueva raza
  addRaceBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Raza";
    raceForm.reset();
    raceIdInput.value = "";
    const modal = new bootstrap.Modal(document.getElementById("raceModal"));
    modal.show();
  });

  // Guardar raza (Crear / Editar)
  raceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput.value,
      description: descriptionInput.value,
    };

    const id = raceIdInput.value;

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

      const modal = bootstrap.Modal.getInstance(document.getElementById("raceModal"));
      modal.hide();
      raceForm.reset();
      await loadRacesFromAPI();
    } catch (error) {
      console.error("Error guardando poder:", error);
    }
  });

  // Inicializar la carga de razas
  loadRacesFromAPI();
  mostrarNombreUsuario("playerName");
  inicializarSidebar();
});
