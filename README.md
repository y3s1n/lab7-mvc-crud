# lab7-mvc-crud

Small MVC-style browser chat demo (COMP305 Fall 2025 — Lab 7).  
Lightweight, dependency-free implementation demonstrating separation of concerns (View / Controller / Model), client-side persistence, simple import/export and a local Eliza-like bot.

---

## Quick start (Windows)

Recommended: serve the `src/` folder so ES modules load reliably.

- With Python (PowerShell / CMD):
  - cd to repo root and run:
    - python -m http.server 5500 --directory src
  - Open: http://localhost:5500

- With Node (no install if using npx):
  - npx http-server src -p 5500
  - or: npx serve src
  - Open: http://localhost:5500

- Alternative: open `src/index.html` directly in a browser or use VS Code Live Server. (Serving is recommended to avoid module / CORS issues.)

---

## Architecture (high level)

The app follows a small MVC pattern:

- View
  - src/js/view.js
  - Implemented as a custom element `<chat-view>` (light DOM).
  - Responsible for DOM rendering and user interactions.
  - Emits high-level CustomEvents: `messageSent`, `deleteMessage`, `requestEdit`, `exportChat`, `importChat`, `clearChat`.
  - Exposes UI methods for the controller: `addUserMsg`, `addBotMsg`, `removeMsgByKey`, `updateMsgByKey`.

- Controller
  - src/js/controller.js
  - Central event-driven mediator: subscribes to view events, calls model APIs, and instructs the view to update.
  - Calls `getBotResponse` (src/js/eliza.js) to generate bot replies synchronously for the demo.
  - Handles import/export adaptation and persistence orchestration.

- Model
  - src/js/model.js
  - LocalStorage-backed message store (single array under `chat.messages.v1`).
  - Provides imperative APIs: load/save/update/delete/clear/import/download.
  - Uses message.date (ISO string) as a stable key for CRUD operations.

Diagram (conceptual):
View (DOM / <chat-view>) <--dispatch--> Controller (mediator) <---> Model (localStorage)
                                                   -> Eliza bot (local response)

See ADRs in `adr/` for detailed design decisions:
- adr/001-chatView-adr.md
- adr/002-chatController-adr.md
- adr/003-chatModel-adr.md

---

## User guide / Features

- Sending a message
  - Type in the textarea and press the Send button or press Enter (Shift+Enter for newline).
  - Message is persisted and shown in the chat. Bot replies are generated immediately and persisted.

- Edit a message
  - Click the `edit` button on a user message to open a prompt and submit edits. Edited messages are flagged.

- Delete a message
  - Click the trash icon (🗑️) on a user message. A confirmation prompt will appear.

- Clear chat
  - Use the sidebar Clear/Clear Chat button. Confirmation is required. This clears localStorage for the chat.

- Export chat
  - Export (save) the stored message array as a JSON file via the export button.

- Import chat
  - Use the import button and select a JSON file containing an array of messages or an object with `messages` property. The controller adapts permissive formats and renders the imported messages.

Persistence: messages persist across reloads via localStorage (KEY = `chat.messages.v1`).

---

## Notable technical decisions & links

- Web Components (custom element)
  - Chosen for native encapsulation of view logic without external frameworks. Kept in light DOM to allow global CSS and simple lab-driven styling.

- Event-driven interface (CustomEvents)
  - Clean separation: View emits intent, Controller handles orchestration, Model stores data.

- localStorage single-array model
  - Simplicity for a teaching lab and straightforward import/export.

- Bot engine
  - Very simple Eliza-like local implementation (src/js/eliza.js); synchronous for immediacy in the demo.

Design rationale and alternatives are documented in ADR files under `adr/`.

---

## Reflections & trade-offs

- Pros
  - Small, dependency-free, easy to read and teach.
  - Clear separation of UI, orchestration, and persistence.
  - Easy to test components individually.

- Cons / limitations
  - Light DOM allows global CSS leakage — shadow DOM was deliberately avoided for learning/simplicity.
  - localStorage writes the whole array on each save; acceptable for lab-scale datasets but not suitable for large volume.
  - Using ISO timestamps as the unique key has a tiny collision risk and relies on consistent date formats.
  - Controller currently assumes a single view and attaches listeners once; dynamic mount/unmount patterns require lifecycle hygiene (see ADRs).

- Future improvements
  - Normalize dates to ISO strings on save to avoid type mismatches.
  - Add disconnected lifecycle cleanup (removeEventListener) in the view.
  - Replace localStorage with IndexedDB or per-message storage for scalability.
  - Make bot response asynchronous (promise-based) to support remote AI integration.
  - Add automated tests (unit tests mocking localStorage, view events, and controller behavior).
  - Improve accessibility (ARIA roles, labels) and keyboard navigation.

---

## Developer notes

- Key source files:
  - src/index.html
  - src/styles.css
  - src/js/view.js        — chatView custom element
  - src/js/controller.js  — event-driven mediator
  - src/js/model.js       — localStorage model
  - src/js/eliza.js       — demo bot

- ADRs (design records):
  - adr/001-chatView-adr.md
  - adr002-chatController-adr.md
  - adr/003-chatModel-adr.md

- Known runtime note:
  - Ensure the app is served (or the script runs after DOM is parsed). If `document.querySelector('chat-view')` is null on startup, the controller cannot attach listeners — serve `src/` or include the module after the body.

---

## License / attribution

- Educational lab code — adapt as needed for exercises.
- No external dependencies included; standard browser APIs used.
