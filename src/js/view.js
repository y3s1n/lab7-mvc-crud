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
        // this.clearBtn = this.querySelector('#clearBtn');

   
        this.attachListeners();

    }

    attachListeners() {
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);
        this.toggleBtn.addEventListener('click', this.onToggle);
        this.createBtn.addEventListener('click', this.onCreate);
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


    

    //CRUD Methods

    CreateChat() {
        window.prompt("Name this chat:");
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

}

customElements.define('chat-view', chatView);