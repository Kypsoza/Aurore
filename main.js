// main.js — point d'entrée : orchestre state, simulation, storage et render

import { createInitialState } from "./state.js";
import { saveToLocalStorage, loadFromLocalStorage, exportSaveAsFile, importSaveFromFile } from "./storage.js";
import { tick, computeOfflineProgress } from "./simulation.js";
import { TICK_MS } from "./config.js";
import {
  renderResources,
  renderGenerators,
  renderUpgrades,
  applyEraTheme,
  setBuyMode,
  showOfflineModal,
  hideOfflineModal,
} from "./render.js";

let state = loadFromLocalStorage() || createInitialState();

function renderAll() {
  applyEraTheme(state.currentEra);
  renderResources(state);
  renderGenerators(state, buyGenerator);
  renderUpgrades(state, buyUpgrade);
}

function buyGenerator(genId, qty, cost, costResource) {
  if (qty <= 0) return;
  state.resources[costResource] -= cost;
  state.generators[genId] += qty;
  renderAll();
}

function buyUpgrade(upId, cost, costResource) {
  state.resources[costResource] -= cost;
  state.upgrades[upId] = true;
  renderAll();
}

function setupBuyModeButtons() {
  document.querySelectorAll("[data-buy-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.dataset.buyMode;
      setBuyMode(raw === "max" ? "max" : Number(raw));
      renderAll();
    });
  });
  setBuyMode(1);
}

function setupSaveControls() {
  document.getElementById("export-save").addEventListener("click", () => {
    exportSaveAsFile(state);
  });
  document.getElementById("import-save").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importSaveFromFile(file);
      state = imported;
      renderAll();
    } catch (err) {
      alert("Fichier de sauvegarde invalide.");
    }
  });
  document.getElementById("offline-modal-close").addEventListener("click", hideOfflineModal);
}

function startGameLoop() {
  setInterval(() => {
    tick(state);
    renderResources(state);
    renderGenerators(state, buyGenerator); // pour rafraîchir les coûts/production affichés
  }, TICK_MS);

  setInterval(() => saveToLocalStorage(state), 10000); // autosave 10s
  window.addEventListener("beforeunload", () => saveToLocalStorage(state));
}

function handleOfflineCatchUp() {
  const info = computeOfflineProgress(state); // extension offline = 0h tant que l'arbre radial n'existe pas (Phase 5+)
  showOfflineModal(info, state.numberFormat);
}

function init() {
  setupBuyModeButtons();
  setupSaveControls();
  handleOfflineCatchUp();
  renderAll();
  startGameLoop();
}

document.addEventListener("DOMContentLoaded", init);
