document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/powers";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");
  const powersContainer = document.getElementById("powersContainer");
  const addPowerBtn = document.getElementById("addPowerBtn");
  const modalTitle = document.getElementById("modalTitle");
  const powerIdInput = document.getElementById("power-id");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const percentageInput = document.getElementById("percentage");
  const powerForm = document.getElementById("powerForm");

  let powers = [];

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

  // Renderizar lista de poderes
  const renderPowers = () => {
    powersContainer.innerHTML = "";
    powers.forEach((power) => {
      const powerElement = document.createElement("div");
      powerElement.className = "col";
      powerElement.innerHTML = `
        <div class="card h-100">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${power.power_name}</h5>
            <p class="card-text">
              Descripción: ${power.power_description} <br>
              Porcentaje: ${power.power_percentage}%
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editPower(${power.power_id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deletePower(${power.power_id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      powersContainer.appendChild(powerElement);
    });
  };

  // Cargar poderes desde la API
  const loadPowersFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      powers = await response.json();
      renderPowers();
    } catch (error) {
      console.error("Error cargando poderes:", error);
    }
  };

  // Editar poder
  window.editPower = async (id) => {
    const power = powers.find(p => p.power_id === id);
    if (!power) return;

    modalTitle.textContent = "Editar Poder";
    powerIdInput.value = power.power_id;
    nameInput.value = power.power_name;
    descriptionInput.value = power.power_description;
    percentageInput.value = power.power_percentage;

    const modal = new bootstrap.Modal(document.getElementById("powerModal"));
    modal.show();
  };

  // Eliminar poder
  window.deletePower = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este poder?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadPowersFromAPI();
    } catch (error) {
      console.error("Error al eliminar poder:", error);
    }
  };

  // Agregar nuevo poder
  addPowerBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Poder";
    powerForm.reset();
    powerIdInput.value = "";
    const modal = new bootstrap.Modal(document.getElementById("powerModal"));
    modal.show();
  });

  // Guardar poder (Crear / Editar)
  powerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      percentage: parseInt(percentageInput.value)
    };

    const id = powerIdInput.value;

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

      const modal = bootstrap.Modal.getInstance(document.getElementById("powerModal"));
      modal.hide();
      powerForm.reset();
      await loadPowersFromAPI();
    } catch (error) {
      console.error("Error guardando poder:", error);
    }
  });


  // Inicializar la carga de poderes
  loadPowersFromAPI();
});
