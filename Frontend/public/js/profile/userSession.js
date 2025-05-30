// Recuperar el usuario guardado en sessionStorage
function mostrarNombreUsuario(idElemento) {
  const userJSON = sessionStorage.getItem("user");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    const el = document.getElementById(idElemento);
    if (el) {
      el.textContent = user.name || user.username || "Jugador";
    }
  }
}

// Mostrar imagen de perfil dinámica
function mostrarImagenPerfil(idElemento = "profileImage") {
  const userJSON = sessionStorage.getItem("user");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    const imgEl = document.getElementById(idElemento);
    if (imgEl) {
      if (user.image && user.image !== "") {
        imgEl.src = `/img/users/${user.image}`;
      } else {
        imgEl.src = "/img/users/default.jpg"; // Imagen por defecto
      }
    }
  }
}