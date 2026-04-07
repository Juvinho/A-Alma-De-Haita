/**
 * Tipos compartilhados do sistema de Visual Novel
 */

// ═════════════════════════════════════════════════════════════════════
// STORY & NARRATIVE
// ═════════════════════════════════════════════════════════════════════

export type CharacterId = 'maya' | 'ella' | 'marci';
export type EndingId = 'rachadas' | 'sem-deusa' | 'assistindo';

export interface SpriteSlot {
  char: CharacterId;
  pose: string;
}

export interface StoryNodeSprites {
  left?: SpriteSlot | null;
  center?: SpriteSlot | null;
  right?: SpriteSlot | null;
}

export interface TextDelta {
  type: 'add' | 'remove' | 'replace';
  position: number;
  text: string;
}

export interface Choice {
  text: string;
  next: string;
  setFlag?: string;
}

export interface StoryNode {
  id: string;

  // ── VISUAIS ──
  background?: string;
  transition?: 'fade' | 'dissolve' | 'flash-white' | 'flash-red' | 'shake' | 'blur' | 'none';
  sprites?: StoryNodeSprites;
  highlightSpeaker?: CharacterId;
  spriteEffect?: { position: 'left' | 'center' | 'right'; effect: 'shake' | 'pulse' };

  // ── TEXTO ──
  speaker?: CharacterId | null;
  text: string;

  // ── FLUXO ──
  next?: string;
  choices?: Choice[];
  condition?: { flag: string; value: boolean };
  setFlag?: string;

  // ── EFEITOS ──
  sound?: 'shake' | 'flash' | 'heartbeat' | 'wind' | 'silence';

  // ── META ──
  chapter?: string;
  chapterTitle?: string;
  ending?: EndingId;
}

// ═════════════════════════════════════════════════════════════════════
// STATE & SETTINGS
// ═════════════════════════════════════════════════════════════════════

export interface VNSettings {
  textSpeed: number; // milliseconds per character
  autoPlayDelay: number; // milliseconds before advancing in auto-play
  masterVolume: number; // 0-1
  isMuted: boolean;
}

export interface HistoryEntry {
  speaker: CharacterId | null;
  text: string;
}

export interface SaveSlot {
  nodeId: string;
  chapterId: string;
  chapterTitle: string;
  flags: Record<string, boolean>;
  history: HistoryEntry[];
  visitedNodes: string[];
  timestamp: number;
  screenshot?: string; // base64
}

// ═════════════════════════════════════════════════════════════════════
// ZUSTAND STORE
// ═════════════════════════════════════════════════════════════════════

export interface VNState {
  // ── CURRENT STATE ──
  currentNodeId: string;
  chapterId: string;
  chapterTitle: string;
  visitedNodes: Set<string>;

  // ── VISUALS ──
  currentBackground: string;
  currentSprites: StoryNodeSprites;

  // ── TEXT ──
  currentSpeaker: CharacterId | null;
  currentText: string;
  isTyping: boolean;

  // ── CHOICES ──
  currentChoices: Choice[] | null;

  // ── FLAGS ──
  flags: Record<string, boolean>;

  // ── UI ──
  isMenuOpen: boolean;
  isSaveLoadOpen: boolean;
  isSaveMode: boolean; // true = save mode, false = load mode
  isHistoryOpen: boolean;
  isAutoPlay: boolean;
  isSkipping: boolean;

  // ── HISTORY ──
  history: HistoryEntry[];

  // ── SAVES ──
  saves: (SaveSlot | null)[];

  // ── SETTINGS ──
  settings: VNSettings;

  // ── META ──
  isStarted: boolean;
  isEnded: boolean;
  currentEnding: EndingId | null;
}

export interface VNActions {
  // ── CORE ──
  startGame: () => void;
  loadNode: (nodeId: string) => void;
  advanceDialog: () => void;
  makeChoice: (choiceIndex: number) => void;

  // ── UI ──
  toggleMenu: () => void;
  toggleSaveLoad: (mode: 'save' | 'load') => void;
  toggleHistory: () => void;
  toggleAutoPlay: () => void;
  toggleSkip: () => void;

  // ── SAVE / LOAD ──
  saveToSlot: (slotIndex: number) => void;
  loadFromSlot: (slotIndex: number) => void;
  deleteSlot: (slotIndex: number) => void;
  quickSave: () => void;
  quickLoad: () => void;

  // ── SETTINGS ──
  updateSettings: (newSettings: Partial<VNSettings>) => void;

  // ── FLAGS ──
  setFlag: (flag: string, value: boolean) => void;
  getFlag: (flag: string) => boolean;
}
