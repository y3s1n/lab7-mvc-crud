# ADR 003 — Model: localStorage-backed message store

Status
- Accepted

Context
- Small MVC chat demo that persists messages client-side using localStorage.
- Requirements: simple persistence, easy serialization/deserialization, performant for small message volumes, and straightforward import/export of message arrays.
- Key file: src/js/model.js

Decision
- Represent the complete chat as a single array stored under one localStorage key (KEY = 'chat.messages.v1'). The array is JSON-stringified as a whole on writes and JSON-parsed on reads.
- Provide imperative APIs for common operations:
  - loadMessages(), saveMessage(msg), clearMessages(), deleteMessage(key), updateMessage(key, newText)
  - downloadJSON(filename, data), importMessages(arr)
- Use the message.date property (ISO datetime string) as the stable identifier for CRUD operations.
- Keep message objects as plain POJOs (no per-message stringification) so import/export and in-memory operations are simple and fast.

Rationale / Justification
- Single-array storage
  - Simplicity: reading and writing a single JSON array is the smallest cognitive and implementation surface for this lab.
  - Efficiency for small datasets: parsing/stringifying the entire array is cheap for expected usage.
  - Serialization parity: import/export can accept and produce the same array form, making round-trips straightforward.
- Plain objects (no per-message stringify)
  - Avoids double-encoding complexity and makes in-memory mutation (update/delete) trivial.
  - Easier to unit-test and to pass between model, controller, and view.
- Date-as-key (ISO string)
  - ISO strings are human-readable, sortable, and serialize naturally via JSON.stringify(new Date()).
  - Using date as identifier avoids introducing a separate id-generation system for this small demo.

Consequences
- Pros
  - Very small, dependency-free model that is easy to understand and debug.
  - Import/export is a direct array round-trip; controller/view can reuse the same structure.
  - CRUD implementations are straightforward using in-memory array methods.
- Cons / Trade-offs
  - Whole-array writes: as message count grows, JSON.stringify/parse on every save becomes more expensive — acceptable for lab scale but not for large datasets.
  - Date collisions: using timestamps as identifiers has a tiny risk of collision if two messages have identical ISO timestamps; improbable in this context but possible in high-frequency scenarios.
  - Type consistency: callers may pass Date objects or ISO strings for msg.date; model relies on string comparison when locating messages, so inconsistent types can cause misses.
  - No index: operations like findIndex / filter are linear; acceptable for small arrays but not scalable.

Mitigations & Improvements
- Consistency: normalize msg.date to an ISO string on save (e.g., msg.date = new Date(msg.date).toISOString()) to avoid type mismatches.
- Performance: if needed, switch to an append-only strategy with per-message keys or use IndexedDB for larger data volumes.
- Collision avoidance: add a small stable id (UUID or monotonic counter) if unique identifiers are required.
- Validation: add schema/shape checks on importMessages to avoid storing malformed data.

Implementation notes (reference)
- Public API (src/js/model.js):
  - loadMessages(): parses and returns stored array or [].
  - saveMessage(msg): appends msg to array and writes JSON string of full array.
  - updateMessage(key, newText): finds message by msg.date === key, mutates message, sets edited metadata, writes back.
  - deleteMessage(key): filters out messages by date and writes back.
  - clearMessages(): removes the storage key.
  - importMessages(arr): overwrites storage with provided array after validating it's an array.
  - downloadJSON(filename, data): helper to export JSON via a blob and download link.
- Recommended small change: ensure saveMessage normalizes incoming msg.date to an ISO string before persisting so update/delete comparisons are reliable.
- Testing: unit tests should mock localStorage and assert correct behavior for saves, updates, deletes, imports, and exports.