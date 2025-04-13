/* Author: Valery Escobar
 * Date: 11/04/2025
 */

const form = document.getElementById("my-form");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://localhost:3000/gamev1/usersLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.error || "Error al iniciar sesión";
      return;
    }

    // Guardar token si lo necesitas
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirigir a la vista cards_view
    window.location.href = "../../views/game/cards_view.html";
  } catch (error) {
    errorMsg.textContent = "Error de conexión con el servidor.";
    console.error("Error en el login:", error);
  }
});