// main.js — point d'entrée : orchestre state, simulation, storage et render

import { createInitialState } from "./state.js";
import { saveToLocalStorage, loadFromLocalStorage, exportSaveAsFile, importSaveFromFile, mergeWithDefaults } from "./storage.js";
import { tick, computeOfflineProgress, checkEraUnlocks } from "./simulation.js";
import { TICK_MS } from "./config.js";
import {
  renderResources,
  renderGenerators,
  renderUpgrades,
  renderEraTabs,
  showEraUnlockedToast,
  applyEraTheme,
  setBuyMode,
  showOfflineModal,
  hideOfflineModal,
} from "./render.js";

let state = mergeWithDefaults(loadFromLocalStorage());

function renderAll() {
  applyEraTheme(state.currentEra);
  renderEraTabs(state, switchEra);
  renderResources(state);
  renderGenerators(state, buyGenerator);
  renderUpgrades(state, buyUpgrade);
}

function switchEra(eraId) {
  state.currentEra = eraId;
  renderAll();
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
      state = mergeWithDefaults(imported);
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
    const unlocked = checkEraUnlocks(state);
    if (unlocked) {
      showEraUnlockedToast(unlocked);
      renderAll(); // nouvel onglet à afficher
    } else {
      renderResources(state);
      renderGenerators(state, buyGenerator); // pour rafraîchir les coûts/production affichés
    }
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
  exposeDebugTools();
}

// Outils de test accessibles depuis la console du navigateur (F12) :
//   debugAurore.add("connaissance", 10000)  → ajoute de la ressource
//   debugAurore.addAll(10000)               → ajoute à toutes les ressources connues
//   debugAurore.state                       → inspecter l'état complet
//   debugAurore.reset()                     → repart de zéro
function exposeDebugTools() {
  window.debugAurore = {
    get state() { return state; },
    add(resource, amount) {
      state.resources[resource] = (state.resources[resource] || 0) + amount;
      if (resource === "connaissance") state.stats.totalConnaissanceCumulee += amount;
      renderAll();
    },
    addAll(amount) {
      for (const key of Object.keys(state.resources)) {
        state.resources[key] += amount;
      }
      state.stats.totalConnaissanceCumulee += amount;
      renderAll();
    },
    reset() {
      state = createInitialState();
      renderAll();
    },
  };
  console.log("%cOutils de debug Aurore disponibles via window.debugAurore (voir README).", "color:#c78a4a");
}

document.addEventListener("DOMContentLoaded", init);
