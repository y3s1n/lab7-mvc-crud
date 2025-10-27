
const KEY  = 'chat.messages.v1';

export function loadMessages() {
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveMessage(msg) {
  const messageArr = loadMessages();
  messageArr.push(msg);
  localStorage.setItem(KEY, JSON.stringify(messageArr));
}

export function clearMessages() {
  localStorage.removeItem(KEY);
}

export function deleteMessage(key) {
  const arr = loadMessages();
  const next = arr.filter(msg => msg.date !== key);
  localStorage.setItem(KEY, JSON.stringify(next));
}