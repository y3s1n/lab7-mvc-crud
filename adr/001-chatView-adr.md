# ADR 001 — View: chat-view (Web Component) design

Status
- Accepted

Context
- Project is a small MVC-style chat demo with CRUD and import/export features.
- Requirements: small footprint, clear separation between UI and data/controller, easy to style, testable, and suitable for a browser lab environment (no heavy frameworks).
- Files of interest: src/js/view.js (custom element `chat-view`) and src/index.html (markup where `<chat-view>` is used in the light DOM).

Decision
- Implement the view as a lightweight Web Component named `chat-view` (custom element) that lives in the light DOM and dispatches CustomEvents to communicate with the controller.
- Keep markup for the element in index.html (light DOM) and query DOM nodes inside `connectedCallback` using querySelector.
- Use arrow-function instance properties for event handlers (e.g., onSend = () => this.sendMessage();) so handlers are bound to the instance and can be referenced later for removal.
- Attach event listeners in `connectedCallback` via attachListeners(), and plan to remove them in a corresponding `disconnectedCallback` (implementation note: necessary to avoid leaks).
- The view does not own persistence or business logic. It:
  - Reads user input and dispatches events: `messageSent`, `deleteMessage`, `requestEdit`, `exportChat`, `importChat`, `clearChat`.
  - Exposes methods to mutate the UI: addUserMsg, addBotMsg, removeMsgByKey, updateMsgByKey.
  - Uses dataset keys (ISO timestamp string) on message blocks as stable identifiers for CRUD operations.
  - Handles import via a hidden file input + FileReader to parse JSON and dispatch an `importChat` event with data.

Rationale / Justification
- Web Component (custom element)
  - Native browser feature, no external dependencies — fits the lab constraints.
  - Encapsulates view logic in a single class (improves discoverability and testability).
  - Using a light-DOM component (no shadowRoot) keeps markup accessible to global CSS and to simple test fixtures, which is important for a small learning project and for easy styling from index.html.
  - Arrow-function handlers preserve `this` and provide stable function references that can be passed to removeEventListener later.
- Event-driven interface (CustomEvent)
  - Enforces separation of concerns: view emits high-level events, controller handles persistence and business logic.
  - CustomEvent detail payloads carry minimal, well-structured data (e.g., { detail: userText }).
- Keys as ISO timestamps
  - Readable, sortable, unique enough for this use-case.
  - Easy to serialize and use as dataset attributes and time element datetimes.
- UX choices
  - Enter key handling (Enter sends, Shift+Enter for newline) improves speed of use.
  - Scroll-to-bottom after appending messages keeps newest content visible.
  - Confirm dialogs for destructive actions (clear/delete) provide basic safety.
- File import/export
  - Using a file input + FileReader is the simplest cross-browser approach for client-side JSON import/export without server code.

Consequences
- Pros
  - Small, dependency-free, and easy to understand.
  - Clear separation (view -> dispatch events; controller -> state management).
  - Easy to test view behavior in isolation by asserting emitted events and DOM updates.
  - Styling remains simple since component stays in light DOM.
- Cons / Trade-offs
  - No DOM encapsulation: global CSS can leak into the component, which can be problematic for larger apps.
  - If disconnectedCallback is not implemented, event listeners may leak memory; must remove listeners when element is removed.
  - Using timestamps as keys can risk collisions in high-frequency scenarios (unlikely here).
  - Current approach assumes presence of specific elements in light DOM; moving to a fully self-contained shadow DOM would require templating and different styling approach.
- Future considerations
  - Implement disconnectedCallback to remove listeners and prevent leaks.
  - If stricter encapsulation is required, migrate to shadow DOM + template and expose a small CSS custom properties API for theming.
  - Add ARIA attributes and accessible labels for better accessibility.
  - Add tests that mount the custom element in a test DOM, simulate user actions, and assert emitted events and DOM updates.

Implementation notes (reference)
- Key file: src/js/view.js — defines chatView, attaches listeners, dispatches events, and provides DOM update methods.
- Event names: messageSent, deleteMessage, requestEdit, exportChat, importChat, clearChat.
- Recommended small change: add disconnectedCallback to call removeEventListener for each handler to fully complete lifecycle management.
