export function seralizeMessage(message) {
    return JSON.stringify(message);
}

const KEY = 'sheet1';

export function saveMessage(jsonMessage) {
    localStorage.setItem(KEY, jsonMessage);
}