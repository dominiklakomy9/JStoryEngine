class LanguageManager {
    constructor() {
        this.languages = {};
    }

    showLanguageModal() {
        const modal = document.getElementById('language-modal');
        document.getElementById('language-code').value = '';
        document.getElementById('language-name').value = '';
        modal.style.display = 'flex';
    }

    hideLanguageModal() {
        const modal = document.getElementById('language-modal');
        modal.style.display = 'none';
    }

    addLanguage() {
        const code = document.getElementById('language-code').value.trim().toLowerCase();
        const name = document.getElementById('language-name').value.trim();

        if (!code || !name) {
            alert('Kod i nazwa języka są wymagane!');
            return;
        }

        if (this.languages[code]) {
            alert('Język o tym kodzie już istnieje!');
            return;
        }

        this.languages[code] = name;
        window.storyEditor.updateLanguagesList();
        this.hideLanguageModal();
    }

    removeLanguage(code) {
        if (confirm(`Czy na pewno chcesz usunąć język ${this.languages[code]}?`)) {
            delete this.languages[code];
            window.storyEditor.updateLanguagesList();
        }
    }

    getLanguageName(code) {
        return this.languages[code] || code;
    }
}