import { CHARSET, SCRAMBLE_DURATION, FLIP_DURATION } from './constants.js';

export class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.currentChar = ' ';
    this.isAnimating = false;
    this._scrambleTimer = null;
    this._startTimer = null;
    this._timers = new Set();
    this._runId = 0;

    // Build DOM
    this.el = document.createElement('div');
    this.el.className = 'tile';

    this.innerEl = document.createElement('div');
    this.innerEl.className = 'tile-inner';

    this.frontEl = document.createElement('div');
    this.frontEl.className = 'tile-front';
    this.frontSpan = document.createElement('span');
    this.frontEl.appendChild(this.frontSpan);

    this.backEl = document.createElement('div');
    this.backEl.className = 'tile-back';
    this.backSpan = document.createElement('span');
    this.backEl.appendChild(this.backSpan);

    this.innerEl.appendChild(this.frontEl);
    this.innerEl.appendChild(this.backEl);
    this.el.appendChild(this.innerEl);
  }

  setChar(char) {
    this.cancelAnimation();
    this.currentChar = char;
    this.frontSpan.textContent = char === ' ' ? '' : char;
    this.backSpan.textContent = '';
    this.frontEl.style.backgroundColor = '';
  }

  scrambleTo(targetChar, delay) {
    if (targetChar === this.currentChar) return;

    this.cancelAnimation();
    this.isAnimating = true;
    this._runId += 1;
    const runId = this._runId;

    this._startTimer = setTimeout(() => {
      if (runId !== this._runId) return;

      this.el.classList.add('scrambling');
      const startIndex = this._getCharsetIndex(this.currentChar);
      const targetIndex = this._getCharsetIndex(targetChar);
      const stepCount = this._getStepCount(startIndex, targetIndex);
      const scrambleInterval = Math.max(45, Math.floor(SCRAMBLE_DURATION / Math.max(stepCount, 1)));
      let currentIndex = startIndex;

      this._scrambleTimer = setInterval(() => {
        if (runId !== this._runId) {
          clearInterval(this._scrambleTimer);
          this._scrambleTimer = null;
          return;
        }

        currentIndex = (currentIndex + 1) % CHARSET.length;
        const nextChar = CHARSET[currentIndex];
        this.frontSpan.textContent = nextChar === ' ' ? '' : nextChar;

        if (currentIndex === targetIndex) {
          clearInterval(this._scrambleTimer);
          this._scrambleTimer = null;

          // Prepare back face with new character
          this.backSpan.textContent = targetChar === ' ' ? '' : targetChar;

          // Full 3D mechanical flip animation
          this.innerEl.classList.add('flipping');
          this.innerEl.style.transition = `transform ${FLIP_DURATION * 1.5}ms ease-in-out`;
          this.innerEl.style.transform = 'perspective(600px) rotateX(-180deg)';

          this._schedule(() => {
            if (runId !== this._runId) return;

            // Swap characters
            this.frontSpan.textContent = targetChar === ' ' ? '' : targetChar;
            this.backSpan.textContent = '';
            
            // Reset rotation
            this.innerEl.style.transition = 'none';
            this.innerEl.style.transform = '';
            this.innerEl.classList.remove('flipping');
            
            // Brief settle bounce
            this._schedule(() => {
              if (runId !== this._runId) return;

              this.innerEl.style.transition = `transform ${FLIP_DURATION / 2}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
              this.innerEl.style.transform = 'perspective(600px) rotateX(-3deg)';
              
              this._schedule(() => {
                if (runId !== this._runId) return;

                this.innerEl.style.transform = '';
                this._schedule(() => {
                  if (runId !== this._runId) return;

                  this.innerEl.style.transition = '';
                  this.el.classList.remove('scrambling');
                  this.currentChar = targetChar;
                  this.isAnimating = false;
                }, 50);
              }, 60);
            }, 10);
          }, FLIP_DURATION * 1.5);
        }
      }, scrambleInterval);
    }, delay);
  }

  cancelAnimation() {
    this._runId += 1;

    if (this._startTimer) {
      clearTimeout(this._startTimer);
      this._startTimer = null;
    }

    if (this._scrambleTimer) {
      clearInterval(this._scrambleTimer);
      this._scrambleTimer = null;
    }

    this._timers.forEach(timer => clearTimeout(timer));
    this._timers.clear();

    this.el.classList.remove('scrambling');
    this.innerEl.classList.remove('flipping');
    this.innerEl.style.transition = '';
    this.innerEl.style.transform = '';
    this.backSpan.textContent = '';
    this.isAnimating = false;
  }

  _schedule(fn, delay) {
    const timer = setTimeout(() => {
      this._timers.delete(timer);
      fn();
    }, delay);
    this._timers.add(timer);
  }

  _getCharsetIndex(char) {
    const index = CHARSET.indexOf(char);
    return index >= 0 ? index : 0;
  }

  _getStepCount(fromIndex, toIndex) {
    if (toIndex >= fromIndex) {
      return toIndex - fromIndex;
    }
    return (CHARSET.length - fromIndex) + toIndex;
  }
}
