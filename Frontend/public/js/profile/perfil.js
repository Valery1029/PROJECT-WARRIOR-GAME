document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users"; 
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");

  const userIdInput = document.getElementById("user-id");
  const userNameInput = document.getElementById("username");  // 🛠 Corrección del ID
  const userEmailInput = document.getElementById("email");
  const userLevelInput = document.getElementById("level");
  const userRankInput = document.getElementById("rank");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileForm = document.querySelector("form");

  // 🔹 Ocultar el botón cuando el sidebar esté abierto
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });

  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  // 🔹 Resaltar la opción activa en el sidebar
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // 🔹 Obtener ID del usuario desde el almacenamiento local
  const userId = localStorage.getItem("userId");  // 🛠 Asegurarse de obtener el ID
  if (!userId) {
    console.error("No hay usuario logueado.");
    return;
  }

  // 🔹 Cargar perfil del usuario
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No hay token disponible. Acceso restringido.");
        return;
      }

      const response = await fetch(`${API_URL}/${userId}`, {  // 🛠 Obtener el usuario por ID
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const user = await response.json();
      userIdInput.value = user.user_id;
      userNameInput.value = user.user_name;
      userEmailInput.value = user.user_email;
      userLevelInput.value = user.user_level;
      userRankInput.value = user.user_rank;
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  // 🔹 Activar edición de campos
  window.enableEdit = () => {
    userNameInput.removeAttribute("disabled");
    userEmailInput.removeAttribute("disabled");
    userLevelInput.removeAttribute("disabled");
    userRankInput.removeAttribute("disabled");
    saveProfileBtn.removeAttribute("disabled");
  };

  // 🔹 Guardar cambios en perfil
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No hay token disponible. Acceso restringido.");
      return;
    }

    const formData = {
      user_name: userNameInput.value,
      user_email: userEmailInput.value,
      user_level: userLevelInput.value,
      user_rank: userRankInput.value
    };

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar perfil: ${response.status}`);
      }

      alert("Perfil actualizado correctamente.");
      loadUserProfile();
    } catch (error) {
      console.error("Error guardando perfil:", error);
    }
  });

  loadUserProfile();
});