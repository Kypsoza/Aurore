// render.js — tout ce qui touche au DOM. Ne modifie jamais le state directement
// (sauf via les callbacks fournis par main.js).

import { ERAS, OWNERSHIP_MILESTONES } from "./config.js";
import { formatNumber, costAt, bulkCost, maxAffordable, ownershipMultiplier } from "./utils.js";

let buyMode = 1; // 1 | 10 | "max"

export function setBuyMode(mode) {
  buyMode = mode;
  document.querySelectorAll("[data-buy-mode]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.buyMode === String(mode));
  });
}

export function renderResources(state) {
  const el = document.getElementById("resource-bar");
  el.innerHTML = "";

  const connChip = document.createElement("div");
  connChip.className = "resource-chip";
  connChip.innerHTML = `<span class="icon">🧠</span><span class="label">Connaissance</span><span class="value">${formatNumber(state.resources.connaissance, state.numberFormat)}</span>`;
  el.appendChild(connChip);

  const era = ERAS.find((e) => e.id === state.currentEra);
  if (era) {
    const sub = era.subResource;
    const chip = document.createElement("div");
    chip.className = "resource-chip";
    chip.innerHTML = `<span class="icon">${sub.icon}</span><span class="label">${sub.name}</span><span class="value">${formatNumber(state.resources[sub.id] || 0, state.numberFormat)}</span>`;
    el.appendChild(chip);
  }

  if (state.chronons > 0) {
    const chip = document.createElement("div");
    chip.className = "resource-chip chronon";
    chip.innerHTML = `<span class="icon">⏳</span><span class="label">Chronons</span><span class="value">${formatNumber(state.chronons, state.numberFormat)}</span>`;
    el.appendChild(chip);
  }
}

export function renderGenerators(state, onBuy) {
  const era = ERAS.find((e) => e.id === state.currentEra);
  const container = document.getElementById("generator-list");
  container.innerHTML = "";
  if (!era) return;

  for (const gen of era.generators) {
    const owned = state.generators[gen.id] || 0;
    const nextCost = costAt(gen.baseCost, gen.costScale, owned);

    let qtyToBuy, totalCost;
    if (buyMode === "max") {
      const { qty, spent } = maxAffordable(gen.baseCost, gen.costScale, owned, state.resources[gen.costResource] || 0);
      qtyToBuy = Math.max(qty, 0);
      totalCost = spent;
    } else {
      qtyToBuy = buyMode;
      totalCost = bulkCost(gen.baseCost, gen.costScale, owned, buyMode);
    }

    const affordable = (state.resources[gen.costResource] || 0) >= totalCost && qtyToBuy > 0;
    const milestoneFactor = ownershipMultiplier(owned, OWNERSHIP_MILESTONES);
    const nextMilestone = OWNERSHIP_MILESTONES.find((m) => m.count > owned);

    const row = document.createElement("div");
    row.className = "generator-row";
    row.innerHTML = `
      <div class="gen-icon">${gen.icon}</div>
      <div class="gen-info">
        <div class="gen-name">${gen.name} <span class="gen-owned">(${owned})</span></div>
        <div class="gen-meta">
          Produit ${gen.produces.map((p) => `+${formatNumber(p.amount * owned * milestoneFactor, state.numberFormat)} ${p.resource}/s`).join(", ")}
          ${milestoneFactor > 1 ? `<span class="milestone-tag">x${milestoneFactor}</span>` : ""}
          ${nextMilestone ? `<span class="milestone-next">prochain palier: ${nextMilestone.count}</span>` : ""}
        </div>
      </div>
      <button class="buy-btn ${affordable ? "" : "disabled"}" data-gen="${gen.id}" data-qty="${qtyToBuy}">
        Acheter ${buyMode === "max" ? `x${qtyToBuy}` : `x${buyMode}`}<br>
        <span class="cost">${formatNumber(totalCost, state.numberFormat)} 🧠</span>
      </button>
    `;
    const btn = row.querySelector(".buy-btn");
    btn.addEventListener("click", () => {
      if (!affordable) return;
      onBuy(gen.id, qtyToBuy, totalCost, gen.costResource);
    });
    container.appendChild(row);
  }
}

export function renderUpgrades(state, onBuyUpgrade) {
  const era = ERAS.find((e) => e.id === state.currentEra);
  const container = document.getElementById("upgrade-list");
  container.innerHTML = "";
  if (!era) return;

  for (const up of era.localUpgrades || []) {
    if (state.upgrades[up.id]) continue; // déjà acheté, on masque
    const affordable = (state.resources[up.costResource] || 0) >= up.cost;
    const card = document.createElement("div");
    card.className = "upgrade-card";
    card.innerHTML = `
      <div class="upgrade-name">${up.name}</div>
      <div class="upgrade-desc">${up.description}</div>
      <button class="buy-btn ${affordable ? "" : "disabled"}">${formatNumber(up.cost, state.numberFormat)} 🧠</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (!affordable) return;
      onBuyUpgrade(up.id, up.cost, up.costResource);
    });
    container.appendChild(card);
  }
}

export function applyEraTheme(eraId) {
  const era = ERAS.find((e) => e.id === eraId);
  document.body.dataset.theme = era ? era.theme : "stone";
}

export function showOfflineModal(gainsInfo, numberFormat) {
  if (gainsInfo.consideredSeconds < 5) return; // pas la peine pour quelques secondes
  const modal = document.getElementById("offline-modal");
  const hours = (gainsInfo.consideredSeconds / 3600).toFixed(1);
  const gainsText = Object.entries(gainsInfo.gains)
    .map(([res, val]) => `+${formatNumber(val, numberFormat)} ${res}`)
    .join(" · ");
  modal.querySelector(".offline-text").textContent = `Pendant votre absence (${hours}h prises en compte) : ${gainsText}`;
  modal.classList.remove("hidden");
}

export function hideOfflineModal() {
  document.getElementById("offline-modal").classList.add("hidden");
}
