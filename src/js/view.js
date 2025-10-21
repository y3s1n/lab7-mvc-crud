export class chatView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.form = this.querySelector('#chatForm');
        this.textarea = this.querySelector('#messageBox');
        this.button = this.querySelector('#sendBtn');
        this.chatBox = this.querySelector('.chatBox');


        this.onClick = ()  => this.send();
        this.onEnter = (e) => {
            if(e.key === 'Enter' && !e.shiftKey){
                e.preventDefault();
                this.send();
            }
        };

        this.button.addEventListener('click', this.onClick);
        this.textarea.addEventListener('keydown', this.onEnter);

    }


     send() {
        const text = {
            id: 'user',
            message: this.textarea.value,
            date: new Date()
        };

        this.dispatchEvent(new CustomEvent('messageSent', {detail: text}));

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