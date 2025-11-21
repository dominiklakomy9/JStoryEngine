# ⚠️ JStoryEngine Tutorial (Demo)

> **Warning:** This is a demo version.  
> Not for production - for learning/testing only.
> Version: 1.0 Demo

JStoryEngine is a simple interactive story engine.  
This file explains how it works and how you use it.

---

## Project structure

.
├─ index.html
├─ config.js
├─ story.json
├─ langs/
│  ├─ pl.json
│  └─ en.json
└─ js/
   └─ engine.js

- config.js: global variables, characters, state
- story.json: scenes, choices
- langs/: translations
- engine.js: main logic

---

## config.js

Example:
export const config = {
  characters: { hero: { name: "" } },
  state: { visitedIntro: false },
  settings: { defaultLanguage: "en" }
};

characters - dynamic objects used in placeholders.
state - game variables (progress/logic).
settings.defaultLanguage - startup language.

---

## Language files (langs/)

Each language is a JSON file in langs/.  
Keys = text labels, placeholders allowed.

Example:
{
  "title": "JStoryEngine Tutorial",
  "welcome_text": "Welcome, ${characters.hero.name}!",
  "save_btn": "Save"
}

Add languages by copying/renaming/translating JSON and using: engine.setLanguage("de");

---

## engine.json(key)

Use in JS:
let txt = engine.json("save_btn");

Returns the current localized value (+placeholders replaced).

---

## data-json in HTML

<label data-json="language"></label>
Auto-filled from language JSON by engine.  
Updates dynamically when language is switched.

---

## Placeholders ${...}

Insert dynamic values in text, eg.
"welcome_text": "Hello ${characters.hero.name}!"

engine.characters.hero.name = "Adam";
engine.json("welcome_text"); // "Hello Adam..."

---

## story.json - Scenes and Choices

Basic structure:
{
  "start": {
    "metadata": { "id": "start", "name": "Start Scene" },
    "content": {
      "text": "welcome_text",
      "choices": [
        { "text": "choice_config", "goto": "config_js" }
      ]
    }
  }
}

metadata - scene info (not rendered)
content.text - language key for text
content.choices - choices (key, next scene)

---

## Saving/Loading

Save:
localStorage.setItem("story_save", JSON.stringify(engine.save()));
Load:
const save = JSON.parse(localStorage.getItem("story_save"));
engine.loadSave(save);

Saves scene, variables, character states.

---

## Running locally

Needs HTTP server (won't work with file://):

Node.js:
npx http-server

Python:
python -m http.server 5500

VS Code:
Live Server extension

Go to: http://127.0.0.1:5500 (or other port from your server)

---

## Summary

- config.js - global state/characters
- langs/ - translations with placeholders
- engine.json(key) - get localized text
- data-json - fill HTML automatically
- story.json - scene structure and choices
- Save/load - game state
- Local server - required for modules/JSON
