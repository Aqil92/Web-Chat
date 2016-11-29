/**
 * This file is part of the webrtc-chat package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {EventType} from "peer-data";

export class Chat {
    constructor(peerData) {
        this.peerData = peerData;
        this.inputSelector = 'input#sendInput';
        this.subscribeEvents();
        this.init('sendBtn');
    }

    init(id) {
        let sendBtn = document.getElementById(id);
        sendBtn.addEventListener('click', this.onSend.bind(this));

        document.querySelector(this.inputSelector).addEventListener('keypress', this.onEnter.bind(this));
    }

    subscribeEvents() {
        this.peerData.on(EventType.OPEN, this.onOpen.bind(this));
        this.peerData.on(EventType.CLOSE, this.onClose.bind(this));
        this.peerData.on(EventType.DATA, this.onData.bind(this));
        this.peerData.on(EventType.ERROR, this.onError.bind(this));
    }

    onEnter(event) {
        if (event.keyCode === 13) {
            this.onSend()
        }
    }

    onSend() {
        let message = document.querySelector(this.inputSelector).value;
        this.clearInput();
        this.peerData.send(message);
        this.addMessage(message);
        let elem = document.querySelector('div.chat');
        elem.scrollTop = elem.scrollHeight;
    }

    onOpen(event) {
        this.addMessage('User joined chat', 'system');
    }

    onClose(event) {
        this.addMessage('User left chat', 'system');
    }

    onData(event) {
        this.addMessage(event.data, true);
    }

    onError(event) {
        this.addMessage(event.toString(), 'system');
    }

    clearInput() {
        document.querySelector(this.inputSelector).value = '';
    }

    addMessage(message, incoming = false) {
        let template = require('./../public/message.html');
        incoming = incoming === 'system' ? 'system' : incoming ? 'income' : 'outcome';
        template = template.replace(/{{message}}/gi, prop => message);
        template = template.replace(/{{class}}/gi, prop => incoming);
        document.querySelector('div.chat').innerHTML += template;
    }
}
