document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/users";
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  const userNameInput = document.getElementById("username");
  const userEmailInput = document.getElementById("email");
  const userVictoriesInput = document.getElementById("victories");
  const userDefeatsInput = document.getElementById("defeats");
  const userScoreInput = document.getElementById("score");

  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const editToggleBtn = document.getElementById("editToggleBtn");
  const profileImageInput = document.getElementById("profileImageInput");
  const editImageBtn = document.getElementById("editProfileImageBtn");
  const profileForm = document.querySelector("form");

  let originalName = "", originalEmail = "";
  let isEditing = false;

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");

  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  if (!user || !token) return;

  const loadUserProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Error al cargar datos");

      const userData = await res.json();

      userNameInput.value = userData.user_name;
      userEmailInput.value = userData.user_email;
      userVictoriesInput.value = userData.victories || 0;
      userDefeatsInput.value = userData.defeats || 0;
      userScoreInput.value = userData.score || 0;

      // Imagen
      const profileImage = document.getElementById("profileImage");
      const sidebarImage = document.getElementById("sidebarImage");
      const imgPath = userData.user_image ? `/img/uploads/${userData.user_image}` : "/img/logos/jjk.jpg";
      profileImage.src = imgPath;
      if (sidebarImage) sidebarImage.src = imgPath;

      // Actualizar sessionStorage
      sessionStorage.setItem("user", JSON.stringify({
        ...user,
        name: userData.user_name,
        email: userData.user_email,
        image: imgPath
      }));

    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  // Alternar modo edición
  window.toggleEditMode = () => {
    isEditing = !isEditing;

    [userNameInput, userEmailInput, editImageBtn].forEach(input => input.disabled = !isEditing);
    saveProfileBtn.disabled = !isEditing;
    editToggleBtn.textContent = isEditing ? "Cancelar" : "Editar Perfil";
  };

  // Guardar perfil
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: userNameInput.value,
      email: userEmailInput.value
    };

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) throw new Error("Error al guardar perfil");
      alert("Perfil actualizado");
      toggleEditMode();
      loadUserProfile();
    } catch (err) {
      console.error(err.message);
    }
  });

  // Subida de imagen
  profileImageInput.addEventListener("change", async () => {
    const file = profileImageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await fetch("http://localhost:3000/gamev1/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const { image } = await uploadRes.json();

      await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: userNameInput.value, email: userEmailInput.value, image })
      });

      loadUserProfile();
    } catch (err) {
      console.error("Error al subir imagen:", err.message);
    }
  });

  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil("profileImage");
  mostrarImagenPerfil("sidebarImage");

  editImageBtn.setAttribute("disabled", true);
  loadUserProfile();
  inicializarSidebar();
});