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
        this.clearBtn = this.querySelector('.clearBtn');

   
        this.attachListeners();

    }

    attachListeners() {
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);
        this.toggleBtn.addEventListener('click', this.onToggle);
        this.clearBtn.addEventListener('click', this.onClear);
    }



    // Handlers

    onClear = () => this.clearChat();
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

    formatDate(dateLike) {
        const d = new Date(dateLike);
        return d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    }

     addToChatWindow(text) {
    
        const theMessage = document.createElement('div');
        theMessage.className = `message ${text.id}`;
        theMessage.textContent = text.message;
        

        const time = document.createElement('time');
        time.className = `timestamp ${text.id}`;

        const d = new Date(text.date);
        time.dateTime = d.toISOString();
        time.textContent = this.formatDate(d);

        
        this.chatBox.appendChild(theMessage);
        this.chatBox.appendChild(time);


        this.chatBox.scrollTop = this.chatBox.scrollHeight;

    }

}

customElements.define('chat-view', chatView);