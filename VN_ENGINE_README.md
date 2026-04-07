# 🧠 VN Engine — Backend Completo | O Cérebro da Visual Novel

> **Status**: ✅ **PRONTO PARA USO**
>
> Este é o backend 100% funcional de uma visual novel engine. Todas lógica de estado, navegação, áudio, controles e save/load estão implementados. O frontend (componentes React) é construído separadamente usando este backend.

---

## 📁 Estrutura de Arquivos

```
stores/
└── vn-store.ts                      # Zustand store (state + actions)

lib/vn/
├── save-manager.ts                  # Save/load system com localStorage
├── text-parser.ts                   # Parser de tags inline em texto
├── audio-engine.ts                  # Síntese de áudio procedural
└── preloader.ts                     # (existente)

hooks/
├── useVNControls.ts                 # Keyboard + mouse input handler
└── useVNAutoPlay.ts                 # Auto-play e skip logic

types/
└── vn.ts                            # Todos os tipos TypeScript compartilhados

scripts/
└── validate-story.ts                # Validador de integridade da história

data/
└── story.ts                         # Arquivo de história completo (200+ nodes)
```

---

## 🎮 API Rápida

### Inicializar

```tsx
import { useVNStore } from '@/stores/vn-store';
import { useVNControls } from '@/hooks/useVNControls';
import { useVNAutoPlay } from '@/hooks/useVNAutoPlay';
import { audioEngine } from '@/lib/vn/audio-engine';

export default function VNApp() {
  // Ativar controles de teclado
  const { handleClick } = useVNControls();
  
  // Ativar auto-play e skip
  useVNAutoPlay();

  // Inicializar áudio após interação (obrigatório para Web Audio API)
  useEffect(() => {
    audioEngine.init().catch(console.warn);
  }, []);

  // Iniciar jogo
  const startGame = () => {
    useVNStore.getState().startGame();
    audioEngine.play('transition-whoosh');
  };

  return (
    <div onClick={handleClick} className="vn-container">
      {/* Components aqui */}
    </div>
  );
}
```

### Ler State

```tsx
// Usar selectors para evitar re-renders desnecessários
const text = useVNStore((s) => s.currentText);
const isTyping = useVNStore((s) => s.isTyping);
const sprites = useVNStore((s) => s.currentSprites);
const background = useVNStore((s) => s.currentBackground);
const choices = useVNStore((s) => s.currentChoices);

// Ou usar os selectors pre-otimizados
const text = useCurrentText();
const sprites = useCurrentSprites();
```

### Chamar Actions

```tsx
const {
  advanceDialog,        // Avança para próxima fala
  makeChoice,           // Seleciona uma choice (índice)
  toggleMenu,           // Abre/fecha menu
  toggleHistory,        // Abre/fecha histórico
  toggleAutoPlay,       // Ativa/desativa auto-play
  toggleSkip,           // Ativa/desativa skip
  saveToSlot,           // Salva em slot (índice)
  loadFromSlot,         // Carrega de slot
  quickSave,            // Quick save (Ctrl+S)
  quickLoad,            // Quick load (Ctrl+L)
  setFlag,              // Seta uma flag
  getFlag,              // Lê uma flag
} = useVNStore();

// Ou chamar diretamente (sem componente)
useVNStore.getState().advanceDialog();
```

---

## 🔊 Audio Engine

Síntese procedural com 10 sons pré-configurados:

```tsx
import { audioEngine } from '@/lib/vn/audio-engine';

// Inicializar (chamado automaticamente)
await audioEngine.init();

// Tocar sons
audioEngine.play('typewriter-tick');      // Som de digitação
audioEngine.play('choice-hover');         // Hover em choice
audioEngine.play('choice-select');        // Seleciona choice
audioEngine.play('transition-whoosh');    // Transição de cena
audioEngine.play('save-confirm');         // Confirmação de save
audioEngine.play('shake-rumble');         // Tremor/shake
audioEngine.play('flash-impact');         // Flash visual
audioEngine.play('heartbeat-single');     // Batida de coração
audioEngine.play('wind-gust');            // Vento
audioEngine.play('ambient-drone');        // Drone contínuo com "respiração"

// Volume
audioEngine.setVolume(0.7);               // 0-1
audioEngine.mute();
audioEngine.unmute(0.5);

// Drone (contínuo)
audioEngine.startDrone();
audioEngine.stopDrone();

// Cleanup
audioEngine.destroy();
```

---

## 📝 Text Parser

Parse de tags inline para estilo dinâmico de texto:

```tsx
import { parseVNText, type TextSegment } from '@/lib/vn/text-parser';

const text = '{bold}Maya{/bold} olhou. {pause:500}{slow}E então...{/slow}';
const segments: TextSegment[] = parseVNText(text);

/*
Resultado:
[
  { text: "Maya", styles: { bold: true }},
  { text: " olhou. ", styles: {}},
  { text: "E então...", styles: { slow: true }, pause: 500 },
]
*/

// Renderizar com estilos
segments.forEach((seg) => {
  const className = {
    bold: seg.styles.bold ? 'font-bold' : '',
    italic: seg.styles.italic ? 'italic' : '',
    shake: seg.styles.shake ? 'animate-shake' : '',
    slow: seg.styles.slow ? 'text-slow' : '',
    fast: seg.styles.fast ? 'text-fast' : '',
  };
  // ... renderizar
});
```

**Tags suportadas**:
- `{bold} ... {/bold}` — Negrito
- `{italic} ... {/italic}` — Itálico
- `{slow} ... {/slow}` — Digitação lenta
- `{fast} ... {/fast}` — Digitação rápida
- `{shake} ... {/shake}` — Tremido
- `{color:red} ... {/color}` — Cor (qualquer valor CSS)
- `{pause:500}` — Pausa de 500ms (não tem fechamento)

---

## 💾 Save/Load System

Persist automático em localStorage com 10 slots:

```tsx
import { useVNStore } from '@/stores/vn-store';

const {
  saveToSlot,     // (índice: 0-9)
  loadFromSlot,   // (índice: 0-9)
  deleteSlot,     // (índice: 0-9)
  quickSave,      // Usa slot 99
  quickLoad,      // Usa slot 99
  saves,          // Array de SaveSlot | null
} = useVNStore();

// Salvar
saveToSlot(0);      // Slot 1
quickSave();        // Quick save

// Carregar
loadFromSlot(0);    // Restaura state completo
quickLoad();        // Quick load

// Listar
const allSaves = useVNStore((s) => s.saves);
allSaves.forEach((save, i) => {
  if (save) {
    console.log(`Slot ${i}: Chapter ${save.chapterId} at ${new Date(save.timestamp)}`);
  }
});

// Deletar
deleteSlot(0);
```

**O que é salvo**:
- Node ID atual
- Capítulo e título
- Todas as flags
- Histórico de diálogos
- Nodes visitados
- Timestamp
- Screenshot (base64, opcional)

---

## ⌨️ Controles

Automáticos via `useVNControls()`:

| Tecla | Ação |
|-------|------|
| **Enter** / **Space** | Avança diálogo |
| **Escape** | Abre/fecha menu |
| **H** / **PageUp** | Abre/fecha histórico |
| **A** | Ativa/desativa auto-play |
| **S** | Quick save |
| **L** | Quick load |
| **Shift** (segurar) | Skip (apenas nodes visitados) |
| **Click** | Avança diálogo |

---

## 🎯 Auto-Play & Skip

Gerenciados por `useVNAutoPlay()`:

```tsx
// Auto-play
- Avança automaticamente após delay (padrão: 3s)
- Respeita choices: não avança se há chosenl
- Para quando menu está aberto

// Skip
- Ativado por Shift (segurar)
- Função: completar texto + avançar rápido
- SÓ funciona em nodes já visitados (visitedNodes)
- Intervalo: 50ms entre nodes
```

---

## 🚀 Keybindings Integrados

```tsx
// Audio feedback automático
audioEngine.play('typewriter-tick');     // Ao avançar
audioEngine.play('choice-hover');        // Ao passar mouse em choice
audioEngine.play('choice-select');       // Ao selecionar choice
audioEngine.play('save-confirm');        // Ao salvar
audioEngine.play('transition-whoosh');   // Ao abrir menu
```

---

## 🔍 Validação de Story

```bash
# Valida integridade do arquivo story.ts
npx ts-node scripts/validate-story.ts

# Ou (se tsx estiver instalado)
npx tsx scripts/validate-story.ts
```

**Verifica**:
- ✅ Todos os `next` pointers existem
- ✅ Todos os choice targets existem
- ✅ Nenhum node é beco sem saída
- ✅ Todos os nodes são alcançáveis
- ✅ Os 3 finais existem (rachadas, sem-deusa, assistindo)

---

## 📊 Tipos TypeScript

Todos definidos em `types/vn.ts`:

```tsx
export interface StoryNode {
  id: string;
  background?: string;
  transition?: 'fade' | 'dissolve' | 'flash-white' | 'flash-red' | 'shake';
  sprites?: StoryNodeSprites;
  speaker?: CharacterId | null;
  text: string;
  next?: string;
  choices?: Choice[];
  condition?: { flag: string; value: boolean };
  chapter?: string;
  ending?: EndingId;
}

export interface VNState {
  currentNodeId: string;
  currentText: string;
  isTyping: boolean;
  currentChoices: Choice[] | null;
  flags: Record<string, boolean>;
  history: HistoryEntry[];
  // ... mais
}

export interface VNActions {
  startGame: () => void;
  loadNode: (nodeId: string) => void;
  advanceDialog: () => void;
  makeChoice: (choiceIndex: number) => void;
  // ... mais
}
```

---

## 🎬 Exemplo: Componente Simples

```tsx
'use client';

import { useVNStore } from '@/stores/vn-store';
import { useVNControls } from '@/hooks/useVNControls';
import { useVNAutoPlay } from '@/hooks/useVNAutoPlay';
import { useCurrentText, useCurrentSprites } from '@/stores/vn-store';
import { parseVNText } from '@/lib/vn/text-parser';
import { audioEngine } from '@/lib/vn/audio-engine';
import { useEffect } from 'react';

export function VNGame() {
  const { handleClick } = useVNControls();
  useVNAutoPlay();

  const text = useCurrentText();
  const sprites = useCurrentSprites();
  const isTyping = useVNStore((s) => s.isTyping);

  useEffect(() => {
    audioEngine.init();
  }, []);

  const segments = parseVNText(text);

  return (
    <div onClick={handleClick} className="game">
      {/* Render sprites */}
      {sprites.left && <Character sprite={sprites.left} position="left" />}
      {sprites.center && <Character sprite={sprites.center} position="center" />}
      {sprites.right && <Character sprite={sprites.right} position="right" />}

      {/* Render text */}
      <div className="text-box">
        {segments.map((seg, i) => (
          <span key={i} className={seg.styles.bold ? 'font-bold' : ''}>
            {seg.text}
          </span>
        ))}
      </div>

      {/* Render choices */}
      <Choices />
    </div>
  );
}

function Character({ sprite, position }) {
  return (
    <img
      src={`/characters/${sprite.char}_${sprite.pose}.png`}
      className={`character ${position}`}
    />
  );
}

function Choices() {
  const { makeChoice, currentChoices } = useVNStore();
  const { audioEngine } = require('@/lib/vn/audio-engine');

  if (!currentChoices) return null;

  return (
    <div className="choices">
      {currentChoices.map((choice, i) => (
        <button
          key={i}
          onClick={() => {
            audioEngine.play('choice-select');
            makeChoice(i);
          }}
          onMouseEnter={() => audioEngine.play('choice-hover')}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
```

---

## ⚙️ Configuração

Settings tembéme salvos:

```tsx
const { settings, updateSettings } = useVNStore();

updateSettings({
  textSpeed: 20,           // ms per character
  autoPlayDelay: 5000,     // ms antes de avançar
  masterVolume: 0.7,       // 0-1
  isMuted: false,
});

// Ler
const textSpeed = settings.textSpeed;
```

---

## 📋 Estado Inicial

Quando `startGame()` é chamado:

```typescript
{
  currentNodeId: 'ch1-001',
  chapterId: 'ch1',
  chapterTitle: 'INSÔNIA',
  isStarted: true,
  isEnded: false,
  currentEnding: null,
  
  visitedNodes: new Set(),
  history: [],
  flags: {},
  
  currentBackground: 'quarto-ella-noite',
  currentSprites: { left: null, center: null, right: null },
  currentSpeaker: null,
  currentText: '',
  isTyping: false,
  currentChoices: null,
  
  isMenuOpen: false,
  isSaveLoadOpen: false,
  isHistoryOpen: false,
  isAutoPlay: false,
  isSkipping: false,
  
  saves: [null, null, ..., null],  // 10 slots
  
  settings: { textSpeed: 30, autoPlayDelay: 3000, ... }
}
```

---

## 🧪 Testando

```tsx
// No browser console
import { useVNStore } from '@/stores/vn-store';

const store = useVNStore.getState();

// Começar
store.startGame();

// Avançar manualmente
store.advanceDialog();

// Ver estado
console.log(store.currentText);
console.log(store.currentChoices);

// Setar flag
store.setFlag('ella-vulneravel', true);
console.log(store.getFlag('ella-vulneravel'));

// Salvar
store.quickSave();
console.log(store.saves);
```

---

## ✅ Checklist — Pronto para Usar

- [x] Zustand store com todas as actions
- [x] Text parser completo
- [x] Audio engine procedural (10 sons + drone)
- [x] Controls hook (keyboard + mouse)
- [x] Auto-play & skip logic
- [x] Save/load system
- [x] Types completos
- [x] Histórico rastreado
- [x] Flags dinâmicas
- [x] Story validável
- [x] Zero runtime errors

---

## 🔗 Próximas Iterações

O agente que construir OS COMPONENTES VISUAIS só precisa:
1. Importar store e hooks
2. Renderizar state (text, sprites, background, choices)
3. Chamar actions (advanceDialog, makeChoice, etc.)
4. Usar audioEngine.play() nos momentos certos

**Tudo que é lógica já está aqui. Só falta os olhos (React components).**

---

**Data**: Abril 4, 2026  
**Status**: 🟢 PRODUCTION READY  
**Next**: Frontend components
