document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users";
  const UPLOAD_URL = "http://localhost:3000/gamev1/upload";
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

      // Actualizar imagen de perfil si existe
      const imagePath = userData.user_image
        ? `/img/uploads/${userData.user_image}`
        : "/img/uploads/default.jpg";

      document.getElementById("profileImage").src = imagePath;
      const sidebarImage = document.querySelector(".offcanvas-body img");
      if (sidebarImage) sidebarImage.src = imagePath;

      // Guardar valores originales
      originalName = userData.user_name;
      originalEmail = userData.user_email;

      // Actualizar sessionStorage con datos actualizados
      sessionStorage.setItem("user", JSON.stringify({
        ...user,
        name: userData.user_name,
        email: userData.user_email,
        image: imagePath
      }));

    } catch (err) {
      console.error("Error al cargar perfil:", err.message);
    }
  };

  // Alternar modo edición / cancelación
  window.toggleEditMode = () => {
    isEditing = !isEditing;

    if (isEditing) {
      userNameInput.removeAttribute("disabled");
      userEmailInput.removeAttribute("disabled");
      saveProfileBtn.removeAttribute("disabled");
      editImageBtn.removeAttribute("disabled");
      editToggleBtn.textContent = "Cancelar";
    } else {
      userNameInput.value = originalName;
      userEmailInput.value = originalEmail;
      userNameInput.setAttribute("disabled", true);
      userEmailInput.setAttribute("disabled", true);
      saveProfileBtn.setAttribute("disabled", true);
      editImageBtn.setAttribute("disabled", true);
      editToggleBtn.textContent = "Editar Perfil";
    }
  };

  // Guardar cambios de nombre y correo
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

      loadUserProfile(); // Recargar datos

    } catch (err) {
      console.error("Error guardando perfil:", err.message);
    }
  });

  // Subir Imagen de perfil y actualizar en BD
  profileImageInput.addEventListener("change", async () => {
    const file = profileImageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Subir imagen al servidor
      const uploadRes = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadRes.ok) throw new Error("Error al subir imagen");

      const { image } = await uploadRes.json();

      // 2. Actualizar usuario con nombre de imagen
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: userNameInput.value,
          email: userEmailInput.value,
          image
        })
      });

      if (!response.ok) throw new Error("Error al actualizar imagen en el perfil");

      const imagePath = `/img/uploads/${image}`;
      document.getElementById("profileImage").src = imagePath;

      const sidebarImage = document.querySelector(".offcanvas-body img");
      if (sidebarImage) sidebarImage.src = imagePath;

      // Actualizar sessionStorage
      user.image = imagePath;
      sessionStorage.setItem("user", JSON.stringify(user));

      alert("Imagen de perfil actualizada correctamente.");

    } catch (err) {
      console.error("Error al cambiar imagen:", err.message);
    }
  });

  // Mostrar nombre en el sidebar
  mostrarNombreUsuario("playerName");

  function mostrarNombreUsuario(id) {
    const el = document.getElementById(id);
    if (el && user) el.textContent = user.name || user.email;
  }

  // Inicialmente botón de imagen deshabilitado
  editImageBtn.setAttribute("disabled", true);

  // Cargar datos al iniciar
  loadUserProfile();
});