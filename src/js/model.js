const KEY = 'chat.messages.v1';

export function loadMessages() {
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveMessage(msg) {
  const messageArr = loadMessages();
  messageArr.push(msg);                     
  localStorage.setItem(KEY, JSON.stringify(messageArr));
}