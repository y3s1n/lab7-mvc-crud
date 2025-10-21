import { chatView } from "./view.js";
import * as model from "./model.js";

const view = document.querySelector('chat-view');

view.addEventListener('messageSent', (e) => {
    const userMessage = e.detail;
    const json = model.seralizeMessage(userMessage);
    model.saveMessage(json);
    console.log('Json message:', json);
});