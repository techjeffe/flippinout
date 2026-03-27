import { Tile } from './Tile.js';
import {
  GRID_COLS, GRID_ROWS, STAGGER_DELAY,
  TOTAL_TRANSITION
} from './constants.js';

export class Board {
  constructor(containerEl, soundEngine, themeManager) {
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.soundEngine = soundEngine;
    this.themeManager = themeManager;
    this.isTransitioning = false;
    this.tiles = [];
    this.currentGrid = [];
    this.accentIndex = 0;
    this._transitionTimer = null;

    // Build board DOM
    this.boardEl = document.createElement('div');
    this.boardEl.className = 'board';
    this.boardEl.style.setProperty('--grid-cols', this.cols);
    this.boardEl.style.setProperty('--grid-rows', this.rows);

    // Left accent squares (2 small stacked blocks)
    this.leftBar = this._createAccentBar('accent-bar-left');
    this.boardEl.appendChild(this.leftBar);

    // Tile grid
    this.gridEl = document.createElement('div');
    this.gridEl.className = 'tile-grid';

    for (let r = 0; r < this.rows; r++) {
      const row = [];
      const charRow = [];
      for (let c = 0; c < this.cols; c++) {
        const tile = new Tile(r, c);
        tile.setChar(' ');
        this.gridEl.appendChild(tile.el);
        row.push(tile);
        charRow.push(' ');
      }
      this.tiles.push(row);
      this.currentGrid.push(charRow);
    }

    this.boardEl.appendChild(this.gridEl);

    // Right accent squares
    this.rightBar = this._createAccentBar('accent-bar-right');
    this.boardEl.appendChild(this.rightBar);

    // Keyboard hint icon (bottom-left)
    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.textContent = 'N';
    hint.title = 'Keyboard shortcuts';
    hint.addEventListener('click', (e) => {
      e.stopPropagation();
      const overlay = this.boardEl.querySelector('.shortcuts-overlay');
      if (overlay) overlay.classList.toggle('visible');
    });
    this.boardEl.appendChild(hint);

    // Shortcuts overlay
    const overlay = document.createElement('div');
    overlay.className = 'shortcuts-overlay';
    overlay.innerHTML = `
      <div><span>Next message</span><kbd>Enter</kbd></div>
      <div><span>Previous</span><kbd>\u2190</kbd></div>
      <div><span>Clock mode</span><kbd>C</kbd></div>
      <div><span>Change theme</span><kbd>T</kbd></div>
      <div><span>Fullscreen</span><kbd>F</kbd></div>
      <div><span>Mute</span><kbd>M</kbd></div>
    `;
    this.boardEl.appendChild(overlay);

    // Settings flip tiles (mobile only - grey/faint)
    const settingsTiles = document.createElement('div');
    settingsTiles.className = 'settings-tiles';
    
    // Left tile: Theme (grey/faint)
    this.leftSettingTile = document.createElement('div');
    this.leftSettingTile.className = 'settings-tile';
    this.leftSettingTile.id = 'left-setting-tile';
    this.leftSettingTile.textContent = 'THEME';
    
    // Center tile: Clock (grey/faint)
    this.centerSettingTile = document.createElement('div');
    this.centerSettingTile.className = 'settings-tile';
    this.centerSettingTile.id = 'center-setting-tile';
    this.centerSettingTile.textContent = 'CLOCK';
    
    // Right tile: Fullscreen button
    this.rightSettingTile = document.createElement('div');
    this.rightSettingTile.className = 'settings-tile settings-tile-primary';
    this.rightSettingTile.id = 'right-setting-tile';
    this.rightSettingTile.textContent = 'FULL';
    
    settingsTiles.appendChild(this.leftSettingTile);
    settingsTiles.appendChild(this.centerSettingTile);
    settingsTiles.appendChild(this.rightSettingTile);
    this.boardEl.appendChild(settingsTiles);

    containerEl.appendChild(this.boardEl);
    this._updateAccentColors();
  }

  _createAccentBar(extraClass) {
    const bar = document.createElement('div');
    bar.className = `accent-bar ${extraClass}`;
    // Just 2 small stacked squares like the original
    for (let i = 0; i < 2; i++) {
      const seg = document.createElement('div');
      seg.className = 'accent-segment';
      bar.appendChild(seg);
    }
    return bar;
  }

  _updateAccentColors() {
    const theme = this.themeManager ? this.themeManager.getTheme() : null;
    const color = theme ? theme.accentColor : '#FFFFFF';
    
    const segments = this.boardEl.querySelectorAll('.accent-segment');
    segments.forEach(seg => {
      seg.style.backgroundColor = color;
      seg.style.boxShadow = `0 0 12px ${color}, 0 0 4px ${color}`;
    });
  }

  displayMessage(lines) {
    // Format lines into grid
    const newGrid = this._formatToGrid(lines);

    // Determine which tiles need to change
    let hasChanges = false;

    if (this._transitionTimer) {
      clearTimeout(this._transitionTimer);
      this._transitionTimer = null;
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const newChar = newGrid[r][c];
        const oldChar = this.currentGrid[r][c];

        if (newChar !== oldChar) {
          const delay = (r * this.cols + c) * STAGGER_DELAY;
          this.tiles[r][c].scrambleTo(newChar, delay);
          hasChanges = true;
        }
      }
    }

    this.isTransitioning = hasChanges;

    // Play the single transition audio clip once
    if (hasChanges && this.soundEngine) {
      this.soundEngine.playTransition();
    }

    // Update accent bar (subtle pulse)
    this._updateAccentColors();

    // Update grid state
    this.currentGrid = newGrid;

    // Clear transitioning flag after animation completes
    if (hasChanges) {
      this._transitionTimer = setTimeout(() => {
        this.isTransitioning = false;
        this._transitionTimer = null;
      }, TOTAL_TRANSITION + 200);
    }
  }

  _formatToGrid(lines) {
    const grid = [];
    for (let r = 0; r < this.rows; r++) {
      const line = (lines[r] || '').toUpperCase();
      const padTotal = this.cols - line.length;
      const padLeft = Math.max(0, Math.floor(padTotal / 2));
      const padded = ' '.repeat(padLeft) + line + ' '.repeat(Math.max(0, this.cols - padLeft - line.length));
      grid.push(padded.split(''));
    }
    return grid;
  }
}
