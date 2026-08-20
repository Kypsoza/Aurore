// storage.js — persistance

const SAVE_KEY = "aube_stellaire_save_v1";

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
