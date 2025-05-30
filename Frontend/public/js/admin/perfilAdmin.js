document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users";
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  const userIdInput = document.getElementById("user-id");
  const userNameInput = document.getElementById("username");
  const userEmailInput = document.getElementById("email");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const editToggleBtn = document.getElementById("editToggleBtn");
  const profileImageInput = document.getElementById("profileImageInput");
  const editImageBtn = document.getElementById("editProfileImageBtn");
  const profileForm = document.querySelector("form");

  let originalName = "";
  let originalEmail = "";
  let isEditing = false;

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");

  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  if (!user || !token) {
    console.error("Usuario o token no disponibles en sessionStorage");
    return;
  }

  // Cargar info de perfil
  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const userData = await response.json();

      userIdInput.value = userData.id;
      userNameInput.value = userData.user_name;
      userEmailInput.value = userData.user_email;

      // Guardar valores originales para cancelación
      originalName = userData.user_name;
      originalEmail = userData.user_email;
    } catch (err) {
      console.error("Error al cargar perfil:", err.message);
    }
  };

  // Alternar modo edición / cancelación
  window.toggleEditMode = () => {
    isEditing = !isEditing;

    if (isEditing) {
      // Activar edición
      userNameInput.removeAttribute("disabled");
      userEmailInput.removeAttribute("disabled");
      saveProfileBtn.removeAttribute("disabled");
      editImageBtn.removeAttribute("disabled");
      editToggleBtn.textContent = "Cancelar";
    } else {
      // Cancelar edición
      userNameInput.value = originalName;
      userEmailInput.value = originalEmail;
      userNameInput.setAttribute("disabled", true);
      userEmailInput.setAttribute("disabled", true);
      saveProfileBtn.setAttribute("disabled", true);
      editImageBtn.setAttribute("disabled", true);
      editToggleBtn.textContent = "Editar Perfil";
    }
  };

  // Editar perfil
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: userNameInput.value,
      email: userEmailInput.value
    };

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error(`Error actualizando perfil: ${response.status}`);

      alert("Perfil actualizado correctamente.");

      userNameInput.setAttribute("disabled", true);
      userEmailInput.setAttribute("disabled", true);
      saveProfileBtn.setAttribute("disabled", true);
      editImageBtn.setAttribute("disabled", true);
      editToggleBtn.textContent = "Editar Perfil";
      isEditing = false;

      loadUserProfile();
    } catch (err) {
      console.error("Error guardando perfil:", err.message);
    }
  });

  // Mostrar nombre en el sidebar
  mostrarNombreUsuario("playerName");

  function mostrarNombreUsuario(id) {
    const el = document.getElementById(id);
    if (el && user) el.textContent = user.name || user.email;
  }

  // Iniciar cargando datos
  loadUserProfile();

  // Inicialmente botón de imagen deshabilitado
  editImageBtn.setAttribute("disabled", true);
});
