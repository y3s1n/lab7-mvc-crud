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

function loadCurrentChat() {
    const messages = model.loadMessages();
    messages.forEach(msg => view.addToChatWindow(msg));
}

view.addEventListener('createChat', (e) => {    
    const chatName = e.detail.name;
    try {
        model.createChat(chatName);
        model.setCurrentChat(chatName);
        loadCurrentChat();
    } catch (err) {
        window.alert(err.message);
    }
});

const currentChat = model.getCurrentChat();
if (currentChat) {
    loadCurrentChat();
}

// view.addEventListener('clearChat', () => {
//     model.clearMessages();
// });