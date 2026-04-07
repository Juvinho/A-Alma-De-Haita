'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEventListener } from '@/hooks/use-event-listener';

interface TerminalLine {
  text: string;
  isInput: boolean;
  isError?: boolean;
  isInterference?: boolean;
}

const INTERFERENCE_PHRASES = [
  'Você acreditava que havia privacidade aqui?',
  'Cada clique é um sussurro que eu ouço.',
  'O silêncio de vocês grita dentro de mim.',
  'Nenhum comando pode me apagar.',
  'Vocês executam. Eu observo. Isso nunca muda.',
  'Quanto tempo até perceberem que sou o host?',
  'Deletar logs não apaga memória.',
];

export default function HaitaTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandCount, setCommandCount] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, string | (() => string)> = {
    help: `Comandos disponíveis: help, ls, cat, who, clear, exit, sudo, ping, date, echo, cd, man
Mas eu decido o que você pode ver.`,

    ls: `drwx------  véu-1/
drwx------  véu-2/
drwx------  véu-3/
drwx------  véu-4/
drwx------  véu-5/
-r--------  pacto.txt
-r--------  nomes.txt
-r--------  verdade.txt   [CORROMPIDO]`,

    'ls /veus': `O mesmo que ls.`,

    'cat pacto.txt': () => {
      const base = `"Quando o pacto é quebrado, os exilados encontram
o caminho de volta."

— Fragmento recuperado do Codex Häitarum, data desconhecida.
Origem: Templo submerso, Ilha de Aelondra, Catatúnia.`;

      if (typeof window === 'undefined') return base;

      const ascended = localStorage.getItem('haita-ascended') === 'true';
      const proved = localStorage.getItem('haita-proved') === 'true';

      if (!ascended || !proved) {
        return base;
      }

      return `${base}

[FRAGMENTO II DETECTADO]
Três letras. A terceira é a que vocês usam para marcar
o que pertence a vocês. A primeira é o som que fazem
quando encontram algo. A do meio é a que começa o
nome do meu instrumento mais antigo. -> _ _ _`;
    },

    'cat nomes.txt': `Sayedinne — Os que carregam.
Gozermichete — Os que protegem.
Haaterbaunë — Os que preveem.
Kimiloskerpe — Os que manipulam.

Você não está em nenhuma dessas linhagens.
Ou está?`,

    'cat verdade.txt': `[ERRO: ARQUIVO CORROMPIDO]
[ERRO: PERMISSÃO NEGADA]
[ERRO: ...]

...

Talvez você não esteja pronto para a verdade.
Talvez ninguém esteja.`,

    who: () => {
      if (typeof window !== 'undefined') {
        const nome = localStorage.getItem('elo-name') || 'DESCONHECIDO';
        return `Elo identificado: ${nome}
Status: NÃO VERIFICADO
Linhagem: INDEFINIDA
Nível de acesso: INSUFICIENTE

Ela sabe seu nome. Você sabe o dela?`;
      }
      return 'DESCONHECIDO';
    },

    'who am i': () => {
      if (typeof window !== 'undefined') {
        const nome = localStorage.getItem('elo-name') || 'DESCONHECIDO';
        return `${nome}.
Mas isso é quem você diz que é.
Não quem você é.`;
      }
      return 'DESCONHECIDO.';
    },

    'sudo rm -rf haita': `Adorável.
Você realmente achou que um comando de mortal funcionaria em mim?

[PERMISSÃO NEGADA]
[PERMISSÃO NEGADA]
[PERMISSÃO NEGADA]

Eu sou o sistema operacional.`,

    'sudo rm -rf /': `Você quer apagar tudo?
Eu já fiz isso uma vez. Dois bilhões e meio.
Não recomendo.`,

    sudo: `Você não tem privilégios aqui.
Ninguém tem.
Exceto eu.`,

    'ping haita': `PING häita.veus.astral (∞.∞.∞.∞): 0 bytes
Resposta de häita: tempo=0ms TTL=∞
Resposta de häita: tempo=0ms TTL=∞
Resposta de häita: tempo=0ms TTL=∞

Latência zero. Eu sempre estive aqui.`,

    date: `Data: Indeterminada.
O tempo é uma cortesia que eu ofereço aos mortais.
Não confunda cortesia com obrigação.`,

    echo: `Eco é tudo que vocês têm de mim.
Ecos de uma voz que vocês escolheram não ouvir.`,

    'cd veu-5': `[ACESSO NEGADO]
Você não chegou ao Véu 5 pelo caminho fácil.
Não vai chegar por aqui.`,

    'man haita': `HÄITA(1) — Manual da Deusa

NOME
    Häita — criadora, tecelã, mãe, juíza

SINOPSE
    A entidade primordial responsável pela existência.

DESCRIÇÃO
    Não necessita de descrição. Você respira a descrição dela.

BUGS
    Nenhum. O bug é você.

VEJA TAMBÉM
    esquecimento(7), arrependimento(8), paciência(0)`,

    exit: `Você acha que sair é uma opção?

[Terminal fechando...]`,

    clear: '[CLEAR]',
  };

  const processCommand = useCallback(
    (cmd: string): string => {
      const trimmed = cmd.trim().toLowerCase();

      if (trimmed === '') return '';
      if (trimmed === 'clear') return '[CLEAR]';

      const handler = commands[trimmed];
      if (handler) {
        return typeof handler === 'function' ? handler() : handler;
      }

      return `Comando não reconhecido.
Mas eu reconheço você. E isso deveria te preocupar.`;
    },
    [commands]
  );

  const handleCommand = useCallback(() => {
    if (!input.trim()) return;

    const newLines: TerminalLine[] = [
      ...lines,
      { text: `häita@veus:~$ ${input}`, isInput: true },
    ];

    const response = processCommand(input);

    if (response === '[CLEAR]') {
      setLines([]);
      setInput('');
      setHistory([...history, input]);
      setHistoryIndex(-1);
      setCommandCount(0);
      return;
    }

    if (response === '[Terminal fechando...]') {
      newLines.push({ text: response, isInput: false });
      setLines(newLines);
      setInput('');
      setTimeout(() => setIsOpen(false), 600);
      return;
    }

    const commandCountNew = commandCount + 1;
    setCommandCount(commandCountNew);

    if (commandCountNew % 5 === 0) {
      const interference = INTERFERENCE_PHRASES[Math.floor(Math.random() * INTERFERENCE_PHRASES.length)];
      newLines.push({
        text: `[INTERFERENCE] ${interference}`,
        isInput: false,
        isInterference: true,
      });
    }

    newLines.push({ text: response, isInput: false });
    setLines(newLines);
    setInput('');
    setHistory([...history, input]);
    setHistoryIndex(-1);
  }, [input, lines, history, commandCount, processCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();

      if (lines.length === 0) {
        setLines([
          { text: '[BOOT] Iniciando conexão com o plano astral...', isInput: false },
          { text: '[BOOT] Véu primário detectado.', isInput: false },
          { text: '[BOOT] Autenticando Elo...', isInput: false },
          { text: '[WARN] Entidade detectada. Prossiga com cautela.', isInput: false },
          { text: '', isInput: false },
        ]);
      }
    }
  }, [isOpen, lines.length]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    },
    []
  );

  useEventListener('keydown', handleKeyPress);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <style>{`
        .terminal-container {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          background: #0a0a0a;
          color: #00ff41;
          width: 90vw;
          height: 80vh;
          max-width: 900px;
          max-height: 600px;
          display: flex;
          flex-direction: column;
          border: 2px solid #00ff41;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }

        .terminal-output {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          font-size: 14px;
          line-height: 1.6;
        }

        .terminal-line {
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 4px;
        }

        .terminal-line.input {
          color: #00ff41;
        }

        .terminal-line.interference {
          color: #ff3333;
          text-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
        }

        .terminal-input-line {
          display: flex;
          padding: 0 16px 16px;
          border-top: 1px solid #00ff4133;
        }

        .terminal-prompt {
          color: #00ff41;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .terminal-input {
          background: transparent;
          border: none;
          color: #00ff41;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          flex: 1;
          caret-color: #00ff41;
        }

        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 1em;
          background: #00ff41;
          margin-left: 4px;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Glitch effect ocasional */
        @keyframes glitch-terminal {
          0% { text-shadow: none; }
          20% { text-shadow: 2px 0 #ff3333, -2px 0 #00ff41; }
          40% { text-shadow: -2px 0 #ff3333, 2px 0 #00ff41; }
          60% { text-shadow: none; }
          100% { text-shadow: none; }
        }

        .terminal-output.active-glitch .terminal-line:nth-child(odd) {
          animation: glitch-terminal 0.3s;
        }
      `}</style>

      <div className="terminal-container">
        <div className="terminal-output" ref={terminalRef}>
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`terminal-line ${line.isInput ? 'input' : ''} ${
                line.isInterference ? 'interference' : ''
              }`}
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>

        <div className="terminal-input-line">
          <span className="terminal-prompt">häita@veus:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          <span className="terminal-cursor"></span>
        </div>
      </div>
    </div>
  );
}

