document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users";
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");

  const userIdInput = document.getElementById("user-id");
  const userNameInput = document.getElementById("username");
  const userEmailInput = document.getElementById("email");
  const userVictoriesInput = document.getElementById("victories");
  const userDefeatsInput = document.getElementById("defeats");
  const userScoreInput = document.getElementById("score");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileForm = document.querySelector("form");

  // Sidebar toggle behavior
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  // Resaltar opción activa
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // Obtener ID del usuario
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("No hay usuario logueado.");
    return;
  }

  const token = localStorage.getItem("adminToken");
  if (!token) {
    console.error("No hay token disponible. Acceso restringido.");
    return;
  }

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const user = await response.json();

      // Cargar datos en inputs
      userIdInput.value = user.user_id;
      userNameInput.value = user.user_name;
      userEmailInput.value = user.user_email;
      userVictoriesInput.value = user.victories || 0;
      userDefeatsInput.value = user.defeats || 0;
      userScoreInput.value = user.score || 0;

      localStorage.setItem("userName", user.user_name);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  // Habilitar edición
  window.enableEdit = () => {
    userNameInput.removeAttribute("disabled");
    userEmailInput.removeAttribute("disabled");
    userVictoriesInput.removeAttribute("disabled");
    userDefeatsInput.removeAttribute("disabled");
    userScoreInput.removeAttribute("disabled");
    saveProfileBtn.removeAttribute("disabled");
  };

  // Guardar perfil
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      user_name: userNameInput.value,
      user_email: userEmailInput.value,
      victories: parseInt(userVictoriesInput.value),
      defeats: parseInt(userDefeatsInput.value),
      score: parseInt(userScoreInput.value)
    };

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Error actualizando perfil: ${response.status}`);

      alert("Perfil actualizado correctamente.");
      loadUserProfile();
    } catch (error) {
      console.error("Error guardando perfil:", error);
    }
  });

  // Mostrar nombre del usuario en el sidebar
  function mostrarNombreUsuario(elementId) {
    const name = localStorage.getItem("userName");
    const element = document.getElementById(elementId);
    if (name && element) {
      element.textContent = name;
    }
  }

  loadUserProfile();
  mostrarNombreUsuario("playerName");
});