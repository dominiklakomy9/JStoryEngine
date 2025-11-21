class VariablesManager {
    constructor() {
        this.variables = {};
    }

    showVariableModal(variableName = '', variableValue = '') {
        const modal = document.getElementById('variable-modal');
        document.getElementById('variable-name').value = variableName;
        document.getElementById('variable-value').value = variableValue;
        modal.style.display = 'flex';
    }

    hideVariableModal() {
        const modal = document.getElementById('variable-modal');
        modal.style.display = 'none';
    }

    saveVariable() {
        const name = document.getElementById('variable-name').value.trim();
        const value = document.getElementById('variable-value').value.trim();

        if (!name) {
            alert('Nazwa zmiennej jest wymagana!');
            return;
        }

        this.variables[name] = value;
        this.updateVariablesList();
        this.hideVariableModal();
    }

    updateVariablesList() {
        const variablesList = document.getElementById('variables-list');
        variablesList.innerHTML = '';

        Object.entries(this.variables).forEach(([name, value]) => {
            const variableElement = document.createElement('div');
            variableElement.className = 'variable-item';
            variableElement.innerHTML = `
                <span class="variable-name">${name}</span>
                <span class="variable-value">${value}</span>
            `;
            variableElement.addEventListener('click', () => {
                this.showVariableModal(name, value);
            });
            
            variablesList.appendChild(variableElement);
        });
    }

    getVariable(name) {
        return this.variables[name];
    }

    setVariable(name, value) {
        this.variables[name] = value;
        this.updateVariablesList();
    }

    deleteVariable(name) {
        delete this.variables[name];
        this.updateVariablesList();
    }
}