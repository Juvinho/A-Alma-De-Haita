import type { VNState, SaveSlot } from '@/types/vn';

const STORAGE_KEY = 'vn-saves';
export const MAX_SLOTS = 24;
export const QUICK_SAVE_SLOT = 99;
export const AUTO_SAVE_SLOT = 98;

/**
 * Converte Set para Array ao serializar
 */
function prepareStateForSave(state: VNState): Omit<SaveSlot, 'timestamp' | 'screenshot'> {
  return {
    nodeId: state.currentNodeId,
    chapterId: state.chapterId,
    chapterTitle: state.chapterTitle,
    flags: { ...state.flags },
    history: [...state.history],
    visitedNodes: Array.from(state.visitedNodes),
  };
}

/**
 * Recupera todos os slots salvos do localStorage
 */
export function getAllSlots(): (SaveSlot | null)[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return Array(MAX_SLOTS).fill(null);

    const data = JSON.parse(stored) as Record<string, SaveSlot | null>;
    const slots: (SaveSlot | null)[] = [];

    for (let i = 0; i < MAX_SLOTS; i++) {
      slots.push(data[String(i)] ?? null);
    }

    return slots;
  } catch (e) {
    console.warn('Failed to load saves:', e);
    return Array(MAX_SLOTS).fill(null);
  }
}

/**
 * Salva o estado em um slot específico
 */
export function saveToSlot(
  slotIndex: number,
  state: VNState,
  screenshot: string
): boolean {
  try {
    const allSlots = getAllSlots();

    const save: SaveSlot = {
      ...prepareStateForSave(state),
      timestamp: Date.now(),
      screenshot,
    };

    allSlots[slotIndex] = save;

    const data: Record<string, SaveSlot | null> = {};
    for (let i = 0; i < allSlots.length; i++) {
      data[String(i)] = allSlots[i];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save to slot:', e);
    return false;
  }
}

/**
 * Carrega um save de um slot específico
 */
export function loadFromSlot(slotIndex: number): SaveSlot | null {
  try {
    const allSlots = getAllSlots();
    return allSlots[slotIndex] ?? null;
  } catch (e) {
    console.error('Failed to load from slot:', e);
    return null;
  }
}

/**
 * Deleta um save de um slot
 */
export function deleteSlot(slotIndex: number): boolean {
  try {
    const allSlots = getAllSlots();
    allSlots[slotIndex] = null;

    const data: Record<string, SaveSlot | null> = {};
    for (let i = 0; i < allSlots.length; i++) {
      data[String(i)] = allSlots[i];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to delete slot:', e);
    return false;
  }
}

/**
 * Quick save (slot 99)
 */
export function quickSave(state: VNState, screenshot: string): boolean {
  return saveToSlot(QUICK_SAVE_SLOT, state, screenshot);
}

/**
 * Quick load (slot 99)
 */
export function quickLoad(): SaveSlot | null {
  return loadFromSlot(QUICK_SAVE_SLOT);
}

/**
 * Auto save (slot 98)
 */
export function autoSave(state: VNState, screenshot: string): boolean {
  return saveToSlot(AUTO_SAVE_SLOT, state, screenshot);
}

/**
 * Auto load (slot 98)
 */
export function autoLoad(): SaveSlot | null {
  return loadFromSlot(AUTO_SAVE_SLOT);
}

/**
 * Verifica se há um quick save
 */
export function hasQuickSave(): boolean {
  return quickLoad() !== null;
}

/**
 * Limpa todos os saves
 */
export function clearAllSaves(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear saves:', e);
    return false;
  }
}
