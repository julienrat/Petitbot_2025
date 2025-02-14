# Interface de Programmation par Blocs pour PetitBot

Cette interface permet de programmer visuellement le PetitBot en utilisant des blocs de programmation. Elle est conçue pour être intuitive et accessible à tous, avec un mode texte et un mode icônes.

## 🌟 Fonctionnalités

- Interface drag & drop intuitive
- Mode texte et mode icônes
- Blocs de contrôle avec imbrication
- Sauvegarde automatique des préférences
- Communication directe avec le PetitBot
- Support multilingue (Français, Anglais, Espagnol, Allemand)

## 🔧 Structure des Blocs

Les blocs sont organisés en catégories dans le fichier `script.js`. Chaque bloc est défini avec la structure suivante :

```javascript
{
    id: 'nom-unique',          // Identifiant unique du bloc
    name: 'Nom Affiché',       // Nom affiché dans l'interface
    type: 'action',            // Type : 'action', 'control', 'sensor'
    category: 'categorie',     // Catégorie pour le style
    params: [{                 // Paramètres (optionnel)
        name: 'param1',        // Nom du paramètre
        type: 'number',        // Type : 'number', 'select'
        default: '10',         // Valeur par défaut
        suffix: 'unité'        // Unité affichée (optionnel)
    }],
    hasContainer: true         // Pour les blocs pouvant contenir d'autres blocs
}
```

## 📝 Ajouter un Nouveau Bloc

1. Définir le bloc dans `BLOCKS` :
```javascript
BLOCKS.CATEGORIE.blocks.push({
    id: 'mon-bloc',
    name: 'Mon Bloc',
    type: 'action',
    category: 'ma-categorie'
});
```

2. Ajouter l'icône dans `style.css` :
```css
.icons-mode .block[data-block-type="mon-bloc"]::before {
    content: "🔵";
    font-size: 1.5rem;
}
```

3. Ajouter la commande dans `executeBlock()` :
```javascript
case 'mon-bloc':
    await executeCommand('ma-commande');
    break;
```

## 🎨 Personnalisation des Styles

### Couleurs des Blocs
Les styles des blocs sont définis par catégorie dans `style.css` :
```css
.block-category-macategorie {
    background: #HEX-COLOR;
}
```

### Mode Icônes
Pour chaque bloc, une icône est définie pour le mode sans texte :
```css
.icons-mode .block[data-block-type="ID"]::before {
    content: "EMOJI";
}
```

## 🤖 Commandes du PetitBot

Les commandes sont envoyées via des requêtes HTTP à l'adresse `http://192.168.4.1/`. Exemples :

- Mouvement : `/avance`, `/recule`, `/gauche`, `/droite`
- Paramètres : `/avance?vitesse=90`
- Servos : `/servo1?angle=45`
- LEDs : `/led1_on`, `/led1_off`
- Capteurs : `/distance`, `/analog`

## 🔄 Ajouter une Nouvelle Catégorie

1. Ajouter la catégorie dans `BLOCKS` :
```javascript
BLOCKS.NOUVELLE_CATEGORIE = {
    title: 'Ma Catégorie',
    blocks: []
};
```

2. Ajouter la section dans `index.html` :
```html
<div class="category-section">
    <div class="category-header" data-category="NOUVELLE_CATEGORIE">
        <span class="category-icon">🆕</span>
        <span class="category-title">Ma Catégorie</span>
    </div>
    <div class="category-blocks" id="NOUVELLE_CATEGORIE-blocks"></div>
</div>
```

## 🎯 Exemples

### Ajout d'un Bloc Simple
```javascript
{
    id: 'mon-bloc',
    name: 'Mon Action',
    type: 'action',
    category: 'ma-categorie'
}
```

### Ajout d'un Bloc avec Paramètres
```javascript
{
    id: 'bloc-param',
    name: 'Action avec Paramètre',
    type: 'action',
    category: 'ma-categorie',
    params: [{
        name: 'valeur',
        type: 'number',
        default: '10',
        suffix: 'unités'
    }]
}
```

### Ajout d'un Bloc de Contrôle
```javascript
{
    id: 'bloc-controle',
    name: 'Mon Contrôle',
    type: 'control',
    hasContainer: true,
    params: [{
        name: 'condition',
        type: 'select',
        options: ['oui', 'non'],
        default: 'oui'
    }]
}
```

## 🚀 Conseils de Développement

1. Toujours tester les nouveaux blocs en mode texte et icônes
2. Vérifier la compatibilité des commandes avec le PetitBot
3. Utiliser des icônes explicites pour le mode sans texte
4. Maintenir une cohérence visuelle entre les blocs
5. Documenter les nouvelles fonctionnalités

## 🐛 Débogage

- Les erreurs de communication sont affichées dans la console
- Le programme s'arrête automatiquement en cas d'erreur
- La commande `stop` est envoyée après chaque mouvement
- Les blocs invalides sont ignorés lors de l'exécution

## 🌍 Système de Traduction

L'interface supporte plusieurs langues grâce à un système de traduction intégré.

### Structure des Traductions

Les traductions sont organisées dans `translations.js` avec la structure suivante :
```javascript
{
    fr: {                          // Code de la langue
        categories: {              // Traductions des catégories
            movement: 'Déplacements',
            // ...
        },
        blocks: {                  // Traductions des blocs
            forward: 'Avancer',
            'forward-steps': 'Avancer de',
            // ...
        },
        ui: {                      // Traductions de l'interface
            execute: 'Exécuter',
            steps: 'pas',
            times: 'fois',
            // ...
        }
    }
}
```

### Ajouter une Nouvelle Langue

1. Ajouter la langue dans `translations.js` :
```javascript
const translations = {
    nouvelle_langue: {
        categories: {
            // Traductions des catégories
        },
        blocks: {
            // Traductions des blocs
        },
        ui: {
            // Traductions de l'interface
        }
    }
}
```

2. Ajouter l'option dans le sélecteur de langue (`index.html`) :
```html
<select id="language-select" class="language-select">
    <option value="nouvelle_langue">🏳️ Nouvelle Langue</option>
</select>
```

### Utilisation des Traductions

- Les éléments de l'interface utilisent l'attribut `data-i18n` :
```html
<span data-i18n="ui.execute">Exécuter</span>
```

- Les suffixes des blocs sont traduits via la section `ui` :
```javascript
{
    suffix: 'pas'  // Traduit en utilisant ui.pas
}
``` 