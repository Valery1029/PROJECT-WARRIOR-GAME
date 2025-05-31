document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/gamev1/matches";

  const sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
  const sidebarOffcanvas = document.getElementById("sidebarOffcanvas");
  const navLinks = document.querySelectorAll(".nav-link");
  const matchesContainer = document.getElementById("matchesContainer");
  const addMatchBtn = document.getElementById("addMatchBtn");
  const modalTitle = document.getElementById("modalTitle");
  const matchIdInput = document.getElementById("match-id");
  const matchNameInput = document.getElementById("matchName");
  const matchDurationInput = document.getElementById("matchDuration");
  const matchStatusInput = document.getElementById("matchStatus");
  const matchForm = document.getElementById("matchForm");

  let matches = [];

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

  // Render matches list
  const renderMatches = () => {
    matchesContainer.innerHTML = "";
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
      console.error("Error cargando partidas:", error);
    }
  };

  // Edit match
  window.editMatch = async (id) => {
    const match = matches.find(m => m.match_id === id);
    if (!match) return;

    modalTitle.textContent = "Editar Partida";
    matchIdInput.value = match.match_id;
    matchNameInput.value = match.match_name;
    matchDurationInput.value = match.match_duration;
    matchStatusInput.value = match.match_status;

    const modal = new bootstrap.Modal(document.getElementById("matchModal"));
    modal.show();
  };

  // Delete match
  window.deleteMatch = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta partida?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await loadMatchesFromAPI();
    } catch (error) {
      console.error("Error al eliminar partida:", error);
    }
  };

  // Add new match button click
  addMatchBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Partida";
    matchForm.reset();
    matchIdInput.value = "";
    const modal = new bootstrap.Modal(document.getElementById("matchModal"));
    modal.show();
  });

  // Save match (create/edit)
  matchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      match_name: matchNameInput.value,
      match_duration: matchDurationInput.value,
      match_status: matchStatusInput.value,
    };

    const id = matchIdInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const nuevaPartida = await response.json();
          sessionStorage.setItem("current_match_id", nuevaPartida.match_id);

          console.log("ID de la nueva partida guardado:", nuevaPartida.match_id);
        } else {
          console.error("Error al crear la partida");
        }
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("matchModal"));
      modal.hide();
      matchForm.reset();
      await loadMatchesFromAPI();
    } catch (error) {
      console.error("Error guardando partida:", error);
    }
  });

  // Initialize
  loadMatchesFromAPI();
  mostrarNombreUsuario("playerName");
  inicializarSidebar();
});
