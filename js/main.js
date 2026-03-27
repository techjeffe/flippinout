import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';
import { ThemeManager } from './ThemeManager.js';
import { ClockMode } from './ClockMode.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.getElementById('board-container');
  const soundEngine = new SoundEngine();
  
  // Create theme manager first (needed by board)
  const themeManager = new ThemeManager(null); // Will be set after board creation
  
  const board = new Board(boardContainer, soundEngine, themeManager);
  themeManager.boardEl = board.boardEl; // Set board element for theme updates
  
  const rotator = new MessageRotator(board);
  const clockMode = new ClockMode(board);
  const keyboard = new KeyboardController(rotator, soundEngine);
  
  let isClockMode = false;
  
  // Enhanced keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Theme cycling with 'T' key
    if (e.key === 't' || e.key === 'T') {
      const themeName = themeManager.cycleTheme();
      showNotification(`Theme: ${themeName}`);
    }
    
    // Clock mode toggle with 'C' key
    if (e.key === 'c' || e.key === 'C') {
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

  // Volume toggle button in header
  const volumeBtn = document.getElementById('volume-btn');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      initAudio();
      const muted = soundEngine.toggleMute();
      volumeBtn.classList.toggle('muted', muted);
    });
  }

  // "Get Early Access" button: scroll to board and go fullscreen
  const ctaBtn = document.getElementById('cta-btn');
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

  // Mobile settings tiles
  const leftSettingTile = document.getElementById('left-setting-tile');
  const centerSettingTile = document.getElementById('center-setting-tile');
  const rightSettingTile = document.getElementById('right-setting-tile');
  
  // Left tile: Theme (cycles through themes)
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
  
  // Center tile: Clock (toggles clock mode)
  if (centerSettingTile) {
    centerSettingTile.addEventListener('click', () => {
      centerSettingTile.classList.add('flipping');
      
      setTimeout(() => {
        isClockMode = !isClockMode;
        if (isClockMode) {
          rotator.stop();
          clockMode.start();
          centerSettingTile.classList.add('active');
          showNotification('Clock Mode ON');
        } else {
          clockMode.stop();
          rotator.start();
          centerSettingTile.classList.remove('active');
          showNotification('Messages ON');
        }
        centerSettingTile.classList.remove('flipping');
      }, 150);
    });
  }
  
  // Right tile: Fullscreen button (main action)
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
  
  // Notification system for theme/mode changes
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
