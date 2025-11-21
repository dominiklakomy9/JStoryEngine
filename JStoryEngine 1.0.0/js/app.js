class StoryEditorApp {
    constructor() {
        this.storyManager = new StoryManager();
        this.passageEditor = new PassageEditor();
        this.variablesManager = new VariablesManager();
        this.languageManager = new LanguageManager();
        this.saveManager = new SaveManager();
        
        this.currentLanguage = 'pl';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        // Story controls
        document.getElementById('new-story').addEventListener('click', () => this.newStory());
        document.getElementById('save-story').addEventListener('click', () => this.saveStory());
        document.getElementById('load-story').addEventListener('click', () => this.loadStory());
        document.getElementById('test-story').addEventListener('click', () => this.testStory());

        // Passage controls
        document.getElementById('add-passage').addEventListener('click', () => this.addPassage());

        // Variable controls
        document.getElementById('add-variable').addEventListener('click', () => this.variablesManager.showVariableModal());
        document.getElementById('save-variable').addEventListener('click', () => this.variablesManager.saveVariable());
        document.getElementById('cancel-variable').addEventListener('click', () => this.variablesManager.hideVariableModal());

        // Language controls
        document.getElementById('add-language').addEventListener('click', () => this.languageManager.showLanguageModal());
        document.getElementById('save-language').addEventListener('click', () => this.languageManager.addLanguage());
        document.getElementById('cancel-language').addEventListener('click', () => this.languageManager.hideLanguageModal());
        document.getElementById('language-selector').addEventListener('change', (e) => this.changeLanguage(e.target.value));
    }

    loadInitialData() {
        this.languageManager.addLanguage('pl', 'Polski');
        this.languageManager.addLanguage('en', 'English');
        this.updateLanguagesList();
        
        // Add sample passage
        this.addPassage('Start', 'Witaj w swojej opowieści! Kliknij "Dodaj scenę" aby utworzyć nową scenę.');
    }

    newStory() {
        if (confirm('Czy na pewno chcesz utworzyć nową opowieść? Niezapisane zmiany zostaną utracone.')) {
            this.storyManager.passages = [];
            this.variablesManager.variables = {};
            this.updatePassagesList();
            this.passageEditor.clearEditor();
        }
    }

    saveStory() {
        const storyData = {
            passages: this.storyManager.passages,
            variables: this.variablesManager.variables,
            languages: this.languageManager.languages,
            metadata: {
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
        
        this.saveManager.saveToFile(storyData);
    }

    loadStory() {
        this.saveManager.loadFromFile((storyData) => {
            if (storyData) {
                this.storyManager.passages = storyData.passages || [];
                this.variablesManager.variables = storyData.variables || {};
                this.languageManager.languages = storyData.languages || {};
                
                this.updatePassagesList();
                this.variablesManager.updateVariablesList();
                this.updateLanguagesList();
                
                alert('Opowieść została wczytana pomyślnie!');
            }
        });
    }

    testStory() {
        const storyData = {
            passages: this.storyManager.passages,
            variables: this.variablesManager.variables
        };
        
        localStorage.setItem('storyTestData', JSON.stringify(storyData));
        window.open('test.html', '_blank');
    }

    addPassage(title = 'Nowa scena', content = '') {
        const passage = this.storyManager.createPassage(title, content);
        this.updatePassagesList();
        this.passageEditor.editPassage(passage);
    }

    updatePassagesList() {
        const passagesList = document.getElementById('passages-list');
        passagesList.innerHTML = '';
        
        this.storyManager.passages.forEach(passage => {
            const passageElement = document.createElement('div');
            passageElement.className = 'passage-item';
            passageElement.textContent = passage.title;
            passageElement.addEventListener('click', () => {
                document.querySelectorAll('.passage-item').forEach(item => item.classList.remove('active'));
                passageElement.classList.add('active');
                this.passageEditor.editPassage(passage);
            });
            
            passagesList.appendChild(passageElement);
        });
    }

    updateLanguagesList() {
        const languagesList = document.getElementById('languages-list');
        const languageSelector = document.getElementById('language-selector');
        
        languagesList.innerHTML = '';
        languageSelector.innerHTML = '';
        
        Object.entries(this.languageManager.languages).forEach(([code, name]) => {
            // Update languages list in sidebar
            const langElement = document.createElement('div');
            langElement.className = 'variable-item';
            langElement.innerHTML = `
                <span>${name}</span>
                <span class="variable-value">${code}</span>
            `;
            languagesList.appendChild(langElement);
            
            // Update language selector
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            languageSelector.appendChild(option);
        });
    }

    changeLanguage(languageCode) {
        this.currentLanguage = languageCode;
        // Tutaj można dodać logikę zmiany języka interfejsu
        console.log('Zmieniono język na:', languageCode);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storyEditor = new StoryEditorApp();
});