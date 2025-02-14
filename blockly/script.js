// Définition des types de blocs
const BLOCKS = {
    MOVEMENT: {
        title: 'Déplacements',
        blocks: [
            { 
                id: 'forward', 
                name: 'Avancer', 
                type: 'action',
                category: 'movement'
            },
            { 
                id: 'forward-steps', 
                name: 'Avancer de', 
                type: 'action',
                category: 'movement',
                params: [{ name: 'steps', type: 'number', default: '10', suffix: 'pas' }]
            },
            { 
                id: 'backward', 
                name: 'Reculer', 
                type: 'action',
                category: 'movement'
            },
            { 
                id: 'backward-steps', 
                name: 'Reculer de', 
                type: 'action',
                category: 'movement',
                params: [{ name: 'steps', type: 'number', default: '10', suffix: 'pas' }]
            },
            { 
                id: 'turn-left', 
                name: 'Tourner à gauche', 
                type: 'action',
                category: 'movement'
            },
            { 
                id: 'turn-right', 
                name: 'Tourner à droite', 
                type: 'action',
                category: 'movement'
            }
        ]
    },
    CONTROL: {
        title: 'Contrôles',
        blocks: [
            { 
                id: 'repeat', 
                name: 'Répéter', 
                type: 'control',
                params: [{ name: 'times', type: 'number', default: '10', suffix: 'fois' }],
                hasContainer: true
            },
            {
                id: 'if-distance',
                name: 'Si la distance',
                type: 'control',
                params: [
                    { name: 'operator', type: 'select', options: ['>', '<', '='], default: '>' },
                    { name: 'value', type: 'number', default: '20', suffix: 'cm' }
                ],
                hasContainer: true
            }
        ]
    },
    SENSOR: {
        title: 'Capteurs',
        blocks: [
            {
                id: 'measure-distance',
                name: 'Mesurer distance',
                type: 'sensor',
                category: 'sensor'
            },
            {
                id: 'read-analog',
                name: 'Lire capteur analogique',
                type: 'sensor',
                category: 'sensor'
            }
        ]
    },
    SERVOS: {
        title: 'Servomoteurs',
        blocks: [
            {
                id: 'servo1',
                name: 'Servo 1',
                type: 'action',
                category: 'servo',
                params: [{ name: 'angle', type: 'number', default: '90', suffix: '°' }]
            },
            {
                id: 'servo2',
                name: 'Servo 2',
                type: 'action',
                category: 'servo',
                params: [{ name: 'angle', type: 'number', default: '90', suffix: '°' }]
            },
            {
                id: 'servo3',
                name: 'Servo 3',
                type: 'action',
                category: 'servo',
                params: [{ name: 'angle', type: 'number', default: '90', suffix: '°' }]
            },
            {
                id: 'servoG',
                name: 'Servo Gauche',
                type: 'action',
                category: 'servo',
                params: [{ name: 'angle', type: 'number', default: '90', suffix: '°' }]
            },
            {
                id: 'servoD',
                name: 'Servo Droit',
                type: 'action',
                category: 'servo',
                params: [{ name: 'angle', type: 'number', default: '90', suffix: '°' }]
            }
        ]
    },
    LEDS: {
        title: 'LEDs',
        blocks: [
            {
                id: 'led1-on',
                name: 'Allumer LED 1',
                type: 'action',
                category: 'led'
            },
            {
                id: 'led1-off',
                name: 'Éteindre LED 1',
                type: 'action',
                category: 'led'
            },
            {
                id: 'led2-on',
                name: 'Allumer LED 2',
                type: 'action',
                category: 'led'
            },
            {
                id: 'led2-off',
                name: 'Éteindre LED 2',
                type: 'action',
                category: 'led'
            }
        ]
    },
    TIME: {
        title: 'Temps',
        blocks: [
            {
                id: 'wait',
                name: 'Attendre',
                type: 'action',
                category: 'time',
                params: [{ name: 'duration', type: 'number', default: '1', suffix: 'seconde(s)' }]
            }
        ]
    }
};

// État du programme
let programBlocks = [];
let draggedBlock = null;
let insertIndicator = null;
let isFromPalette = false;
let currentLanguage = localStorage.getItem('language') || 'fr';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    initializeCategories();
    initializeBlocks();
    initializeDragAndDrop();
    initializeButtons();
    createInsertIndicator();
    const isIconMode = localStorage.getItem('iconMode') === 'true';
    if (isIconMode) {
        const button = document.getElementById('btn-toggle-icons');
        const workspace = document.getElementById('program-container');
        const blocksContainer = document.querySelector('.panel-content');
        
        button.classList.add('active');
        workspace.classList.add('icons-mode');
        blocksContainer.classList.add('icons-mode');
    }
});

// Initialisation de la langue
function initializeLanguage() {
    const languageSelect = document.getElementById('language-select');
    languageSelect.value = currentLanguage;
    
    // Appliquer les traductions initiales
    updateTranslations();
    
    // Écouter les changements de langue
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        updateTranslations();
    });
}

// Mettre à jour les traductions
function updateTranslations() {
    // Mettre à jour les éléments de l'interface
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[currentLanguage];
        for (const k of keys) {
            translation = translation[k];
        }
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Mettre à jour le message du conteneur de programme vide
    const style = document.createElement('style');
    style.textContent = `
        #program-container:empty::before {
            content: '${translations[currentLanguage].ui.dropBlocksHere}';
        }
    `;
    document.head.appendChild(style);

    // Mettre à jour les blocs dans la palette
    Object.entries(BLOCKS).forEach(([categoryId, categoryData]) => {
        const container = document.getElementById(`${categoryId}-blocks`);
        if (!container) return;

        const blocks = container.querySelectorAll('.block');
        blocks.forEach(block => {
            const blockType = block.dataset.blockType;
            const nameSpan = block.querySelector('.block-content span:first-child');
            if (nameSpan) {
                nameSpan.textContent = getTranslation(`blocks.${blockType}`);
            }

            // Mettre à jour les suffixes des paramètres
            const inputs = block.querySelectorAll('input');
            inputs.forEach(input => {
                const nextSibling = input.nextSibling;
                if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                    const suffix = input.getAttribute('data-suffix');
                    if (suffix) {
                        nextSibling.textContent = ' ' + getTranslation(`ui.${suffix}`);
                    }
                }
            });
        });
    });

    // Mettre à jour les blocs dans l'espace de travail
    const workspace = document.getElementById('program-container');
    const workspaceBlocks = workspace.querySelectorAll('.block');
    workspaceBlocks.forEach(block => {
        const blockType = block.dataset.blockType;
        const nameSpan = block.querySelector('.block-content span:first-child');
        if (nameSpan) {
            nameSpan.textContent = getTranslation(`blocks.${blockType}`);
        }
        
        // Mettre à jour les suffixes des paramètres
        const inputs = block.querySelectorAll('input');
        inputs.forEach(input => {
            const nextSibling = input.nextSibling;
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                const suffix = input.getAttribute('data-suffix');
                if (suffix) {
                    nextSibling.textContent = ' ' + getTranslation(`ui.${suffix}`);
                }
            }
        });
    });
}

// Fonction pour obtenir une traduction
function getTranslation(key) {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    for (const k of keys) {
        translation = translation[k];
    }
    return translation || key;
}

// Initialisation des catégories
function initializeCategories() {
    const headers = document.querySelectorAll('.category-header');
    headers.forEach(header => {
        // Retirer la classe active par défaut
        header.classList.remove('active');
        const blocks = document.getElementById(`${header.dataset.category}-blocks`);
        if (blocks) {
            blocks.classList.remove('active');
        }
        
        header.addEventListener('click', () => {
            const categoryId = header.dataset.category;
            toggleCategory(categoryId);
        });
    });
}

// Basculer l'état d'une catégorie
function toggleCategory(categoryId) {
    const header = document.querySelector(`.category-header[data-category="${categoryId}"]`);
    const blocks = document.getElementById(`${categoryId}-blocks`);
    const wasActive = header.classList.contains('active');

    // Fermer toutes les catégories
    document.querySelectorAll('.category-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.category-blocks').forEach(b => b.classList.remove('active'));

    // Si la catégorie n'était pas active, l'ouvrir
    if (!wasActive) {
        header.classList.add('active');
        blocks.classList.add('active');
    }
}

// Initialisation des blocs
function initializeBlocks() {
    Object.entries(BLOCKS).forEach(([categoryId, categoryData]) => {
        const container = document.getElementById(`${categoryId}-blocks`);
        if (!container) return;

        categoryData.blocks.forEach(block => {
            const blockElement = createBlockElement(block);
            container.appendChild(blockElement);
        });
    });
}

// Création d'un élément de bloc
function createBlockElement(block) {
    const div = document.createElement('div');
    div.className = `block block-${block.type}`;
    if (block.category) {
        div.className += ` block-category-${block.category}`;
    }
    div.draggable = true;
    div.dataset.blockType = block.id;
    
    const content = document.createElement('div');
    content.className = 'block-content';
    
    // Ajout du nom
    const nameSpan = document.createElement('span');
    nameSpan.textContent = getTranslation(`blocks.${block.id}`);
    content.appendChild(nameSpan);
    
    // Ajout des paramètres si nécessaire
    if (block.params) {
        block.params.forEach(param => {
            content.appendChild(document.createTextNode(' '));
            
            if (param.type === 'select') {
                const select = document.createElement('select');
                select.className = 'block-input block-select';
                param.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    select.appendChild(opt);
                });
                select.value = param.default;
                select.placeholder = param.name;
                content.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.type = param.type;
                input.className = 'block-input';
                input.value = param.default || '';
                input.placeholder = param.name;
                if (param.suffix) {
                    input.setAttribute('data-suffix', param.suffix);
                }
                content.appendChild(input);
            }
            
            if (param.suffix) {
                content.appendChild(document.createTextNode(' ' + getTranslation(param.suffix)));
            }
        });
    }
    
    div.appendChild(content);

    // Ajout du container pour les blocs de contrôle
    if (block.hasContainer) {
        const container = document.createElement('div');
        container.className = 'block-control-container';
        div.appendChild(container);

        const footer = document.createElement('div');
        footer.className = 'block-control-footer';
        div.appendChild(footer);

        initializeContainerDragDrop(container);
    }
    
    return div;
}

// Cloner un bloc avec tous ses événements
function cloneBlockWithEvents(originalBlock) {
    const clone = originalBlock.cloneNode(true);
    
    // Si c'est un bloc de contrôle, réinitialiser le drag and drop pour son container
    if (clone.classList.contains('block-control')) {
        const container = clone.querySelector('.block-control-container');
        if (container) {
            initializeContainerDragDrop(container);
        }
    }
    
    return clone;
}

// Création de l'indicateur d'insertion
function createInsertIndicator() {
    insertIndicator = document.createElement('div');
    insertIndicator.className = 'insert-indicator';
    insertIndicator.style.display = 'none';
}

// Initialisation du drag and drop
function initializeDragAndDrop() {
    const workspace = document.getElementById('program-container');
    const leftPanel = document.querySelector('.left-panel');
    
    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('block')) {
            draggedBlock = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
            isFromPalette = !draggedBlock.classList.contains('in-workspace');
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('block')) {
            e.target.classList.remove('dragging');
            hideInsertIndicator();
        }
    });

    // Ajout du gestionnaire pour la zone des blocs disponibles
    leftPanel.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedBlock && draggedBlock.classList.contains('in-workspace')) {
            e.dataTransfer.dropEffect = 'move';
        }
    });

    leftPanel.addEventListener('dragleave', (e) => {
        e.preventDefault();
    });

    leftPanel.addEventListener('drop', (e) => {
        e.preventDefault();
        leftPanel.classList.remove('drag-over');
        
        if (draggedBlock && draggedBlock.classList.contains('in-workspace')) {
            draggedBlock.remove();
            updateProgramBlocks();
        }
    });

    workspace.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedBlock) {
            const mouseY = e.clientY;
            const blocks = Array.from(workspace.querySelectorAll('.block.in-workspace:not(.dragging)'));
            let insertBefore = null;

            // Trouver la position d'insertion
            for (const block of blocks) {
                const rect = block.getBoundingClientRect();
                if (mouseY < rect.top + rect.height / 2) {
                    insertBefore = block;
                    break;
                }
            }

            // Mettre à jour l'indicateur d'insertion
            updateInsertIndicator(workspace, insertBefore, mouseY);
        }
    });

    workspace.addEventListener('dragenter', (e) => {
        e.preventDefault();
        workspace.classList.add('drag-over');
    });

    workspace.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (!workspace.contains(e.relatedTarget)) {
            workspace.classList.remove('drag-over');
            hideInsertIndicator();
        }
    });

    workspace.addEventListener('drop', (e) => {
        e.preventDefault();
        workspace.classList.remove('drag-over');
        hideInsertIndicator();

        if (draggedBlock) {
            let blockToInsert;
            
            if (isFromPalette) {
                blockToInsert = cloneBlockWithEvents(draggedBlock);
                blockToInsert.classList.add('in-workspace');
            } else {
                blockToInsert = draggedBlock;
            }

            const mouseY = e.clientY;
            const blocks = Array.from(workspace.querySelectorAll(':scope > .block.in-workspace:not(.dragging)'));
            let insertBefore = null;

            for (const block of blocks) {
                const rect = block.getBoundingClientRect();
                if (mouseY < rect.top + rect.height / 2) {
                    insertBefore = block;
                    break;
                }
            }

            if (insertBefore) {
                workspace.insertBefore(blockToInsert, insertBefore);
            } else {
                workspace.appendChild(blockToInsert);
            }

            updateProgramBlocks();
        }
    });
}

// Mise à jour de l'indicateur d'insertion
function updateInsertIndicator(workspace, insertBefore, mouseY) {
    if (!insertIndicator.parentNode) {
        workspace.appendChild(insertIndicator);
    }

    insertIndicator.style.display = 'block';
    
    if (insertBefore) {
        const rect = insertBefore.getBoundingClientRect();
        insertIndicator.style.top = (rect.top - 2) + 'px';
    } else {
        const lastBlock = workspace.querySelector('.block.in-workspace:not(.dragging):last-child');
        if (lastBlock) {
            const rect = lastBlock.getBoundingClientRect();
            insertIndicator.style.top = (rect.bottom + 2) + 'px';
        } else {
            insertIndicator.style.top = mouseY + 'px';
        }
    }
}

// Cacher l'indicateur d'insertion
function hideInsertIndicator() {
    if (insertIndicator) {
        insertIndicator.style.display = 'none';
    }
}

// Initialiser le drag and drop pour un container
function initializeContainerDragDrop(container) {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!container.contains(e.relatedTarget)) {
            container.classList.remove('drag-over');
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.remove('drag-over');

        if (draggedBlock) {
            let blockToInsert;
            
            if (isFromPalette) {
                blockToInsert = cloneBlockWithEvents(draggedBlock);
                blockToInsert.classList.add('in-workspace');
            } else {
                blockToInsert = draggedBlock;
            }

            const mouseY = e.clientY;
            const blocks = Array.from(container.querySelectorAll(':scope > .block.in-workspace:not(.dragging)'));
            let insertBefore = null;

            for (const block of blocks) {
                const rect = block.getBoundingClientRect();
                if (mouseY < rect.top + rect.height / 2) {
                    insertBefore = block;
                    break;
                }
            }

            if (insertBefore) {
                container.insertBefore(blockToInsert, insertBefore);
            } else {
                container.appendChild(blockToInsert);
            }

            updateProgramBlocks();
        }
    });
}

// Mise à jour de la liste des blocs du programme
function updateProgramBlocks() {
    const workspace = document.getElementById('program-container');
    programBlocks = [];
    
    function processBlock(block) {
        const blockData = {
            type: block.dataset.blockType,
            params: {}
        };
        
        // Récupérer les paramètres
        const inputs = block.querySelectorAll('input');
        if (inputs.length > 0) {
            inputs.forEach(input => {
                blockData.params[input.placeholder] = input.value;
            });
        }
        
        // Récupérer les blocs enfants si c'est un bloc de contrôle
        const container = block.querySelector('.block-control-container');
        if (container) {
            blockData.children = Array.from(container.querySelectorAll(':scope > .block.in-workspace'))
                .map(processBlock);
        }
        
        return blockData;
    }
    
    // Traiter tous les blocs de premier niveau
    programBlocks = Array.from(workspace.querySelectorAll(':scope > .block.in-workspace'))
        .map(processBlock);
}

// Initialisation des boutons
function initializeButtons() {
    const executeBtn = document.getElementById('btn-execute');
    const clearBtn = document.getElementById('btn-clear');
    const toggleIconsBtn = document.getElementById('btn-toggle-icons');
    
    executeBtn.addEventListener('click', executeProgram);
    clearBtn.addEventListener('click', clearWorkspace);
    toggleIconsBtn.addEventListener('click', toggleIconsMode);
}

// Exécution du programme
async function executeProgram() {
    updateProgramBlocks();
    console.log('Programme à exécuter:', programBlocks);
    
    // Désactiver le bouton d'exécution pendant l'exécution
    const executeBtn = document.getElementById('btn-execute');
    executeBtn.disabled = true;
    
    // URL de base du PetitBot
    const BASE_URL = 'http://192.168.4.1';
    let isDemo = true; // Mode démo par défaut
    
    // Fonction pour exécuter une commande
    async function executeCommand(command) {
        if (isDemo) {
            // En mode démo, on simule juste un délai
            console.log('Mode démo - Commande:', command);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simuler une valeur de retour pour les capteurs
            if (command === 'distance') return '20';
            if (command === 'analog') return '512';
            return 'OK';
        }

        try {
            const response = await fetch(`${BASE_URL}/${command}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande:', error);
            throw error;
        }
    }

    // Fonction pour mettre en évidence un bloc
    async function highlightBlock(block) {
        block.classList.add('executing');
        // Attendre un court instant pour que l'animation soit visible
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Fonction pour retirer la mise en évidence
    function unhighlightBlock(block) {
        block.classList.remove('executing');
    }
    
    // Fonction récursive pour exécuter les blocs
    async function executeBlock(block, parentContainer = null, blockIndex = 0) {
        // Trouver l'élément DOM correspondant au bloc
        let blockElement;
        if (parentContainer) {
            // Si on est dans un conteneur (bloc de contrôle), chercher dans ce conteneur
            const blocks = Array.from(parentContainer.querySelectorAll(`:scope > .block[data-block-type="${block.type}"]`));
            blockElement = blocks[blockIndex];
        } else {
            // Sinon, chercher dans le workspace principal
            const workspace = document.getElementById('program-container');
            const blocks = Array.from(workspace.querySelectorAll(`:scope > .block[data-block-type="${block.type}"]`));
            const sameTypeBlocks = programBlocks.filter(b => b.type === block.type);
            const indexInType = sameTypeBlocks.indexOf(block);
            blockElement = blocks[indexInType];
        }

        if (blockElement) {
            await highlightBlock(blockElement);
        }

        try {
            switch (block.type) {
                case 'forward':
                    await executeCommand('avance');
                    break;
                case 'forward-steps':
                    await executeCommand(`avance?vitesse=${block.params.steps}`);
                    break;
                case 'backward':
                    await executeCommand('recule');
                    break;
                case 'backward-steps':
                    await executeCommand(`recule?vitesse=${block.params.steps}`);
                    break;
                case 'turn-left':
                    await executeCommand('gauche');
                    break;
                case 'turn-right':
                    await executeCommand('droite');
                    break;
                case 'servo1':
                    await executeCommand(`servo1?angle=${block.params.angle}`);
                    break;
                case 'servo2':
                    await executeCommand(`servo2?angle=${block.params.angle}`);
                    break;
                case 'servo3':
                    await executeCommand(`servo3?angle=${block.params.angle}`);
                    break;
                case 'servoG':
                    await executeCommand(`servoG?angle=${block.params.angle}`);
                    break;
                case 'servoD':
                    await executeCommand(`servoD?angle=${block.params.angle}`);
                    break;
                case 'led1-on':
                    await executeCommand('led1_on');
                    break;
                case 'led1-off':
                    await executeCommand('led1_off');
                    break;
                case 'led2-on':
                    await executeCommand('led2_on');
                    break;
                case 'led2-off':
                    await executeCommand('led2_off');
                    break;
                case 'measure-distance':
                    const distance = await executeCommand('distance');
                    return parseFloat(distance);
                case 'read-analog':
                    const analog = await executeCommand('analog');
                    return parseFloat(analog);
                case 'wait':
                    await new Promise(resolve => setTimeout(resolve, block.params.duration * 1000));
                    break;
                case 'repeat':
                    const times = parseInt(block.params.times);
                    const container = blockElement ? blockElement.querySelector('.block-control-container') : null;
                    for (let i = 0; i < times; i++) {
                        for (let j = 0; j < block.children.length; j++) {
                            await executeBlock(block.children[j], container, j);
                        }
                    }
                    break;
                case 'if-distance':
                    const currentDistance = await executeCommand('distance');
                    const value = parseFloat(block.params.value);
                    const operator = block.params.operator;
                    
                    let condition = false;
                    switch (operator) {
                        case '>':
                            condition = currentDistance > value;
                            break;
                        case '<':
                            condition = currentDistance < value;
                            break;
                        case '=':
                            condition = Math.abs(currentDistance - value) < 1;
                            break;
                    }
                    
                    if (condition && block.children) {
                        const container = blockElement ? blockElement.querySelector('.block-control-container') : null;
                        for (let j = 0; j < block.children.length; j++) {
                            await executeBlock(block.children[j], container, j);
                        }
                    }
                    break;
            }
            
            // Arrêt après chaque action de mouvement
            if (['forward', 'forward-steps', 'backward', 'backward-steps', 'turn-left', 'turn-right'].includes(block.type)) {
                await executeCommand('stop');
            }
        } finally {
            if (blockElement) {
                unhighlightBlock(blockElement);
                await new Promise(resolve => setTimeout(resolve, 200)); // Petite pause entre les blocs
            }
        }
    }
    
    // Exécuter tous les blocs du programme
    try {
        for (const block of programBlocks) {
            await executeBlock(block);
        }
    } catch (error) {
        console.error('Erreur lors de l\'exécution du programme:', error);
        // Arrêter le robot en cas d'erreur
        await executeCommand('stop');
    } finally {
        // Réactiver le bouton d'exécution
        executeBtn.disabled = false;
    }
}

// Nettoyage de l'espace de travail
function clearWorkspace() {
    const workspace = document.getElementById('program-container');
    workspace.innerHTML = '';
    programBlocks = [];
}

// Basculer le mode icônes
function toggleIconsMode() {
    const button = document.getElementById('btn-toggle-icons');
    const workspace = document.getElementById('program-container');
    const blocksContainer = document.querySelector('.panel-content');
    
    button.classList.toggle('active');
    workspace.classList.toggle('icons-mode');
    blocksContainer.classList.toggle('icons-mode');
    
    // Sauvegarder la préférence
    const isIconMode = button.classList.contains('active');
    localStorage.setItem('iconMode', isIconMode);
} 