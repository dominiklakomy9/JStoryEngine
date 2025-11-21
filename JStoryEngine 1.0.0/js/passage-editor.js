class PassageEditor {
    constructor() {
        this.currentPassage = null;
    }

    editPassage(passage) {
        this.currentPassage = passage;
        this.renderEditor();
    }

    renderEditor() {
        const editorArea = document.getElementById('passage-editor');
        
        editorArea.innerHTML = `
            <div class="passage-form">
                <input type="text" class="passage-title" value="${this.escapeHtml(this.currentPassage.title)}" placeholder="Tytuł sceny">
                <textarea class="passage-content" placeholder="Treść sceny...">${this.escapeHtml(this.currentPassage.content)}</textarea>
                
                <div class="choices-section">
                    <h4>Wybory</h4>
                    <div id="choices-list"></div>
                    <button id="add-choice" class="btn btn-secondary">+ Dodaj wybór</button>
                </div>
                
                <div class="editor-actions">
                    <button id="save-passage" class="btn btn-primary">Zapisz zmiany</button>
                    <button id="delete-passage" class="btn btn-danger">Usuń scenę</button>
                </div>
            </div>
        `;

        this.bindEditorEvents();
        this.renderChoices();
    }

    bindEditorEvents() {
        document.getElementById('save-passage').addEventListener('click', () => this.savePassage());
        document.getElementById('delete-passage').addEventListener('click', () => this.deletePassage());
        document.getElementById('add-choice').addEventListener('click', () => this.addChoice());
    }

    renderChoices() {
        const choicesList = document.getElementById('choices-list');
        choicesList.innerHTML = '';

        this.currentPassage.choices.forEach(choice => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice-item';
            choiceElement.innerHTML = `
                <input type="text" class="choice-text" value="${this.escapeHtml(choice.text)}" placeholder="Tekst wyboru">
                <select class="choice-target">
                    <option value="">-- Wybierz cel --</option>
                    ${window.storyEditor.storyManager.passages.map(passage => 
                        `<option value="${passage.id}" ${choice.target === passage.id ? 'selected' : ''}>${this.escapeHtml(passage.title)}</option>`
                    ).join('')}
                </select>
                <button class="remove-choice" data-choice-id="${choice.id}">×</button>
            `;
            choicesList.appendChild(choiceElement);
        });

        // Bind remove choice events
        document.querySelectorAll('.remove-choice').forEach(button => {
            button.addEventListener('click', (e) => {
                const choiceId = parseInt(e.target.getAttribute('data-choice-id'));
                this.removeChoice(choiceId);
            });
        });
    }

    addChoice() {
        if (!this.currentPassage) return;
        
        const choice = window.storyEditor.storyManager.addChoice(
            this.currentPassage.id, 
            'Nowy wybór', 
            null
        );
        
        if (choice) {
            this.renderChoices();
        }
    }

    removeChoice(choiceId) {
        if (!this.currentPassage) return;
        
        window.storyEditor.storyManager.removeChoice(this.currentPassage.id, choiceId);
        this.renderChoices();
    }

    savePassage() {
        if (!this.currentPassage) return;

        const title = document.querySelector('.passage-title').value;
        const content = document.querySelector('.passage-content').value;
        
        // Update choices
        const choiceElements = document.querySelectorAll('.choice-item');
        const choices = Array.from(choiceElements).map(element => {
            const text = element.querySelector('.choice-text').value;
            const target = element.querySelector('.choice-target').value;
            const choiceId = parseInt(element.querySelector('.remove-choice').getAttribute('data-choice-id'));
            
            return {
                id: choiceId,
                text: text,
                target: target ? parseInt(target) : null
            };
        });

        window.storyEditor.storyManager.updatePassage(this.currentPassage.id, {
            title: title,
            content: content,
            choices: choices
        });

        window.storyEditor.updatePassagesList();
        alert('Zmiany zapisane!');
    }

    deletePassage() {
        if (!this.currentPassage) return;
        
        if (confirm('Czy na pewno chcesz usunąć tę scenę?')) {
            window.storyEditor.storyManager.deletePassage(this.currentPassage.id);
            window.storyEditor.updatePassagesList();
            this.clearEditor();
        }
    }

    clearEditor() {
        const editorArea = document.getElementById('passage-editor');
        editorArea.innerHTML = `
            <div class="empty-state">
                <p>Wybierz lub utwórz scenę aby rozpocząć edycję</p>
            </div>
        `;
        this.currentPassage = null;
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}