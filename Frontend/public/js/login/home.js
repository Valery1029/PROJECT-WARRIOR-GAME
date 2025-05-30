document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  mostrarNombreUsuario("playerName");

  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  // Opcional: resaltar el link activo en el sidebar
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (link.getAttribute("href").split("/").pop() === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", () => {
      navLinks.forEach(nav => nav.classList.remove("active"));
      link.classList.add("active");
    });
  });
});