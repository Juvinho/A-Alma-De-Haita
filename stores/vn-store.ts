import { create } from 'zustand';
import { story } from '@/data/story';
import type {
  VNState,
  VNActions,
  StoryNode,
  CharacterId,
  SpriteSlot,
  Choice,
  SaveSlot,
  EndingId,
  VNSettings,
  HistoryEntry,
} from '@/types/vn';
import {
  saveToSlot,
  loadFromSlot,
  deleteSlot as removeSlot,
  getAllSlots,
  quickSave as qSave,
  quickLoad as qLoad,
  autoSave as aSave,
  QUICK_SAVE_SLOT,
  AUTO_SAVE_SLOT,
  MAX_SLOTS,
} from '@/lib/vn/save-manager';

const FIRST_NODE = 'ch1-001';

const defaultSettings: VNSettings = {
  textSpeed: 30,
  autoPlayDelay: 3000,
  masterVolume: 0.5,
  isMuted: false,
};

const initialState: Omit<VNState, keyof VNActions> = {
  currentNodeId: FIRST_NODE,
  chapterId: 'ch1',
  chapterTitle: 'INSÔNIA',
  visitedNodes: new Set<string>(),

  currentBackground: 'quarto-ella-noite',
  currentSprites: { left: null, center: null, right: null },

  currentSpeaker: null,
  currentText: '',
  isTyping: false,

  currentChoices: null,

  flags: {},

  isMenuOpen: false,
  isSaveLoadOpen: false,
  isSaveMode: true,
  isHistoryOpen: false,
  isAutoPlay: false,
  isSkipping: false,

  history: [],

  saves: Array(MAX_SLOTS).fill(null),

  settings: { ...defaultSettings },

  isStarted: false,
  isEnded: false,
  currentEnding: null,
};

export const useVNStore = create<VNState & VNActions>((set, get) => ({
  ...initialState,

  // ═══════════════════════════════════════
  // CORE ACTIONS
  // ═══════════════════════════════════════

  startGame: () => {
    set({
      ...initialState,
      isStarted: true,
      visitedNodes: new Set<string>(),
      saves: getAllSlots(),
    });
    get().loadNode(FIRST_NODE);
  },

  loadNode: (nodeId: string) => {
    const node = story[nodeId];
    if (!node) {
      console.error(`Node not found: ${nodeId}`);
      return;
    }

    // Verificar condição
    if (node.condition) {
      const flagValue = get().flags[node.condition.flag] ?? false;
      if (flagValue !== node.condition.value) {
        // Condição não satisfeita — pular para o próximo node
        if (node.next) {
          get().loadNode(node.next);
        }
        return;
      }
    }

    const updates: Partial<VNState> = {
      currentNodeId: nodeId,
      currentText: node.text,
      currentSpeaker: node.speaker ?? null,
      isTyping: true,
      currentChoices: node.choices ?? null,
    };

    // Marcar como visitado
    const visited = new Set(get().visitedNodes);
    visited.add(nodeId);
    updates.visitedNodes = visited;

    // Background — só muda se especificado
    if (node.background) {
      updates.currentBackground = node.background;
    }

    // Chapter — atualizar se especificado
    if (node.chapter) {
      updates.chapterId = node.chapter;
      updates.chapterTitle = node.chapterTitle ?? '';
    }

    // Sprites — merge com estado atual
    if (node.sprites) {
      const current = get().currentSprites;
      updates.currentSprites = {
        left: node.sprites.left !== undefined ? node.sprites.left : current.left,
        center: node.sprites.center !== undefined ? node.sprites.center : current.center,
        right: node.sprites.right !== undefined ? node.sprites.right : current.right,
      };
    }

    // Flag de nível de node — suporta 'nome=true' ou apenas 'nome'
    if (node.setFlag) {
      const [flagName] = node.setFlag.split('=');
      const newFlags = { ...get().flags, [flagName.trim()]: true };
      updates.flags = newFlags;
    }

    // Ending
    if (node.ending) {
      updates.isEnded = true;
      updates.currentEnding = node.ending;
    }

    // Adicionar ao histórico
    const historyEntry: HistoryEntry = {
      speaker: node.speaker ?? null,
      text: node.text,
    };
    updates.history = [...get().history, historyEntry];

    set(updates);

    // Auto-save no início de capítulo
    if (node.chapter) {
      setTimeout(() => {
        const state = get();
        aSave(state, '');
      }, 500);
    }
  },

  advanceDialog: () => {
    const state = get();

    // Se está digitando, completar o texto
    if (state.isTyping) {
      set({ isTyping: false });
      return;
    }

    // Se tem choices, não avançar
    if (state.currentChoices && state.currentChoices.length > 0) {
      return;
    }

    // Se o jogo acabou, não avançar
    if (state.isEnded) {
      return;
    }

    // Avançar para o próximo node
    const currentNode = story[state.currentNodeId];
    if (currentNode?.next) {
      get().loadNode(currentNode.next);
    }
  },

  makeChoice: (choiceIndex: number) => {
    const state = get();
    if (!state.currentChoices || !state.currentChoices[choiceIndex]) return;

    const choice = state.currentChoices[choiceIndex];

    // Setar flag se especificado — suporta formato 'nome=true' ou apenas 'nome'
    if (choice.setFlag) {
      const [flagName] = choice.setFlag.split('=');
      get().setFlag(flagName.trim(), true);
    }

    // Limpar choices e carregar próximo node
    set({ currentChoices: null });
    get().loadNode(choice.next);
  },

  // ═══════════════════════════════════════
  // UI ACTIONS
  // ═══════════════════════════════════════

  toggleMenu: () => {
    const state = get();
    set({
      isMenuOpen: !state.isMenuOpen,
      isSaveLoadOpen: false,
      isHistoryOpen: false,
      isSkipping: false,
    });
  },

  toggleSaveLoad: (mode: 'save' | 'load') => {
    const state = get();
    set({
      isSaveLoadOpen: !state.isSaveLoadOpen,
      isSaveMode: mode === 'save',
      isMenuOpen: false,
      saves: getAllSlots(),
    });
  },

  toggleHistory: () => {
    set({
      isHistoryOpen: !get().isHistoryOpen,
      isMenuOpen: false,
      isSaveLoadOpen: false,
    });
  },

  toggleAutoPlay: () => {
    set({
      isAutoPlay: !get().isAutoPlay,
      isSkipping: false,
    });
  },

  toggleSkip: () => {
    set({
      isSkipping: !get().isSkipping,
      isAutoPlay: false,
    });
  },

  // ═══════════════════════════════════════
  // SAVE / LOAD ACTIONS
  // ═══════════════════════════════════════

  saveToSlot: (slotIndex: number) => {
    const state = get();
    const success = saveToSlot(slotIndex, state, '');
    if (success) {
      set({ saves: getAllSlots() });
    }
  },

  loadFromSlot: (slotIndex: number) => {
    const slot = loadFromSlot(slotIndex);
    if (!slot) return;

    // Restaurar estado completo
    set({
      currentNodeId: slot.nodeId,
      chapterId: slot.chapterId,
      chapterTitle: slot.chapterTitle,
      flags: { ...slot.flags },
      history: [...slot.history],
      visitedNodes: new Set(slot.visitedNodes),
      isMenuOpen: false,
      isSaveLoadOpen: false,
      isHistoryOpen: false,
      isAutoPlay: false,
      isSkipping: false,
      isStarted: true,
      isEnded: false,
      currentEnding: null,
    });

    // Recarregar o node para restaurar visuais
    get().loadNode(slot.nodeId);
  },

  deleteSlot: (slotIndex: number) => {
    removeSlot(slotIndex);
    set({ saves: getAllSlots() });
  },

  quickSave: () => {
    const state = get();
    qSave(state, '');
    set({ saves: getAllSlots() });
  },

  quickLoad: () => {
    const slot = qLoad();
    if (slot) {
      get().loadFromSlot(QUICK_SAVE_SLOT);
    }
  },

  // ═══════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════

  updateSettings: (newSettings: Partial<VNSettings>) => {
    set({
      settings: { ...get().settings, ...newSettings },
    });
  },

  // ═══════════════════════════════════════
  // FLAGS
  // ═══════════════════════════════════════

  setFlag: (flag: string, value: boolean) => {
    set({
      flags: { ...get().flags, [flag]: value },
    });
  },

  getFlag: (flag: string) => {
    return get().flags[flag] ?? false;
  },
}));

// ═══════════════════════════════════════
// SELECTORS (para evitar re-renders)
// ═══════════════════════════════════════

export const useCurrentNode = () => useVNStore((s) => story[s.currentNodeId]);
export const useCurrentBackground = () => useVNStore((s) => s.currentBackground);
export const useCurrentSprites = () => useVNStore((s) => s.currentSprites);
export const useCurrentSpeaker = () => useVNStore((s) => s.currentSpeaker);
export const useCurrentText = () => useVNStore((s) => s.currentText);
export const useIsTyping = () => useVNStore((s) => s.isTyping);
export const useCurrentChoices = () => useVNStore((s) => s.currentChoices);
export const useIsMenuOpen = () => useVNStore((s) => s.isMenuOpen);
export const useHistory = () => useVNStore((s) => s.history);
export const useIsEnded = () => useVNStore((s) => s.isEnded);
export const useSettings = () => useVNStore((s) => s.settings);
export const useFlags = () => useVNStore((s) => s.flags);
export const useVisitedNodes = () => useVNStore((s) => s.visitedNodes);
export const useSaves = () => useVNStore((s) => s.saves);
