export class chatView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.form = this.querySelector('#chatForm');
        this.textarea = this.querySelector('#messageBox');
        this.sendBtn = this.querySelector('#sendBtn');
        this.chatBox = this.querySelector('.chatBox');
        this.clearBtn = this.querySelector('#clearBtn');


        this.onClear = () => this.clearChat();
        this.onSend = ()  => this.sendMessage();
        this.onEnter = (e) => {
            if(e.key === 'Enter' && !e.shiftKey){
                e.preventDefault();
                this.sendMessage();
            }
        };

        this.clearBtn.addEventListener('click', this.onClear);
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);

    }

    clearChat() {
       if (!(window.confirm("Are you sure you want to clear the chat?"))) return;


        this.dispatchEvent(new CustomEvent('clearChat'));   
        this.chatBox.innerHTML = '';
    }

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
    
        const theSpeaker = document.createElement('div');
        theSpeaker.className = text.id;

        const theMessage = document.createElement('p');
        theMessage.className = 'message';
        theMessage.textContent = text.message;

        theSpeaker.appendChild(theMessage);
        this.chatBox.appendChild(theSpeaker);

        this.chatBox.scrollTop = this.chatBox.scrollHeight;

    }

}

customElements.define('chat-view', chatView);