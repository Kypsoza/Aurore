// state.js — état centralisé de la partie

import { ERAS } from "./config.js";

export function createInitialState() {
  const generators = {};
  const upgrades = {};
  for (const era of ERAS) {
    for (const gen of era.generators) generators[gen.id] = 0;
    for (const up of era.localUpgrades || []) upgrades[up.id] = false;
  }

  return {
    version: 1,
    resources: {
      connaissance: 70, // amorce : de quoi acheter le 1er Conteur du foyer (60) et démarrer la boucle
      feu: 0,
    },
    generators, // { generatorId: quantitéPossédée }
    upgrades, // { upgradeId: bool }
    currentEra: 1,
    maxEraUnlocked: 1,
    numberFormat: "compact", // compact | scientific | engineering
    chronons: 0, // prestige Tier 1 (Phase 3)
    lastTick: Date.now(),
    lastSave: Date.now(),
    stats: {
      totalConnaissanceCumulee: 0,
      playTimeSeconds: 0,
    },
  };
}

export function eraMultiplier(state, eraId, resource) {
  // Applique les améliorations locales de type era_multiplier (ex: Maîtrise du Feu)
  let factor = 1;
  const era = ERAS.find((e) => e.id === eraId);
  if (!era) return factor;
  for (const up of era.localUpgrades || []) {
    if (
      state.upgrades[up.id] &&
      up.effect.type === "era_multiplier" &&
      up.effect.era === eraId &&
      up.effect.resource === resource
    ) {
      factor *= up.effect.factor;
    }
  }
  return factor;
}
