import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';
import { ThemeManager } from './ThemeManager.js';
import { ClockMode } from './ClockMode.js';
import { MESSAGES, QUOTE_SCREENS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'flippinout-custom-screens';
  const MAX_LINES = 7;

  const boardContainer = document.getElementById('board-container');
  const screenSettings = document.getElementById('screen-settings');
  const screenEditorList = document.getElementById('screen-editor-list');
  const addScreenBtn = document.getElementById('add-screen-btn');
  const scrollToSettingsBtn = document.getElementById('scroll-to-settings-btn');
  const volumeBtn = document.getElementById('volume-btn');
  const ctaBtn = document.getElementById('cta-btn');
  const leftSettingTile = document.getElementById('left-setting-tile');
  const centerSettingTile = document.getElementById('center-setting-tile');
  const rightSettingTile = document.getElementById('right-setting-tile');

  const soundEngine = new SoundEngine();

  // Create theme manager first (needed by board)
  const themeManager = new ThemeManager(null);

  const board = new Board(boardContainer, soundEngine, themeManager);
  themeManager.boardEl = board.boardEl;

  const rotator = new MessageRotator(board);
  const clockMode = new ClockMode(board);
  const keyboard = new KeyboardController(rotator, soundEngine);
  const screens = loadScreens();

  rotator.setMessages(screens);

  let isClockMode = false;

  renderScreenEditors();
  syncClockTileState();

  // Enhanced keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 't' || e.key === 'T') {
      const themeName = themeManager.cycleTheme();
      showNotification(`Theme: ${themeName}`);
    }

    if (e.key === 'c' || e.key === 'C') {
      toggleClockMode();
    }
  });

  // Initialize audio on first user interaction (browser autoplay policy)
  let audioInitialized = false;
  const initAudio = async () => {
    if (audioInitialized) return;
    audioInitialized = true;
    await soundEngine.init();
    soundEngine.resume();
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);

  // Start message rotation
  rotator.start();

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      initAudio();
      const muted = soundEngine.toggleMute();
      volumeBtn.classList.toggle('muted', muted);
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      boardContainer.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.documentElement.requestFullscreen().catch(() => {});
      }, 400);
    });
  }

  if (scrollToSettingsBtn) {
    scrollToSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      screenSettings?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (addScreenBtn) {
    addScreenBtn.addEventListener('click', () => {
      screens.push(createQuoteScreen());
      persistScreens();
      renderScreenEditors(screens.length - 1);
      syncMessages({ previewIndex: screens.length - 1 });
    });
  }

  if (leftSettingTile) {
    leftSettingTile.addEventListener('click', () => {
      leftSettingTile.classList.add('flipping');

      setTimeout(() => {
        const themeName = themeManager.cycleTheme();
        showNotification(`Theme: ${themeName}`);
        leftSettingTile.classList.remove('flipping');
      }, 150);
    });
  }

  if (centerSettingTile) {
    centerSettingTile.addEventListener('click', () => {
      centerSettingTile.classList.add('flipping');

      setTimeout(() => {
        toggleClockMode();
        centerSettingTile.classList.remove('flipping');
      }, 150);
    });
  }

  if (rightSettingTile) {
    rightSettingTile.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          showNotification('Fullscreen not available');
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  function toggleClockMode() {
    isClockMode = !isClockMode;

    if (isClockMode) {
      rotator.stop();
      clockMode.start();
      showNotification('Clock Mode ON');
    } else {
      clockMode.stop();
      rotator.start();
      showNotification('Message Mode ON');
    }

    syncClockTileState();
  }

  function createEmptyScreen() {
    return Array(MAX_LINES).fill('');
  }

  function createQuoteScreen() {
    const quote = QUOTE_SCREENS[Math.floor(Math.random() * QUOTE_SCREENS.length)] || createEmptyScreen();
    return quote.map(line => line.slice(0, board.cols));
  }

  function normalizeScreens(rawScreens) {
    if (!Array.isArray(rawScreens) || !rawScreens.length) {
      return [createEmptyScreen()];
    }

    const normalized = rawScreens.map((screen) => {
      const lines = Array.isArray(screen) ? screen : String(screen || '').split('\n');
      return Array.from({ length: MAX_LINES }, (_, index) => {
        return String(lines[index] || '').slice(0, board.cols);
      });
    });

    return normalized.length ? normalized : [createEmptyScreen()];
  }

  function loadScreens() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return normalizeScreens([MESSAGES[0]]);
      return normalizeScreens(JSON.parse(saved));
    } catch (error) {
      console.warn('Failed to load saved screens:', error);
      return normalizeScreens([MESSAGES[0]]);
    }
  }

  function persistScreens() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));
  }

  function screenToTextareaValue(screen) {
    let lastNonEmptyIndex = screen.findLastIndex(line => line.trim().length > 0);

    if (lastNonEmptyIndex === -1) {
      lastNonEmptyIndex = 0;
    }

    return screen.slice(0, lastNonEmptyIndex + 1).join('\n');
  }

  function textareaToScreen(value) {
    const lines = normalizeTextareaValue(value).split('\n').slice(0, MAX_LINES);

    while (lines.length < MAX_LINES) {
      lines.push('');
    }

    return lines.map(line => line.slice(0, board.cols));
  }

  function normalizeTextareaValue(value) {
    return String(value)
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .slice(0, MAX_LINES)
      .map(line => line.slice(0, board.cols))
      .join('\n');
  }

  function getSelectionRange(value, start, end) {
    const lines = value.split('\n');
    let offset = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const lineLength = lines[lineIndex].length;
      const lineStart = offset;
      const lineEnd = offset + lineLength;

      if (start >= lineStart && start <= lineEnd) {
        const endInLine = Math.min(end, lineEnd);
        return {
          lineIndex,
          columnStart: start - lineStart,
          columnEnd: endInLine - lineStart,
          selectedLineCount: value.slice(start, end).split('\n').length
        };
      }

      offset = lineEnd + 1;
    }

    const lastLineIndex = lines.length - 1;
    return {
      lineIndex: lastLineIndex,
      columnStart: lines[lastLineIndex].length,
      columnEnd: lines[lastLineIndex].length,
      selectedLineCount: 1
    };
  }

  function shouldBlockInput(textarea, event) {
    if (event.inputType.startsWith('delete')) return false;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selection = getSelectionRange(value, start, end);
    const insertedText = event.data ?? '';

    if (event.inputType === 'insertLineBreak') {
      const currentLines = value.split('\n').length;
      const replacedLines = value.slice(start, end).split('\n').length;
      return currentLines - replacedLines + 1 >= MAX_LINES;
    }

    if (!insertedText) return false;
    if (insertedText.includes('\n')) return false;

    const selectedWidth = selection.columnEnd - selection.columnStart;
    const currentLine = value.split('\n')[selection.lineIndex] || '';
    const nextLength = currentLine.length - selectedWidth + insertedText.length;
    return nextLength > board.cols;
  }

  function syncMessages({ previewIndex = null } = {}) {
    rotator.setMessages(screens, { preserveCurrent: true });

    if (isClockMode) return;

    if (typeof previewIndex === 'number') {
      rotator.showMessage(previewIndex);
      return;
    }

    if (rotator.currentIndex === -1) {
      rotator.showMessage(0);
    }
  }

  function renderScreenEditors(focusIndex = null) {
    if (!screenEditorList) return;
    screenEditorList.innerHTML = '';

    screens.forEach((screen, index) => {
      const card = document.createElement('article');
      card.className = 'screen-editor';

      const header = document.createElement('div');
      header.className = 'screen-editor-header';

      const labelWrap = document.createElement('div');

      const title = document.createElement('div');
      title.className = 'screen-editor-title';
      title.textContent = `Screen ${index + 1}`;

      const meta = document.createElement('div');
      meta.className = 'screen-editor-meta';
      meta.textContent = `${MAX_LINES} lines, ${board.cols} characters max per line`;

      labelWrap.appendChild(title);
      labelWrap.appendChild(meta);
      header.appendChild(labelWrap);

      if (screens.length > 1) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'screen-remove-btn';
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
          const nextIndex = Math.max(0, Math.min(index, screens.length - 2));
          screens.splice(index, 1);
          persistScreens();
          renderScreenEditors();
          syncMessages({ previewIndex: nextIndex });
        });
        header.appendChild(removeBtn);
      }

      const textarea = document.createElement('textarea');
      textarea.className = 'screen-textarea';
      textarea.rows = MAX_LINES;
      textarea.spellcheck = false;
      textarea.value = screenToTextareaValue(screen);
      textarea.placeholder = 'Type one line per row';
      textarea.addEventListener('beforeinput', (event) => {
        if (shouldBlockInput(textarea, event)) {
          event.preventDefault();
        }
      });
      textarea.addEventListener('input', () => {
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const normalizedValue = normalizeTextareaValue(textarea.value);

        if (textarea.value !== normalizedValue) {
          textarea.value = normalizedValue;
          const caret = Math.min(selectionStart, normalizedValue.length);
          textarea.setSelectionRange(caret, Math.min(selectionEnd, normalizedValue.length));
        }

        screens[index] = textareaToScreen(textarea.value);
        persistScreens();
        syncMessages({ previewIndex: index });
      });

      const help = document.createElement('p');
      help.className = 'screen-editor-help';
      help.textContent = 'Press Enter to add the next row. Up to 7 rows are supported.';

      card.appendChild(header);
      card.appendChild(textarea);
      card.appendChild(help);
      screenEditorList.appendChild(card);

      if (focusIndex === index) {
        requestAnimationFrame(() => textarea.focus());
      }
    });
  }

  function syncClockTileState() {
    if (!centerSettingTile) return;
    centerSettingTile.classList.toggle('active', isClockMode);
  }

  function showNotification(message) {
    const existing = document.querySelector('.mode-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'mode-notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('visible'), 10);
    setTimeout(() => {
      notif.classList.remove('visible');
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
});
