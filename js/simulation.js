// simulation.js — logique de production, tick loop, calcul offline

import { ERAS, TICK_MS, OFFLINE_BASE_HOURS, OFFLINE_BASE_EFFICIENCY, OWNERSHIP_MILESTONES } from "./config.js";
import { eraMultiplier } from "./state.js";
import { ownershipMultiplier } from "./utils.js";

// Production par seconde pour l'état courant (toutes ères actives confondues)
export function computeProductionPerSecond(state) {
  const production = {}; // { resourceId: quantité/s }

  for (const era of ERAS) {
    if (era.id > state.maxEraUnlocked) continue;
    for (const gen of era.generators) {
      const owned = state.generators[gen.id] || 0;
      if (owned <= 0) continue;
      const milestoneFactor = ownershipMultiplier(owned, OWNERSHIP_MILESTONES);
      for (const p of gen.produces) {
        const localFactor = eraMultiplier(state, era.id, p.resource);
        const amount = p.amount * owned * milestoneFactor * localFactor;
        production[p.resource] = (production[p.resource] || 0) + amount;
      }
    }
  }
  return production;
}

// Applique `seconds` de production au state (mute le state, retourne les gains)
export function applyProduction(state, seconds, efficiency = 1) {
  const perSecond = computeProductionPerSecond(state);
  const gains = {};
  for (const [resource, rate] of Object.entries(perSecond)) {
    const gained = rate * seconds * efficiency;
    state.resources[resource] = (state.resources[resource] || 0) + gained;
    gains[resource] = gained;
  }
  if (gains.connaissance) {
    state.stats.totalConnaissanceCumulee += gains.connaissance;
  }
  return gains;
}

// Un tick de jeu en temps réel (appelé par le setInterval du main loop)
export function tick(state) {
  const seconds = TICK_MS / 1000;
  applyProduction(state, seconds, 1);
  state.stats.playTimeSeconds += seconds;
  state.lastTick = Date.now();
}

// Est-ce que la condition de déblocage d'une ère est remplie ? (Phase 2)
export function isUnlockConditionMet(era, state) {
  if (!era.unlockCondition) return true;
  const c = era.unlockCondition;
  if (c.type === "totalConnaissance") {
    return state.stats.totalConnaissanceCumulee >= c.amount;
  }
  return false;
}

// Débloque séquentiellement la prochaine ère si sa condition est remplie.
// Retourne l'ère nouvellement débloquée, ou null.
export function checkEraUnlocks(state) {
  const next = ERAS.find((e) => e.id === state.maxEraUnlocked + 1);
  if (next && isUnlockConditionMet(next, state)) {
    state.maxEraUnlocked = next.id;
    return next;
  }
  return null;
}

// Calcul de la production accumulée pendant l'absence du joueur
export function computeOfflineProgress(state, offlineExtensionHours = 0, offlineExtensionEfficiency = 0) {
  const now = Date.now();
  const elapsedSeconds = Math.max(0, (now - state.lastTick) / 1000);

  const baseSeconds = OFFLINE_BASE_HOURS * 3600;
  const extSeconds = offlineExtensionHours * 3600;
  const cappedSeconds = Math.min(elapsedSeconds, baseSeconds + extSeconds);

  const baseCappedSeconds = Math.min(cappedSeconds, baseSeconds);
  const extCappedSeconds = Math.max(0, cappedSeconds - baseSeconds);

  const baseGains = applyProduction(state, baseCappedSeconds, OFFLINE_BASE_EFFICIENCY);
  const extGains = extCappedSeconds > 0
    ? applyProduction(state, extCappedSeconds, offlineExtensionEfficiency)
    : {};

  state.lastTick = now;

  const totalGains = {};
  for (const [k, v] of Object.entries(baseGains)) totalGains[k] = (totalGains[k] || 0) + v;
  for (const [k, v] of Object.entries(extGains)) totalGains[k] = (totalGains[k] || 0) + v;

  return {
    elapsedSeconds,
    consideredSeconds: cappedSeconds,
    gains: totalGains,
  };
}
