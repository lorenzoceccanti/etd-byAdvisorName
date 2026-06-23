// ==UserScript==
// @name         ETD Unipi - Cerca per advisor_name
// @namespace    local.etd.unipi
// @version      1.0
// @description  Aggiunge un box per cercare tesi ETD Unipi per cognome relatore/advisor
// @match        https://etd.adm.unipi.it/ETD-db/ETD-search/*
// @match        https://etd.adm.unipi.it/ETD-db/ETD-search
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const ENDPOINT = "https://etd.adm.unipi.it/ETD-db/ETD-search/search_by_advisor";

  // Evita duplicati se lo script viene reiniettato
  if (document.getElementById("etd-advisor-search-panel")) {
    return;
  }

  const panel = document.createElement("div");
  panel.id = "etd-advisor-search-panel";

  panel.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 6px;">
      Cerca per advisor
    </div>

    <input
      id="etd-advisor-name"
      type="text"
      placeholder="es. Ceccanti"
      style="
        width: 180px;
        padding: 5px;
        border: 1px solid #999;
        border-radius: 4px;
        margin-bottom: 6px;
      "
    />

    <button
      id="etd-advisor-submit"
      style="
        padding: 5px 8px;
        border: 1px solid #666;
        border-radius: 4px;
        cursor: pointer;
      "
    >
      Cerca
    </button>
  `;

  Object.assign(panel.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    zIndex: "999999",
    background: "#f8f8f8",
    color: "#111",
    border: "1px solid #777",
    borderRadius: "6px",
    padding: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px"
  });

  document.body.appendChild(panel);

  const input = document.getElementById("etd-advisor-name");
  const button = document.getElementById("etd-advisor-submit");

  function submitAdvisorSearch() {
    const advisorName = input.value.trim();

    if (!advisorName) {
      alert("Inserisci un cognome advisor, ad esempio: Ceccanti");
      return;
    }

    localStorage.setItem("etd_last_advisor_name", advisorName);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = ENDPOINT;

    const advisorInput = document.createElement("input");
    advisorInput.type = "hidden";
    advisorInput.name = "advisor_name";
    advisorInput.value = advisorName;

    const placeInput = document.createElement("input");
    placeInput.type = "hidden";
    placeInput.name = "place";
    placeInput.value = "0";

    form.appendChild(advisorInput);
    form.appendChild(placeInput);

    document.body.appendChild(form);
    form.submit();
  }

  button.addEventListener("click", submitAdvisorSearch);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitAdvisorSearch();
    }
  });

  const lastAdvisor = localStorage.getItem("etd_last_advisor_name");
  if (lastAdvisor) {
    input.value = lastAdvisor;
  }
})();