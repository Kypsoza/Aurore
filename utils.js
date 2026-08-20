// utils.js — helpers génériques

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export function formatNumber(value, format = "compact") {
  if (value === null || value === undefined || Number.isNaN(value)) return "0";
  const abs = Math.abs(value);

  if (format === "scientific" || format === "engineering") {
    if (abs < 1000) return value.toFixed(2);
    const exp = format === "engineering"
      ? Math.floor(Math.log10(abs) / 3) * 3
      : Math.floor(Math.log10(abs));
    const mantissa = value / Math.pow(10, exp);
    const eChar = format === "engineering" ? "E" : "e";
    return `${mantissa.toFixed(2)}${eChar}${exp}`;
  }

  // compact (défaut)
  if (abs < 1000) return value.toFixed(abs < 10 ? 2 : 1).replace(/\.0$/, "");
  const tier = Math.min(Math.floor(Math.log10(abs) / 3), SUFFIXES.length - 1);
  const scaled = value / Math.pow(10, tier * 3);
  return `${scaled.toFixed(2)} ${SUFFIXES[tier]}`.trim();
}

export function costAt(baseCost, scale, owned) {
  return baseCost * Math.pow(scale, owned);
}

// Coût cumulé pour acheter `qty` unités à partir de `owned`
export function bulkCost(baseCost, scale, owned, qty) {
  let total = 0;
  for (let i = 0; i < qty; i++) {
    total += costAt(baseCost, scale, owned + i);
  }
  return total;
}

// Combien peut-on acheter au max avec `budget`
export function maxAffordable(baseCost, scale, owned, budget) {
  let qty = 0;
  let spent = 0;
  while (true) {
    const next = costAt(baseCost, scale, owned + qty);
    if (spent + next > budget) break;
    spent += next;
    qty++;
    if (qty > 100000) break; // garde-fou
  }
  return { qty, spent };
}

export function ownershipMultiplier(owned, milestones) {
  let factor = 1;
  for (const m of milestones) {
    if (owned >= m.count) factor = m.factor;
  }
  return factor;
}
