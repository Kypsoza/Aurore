# L'Aube Stellaire — Roadmap de développement par phases

Choix techniques retenus pour ce projet :
- **Vanilla JavaScript (ES Modules)**, sans build step, comme Age to Age. Zéro compilation = zéro risque de casse à l'hébergement sur GitHub Pages, juste des fichiers `.js` servis tels quels. (Le cahier des charges mentionnait TypeScript ; on peut migrer plus tard si besoin, mais ça ajoute un step de build à maintenir sur GitHub Pages — dites-moi si vous y tenez.)
- Architecture **data-driven** : chaque ère est décrite comme des objets de config (générateurs, coûts, sous-ressource) dans `config.js`, pas codée en dur dans la logique. Ça permet d'ajouter les Ères 2 à 10 sans réécrire le moteur.
- State centralisé (`state.js`), boucle de simulation à tick fixe (`simulation.js`), rendu séparé de la logique (`render.js`).

## Phase 0 — Socle & architecture (fait dans cette session)
- Structure de fichiers, state management, moteur de tick, formatage des nombres (compact/scientifique/ingénieur)
- Sauvegarde auto `localStorage` + export/import `.json`
- Squelette UI thématisable par ère (variables CSS)

## Phase 1 — Ère 1 : Âge de Pierre (fait dans cette session)
- Générateurs Tailleur de silex / Conteur du foyer, sous-ressource Feu, ressource Connaissance
- Formule de coût `C0 × 1.07^k`, achat unité/x10/max
- Milestones de possession (10/25/50/100/250 → multiplicateurs)
- Panneau de ressources, liste de générateurs, thème "terre/ocre"

## Phase 2 — Ères 2 & 3 (Bronze/Fer, Antiquité)
- Généralisation du système à N ères actives simultanément (le joueur peut faire avancer plusieurs ères en parallèle une fois débloquées, ou ères séquentielles — **à trancher avec vous**)
- Sous-ressources Métal, Parchemin + leurs générateurs
- Déblocage d'ère (condition + transition visuelle/thème)

## Phase 3 — Prestige Tier 1 : "l'Éon" (Chronons)
- Condition d'activation (Ère 4 débloquée OU 10⁸ Connaissance cumulée)
- Formule de gain, reset de la run, bonus passif +1%/Chronon non dépensé
- Écran de confirmation de prestige (à ne pas déclencher par erreur — retour d'expérience Age to Age : pas de reset accidentel)

## Phase 4 — Ères 4, 5, 6 (Renaissance, Industrielle, Atomique)
- Contenu générateurs/sous-ressources, coefficients d'échelle croissants (E_ère)
- Maîtrise d'Ère (+0,1%/min plafonné)

## Phase 5 — Arbre de talents radial
- Rendu SVG ~100 nœuds en 4 quadrants (Nord/Est/Sud/Ouest), lignes de dépendance
- Nœuds standards (5 niveaux) vs nœuds terminaux (100 niveaux, talent spécial)
- Dépense des Chronons

## Phase 6 — Ères 7, 8, 9, 10 (Numérique → Nuage de Oort)
- Contenu générateurs/sous-ressources restants
- Mur de progression Ère 10 (E₁₀ = 1,22)

## Phase 7 — Anomalies Temporelles (défis)
- Runs à contraintes (coûts augmentés, sous-ressources accélérées)
- Récompense en Éclats Temporels (nécessaires pour les nœuds terminaux)

## Phase 8 — Prestige Tier 2 : "Singularité"
- Reset complet de l'arbre radial en fin d'Ère 10 → Essence Stellaire
- Nouvelles branches débloquées sur l'arbre radial

## Phase 9 — Offline Engine complet & PWA
- Calcul offline précis à l'ouverture (diff de timestamp), base 8h/50%, extensible via arbre
- `manifest.json` + Service Worker (installable, cache assets, fonctionnement 100% offline)

## Phase 10 — Onboarding, QoL, Succès
- Tutoriel interactif première session
- Encyclopédie/guide intégré
- Réglage format des nombres
- Succès/achievements (+1% permanent cumulatif par succès)

## Phase 11 — Polish, équilibrage, QA
- Passes d'équilibrage des courbes de coût/production par ère
- Suivi de bugs (même logique que le classeur QA d'Age to Age si vous voulez centraliser)

---
**Convention de suivi** : à la fin de chaque phase développée, je vous donnerai un mini-changelog "à tester" comme pour Age to Age, pour que vous puissiez le reporter dans un suivi QA si vous en montez un pour ce projet.
