export class chatView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.form = this.querySelector('#chatForm');
        this.textarea = this.querySelector('#messageBox');
        this.sendBtn = this.querySelector('#sendBtn');
        this.chatBox = this.querySelector('.chatBox');
        this.toggleBtn = this.querySelector('#toggleBtn');
        this.createBtn = this.querySelector('#createBtn');
        this.chatList = this.querySelector('#chatList');
        // this.clearBtn = this.querySelector('#clearBtn');

   
        this.attachListeners();

    }

    attachListeners() {
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);
        this.toggleBtn.addEventListener('click', this.onToggle);
        this.createBtn.addEventListener('click', this.onCreate);
        this.chatList.addEventListener('click', this.onChatListClick);
        // this.clearBtn.addEventListener('click', this.onClear);
    }



    // Handlers

    //onClear = () => this.clearChat();
    onCreate = () => this.CreateChat();
    onSend = ()  => this.sendMessage();
    onEnter = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            this.sendMessage();
        }
    };
    onToggle = () => {
        this.closest('.box').classList.toggle('is-open');
    }
    onChatListClick = (e) => {
        const clear = e.target.closest('.clearChat');
        const deleteChat = e.target.closest('.deleteChat');
        const open = e.target.closest('.chatItem');
        if (!clear && !deleteChat && !oepn) return;

        const name = e.target.closest('li').querySelector('.chatItem').dataset.name;
        if (!name) return;

        if (open) {
            this.dispatchEvent(new CustomEvent('openChat', {detail: {name}}));
        } else if (clear) {
            this.dispatchEvent(new CustomEvent('clearChat', {detail: {name}}));
        } else if (deleteChat) {
            this.dispatchEvent(new CustomEvent('deleteChat', {detail: {name}}));
        }

    };


    

    //CRUD Methods

    CreateChat() {
        const name = window.prompt("Name this chat:");
        if (name === null || name === "") return;
        const chatName = name.trim();
        this.dispatchEvent(new CustomEvent('createChat', {name: chatName}));

    }

    clearChat() {
       if (!(window.confirm("Are you sure you want to clear the chat?"))) return;


        this.dispatchEvent(new CustomEvent('clearChat'));   
        this.chatBox.innerHTML = '';
    }

// Functions

     sendMessage() {
        const userText = {
            id: 'user',
            message: this.textarea.value,
            date: new Date()
        };

        this.dispatchEvent(new CustomEvent('messageSent', {detail: userText}));

        this.textarea.value = '';
        this.textarea.focus();

        
    }

     addToChatWindow(text) {
    
        const theMessage = document.createElement('div');
        theMessage.className = `message ${text.id}`;
        theMessage.textContent = text.message;
        this.chatBox.appendChild(theMessage);

        this.chatBox.scrollTop = this.chatBox.scrollHeight;

    }

    addToChatList(name, current = false) {
        if (!this.chatList) return;
        
        const li = document.createElement('li');
        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'chatItem';
        openBtn.dataset.name = name;
        openBtn.textContent = name;
        if (current) openBtn.setAttribute('aria-current', 'true');
        li.appendChild(openBtn);


        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'deleteChat';
        deleteBtn.textContent = '×';
        deleteBtn.title = `Delete chat"`;
        li.appendChild(deleteBtn);

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'clearChat';
        clearBtn.textContent = '🗑️';
        clearBtn.title = `Clear chat"`;
        li.appendChild(clearBtn);

        this.chatList.appendChild(li);
    }

}

customElements.define('chat-view', chatView);