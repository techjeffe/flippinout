import { CHARSET, DEFAULT_FLIP_DURATION, SETTLE_DURATION, CLEAR_PAUSE } from './constants.js';

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
    this.flipDuration = DEFAULT_FLIP_DURATION;

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
    this.flipSequenceTo(targetChar, delay);
  }

  setFlipDuration(duration) {
    this.flipDuration = duration;
  }

  flipSequenceTo(targetChar, delay, { resetFirst = false } = {}) {
    if (!resetFirst && targetChar === this.currentChar) return 0;

    this.cancelAnimation();
    this.isAnimating = true;
    this._runId += 1;
    const runId = this._runId;
    const { sequence, pauseAfterIndex } = this._buildSequence(this.currentChar, targetChar, resetFirst);

    if (!sequence.length) {
      this.isAnimating = false;
      return 0;
    }

    this._startTimer = setTimeout(() => {
      if (runId !== this._runId) return;

      this.el.classList.add('scrambling');
      this._playSequence(sequence, 0, runId, pauseAfterIndex);
    }, delay);

    return delay + this._getSequenceDuration(sequence.length, pauseAfterIndex);
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

  _buildSequence(fromChar, targetChar, resetFirst) {
    const sequence = [];
    let pauseAfterIndex = -1;
    const pushForwardRange = (startChar, endChar) => {
      const startIndex = this._getCharsetIndex(startChar);
      const endIndex = this._getCharsetIndex(endChar);
      const steps = this._getStepCount(startIndex, endIndex);

      for (let step = 1; step <= steps; step += 1) {
        sequence.push(CHARSET[(startIndex + step) % CHARSET.length]);
      }
    };

    if (resetFirst && fromChar !== ' ') {
      pushForwardRange(fromChar, ' ');
      pauseAfterIndex = sequence.length - 1;
      fromChar = ' ';
    }

    if (targetChar !== fromChar) {
      pushForwardRange(fromChar, targetChar);
    }

    if (pauseAfterIndex === sequence.length - 1) {
      pauseAfterIndex = -1;
    }

    return { sequence, pauseAfterIndex };
  }

  _playSequence(sequence, index, runId, pauseAfterIndex) {
    if (runId !== this._runId) return;

    const nextChar = sequence[index];
    this.backSpan.textContent = nextChar === ' ' ? '' : nextChar;
    this.innerEl.classList.add('flipping');
    this.innerEl.style.transition = `transform ${this.flipDuration}ms ease-in-out`;
    this.innerEl.style.transform = 'perspective(600px) rotateX(-180deg)';

    this._schedule(() => {
      if (runId !== this._runId) return;

      this.frontSpan.textContent = nextChar === ' ' ? '' : nextChar;
      this.backSpan.textContent = '';
      this.innerEl.style.transition = 'none';
      this.innerEl.style.transform = '';
      this.innerEl.classList.remove('flipping');

      this._schedule(() => {
        if (runId !== this._runId) return;

        this.innerEl.style.transition = `${Math.max(100, Math.floor(SETTLE_DURATION * 0.6))}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        this.innerEl.style.transform = 'perspective(600px) rotateX(-2deg)';

        this._schedule(() => {
          if (runId !== this._runId) return;

          this.innerEl.style.transform = '';
          this._schedule(() => {
            if (runId !== this._runId) return;

            this.innerEl.style.transition = '';
            this.currentChar = nextChar;

            if (index === sequence.length - 1) {
              this.el.classList.remove('scrambling');
              this.isAnimating = false;
              return;
            }

            const nextDelay = index === pauseAfterIndex
              ? CLEAR_PAUSE
              : Math.max(40, Math.floor(SETTLE_DURATION * 0.2));

            this._schedule(() => {
              if (runId !== this._runId) return;
              this._playSequence(sequence, index + 1, runId, pauseAfterIndex);
            }, nextDelay);
          }, Math.max(40, Math.floor(SETTLE_DURATION * 0.2)));
        }, Math.max(60, Math.floor(SETTLE_DURATION * 0.4)));
      }, 10);
    }, this.flipDuration);
  }

  _getSequenceDuration(stepCount, pauseAfterIndex) {
    return stepCount * (this.flipDuration + SETTLE_DURATION) + (pauseAfterIndex >= 0 ? CLEAR_PAUSE : 0);
  }
}
