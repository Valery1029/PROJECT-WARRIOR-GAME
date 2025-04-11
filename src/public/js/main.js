/* Author: Valery Escobar
 * Date: 11/04/2025
 */

class Main {
  constructor(modalId, formId, classEdit, preloadId) {
    // Props de Main
    this.myModal = Array.isArray(modalId)
      ? modalId.map(id => new bootstrap.Modal(document.getElementById(id)))
      : [new bootstrap.Modal(document.getElementById(modalId))];

    this.myForm = Array.isArray(formId)
      ? formId.map(id => document.getElementById(id))
      : [document.getElementById(formId)];

    this.classEdit = classEdit;
    this.elementJson = {};
    this.fromData = new FormData();
    this.preload = document.getElementById(preloadId);

    // Props de juego
    this.maxCards = 5;
    this.selectedCards = [];
    this.currentPlayer = 1;
    this.players = { 1: [], 2: [] };
  }

  // 🌀 Utilidades UI
  showPreload() {
    if (this.preload) this.preload.style.display = "block";
  }

  hiddenPreload() {
    if (!this.preload) return;
    let op = 1;
    const fade = setInterval(() => {
      if (op <= 0.1) {
        this.preload.style.display = "none";
        clearInterval(fade);
      }
      this.preload.style.opacity = op;
      op -= 0.1;
    }, 100);
  }

  showModal(pos = 0) {
    this.myModal[pos].show();
  }

  hiddenModal(pos = 0) {
    this.myModal[pos].hide();
  }

  setLocationPage(url) {
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }

  // 📝 Formularios
  getForm(pos = 0) {
    return this.myForm[pos];
  }

  resetForm(pos = 0) {
    const inputs = this.myForm[pos].querySelectorAll("input");
    const selects = this.myForm[pos].querySelectorAll("select");
    inputs.forEach(i => (i.value = ""));
    selects.forEach(s => (s.value = ""));
    this.myForm[pos].reset();
  }

  getDataFormJson(pos = 0) {
    const form = this.myForm[pos].querySelectorAll("input, select");
    const data = {};
    form.forEach(el => {
      if (el.id) {
        if (el.type === "checkbox") {
          data[el.id] = el.checked;
        } else {
          data[el.id] = el.value.trim();
        }
      }
    });
    return data;
  }

  setDataFormJson(json, pos = 0) {
    const elements = this.myForm[pos].querySelectorAll("input,select");
    const keys = Object.keys(json);
    for (const el of elements) {
      if (keys.includes(el.id)) {
        if (el.type === "checkbox") {
          el.checked = json[el.id] ? true : false;
        } else {
          el.value = json[el.id];
        }
      }
    }
  }

  setValidateForm(pos = 0) {
    const form = this.myForm[pos];
    const inputs = form.querySelectorAll("input");
    const selects = form.querySelectorAll("select");
    let valid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        this.showMessageError(input);
        valid = false;
      }
    });

    selects.forEach(select => {
      if (select.value === "0" || select.value === "") {
        select.focus();
        valid = false;
      }
    });

    if (valid) this.hiddenMessageError();
    return valid;
  }

  validateInput(input) {
    switch (input.type) {
      case "text": return this.validateText(input);
      case "email": return this.validateEmail(input);
      case "password": return this.validatePassword(input);
      case "number": return this.validateNumber(input);
      default: return true;
    }
  }

  validateText(input) {
    return input.value.trim().length >= 4;
  }

  validateEmail(input) {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(input.value);
  }

  validatePassword(input) {
    return input.value.length >= 8;
  }

  validateNumber(input) {
    return !isNaN(input.value);
  }

  showMessageError(input) {
    input.classList.add("error");
    const span = document.createElement("span");
    span.classList.add("message-error");
    span.textContent = "Este campo es inválido";
    input.parentNode.appendChild(span);
  }

  hiddenMessageError() {
    document.querySelectorAll(".message-error").forEach(el => (el.innerHTML = ""));
  }

  // 📋 Tablas y selects
  createTable(data, id, actions) {
    const table = document.getElementById(id);
    table.innerHTML = "";
    let html = "";

    data.forEach(row => {
      let rowHtml = "";
      const entries = Object.entries(row);
      entries.forEach(([_, val]) => {
        rowHtml += `<td>${val}</td>`;
      });

      if (actions) {
        rowHtml += `<td class="text-center">
          <div class="btn-group">
            <button class="btn btn-warning" onclick="${LIST_CRUD[5]}(${entries[0][1]})"><i class="${LIST_CRUD_ICONS[5]}"></i></button>
            <button class="btn btn-success" onclick="${LIST_CRUD[1]}(${entries[0][1]})"><i class="${LIST_CRUD_ICONS[1]}"></i></button>
            <button class="btn btn-danger" onclick="${LIST_CRUD[3]}(${entries[0][1]})"><i class="${LIST_CRUD_ICONS[3]}"></i></button>
          </div>
        </td>`;
      }

      html += `<tr>${rowHtml}</tr>`;
    });

    table.innerHTML = html;
  }

  createSelect(data, id) {
    const select = document.getElementById(id);
    select.innerHTML = '<option selected value="">Selecciona una opción</option>';
    data.forEach(item => {
      const [idKey, nameKey] = Object.entries(item);
      select.innerHTML += `<option value="${idKey[1]}">${nameKey[1]}</option>`;
    });
  }

  createCard(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    data.forEach(item => {
      container.innerHTML += `
        <div class="card col-3 mx-auto" style="margin:0.28em;">
          <img src="${item.image || '/img/default.jpg'}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Poder: ${item.power}</p>
            <button class="btn btn-primary" onclick="alert(${item.id})">Seleccionar</button>
          </div>
        </div>`;
    });
  }

  // 🃏 Funciones del juego de cartas
  renderCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    data.forEach(card => {
      container.innerHTML += `
        <div class="card" onclick="game.selectCard(${card.id}, this)">
          <img src="${card.image}" alt="${card.name}">
          <h4>${card.name}</h4>
          <p>Poder: ${card.power}</p>
        </div>
      `;
    });
  }

  selectCard(cardId, cardElement) {
    if (this.selectedCards.includes(cardId)) {
      this.selectedCards = this.selectedCards.filter(id => id !== cardId);
      cardElement.classList.remove("selected");
    } else if (this.selectedCards.length < this.maxCards) {
      this.selectedCards.push(cardId);
      cardElement.classList.add("selected");
    }

    const counter = document.getElementById("counter");
    if (counter) counter.textContent = this.selectedCards.length;
  }

  confirmSelection() {
    if (this.selectedCards.length !== this.maxCards) {
      alert("Debes seleccionar exactamente 5 cartas.");
      return;
    }

    this.players[this.currentPlayer] = [...this.selectedCards];
    this.selectedCards = [];

    if (this.currentPlayer === 1) {
      localStorage.setItem("player1", JSON.stringify(this.players[1]));
      window.location.href = "/select-cards?player=2";
    } else {
      localStorage.setItem("player2", JSON.stringify(this.players[2]));
      window.location.href = "/battle";
    }
  }

  loadPlayersFromStorage() {
    this.players[1] = JSON.parse(localStorage.getItem("player1")) || [];
    this.players[2] = JSON.parse(localStorage.getItem("player2")) || [];
  }

  simulateBattle(cards1, cards2) {
    const total1 = cards1.reduce((acc, c) => acc + c.power, 0);
    const total2 = cards2.reduce((acc, c) => acc + c.power, 0);
    return total1 > total2 ? "Jugador 1 gana" : total2 > total1 ? "Jugador 2 gana" : "Empate";
  }
}