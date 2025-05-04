/* Author: Valery Escobar
 * Date: 11/04/2025
 */

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleRegister = document.getElementById("toggle-register");
const toggleLogin = document.getElementById("toggle-login");

// LOGIN
loginForm.addEventListener("submit", async (e) => {
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
      alert(data.error || "Error al iniciar sesión");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "../../views/game/cards_view.html";
  } catch (error) {
    alert("Error de conexión con el servidor.");
    console.error("Error en el login:", error);
  }
});

// REGISTRO
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirm = document.getElementById("register-confirm").value.trim();

  if (password !== confirm) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/gamev1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Error al registrar la cuenta");
      return;
    }

    alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
    toggleLogin.click();
  } catch (error) {
    alert("Error al registrar la cuenta.");
    console.error("Error en el registro:", error);
  }
});

// CAMBIO ENTRE LOGIN Y REGISTRO
toggleRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  document.querySelector(".login-header").textContent = "Create Your Account";
});

toggleLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  document.querySelector(".login-header").textContent = "Hello! Welcome Back";
});