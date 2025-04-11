document.addEventListener("DOMContentLoaded", () => {
  const game = new Main(null, "my-form", null, null);

  const form = game.getForm(0);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    game.loginUser(0);
  });
});
