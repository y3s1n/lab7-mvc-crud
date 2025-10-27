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
        this.sideBar = this.querySelector('#sideBar');
        

   
        this.attachListeners();

    }

    attachListeners() {
        this.sendBtn.addEventListener('click', this.onSend);
        this.textarea.addEventListener('keydown', this.onEnter);
        this.toggleBtn.addEventListener('click', this.onToggle);
        this.clearBtn.addEventListener('click', this.onClear);
        this.chatBox.addEventListener('click', this.onChatDelete);
        this.chatBox.addEventListener('click', this.onChatEdit);
        this.sideBar.addEventListener('click', this.onExport);
        this.sideBar.addEventListener('click', this.onImport);

    }



    // Handlers
    onImport = (e) => this.importChat(e);
    onExport = (e) => this.exportChat(e);
    onClear = () => this.clearChat();
    onChatDelete = (e) => this.deleteMsg(e);
    onChatEdit = (e) => this.editMsg(e);
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

    importChat(e) {
        const btn = e.target.closest('.importBtn');
        if (!btn) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (ev) => {
            const file = ev.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    this.dispatchEvent(new CustomEvent('importChat', { detail: {data}}));
                } catch (err) {
                    alert('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    exportChat(e) {
        const btn = e.target.closest('.exportBtn');
        if (!btn) return;

        this.dispatchEvent(new CustomEvent('exportChat'));
    }


    editMsg(e) {
        const btn = e.target.closest('.editBtn');
        if (!btn) return;

        const block = btn.closest('.userMsg');
        if (!block) return;

        const key = block.dataset.key;
        const currentText = block.querySelector('.message.user').textContent;

        this.dispatchEvent(new CustomEvent('requestEdit', {detail: {key, currentText}}));
    }
    deleteMsg(e) {
       
        const del = e.target.closest('.deleteBtn');
        if (!del) return;

         if (!(window.confirm("Are you sure you want to delete this message?"))) return;

        const block = del.closest('.userMsg');
        if (!block) return;

        const key = block.dataset.key;
        this.dispatchEvent(new CustomEvent('deleteMessage', {detail: {key}}));

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

    formatDate(dateLike) {
        const d = new Date(dateLike);
        return d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    }

     addUserMsg(text) {
    

        
        const userMsg = document.createElement('div');
        userMsg.className = 'userMsg';

     
        const theMessage = document.createElement('div');
        theMessage.className = `message ${text.id}`; 
        theMessage.textContent = text.message;

        const meta = document.createElement('div');
        meta.className = 'metaData';

     
        const time = document.createElement('time');
        time.className = `timestamp ${text.id}`;
        const d = new Date(text.date);
        const key = d.toISOString();
        userMsg.dataset.key = key;
        time.dateTime = key;
        time.textContent = this.formatDate(d); 

  
        const actions = document.createElement('div');
        actions.className = 'actions';

     
        const editBtn = document.createElement('button');
        editBtn.className = 'editBtn';
        editBtn.textContent = 'edit';

       
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = '🗑️';

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        meta.appendChild(time);
        meta.appendChild(actions);

        userMsg.appendChild(theMessage);
        userMsg.appendChild(meta);

        this.chatBox.appendChild(userMsg);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;

    }

    addBotMsg(text) {
        
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

    removeMsgByKey(key) {
        const block = this.chatBox.querySelector(`.userMsg [datetime="${key}"]`).closest('.userMsg');
        if (block) block.remove();
    }

    updateMsgByKey(key, newText, edited=false) {
        const block = this.chatBox.querySelector(`.userMsg[data-key="${key}"]`);
        if (!block) return;

        const msgEl = block.querySelector('.message.user');
        if (msgEl) msgEl.textContent = newText;

        if (edited) {
            const meta = block.querySelector('.metaData');
            if (!meta) return;
        
            let editedTag = meta.querySelector('.editedTag');
            if (!editedTag) {
                editedTag = document.createElement('span');
                editedTag.className = 'editedTag';
                editedTag.textContent = ' (edited)';
                const timeEl = meta.querySelector('time');
                if (timeEl && timeEl.nextSibling) {
                    meta.insertBefore(editedTag, timeEl.nextSibling);
                } else {
                    meta.appendChild(editedTag);
                }
            }
        }
    
    }
}

customElements.define('chat-view', chatView);