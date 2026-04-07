const TARGET_PASSWORD = "MAHASSE GRAND'MAA";

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeEternalInput(value: string): string {
  return stripDiacritics(value)
    .replace(/[’`´]/g, "'")
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function isEternalPassword(value: string): boolean {
  const normalized = normalizeEternalInput(value);
  return normalized === TARGET_PASSWORD || normalized === 'MAHASSE GRANDMAA';
}

export const eternalWrongReplies = [
  'Nao.',
  'Essa nao e a palavra.',
  'Voce esta procurando no lugar errado.',
  'Mais perto... ou mais longe. Eu nao vou te dizer.',
  'A resposta esta em tudo que voce ja viu. Olhe de novo.',
  'Sete pedacos. Eu ja te disse.',
];

export const ETERNAL_PASSWORD_CANONICAL = "MAHASSE GRAND'MAA";
