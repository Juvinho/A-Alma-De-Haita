export interface TextSegment {
  text: string;
  styles: {
    shake?: boolean;
    slow?: boolean;
    fast?: boolean;
    bold?: boolean;
    italic?: boolean;
    color?: string;
  };
  pause?: number;
}

const TAG_REGEX = /\{(\/?\w+(?::\w+)?)\}/g;

/**
 * Pareia tags inline em texto de VN.
 * 
 * Sintaxe suportada:
 * - {shake} ... {/shake}
 * - {slow} ... {/slow}
 * - {fast} ... {/fast}
 * - {bold} ... {/bold}
 * - {italic} ... {/italic}
 * - {pause:500} (pausa de 500ms no próximo segmento)
 * - {color:red} ... {/color}
 * 
 * Exemplo:
 * "{bold}Maya{/bold} não respondeu. {pause:500}{slow}E então...{/slow}"
 */
export function parseVNText(raw: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const activeStyles: TextSegment['styles'] = {};
  let lastIndex = 0;
  let pendingPause: number | undefined;

  let match: RegExpExecArray | null;
  const regex = new RegExp(TAG_REGEX);

  while ((match = regex.exec(raw)) !== null) {
    const tagFull = match[1];
    const tagStart = match.index;

    // Texto ANTES desta tag
    if (tagStart > lastIndex) {
      const textBefore = raw.slice(lastIndex, tagStart);
      if (textBefore.length > 0) {
        segments.push({
          text: textBefore,
          styles: { ...activeStyles },
          pause: pendingPause,
        });
        pendingPause = undefined;
      }
    }

    // Processar a tag
    if (tagFull.startsWith('/')) {
      // Tag de fechamento
      const tagName = tagFull.slice(1);
      switch (tagName) {
        case 'shake':
          delete activeStyles.shake;
          break;
        case 'slow':
          delete activeStyles.slow;
          break;
        case 'fast':
          delete activeStyles.fast;
          break;
        case 'bold':
          delete activeStyles.bold;
          break;
        case 'italic':
          delete activeStyles.italic;
          break;
        case 'color':
          delete activeStyles.color;
          break;
      }
    } else if (tagFull.startsWith('pause:')) {
      // Tag de pausa
      const ms = parseInt(tagFull.split(':')[1], 10);
      if (!isNaN(ms)) {
        pendingPause = ms;
      }
    } else if (tagFull.startsWith('color:')) {
      // Tag de cor
      activeStyles.color = tagFull.split(':')[1];
    } else {
      // Tag de abertura
      switch (tagFull) {
        case 'shake':
          activeStyles.shake = true;
          break;
        case 'slow':
          activeStyles.slow = true;
          break;
        case 'fast':
          activeStyles.fast = true;
          break;
        case 'bold':
          activeStyles.bold = true;
          break;
        case 'italic':
          activeStyles.italic = true;
          break;
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Texto restante após a última tag
  if (lastIndex < raw.length) {
    const remaining = raw.slice(lastIndex);
    if (remaining.length > 0) {
      segments.push({
        text: remaining,
        styles: { ...activeStyles },
        pause: pendingPause,
      });
    }
  }

  // Se não havia nenhuma tag, retornar o texto inteiro como um segmento
  if (segments.length === 0 && raw.length > 0) {
    segments.push({ text: raw, styles: {} });
  }

  return segments;
}

// ═══════════════════════════════════════
// TESTES INLINE
// ═══════════════════════════════════════

/*
parseVNText("Ella olhou para ela.")
→ [{ text: "Ella olhou para ela.", styles: {} }]

parseVNText("Ella olhou. {pause:500}{slow}E então disse:{/slow}")
→ [
    { text: "Ella olhou. ", styles: {} },
    { text: "E então disse:", styles: { slow: true }, pause: 500 },
  ]

parseVNText("{bold}Maya{/bold} não respondeu.")
→ [
    { text: "Maya", styles: { bold: true } },
    { text: " não respondeu.", styles: {} },
  ]

parseVNText("{color:red}Häita{/color} fala.")
→ [
    { text: "Häita", styles: { color: 'red' } },
    { text: " fala.", styles: {} },
  ]

parseVNText("{shake}O chão tremeu.{/shake} Depois parou.")
→ [
    { text: "O chão tremeu.", styles: { shake: true } },
    { text: " Depois parou.", styles: {} },
  ]
*/
