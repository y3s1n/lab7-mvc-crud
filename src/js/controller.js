import "./view.js";
import * as model from "./model.js";
import { getBotResponse } from './eliza.js';

const view = document.querySelector('chat-view');

view.addEventListener('messageSent', (e) => {
    const userMessage = e.detail;
    model.saveMessage(userMessage);
    view.addToChatWindow(userMessage);  


    const botText = {
        id: 'bot',
        message: getBotResponse(userMessage.message),
        date: new Date()
    };

    model.saveMessage(botText);
    view.addToChatWindow(botText);
}); 



view.addEventListener('clearChat', () => {
    model.clearMessages();
})

