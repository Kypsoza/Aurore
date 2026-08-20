// config.js — Toutes les données du jeu, séparées de la logique.
// Ajouter une ère = ajouter une entrée ici (Phase 2+), pas modifier le moteur.

export const ERAS = [
  {
    id: 1,
    name: "Âge de Pierre",
    theme: "stone",
    subResource: { id: "feu", name: "Feu", icon: "🔥" },
    unlockCondition: null, // première ère, toujours débloquée
    generators: [
      {
        id: "tailleur_silex",
        name: "Tailleur de silex",
        icon: "🪨",
        baseCost: 10,
        costScale: 1.07, // E_ère Phase 0/1
        costResource: "connaissance",
        produces: [{ resource: "feu", amount: 0.5 }],
      },
      {
        id: "conteur_foyer",
        name: "Conteur du foyer",
        icon: "🗣️",
        baseCost: 60,
        costScale: 1.07,
        costResource: "connaissance",
        produces: [{ resource: "connaissance", amount: 0.3 }],
      },
    ],
    // Multiplicateur d'amélioration locale citée dans le cahier des charges
    localUpgrades: [
      {
        id: "maitrise_du_feu",
        name: "Maîtrise du Feu",
        description: "Double la production de Feu de l'Ère 1.",
        cost: 500,
        costResource: "connaissance",
        effect: { type: "era_multiplier", era: 1, resource: "feu", factor: 2 },
      },
    ],
  },
];

// Paliers de possession → multiplicateur (Phase 0/1)
export const OWNERSHIP_MILESTONES = [
  { count: 10, factor: 2 },
  { count: 25, factor: 4 },
  { count: 50, factor: 8 },
  { count: 100, factor: 16 },
  { count: 250, factor: 32 },
];

export const TICK_MS = 200; // fréquence de simulation
export const OFFLINE_BASE_HOURS = 8;
export const OFFLINE_BASE_EFFICIENCY = 0.5;
