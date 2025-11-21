// ===================================
//            WARNING:
//    This file is copyrighted, 
//    please do not modify the engine 
//    to implement your own features.
// ===================================

export class StoryEngine {
  constructor(storyData, langData, config) {
    this.story = storyData;
    this.lang = langData || {};
    this.characters = { ...(config.characters || {}) };
    this.state = { ...(config.state || {}) };
    this.currentScene = null;
    this._initCurrentScene();
  }
  json(key) {
    if (!this.lang) return `[MISSING_LANG:${key}]`;
    return this.lang[key] ?? `[MISSING_KEY:${key}]`;
  }
  _initCurrentScene() {
    const first = Object.keys(this.story)[0];
    if (!first) throw new Error('Story is empty');
    this.currentScene = first;
  }
  validateScene(sceneId) {
    const node = this.story[sceneId];
    if (!node) throw new Error(`Missing scene "${sceneId}"`);
    if (!node.metadata) throw new Error(`Scene "${sceneId}" missing metadata`);
    if (!node.content) throw new Error(`Scene "${sceneId}" missing content`);
    if (!node.metadata.id) throw new Error(`Scene "${sceneId}" metadata.id missing`);
    if (String(node.metadata.id) !== String(sceneId)) throw new Error(`Scene "${sceneId}" metadata.id must equal the scene key`);
    if (!node.content.text) throw new Error(`Scene "${sceneId}" content.text missing`);
    if (node.content.choices && !Array.isArray(node.content.choices)) throw new Error(`Scene "${sceneId}" content.choices must be an array`);
    return true;
  }
  _evalCondition(cond) {
    if (!cond) return true;
    for (const k of Object.keys(cond)) {
      if (this.state[k] !== cond[k]) return false;
    }
    return true;
  }
  _evalExpression(expr) {
    try {
      const fn = new Function('state','characters',`with(state){with(characters){ return (${expr}); }}`);
      return fn(this.state, this.characters);
    } catch(e) {
      return `[ERR:${expr}]`;
    }
  }
  interpolateString(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\$\{([^}]+)\}/g, (_, expr) => {
      const v = this._evalExpression(expr);
      return (v === undefined || v === null) ? '' : String(v);
    });
  }
  renderContentText(text) { return this.interpolateString(text); }
  _enterScene(sceneId) {
    const node = this.story[sceneId];
    const content = node.content || {};
    if (content.set) {
      for (const [k,v] of Object.entries(content.set)) {
        if (typeof v === 'string' && v.includes('${')) {
          const m = v.match(/^\$\{([^}]+)\}$/);
          if (m) this.state[k] = this._evalExpression(m[1]);
          else this.state[k] = this.interpolateString(v);
        } else this.state[k] = v;
      }
    }
  }
  getSceneFull() {
    this.validateScene(this.currentScene);
    this._enterScene(this.currentScene);
    const node = this.story[this.currentScene];
    const metadata = node.metadata;
    const content = node.content;
    const choices = (content.choices || []).filter(ch => {
      if (!ch.condition) return true;
      return this._evalCondition(ch.condition);
    }).map(ch => ({ ...ch }));
    const contentCopy = { ...content, choices };
    return { sceneId: this.currentScene, metadata, content: contentCopy };
  }
  setLanguage(langCode, langData) {
    if (!langData) throw new Error('langData required when switching language');
    this.lang = langData;
  }
  chooseByIndex(index) {
    const node = this.story[this.currentScene];
    const content = node.content || {};
    const visibleChoices = (content.choices || []).filter(ch => {
      if (!ch.condition) return true;
      return this._evalCondition(ch.condition);
    });
    const choice = visibleChoices[index];
    if (!choice) throw new Error('Invalid choice index: ' + index);
    if (choice.set) {
      for (const [k,v] of Object.entries(choice.set)) {
        if (typeof v === 'string' && v.includes('${')) {
          const m = v.match(/^\$\{([^}]+)\}$/);
          if (m) this.state[k] = this._evalExpression(m[1]);
          else this.state[k] = this.interpolateString(v);
        } else this.state[k] = v;
      }
    }
    if (choice.goto) this.currentScene = choice.goto;
    return true;
  }
  save() { return { scene: this.currentScene, state: this.state, characters: this.characters }; }
  loadSave(saveObj) {
    if (!saveObj || typeof saveObj !== 'object') throw new Error('Invalid save');
    if (!saveObj.scene || !this.story[saveObj.scene]) throw new Error('Save refers to unknown scene: ' + saveObj.scene);
    this.currentScene = saveObj.scene;
    this.state = saveObj.state || {};
    this.characters = saveObj.characters || {};
  }
  reset(initialState = {}, initialCharacters = {}) {
    this.state = { ...initialState };
    this.characters = { ...initialCharacters };
    this._initCurrentScene();
  }
}
