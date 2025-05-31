// Mostrar el nombre del usuario en cualquier elemento por ID
function mostrarNombreUsuario(idElemento = "playerName") {
  const userJSON = sessionStorage.getItem("user");
  if (!userJSON) return;

  const user = JSON.parse(userJSON);
  const el = document.getElementById(idElemento);
  if (el) {
    el.textContent = user.name || user.username || user.email || "Usuario";
  }
}

// Mostrar imagen de perfil del usuario
function mostrarImagenPerfil(idElemento = "profileImage") {
  const userJSON = sessionStorage.getItem("user");
  if (!userJSON) return;

  const user = JSON.parse(userJSON);
  const imgEl = document.getElementById(idElemento);
  if (imgEl) {
    const ruta = user.image && user.image.trim() !== "" 
      ? user.image 
      : "/img/cards/Back.jpg"; // Imagen predeterminada si no hay imagen en BD
    imgEl.src = ruta;
  }
}

// Mostrar nombre e imagen en sidebar y/o perfil
function inicializarSidebar(nombreID = "playerName", imagenID = "sidebarImage") {
  mostrarNombreUsuario(nombreID);
  mostrarImagenPerfil(imagenID);
}