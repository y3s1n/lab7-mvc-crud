import "./view.js";
import * as model from "./model.js";

const view = document.querySelector('chat-view');

view.addEventListener('messageSent', (e) => {
    const userMessage = e.detail;
    model.saveMessage(userMessage);
    view.addToChatWindow(userMessage);  
}); 