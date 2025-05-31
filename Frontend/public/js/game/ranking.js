document.addEventListener("DOMContentLoaded", async () => {
  const API_URL_WINNERS = "http://localhost:3000/gamev1/winners";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");
  const rankingTableBody = document.getElementById("rankingTableBody");
  const playerNameEl = document.getElementById("playerName");
  const sidebarImageEl = document.getElementById("sidebarImage");

  // Sidebar toggle button show/hide logic
  sidebarOffcanvas.addEventListener("shown.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "none";
  });
  sidebarOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
    sidebarToggleBtn.style.display = "block";
  });

  // Highlight active nav link
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

  // Mostrar nombre de usuario desde sesión
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

  // Mostrar imagen de perfil si está guardada
  function mostrarImagenPerfil() {
    const imgUrl = sessionStorage.getItem("user_image_url") || "/img/logos/jjk.jpg";
    if (sidebarImageEl) sidebarImageEl.src = imgUrl;
  }

  // Evitar XSS en los datos
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (match) => {
      const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return escapeMap[match];
    });
  }

  // Renderizar ranking en tabla
  function renderRankingTable(winners) {
    rankingTableBody.innerHTML = "";
    if (!winners.length) {
      rankingTableBody.innerHTML = `<tr><td colspan="3" class="text-white">No hay ganadores registrados aún.</td></tr>`;
      return;
    }
    winners.forEach((winner, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(winner.winner_name)}</td>
        <td>${winner.partidas_ganadas}</td>
      `;
      rankingTableBody.appendChild(row);
    });
  }

  // Cargar ranking desde API
  async function cargarRankingGanadores() {
    try {
      const res = await fetch(API_URL_WINNERS);
      if (!res.ok) throw new Error(`Error al obtener ganadores: ${res.statusText}`);
      let winners = await res.json();
      winners.sort((a, b) => b.partidas_ganadas - a.partidas_ganadas);
      renderRankingTable(winners);
    } catch (error) {
      console.error("Error cargando ranking de ganadores:", error);
      if (rankingTableBody) {
        rankingTableBody.innerHTML = `<tr><td colspan="3" class="text-danger">No se pudo cargar el ranking.</td></tr>`;
      }
    }
  }

  // Inicializar sidebar (puede incluir otras configuraciones si necesitas)
  function inicializarSidebar() {
    // Por ahora, solo un placeholder
  }

  // Placeholder para loadMatchesFromAPI (defínela según necesites)
  async function loadMatchesFromAPI() {
    console.log("loadMatchesFromAPI llamada");
    // Lógica para cargar partidas
  }

  // Llamadas finales
  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil();
  inicializarSidebar();

  await cargarRankingGanadores();

  loadMatchesFromAPI();
});
