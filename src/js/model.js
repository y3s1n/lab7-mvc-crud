
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

export function updateMessage(key, newText) {
  const arr = loadMessages();
  const i = arr.findIndex(msg => msg.date === key);
  if (i === -1) return false;

  arr[i].message = newText;
  arr[i].edited = true;
  arr[i].editedAt = new Date().toISOString();

  localStorage.setItem(KEY, JSON.stringify(arr));
  return true;
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}