import { MESSAGES, MESSAGE_INTERVAL } from './constants.js';

export class MessageRotator {
  constructor(board) {
    this.board = board;
    this.messages = MESSAGES;
    this.currentIndex = -1;
    this._timer = null;
    this._paused = false;
  }

  start() {
    this._clearTimer();

    // Show first message immediately
    this.next();
  }

  stop() {
    this._clearTimer();
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
    this._clearTimer();
    this._timer = setTimeout(() => {
      this._timer = null;
      if (!this._paused && !this.board.isTransitioning) {
        this.next();
        return;
      }

      this._resetAutoRotation();
    }, Math.max(MESSAGE_INTERVAL, this.board.getTransitionDuration() + 1000));
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
