# Guide du Développeur - PetitBot Blocks

## 📚 Table des Matières
1. [Architecture](#architecture)
2. [Anatomie d'un Bloc](#anatomie-dun-bloc)
3. [Types de Blocs](#types-de-blocs)
4. [Guide Pas à Pas](#guide-pas-à-pas)
5. [Styles et Apparence](#styles-et-apparence)
6. [Bonnes Pratiques](#bonnes-pratiques)

## 🏗 Architecture

L'interface est composée de trois fichiers principaux :
- `index.html` : Structure de l'interface
- `style.css` : Styles et apparence des blocs
- `script.js` : Logique et définition des blocs

### Structure des Données
```javascript
const BLOCKS = {
    CATEGORIE: {
        title: 'Nom de la Catégorie',
        blocks: [ /* définitions des blocs */ ]
    }
}
```

## 🧩 Anatomie d'un Bloc

### Structure de Base
```javascript
{
    id: 'mon-bloc',              // Identifiant unique pour le bloc
    name: 'Mon Bloc',            // Nom affiché
    type: 'action',              // Type de bloc (action/control/sensor)
    category: 'ma-categorie',    // Catégorie pour le style
    params: [],                  // Paramètres (optionnel)
    hasContainer: false          // Conteneur pour d'autres blocs (optionnel)
}
```

### Types de Paramètres
```javascript
// Paramètre numérique
{
    name: 'vitesse',
    type: 'number',
    default: '10',
    suffix: 'pas'
}

// Paramètre de sélection
{
    name: 'direction',
    type: 'select',
    options: ['gauche', 'droite'],
    default: 'gauche'
}
```

## 🎨 Types de Blocs

### 1. Bloc d'Action Simple
```javascript
{
    id: 'avancer',
    name: 'Avancer',
    type: 'action',
    category: 'movement'
}
```

### 2. Bloc avec Paramètres
```javascript
{
    id: 'avancer-pas',
    name: 'Avancer de',
    type: 'action',
    category: 'movement',
    params: [{
        name: 'steps',
        type: 'number',
        default: '10',
        suffix: 'pas'
    }]
}
```

### 3. Bloc de Contrôle
```javascript
{
    id: 'repeter',
    name: 'Répéter',
    type: 'control',
    hasContainer: true,
    params: [{
        name: 'times',
        type: 'number',
        default: '10',
        suffix: 'fois'
    }]
}
```

### 4. Bloc Capteur
```javascript
{
    id: 'lire-distance',
    name: 'Lire Distance',
    type: 'sensor',
    category: 'sensor'
}
```

## 📝 Guide Pas à Pas

### 1. Ajouter un Nouveau Bloc

1. Définir le bloc dans `script.js` :
```javascript
BLOCKS.CATEGORIE.blocks.push({
    id: 'mon-bloc',
    name: 'Mon Bloc',
    type: 'action',
    category: 'ma-categorie'
});
```

2. Ajouter le style dans `style.css` :
```css
.block-category-ma-categorie {
    background: #4C6EF5;
}

.icons-mode .block[data-block-type="mon-bloc"]::before {
    content: "🔵";
    font-size: 1.5rem;
}
```

3. Ajouter la logique d'exécution dans `executeBlock()` :
```javascript
case 'mon-bloc':
    await executeCommand('ma-commande');
    break;
```

### 2. Ajouter une Nouvelle Catégorie

1. Définir la catégorie dans `script.js` :
```javascript
BLOCKS.NOUVELLE_CATEGORIE = {
    title: 'Nouvelle Catégorie',
    blocks: []
};
```

2. Ajouter la section HTML :
```html
<div class="category-section">
    <div class="category-header" data-category="NOUVELLE_CATEGORIE">
        <span class="category-icon">🆕</span>
        <span class="category-title">Nouvelle Catégorie</span>
    </div>
    <div class="category-blocks" id="NOUVELLE_CATEGORIE-blocks"></div>
</div>
```

## 🎯 Styles et Apparence

### Couleurs des Blocs
```css
/* Style de base */
.block-category-custom {
    background: #HEX-COLOR;
}

/* Effets de survol */
.block-category-custom:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}
```

### Mode Icônes
```css
/* Icône pour le mode sans texte */
.icons-mode .block[data-block-type="mon-bloc"]::before {
    content: "🔵";
    font-size: 1.5rem;
}

/* Style du conteneur en mode icônes */
.icons-mode .block {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

## ✅ Bonnes Pratiques

### Nommage
- Utiliser des ID uniques et descriptifs
- Préfixer les ID par la catégorie
- Utiliser des noms clairs et explicites

### Paramètres
- Définir des valeurs par défaut cohérentes
- Limiter le nombre de paramètres (max 2-3)
- Utiliser des unités appropriées

### Style
- Maintenir une cohérence visuelle
- Choisir des icônes explicites
- Respecter la palette de couleurs existante

### Commandes
- Vérifier la compatibilité avec le PetitBot
- Gérer les erreurs de communication
- Documenter les nouvelles commandes

### Tests
1. Vérifier le fonctionnement en mode texte
2. Vérifier le fonctionnement en mode icônes
3. Tester l'imbrication (si applicable)
4. Valider les paramètres
5. Tester les cas d'erreur

## 🔍 Débogage

### Console du Navigateur
```javascript
// Afficher l'état des blocs
console.log('Programme:', programBlocks);

// Déboguer une commande
console.log('Commande:', command);
```

### Erreurs Communes
1. ID en double
2. Paramètres mal configurés
3. Commandes non supportées
4. Styles CSS manquants
5. Icônes non définies

### Solutions
- Vérifier les ID uniques
- Valider la syntaxe JSON
- Tester les commandes HTTP
- Inspecter les styles CSS
- Vérifier le mode icônes 