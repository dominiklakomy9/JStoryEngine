class StoryManager {
    constructor() {
        this.passages = [];
        this.nextPassageId = 1;
    }

    createPassage(title, content = '', choices = []) {
        const passage = {
            id: this.nextPassageId++,
            title: title,
            content: content,
            choices: choices,
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            }
        };
        
        this.passages.push(passage);
        return passage;
    }

    getPassage(id) {
        return this.passages.find(passage => passage.id === id);
    }

    updatePassage(id, updates) {
        const passage = this.getPassage(id);
        if (passage) {
            Object.assign(passage, updates);
            passage.metadata.modified = new Date().toISOString();
            return true;
        }
        return false;
    }

    deletePassage(id) {
        const index = this.passages.findIndex(passage => passage.id === id);
        if (index !== -1) {
            this.passages.splice(index, 1);
            return true;
        }
        return false;
    }

    getPassageChoices(passageId) {
        const passage = this.getPassage(passageId);
        return passage ? passage.choices : [];
    }

    addChoice(passageId, choiceText, targetPassageId) {
        const passage = this.getPassage(passageId);
        if (passage) {
            const choice = {
                id: Date.now(), // Simple ID generation
                text: choiceText,
                target: targetPassageId
            };
            passage.choices.push(choice);
            return choice;
        }
        return null;
    }

    removeChoice(passageId, choiceId) {
        const passage = this.getPassage(passageId);
        if (passage) {
            const index = passage.choices.findIndex(choice => choice.id === choiceId);
            if (index !== -1) {
                passage.choices.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}