export const CHAT_INDEX_KEY = 'chatIndex';

export const CURRENT_CHAT_KEY = 'currentChat';

export const CHAT_MESSAGES_PREFIX = 'chatMessages_';


// Helper to get the storage key for a specific chat

function loadIndex() {
  const stored = localStorage.getItem(CHAT_INDEX_KEY);
  if (!stored) return [];
  try {
    const arr = JSON.parse(stored);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveIndex(chatNames) {
  if (!Array.isArray(chatNames)) throw new Error('saveIndex expects an array');
  localStorage.setItem(CHAT_INDEX_KEY, JSON.stringify(chatNames));
}

export function listChats() {
  return loadIndex();
}

// Accessing current chat

export function getCurrentChat() {
  const name = localStorage.getItem(CURRENT_CHAT_KEY);
  return name ? name : null;
}

export function setCurrentChat(name) {
  const clean = String(name).trim();
  if (clean === '') throw new Error('Chat name cannot be empty');
  localStorage.setItem(CURRENT_CHAT_KEY, clean);
  return clean;
}

export function clearCurrentChat() {
  localStorage.removeItem(CURRENT_CHAT_KEY);
}

// creating a new chat

function keyForChat(name) {
  return CHAT_MESSAGES_PREFIX + name;
}

export function createChat(name, { setCurrent = true } = {}) {
  const clean = String(name).trim();
  if (!clean) throw new Error('Chat name cannot be empty');

  const stored = localStorage.getItem(CHAT_INDEX_KEY);
  let chatIndex;
  try {
    index = stored ? JSON.parse(stored) : [];
  } catch {
    index = [];
  }

  const exists = index.includes(clean);
  if (exists) throw new Error(`Chat with name "${clean}" already exists`);
  index.push(clean);
  localStorage.setItem(CHAT_INDEX_KEY, JSON.stringify(index));

  const chatKey = keyForChat(clean);
  if (localStorage.getItem(chatKey) == null) {
    localStorage.setItem(chatKey, JSON.stringify([]));
  }

  if (setCurrent) {
    localStorage.setItem(CURRENT_CHAT_KEY, clean);
  }

  return { name: clean, created: true };
}

// load and save array

function loadArray(key) {
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    const arr = JSON.parse(stored);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}



export function loadMessages() {
  const current = getCurrentChat();
  if (!current) return [];
  return loadArray(keyForChat(current));
}

export function saveMessage(msg) {
 const current = getCurrentChat();
 if (!current) throw new Error('No current chat selected');
 const key = keyForChat(current);
 const messages = loadArray(key);
 messages.push(msg);
 saveArray(key, messages);
}

export function clearMessages() {
  const current = getCurrentChat();
  if (!current) return;

  localStorage.removeItem(keyForChat(current));
}