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
  {
    id: 2,
    name: "Âge du Bronze / Fer",
    theme: "bronze",
    subResource: { id: "metal", name: "Métal", icon: "⚒️" },
    // Débloquée dès 1 000 Connaissance cumulée au total sur la partie
    unlockCondition: { type: "totalConnaissance", amount: 1000 },
    generators: [
      {
        id: "fonderie_artisanale",
        name: "Fonderie artisanale",
        icon: "🔥⚒️",
        baseCost: 100,
        costScale: 1.08,
        costResource: "connaissance",
        produces: [{ resource: "metal", amount: 0.8 }],
      },
      {
        id: "mine_surface",
        name: "Mine de surface",
        icon: "⛏️",
        baseCost: 250,
        costScale: 1.08,
        costResource: "connaissance",
        produces: [{ resource: "connaissance", amount: 1.2 }],
      },
    ],
    localUpgrades: [
      {
        id: "alliage_renforce",
        name: "Alliage renforcé",
        description: "Double la production de Métal de l'Ère 2.",
        cost: 5000,
        costResource: "connaissance",
        effect: { type: "era_multiplier", era: 2, resource: "metal", factor: 2 },
      },
    ],
  },
  {
    id: 3,
    name: "Antiquité",
    theme: "antique",
    subResource: { id: "parchemin", name: "Parchemin", icon: "📜" },
    // Débloquée à 20 000 Connaissance cumulée au total sur la partie
    unlockCondition: { type: "totalConnaissance", amount: 20000 },
    generators: [
      {
        id: "scribe",
        name: "Scribe",
        icon: "🖋️",
        baseCost: 1200,
        costScale: 1.09,
        costResource: "connaissance",
        produces: [{ resource: "parchemin", amount: 1 }],
      },
      {
        id: "grande_bibliotheque",
        name: "Grande Bibliothèque",
        icon: "🏛️",
        baseCost: 4000,
        costScale: 1.09,
        costResource: "connaissance",
        produces: [{ resource: "connaissance", amount: 3 }],
      },
    ],
    localUpgrades: [
      {
        id: "canon_du_savoir",
        name: "Canon du Savoir",
        description: "Double la production de Parchemin de l'Ère 3.",
        cost: 30000,
        costResource: "connaissance",
        effect: { type: "era_multiplier", era: 3, resource: "parchemin", factor: 2 },
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
