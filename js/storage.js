// storage.js — persistance

import { createInitialState } from "./state.js";

const SAVE_KEY = "aube_stellaire_save_v1";

// Fusionne une sauvegarde (potentiellement ancienne) avec un état frais :
// toute clé absente de la sauvegarde (nouveau générateur/amélioration ajouté
// depuis) reçoit sa valeur par défaut au lieu de rester `undefined`.
export function mergeWithDefaults(saved) {
  const fresh = createInitialState();
  if (!saved) return fresh;
  return {
    ...fresh,
    ...saved,
    resources: { ...fresh.resources, ...saved.resources },
    generators: { ...fresh.generators, ...saved.generators },
    upgrades: { ...fresh.upgrades, ...saved.upgrades },
    stats: { ...fresh.stats, ...saved.stats },
  };
}

export function saveToLocalStorage(state) {
  state.lastSave = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Échec de sauvegarde locale", e);
    return false;
  }
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Échec de chargement de la sauvegarde", e);
    return null;
  }
}

export function exportSaveAsFile(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aube-stellaire-save-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSaveFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
