import { MESSAGES, MESSAGE_INTERVAL, TOTAL_TRANSITION } from './constants.js';

export class MessageRotator {
  constructor(board) {
    this.board = board;
    this.messages = MESSAGES;
    this.currentIndex = -1;
    this._timer = null;
    this._paused = false;
  }

  start() {
    if (this._timer) {
      clearInterval(this._timer);
    }

    // Show first message immediately
    this.next();

    // Begin auto-rotation
    this._timer = setInterval(() => {
      if (!this._paused && !this.board.isTransitioning) {
        this.next();
      }
    }, MESSAGE_INTERVAL + TOTAL_TRANSITION);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  setMessages(messages, { preserveCurrent = false } = {}) {
    this.messages = messages.length ? messages : [['', '', '', '', '', '', '']];

    if (!preserveCurrent) {
      this.currentIndex = -1;
    } else if (this.currentIndex >= this.messages.length) {
      this.currentIndex = this.messages.length - 1;
    }
  }

  next() {
    if (!this.messages.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  prev() {
    if (!this.messages.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.messages.length) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  showMessage(index) {
    if (!this.messages.length) return;
    const safeIndex = Math.max(0, Math.min(index, this.messages.length - 1));
    this.currentIndex = safeIndex;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  _resetAutoRotation() {
    // Reset timer when user manually navigates
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        if (!this._paused && !this.board.isTransitioning) {
          this.next();
        }
      }, MESSAGE_INTERVAL + TOTAL_TRANSITION);
    }
  }
}
