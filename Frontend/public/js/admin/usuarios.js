document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users";
  const usersContainer = document.getElementById("usersContainer");
  const addUserBtn = document.getElementById("addUserBtn");
  const modalTitle = document.getElementById("modalTitle");
  const userIdInput = document.getElementById("user-id");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");
  const userForm = document.getElementById("userForm");
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const passwordInput = document.getElementById("password");


  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  let users = [];

  const renderUsers = () => {
    usersContainer.innerHTML = "";
    users.forEach(user => {
      const userCard = document.createElement("div");
      userCard.className = "col";
      userCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${user.user_name}</h5>
            <p class="card-text">
              Email: ${user.user_email}<br>
              Rol: ${user.role_id}
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-warning" onclick="editUser(${user.user_id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      usersContainer.appendChild(userCard);
    });
  };

  // Cargar Usuarios
  const loadUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");

      console.log("Token enviado:", sessionStorage.getItem("token"));

      const res = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "No autorizado");
      }

      users = await res.json();
      renderUsers();
    } catch (err) {
      console.error("Error cargando usuarios:", err.message);
    }
  };


  // Edita Usuario
  window.editUser = (id) => {
    const user = users.find(u => u.user_id === id);
    if (!user) return;

    modalTitle.textContent = "Editar Usuario";
    userIdInput.value = user.user_id;
    usernameInput.value = user.user_name;
    emailInput.value = user.user_email;
    roleInput.value = user.role_id === 2 ? "admin" : "player";

    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.show();
  };

  // Eliminar Usuario
  window.deleteUser = async (id) => {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadUsers();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  // Agregar Usuario
  addUserBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Usuario";
    userForm.reset();
    userIdInput.value = "";

    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.show();
  });


  // Guardar usuario (Crear / Editar)
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const roleValue = roleInput.value;
    const role_id = roleValue === "admin" ? 2 : 1;

    const id = userIdInput.value;

    const userData = {
      name: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      role: role_id
    };

    try {
      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, role_id: role_id})
        });
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("userModal"));
      modal.hide();
      userForm.reset();
      await loadUsers();
    } catch (err) {
      console.error("Error guardando usuario:", err);
    }
  });


  // Inicializar la carga de usuarios
  loadUsers();
  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil("profileImage");
});
