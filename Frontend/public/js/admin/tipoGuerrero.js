document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/typeWarrior";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link"); 
  const type_warriorContainer = document.getElementById("type_warriorContainer");
  const addType_WarriorBtn = document.getElementById("addType_WarriorBtn");
  const modalTitle = document.getElementById("modalTitle");
  const type_warriorIdInput = document.getElementById("type_warrior-id");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const type_warriorForm = document.getElementById("type_warriorForm");

  let type_warrior = [];

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

  // Renderizar lista de tipos de guerreros
  const renderType_Warrior = () => {
  type_warriorContainer.innerHTML = "";
  type_warrior.forEach((type_warrior) => {
    const type_warriorElement = document.createElement("div");
    type_warriorElement.className = "col";
    type_warriorElement.innerHTML = `
      <div class="card h-100">
        <div class="card-body bg-dark text-white">
          <h5 class="card-title">${type_warrior.type_warrior_name}</h5>
          <p class="card-text">
            Descripción: ${type_warrior.type_warrior_description}
          </p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-warning" onclick="editType_Warrior(${type_warrior.type_warrior_id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteType_Warrior(${type_warrior.type_warrior_id})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    type_warriorContainer.appendChild(type_warriorElement);
  });
};


  // Cargar tipos de guerreros desde la API
  const loadType_WarriorFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      type_warrior = await response.json();
      renderType_Warrior();
    } catch (error) {
      console.error("Error cargando tipos de guerreros:", error);
    }
  };

  // Editar tipo de guerrero
  window.editType_Warrior = async (id) => {
  const warriorType = type_warrior.find(w => w.type_warrior_id === id);
  if (!warriorType) return;

  modalTitle.textContent = "Editar Tipo de Guerrero";
  type_warriorIdInput.value = warriorType.type_warrior_id;
  nameInput.value = warriorType.type_warrior_name;
  descriptionInput.value = warriorType.type_warrior_description;

  const modalElement = document.getElementById("type_warriorModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
};


  // Eliminar tipo de guerrero
  window.deleteType_Warrior = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este tipo de guerrero?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadType_WarriorFromAPI();
    } catch (error) {
      console.error("Error al eliminar tipo de guerrero:", error);
    }
  };

  // Agregar nuevo tipo de guerrero
  addType_WarriorBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar tipo de guerrero";
    type_warriorForm.reset();
    type_warriorIdInput.value = "";
    const modal = new bootstrap.Modal(document.getElementById("type_warriorModal"));
    modal.show();
  });

  // Guardar tipo de guerrero (Crear / Editar)
  type_warriorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      type_warrior_name: nameInput.value,
      type_warrior_description: descriptionInput.value,
    };

    const id = type_warriorIdInput.value;

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

      const modal = bootstrap.Modal.getInstance(document.getElementById("type_warriorModal"));
      modal.hide();
      type_warriorForm.reset();
      await loadType_WarriorFromAPI();
    } catch (error) {
      console.error("Error guardando tipo de guerrero:", error);
    }
  });

  // Inicializar la carga de tipos de guerreros
  loadType_WarriorFromAPI();
});
