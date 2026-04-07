'use client';

import { useState } from 'react';
import Sprite from '@/components/Sprite';

type Expression = 
  | 'normal' 
  | 'happy' 
  | 'thinking' 
  | 'sad' 
  | 'angry' 
  | 'surprised'
  | 'surprised_2'
  | 'crying'
  | 'smug'
  | 'expr_09'
  | 'expr_10'
  | 'expr_11'
  | 'expr_12'
  | 'expr_13'
  | 'expr_14'
  | 'expr_15'
  | 'expr_16'
  | 'expr_17'
  | 'expr_18'
  | 'expr_19'
  | 'expr_20'
  | 'expr_21'
  | 'expr_22'
  | 'expr_23'
  | 'expr_24'
  | 'expr_25'
  | 'expr_26'
  | 'expr_27'
  | 'expr_28'
  | 'expr_29'
  | 'expr_30'
  | 'expr_31'
  | 'expr_32'
  | 'expr_33'
  | 'expr_34'
  | 'expr_35'
  | 'expr_36'
  | 'expr_37'
  | 'expr_38';

const EXPRESSIONS: Expression[] = [
  'normal', 'happy', 'thinking', 'sad', 'angry', 
  'surprised', 'surprised_2', 'crying', 'smug',
  'expr_09', 'expr_10', 'expr_11', 'expr_12',
  'expr_13', 'expr_14', 'expr_15', 'expr_16',
  'expr_17', 'expr_18', 'expr_19', 'expr_20',
  'expr_21', 'expr_22', 'expr_23', 'expr_24',
  'expr_25', 'expr_26', 'expr_27', 'expr_28',
  'expr_29', 'expr_30', 'expr_31', 'expr_32',
  'expr_33', 'expr_34', 'expr_35', 'expr_36',
  'expr_37', 'expr_38'
];

const CHARACTERS = ['maya', 'ella', 'marci'];

export default function SpritesTestPage() {
  const [character, setCharacter] = useState<string>('maya');
  const [expression, setExpression] = useState<Expression>('normal');

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Sprite Display */}
      <Sprite character={character} expression={expression} animated duration={300} />

      {/* Controls Overlay */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Character Select */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold">Personagem:</label>
            <select
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-blue-500/50 text-white rounded hover:bg-black/70 transition"
            >
              {CHARACTERS.map((char) => (
                <option key={char} value={char}>
                  {char.charAt(0).toUpperCase() + char.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Expression Buttons */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-semibold">Expressão:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPRESSIONS.map((expr) => (
                <button
                  key={expr}
                  onClick={() => setExpression(expr)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    expression === expr
                      ? 'bg-blue-600 text-white'
                      : 'bg-black/50 text-gray-300 border border-gray-600/50 hover:bg-black/70'
                  }`}
                >
                  {expr}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="text-gray-400 text-xs">
            <p>Sprite atual: `{character}_${expression}_sprite.png`</p>
          </div>
        </div>
      </div>
    </main>
  );
}
