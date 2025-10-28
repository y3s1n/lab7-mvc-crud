...existing code...

# ADR 002 — Controller: event-driven mediator design

Status
- Accepted

Context
- Project uses MVC pattern for a small browser-based chat demo (CRUD, import/export, simple bot).
- Files of interest: src/js/controller.js, src/js/model.js, src/js/view.js, src/js/eliza.js.
- Goals: keep controller thin, maintain separation of concerns, avoid framework dependencies, and keep the app easy to reason about in a lab environment.

Decision
- Implement the controller as a central event-driven mediator that:
  - Selects the view instance (document.querySelector('chat-view')) and registers listeners for the view's CustomEvents.
  - For each incoming view event, invokes appropriate model APIs and calls view methods to update UI.
  - Produces the bot response synchronously (via getBotResponse) and persists both user and bot messages through the model.
  - Handles import/export by adapting incoming payloads to the model import API and rendering messages via the view.
  - Keeps business rules and persistence in the model; controller only orchestrates between view and model.

Rationale / Justification
- Event-driven mediator
  - Aligns with the view's design: the view emits high-level CustomEvents and the controller responds.
  - Preserves separation of concerns: view owns UI, model owns data/persistence, controller coordinates.
  - Simple, explicit mapping of user actions to model operations and UI updates — good for teaching and debugging.
- Thin controller
  - Minimizes duplicated logic; controller delegates logic to model and view helpers.
  - Improves testability: behavior can be exercised by simulating emitted events and asserting calls to model/view (or by unit-testing model + view separately).
- Synchronous bot response
  - Using getBotResponse synchronously keeps flow simple and immediate for a demo app.
  - Simplicity favors local, dependency-free implementation (eliza-like).
- Import/export handling in controller
  - Controller validates/adapts payload shapes and calls model.importMessages, then instructs view to re-render — keeps format adaptation out of view and model.

Consequences
- Pros
  - Clear responsibilities: controller orchestrates, model persists, view renders.
  - Easy to follow control flow for small apps; minimal boilerplate.
  - No framework lock-in and low cognitive overhead for students.
- Cons / Trade-offs
  - Controller directly queries the view with document.querySelector — assumes a single view instance and presence at script load. This can cause runtime errors if the element isn't yet connected.
  - Synchronous bot generation couples response timing to message handling; migrating to async (e.g., remote bot service) requires refactor.
  - Event listeners are attached once and not removed — if the app dynamically mounts/unmounts the view, listeners may become stale. (Mitigation: guard existence or use lifecycle methods.)
  - Import format adaptation is permissive; complex formats may require stricter validation.

Mitigations & Improvements
- Robustness
  - Defer controller setup until DOMContentLoaded or verify view is non-null before adding listeners.
  - Add null checks and defensive guards around view and model calls.
  - If multiple views are required, move to a registration API or instantiate controller per view.
- Lifecycle hygiene
  - Move event listener attachment into the view or implement explicit subscribe/unsubscribe APIs so controller can detach when view is removed.
- Async readiness
  - Abstract bot response behind a promise-returning API to allow easy replacement with async services.
- Validation & error handling
  - Add validation and clearer user feedback for import errors and malformed payloads.
- Testing
  - Add unit tests that mock model and view to assert controller behavior when events are emitted.

Implementation notes (reference)
- Key file: src/js/controller.js — registers listeners on chat-view and calls:
  - model.saveMessage, model.updateMessage, model.deleteMessage, model.clearMessages, model.loadMessages, model.downloadJSON, model.importMessages
  - view.addUserMsg, view.addBotMsg, view.updateMsgByKey, view.removeMsgByKey, and view.chatBox for re-rendering on import
  - eliza.getBotResponse for simple bot replies
- Recommended small changes:
  - Guard the initial view lookup and/or run setup on DOMContentLoaded.
  - Consider moving import rendering into model -> view sync helper to centralize rendering logic.
  - Add explicit subscribe/unsubscribe or use view-provided lifecycle events to avoid leaking listeners.
