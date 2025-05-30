document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/spells";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link"); 
  const spellsContainer = document.getElementById("spellsContainer");
  const addSpellsBtn = document.getElementById("addSpellsBtn");
  const modalTitle = document.getElementById("modalTitle");
  const spellIdInput = document.getElementById("spell-id");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const percentageInput = document.getElementById("percentage");
  const spellsForm = document.getElementById("spellsForm");

  let spells = [];

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

  // Renderizar lista de hechizos
  const renderSpells = () => {
    spellsContainer.innerHTML = "";
    spells.forEach((spell) => {
      const spellElement = document.createElement("div");
      spellElement.className = "col";
      spellElement.innerHTML = `
        <div class="card h-100">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${spell.spell_name}</h5>
            <p class="card-text">
              Descripción: ${spell.spell_description} <br>
              Porcentaje: ${spell.spell_percentage}%
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editSpell(${spell.spell_id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteSpell(${spell.spell_id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      spellsContainer.appendChild(spellElement);
    });
  };

  // Cargar hechizos desde la API
  const loadSpellsFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      spells = await response.json();
      renderSpells();
    } catch (error) {
      console.error("Error cargando hechizos:", error);
    }
  };

  // Editar hechizo
  window.editSpell = async (id) => {
    const spell = spells.find(p => p.spell_id === id);
    if (!spell) return;

    modalTitle.textContent = "Editar Hechizos";
    spellIdInput.value = spell.spell_id;
    nameInput.value = spell.spell_name;
    descriptionInput.value = spell.spell_description;
    percentageInput.value = spell.spell_percentage;

    const modal = new bootstrap.Modal(document.getElementById("spellsModal"));
    modal.show();
  };

  // Eliminar hechizo
  window.deleteSpell = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este hechizo?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadSpellsFromAPI();
    } catch (error) {
      console.error("Error al eliminar hechizos:", error);
    }
  };

  // Agregar nuevo hechizo
  addSpellsBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar hechizo";
    spellsForm.reset();
    spellIdInput.value = "";
    const modal = new bootstrap.Modal(document.getElementById("spellsModal"));
    modal.show();
  });

  // Guardar hechizo (Crear / Editar)
  spellsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput.value,
      description: descriptionInput.value,
      percentage: percentageInput.value
    };

    const id = spellIdInput.value;

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

      const modal = bootstrap.Modal.getInstance(document.getElementById("spellsModal"));
      modal.hide();
      spellsForm.reset();
      await loadSpellsFromAPI();
    } catch (error) {
      console.error("Error guardando hechizo:", error);
    }
  });

  // Inicializar la carga de hechizos
  loadSpellsFromAPI();
  mostrarNombreUsuario("playerName");
});
