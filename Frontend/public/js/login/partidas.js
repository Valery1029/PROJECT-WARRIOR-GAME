document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/matches";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");
  const matchesContainer = document.getElementById("cardsContainer");

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
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", () => {
      navLinks.forEach(nav => nav.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Render matches list (solo visualizar)
  const renderMatches = () => {
    matchesContainer.innerHTML = "";
    if (matches.length === 0) {
      matchesContainer.innerHTML = `<p class="text-white">No hay partidas disponibles.</p>`;
      return;
    }

    matches.forEach(match => {
      const matchElement = document.createElement("div");
      matchElement.className = "col";
      matchElement.innerHTML = `
        <div class="card h-100">
          <div class="card-body bg-dark text-white">
            <h5 class="card-title">${match.match_name}</h5>
            <p class="card-text">
              Duración: ${match.match_duration} minutos<br/>
              Estado: ${match.match_status}
            </p>
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-success"
                onclick="startMatch(${match.match_id}, this)"
                ${match.match_status === 'en curso' || match.match_status === 'finalizada' ? 'disabled' : ''}>
                ${match.match_status === 'finalizada' ? 'Finalizada' : match.match_status === 'en curso' ? 'En curso' : 'Iniciar'}
              </button>
            </div>
          </div>
        </div>
      `;
      matchesContainer.appendChild(matchElement);
    });
  };

  // Load matches from API
  const loadMatchesFromAPI = async () => {
    try {
      const response = await fetch(API_URL);
      matches = await response.json();
      renderMatches();
    } catch (error) {
      matchesContainer.innerHTML = `<p class="text-danger">Error cargando partidas.</p>`;
      console.error("Error cargando partidas:", error);
    }
  };

  let matches = [];
  loadMatchesFromAPI();
  mostrarNombreUsuario("playerName");
  mostrarImagenPerfil("sidebarImage");
  inicializarSidebar();
});

window.startMatch = async (matchId, button) => {
  try {
    // Obtener los datos actuales de la partida
    const getResponse = await fetch(`http://localhost:3000/gamev1/matches/${matchId}`);
    const match = await getResponse.json();

    // Enviar todos los datos (requeridos) con nuevo estado
    const putResponse = await fetch(`http://localhost:3000/gamev1/matches/${matchId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        match_name: match.match_name,
        match_duration: match.match_duration,
        match_status: "finalizada"
      })
    });

    if (putResponse.ok) {
      button.textContent = "Finalizada";
      button.classList.remove("btn-success");
      button.classList.add("btn-secondary");
      button.disabled = true;

      // Redirigir después de una pausa visual
      setTimeout(() => {
        location.href = "/game";
      }, 500);
    } else {
      console.error("Error actualizando estado de la partida");
    }
  } catch (error) {
    console.error("Error al iniciar partida:", error);
  }
};
