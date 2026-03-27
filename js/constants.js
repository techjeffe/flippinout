export const GRID_COLS = 22;
export const GRID_ROWS = 7;

// Mechanical timing
export const DEFAULT_FLIP_DURATION = 100;
export const MIN_FLIP_DURATION = 50;
export const MAX_FLIP_DURATION = 333;
export const STAGGER_DELAY = 35;
export const SETTLE_DURATION = 286;
export const CLEAR_PAUSE = 600;
export const MESSAGE_INTERVAL = 60000;

export const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-+\'/&:;?!';

// Vintage display themes (monochrome per theme - authentic to real mechanical boards)
export const THEMES = {
  classic: {
    name: 'Classic Airport',
    textColor: '#FFFFFF',
    bgColor: '#1C1C1C',
    boardBg: '#0F0F0F',
    tileBg: '#1C1C1C',
    accentColor: '#FFFFFF'
  },
  amber: {
    name: 'Vintage Amber',
    textColor: '#FFB000',
    bgColor: '#1A1008',
    boardBg: '#0A0804',
    tileBg: '#1A1008',
    accentColor: '#FFB000'
  },
  green: {
    name: 'Terminal Green',
    textColor: '#00FF41',
    bgColor: '#0A1508',
    boardBg: '#050A04',
    tileBg: '#0A1508',
    accentColor: '#00FF41'
  },
  cyan: {
    name: 'Railway Blue',
    textColor: '#4DD0E1',
    bgColor: '#0A1418',
    boardBg: '#050A0C',
    tileBg: '#0A1418',
    accentColor: '#4DD0E1'
  }
};

// Removed multicolor scramble - not authentic to real mechanical boards

export const MESSAGES = [
  [
    '',
    'GOD IS IN',
    'THE DETAILS .',
    '',
    '- LUDWIG MIES',
    '',
    ''
  ],
  [
    '',
    'STAY HUNGRY',
    'STAY FOOLISH',
    '',
    '- STEVE JOBS',
    '',
    ''
  ],
  [
    '',
    'GOOD DESIGN IS',
    'GOOD BUSINESS',
    '',
    '- THOMAS WATSON',
    '',
    ''
  ],
  [
    '',
    'LESS IS MORE',
    '',
    '',
    '- MIES VAN DER ROHE',
    '',
    ''
  ],
  [
    '',
    'MAKE IT SIMPLE',
    'BUT SIGNIFICANT',
    '',
    '- DON DRAPER',
    '',
    ''
  ],
  [
    '',
    'HAVE NO FEAR OF',
    'PERFECTION',
    '',
    '- SALVADOR DALI',
    '',
    ''
  ],
  [
    '',
    'FORM FOLLOWS',
    'FUNCTION',
    '',
    '- LOUIS SULLIVAN',
    '',
    ''
  ],
  [
    'DESIGN IS NOT',
    'JUST WHAT IT LOOKS',
    'LIKE AND FEELS LIKE',
    '',
    'DESIGN IS HOW',
    'IT WORKS',
    ''
  ],
  [
    '',
    'SIMPLICITY IS THE',
    'ULTIMATE',
    'SOPHISTICATION',
    '',
    '',
    ''
  ],
  [
    'THE BEST WAY TO',
    'PREDICT THE FUTURE',
    'IS TO INVENT IT',
    '',
    '- ALAN KAY',
    '',
    ''
  ],
  [
    '',
    'I WILL RAGE CODE',
    'THIS IN A FEW MINUTES',
    '',
    '- WAYNE',
    '',
    ''
  ]
];

export const QUOTE_SCREENS = [
  ['', 'STAY HUNGRY', 'STAY FOOLISH', '', '- STEVE JOBS', '', ''],
  ['', 'LESS IS MORE', '', '', '- MIES VAN DER ROHE', '', ''],
  ['', 'MAKE IT SIMPLE', 'BUT SIGNIFICANT', '', '- DON DRAPER', '', ''],
  ['', 'DONE IS BETTER', 'THAN PERFECT', '', '- SHERYL SANDBERG', '', ''],
  ['', 'TASTE IS THE', 'ENEMY OF ART', '', '- PABLO PICASSO', '', ''],
  ['', 'FORTUNE FAVORS', 'THE BOLD', '', '- VIRGIL', '', ''],
  ['', 'MOVE FAST', 'AND FIX THINGS', '', '- PARAPHRASED', '', ''],
  ['', 'GOOD THINGS', 'TAKE TIME', '', '- OLD WISDOM', '', ''],
  ['', 'WHAT A TIME', 'TO BE ALIVE', '', '- MODERN SAYING', '', ''],
  ['', 'EYES ON THE', 'HORIZON', '', '- KEEP GOING', '', ''],
  ['', 'SHIP THE THING', '', '', '- FRIENDLY ADVICE', '', ''],
  ['', 'GO MAKE THE', 'WEIRD VERSION', '', '- CREATIVE RULE', '', ''],
  ['', 'SMALL STEPS', 'STILL COUNT', '', '- DAILY PRACTICE', '', ''],
  ['', 'KEEP THE RECEIPTS', '', '', '- EXPERIENCED ADULT', '', ''],
  ['', 'CHAOS IS A', 'LADDER', '', '- LITTLEFINGER', '', ''],
  ['', 'MAKE IT WORK', 'THEN MAKE IT', 'BETTER', '- COMMON SENSE', '', ''],
  ['', 'NEAT IS NICE', 'CLEAR IS BETTER', '', '- DESIGN NOTE', '', ''],
  ['', 'YOU CAN DO', 'HARD THINGS', '', '- TRUE FACT', '', ''],
  ['', 'TRUST THE PROCESS', '', '', '- POSTER ENERGY', '', ''],
  ['', 'THIS COULD BE', 'AN EMAIL', '', '- OFFICE HUMOR', '', '']
];
