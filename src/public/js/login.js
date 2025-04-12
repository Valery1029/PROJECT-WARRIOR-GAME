/* Author: Valery Escobar
 * Date: 11/04/2025
 */

import Main from "./main.js";
const app = new Main();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("my-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = app.getFormData("my-form");

    try {
      const data = await app.fetchData("http://localhost:3000/gamev1/usersLogin", "POST", {
        api_user: formData.user,
        api_password: formData.password
      });

      localStorage.setItem("token", data.token);
      app.setLocationPage("../../views/game/cards_view.html");

    } catch (err) {
      alert(err.message);
    }
  });
});