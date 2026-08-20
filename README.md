# Aurore

Jeu incrémental / idle spatial à métaprogression — de l'Âge de Pierre au Nuage de Oort.

🔗 **Jouer** : https://kypsoza.github.io/Aurore/

## Choix techniques
- Vanilla JavaScript (ES Modules), sans build step, pour un hébergement GitHub Pages simple sans étape de compilation.
- Architecture data-driven : chaque ère est décrite comme des objets de config (générateurs, coûts, sous-ressource) dans `js/config.js`, pas codée en dur dans la logique. Ça permet d'ajouter les Ères 2 à 10 sans réécrire le moteur.
- State centralisé (`js/state.js`), boucle de simulation à tick fixe (`js/simulation.js`), rendu séparé de la logique (`js/render.js`).

## Structure du dépôt
```
index.html
css/style.css
js/config.js       # données de jeu (ères, générateurs, coûts)
js/state.js         # état centralisé de la partie
js/simulation.js    # tick loop, production, calcul offline
js/storage.js        # localStorage + export/import JSON
js/render.js          # rendu DOM
js/utils.js           # formatage des nombres, calculs de coûts
js/main.js            # point d'entrée, orchestration
docs/PHASING.md        # roadmap détaillée (ce même contenu, en plus long)
```

## Roadmap du projet

### Phase 0 — Socle & architecture ✅
Structure de fichiers, state management, moteur de tick, formatage des nombres (compact/scientifique/ingénieur), sauvegarde auto `localStorage` + export/import `.json`, squelette UI thématisable par ère.

### Phase 1 — Ère 1 : Âge de Pierre ✅
Générateurs Tailleur de silex / Conteur du foyer, sous-ressource Feu, ressource Connaissance, coût `C0 × 1.07^k`, achat unité/x10/max, milestones de possession (10/25/50/100/250 → multiplicateurs), panneau de ressources, thème "terre/ocre".

### Phase 2 — Ères 2 & 3 (Bronze/Fer, Antiquité)
Généralisation du système à plusieurs ères actives, sous-ressources Métal et Parchemin + générateurs, déblocage d'ère (condition + transition visuelle/thème).

### Phase 3 — Prestige Tier 1 : "l'Éon" (Chronons)
Condition d'activation (Ère 4 débloquée OU 10⁸ Connaissance cumulée), formule de gain, reset de la run, bonus passif +1%/Chronon non dépensé, écran de confirmation de prestige.

### Phase 4 — Ères 4, 5, 6 (Renaissance, Industrielle, Atomique)
Contenu générateurs/sous-ressources, coefficients d'échelle croissants (E_ère), Maîtrise d'Ère (+0,1%/min plafonné).

### Phase 5 — Arbre de talents radial
Rendu SVG ~100 nœuds en 4 quadrants (Nord/Est/Sud/Ouest), lignes de dépendance, nœuds standards (5 niveaux) vs nœuds terminaux (100 niveaux), dépense des Chronons.

### Phase 6 — Ères 7, 8, 9, 10 (Numérique → Nuage de Oort)
Contenu générateurs/sous-ressources restants, mur de progression Ère 10 (E₁₀ = 1,22).

### Phase 7 — Anomalies Temporelles (défis)
Runs à contraintes (coûts augmentés, sous-ressources accélérées), récompense en Éclats Temporels.

### Phase 8 — Prestige Tier 2 : "Singularité"
Reset complet de l'arbre radial en fin d'Ère 10 → Essence Stellaire, nouvelles branches débloquées.

### Phase 9 — Offline Engine complet & PWA
Calcul offline précis à l'ouverture (diff de timestamp), base 8h/50%, extensible via arbre, `manifest.json` + Service Worker (installable, cache assets, 100% offline).

### Phase 10 — Onboarding, QoL, Succès
Tutoriel interactif première session, encyclopédie/guide intégré, réglage format des nombres, succès/achievements (+1% permanent cumulatif par succès).

### Phase 11 — Polish, équilibrage, QA
Passes d'équilibrage des courbes de coût/production par ère, suivi de bugs.
