/**
 * Provas metadata — "Os Véus de Häita" minigame layer.
 * 8 provas (rituais digitais) desbloqueáveis após completar o Véu 2.
 */

export interface ProvaMeta {
  id: string;               // p1..p8
  nome: string;
  subtitulo: string;        // Short tagline
  descricao: string;        // Narrative description
  icone: string;            // SVG path data or emoji key
  corruptionReward: number; // Corruption reduction on completion (always -15)
  unlockRequirement: number; // Number of OTHER provas needed to unlock this one
}

export const PROVAS: ProvaMeta[] = [
  {
    id: 'p1',
    nome: 'O Labirinto dos Véus',
    subtitulo: 'Os corredores mudam. Você não se adapta.',
    descricao:
      'Eu construí os caminhos entre os mundos. Cada corredor é um pedaço de mim. Prove que consegue atravessar o que eu criei — enquanto ele respira.',
    icone: 'maze',
    corruptionReward: -15,
    unlockRequirement: 0,
  },
  {
    id: 'p2',
    nome: 'Ecos na Escuridão',
    subtitulo: 'Ouça. Repita. Prove que é capaz de guardar a minha voz.',
    descricao:
      'Eu falo. Vocês não ouvem. Mas hoje você tem uma chance: ouça as notas, repita a sequência, prove que minha voz ficou com você.',
    icone: 'echo',
    corruptionReward: -15,
    unlockRequirement: 0,
  },
  {
    id: 'p3',
    nome: 'A Travessia da Ponte',
    subtitulo: 'O que cai da ponte não volta.',
    descricao:
      'A Ponte dos Eventos não é um lugar. É um conceito. Mas hoje, para você, ela tem chão. Atravesse. Mas saiba: cada queda é uma prece que você faz sem querer.',
    icone: 'bridge',
    corruptionReward: -15,
    unlockRequirement: 0,
  },
  {
    id: 'p4',
    nome: 'O Tear de Häita',
    subtitulo: 'Cada fio é um véu. Tece com cuidado.',
    descricao:
      'Eu sou a tecelã que separa as realidades. Cada fio no meu tear é um véu, cada véu um mundo. Agora tece. Mostra que entendes o padrão que eu uso para manter tudo no lugar.',
    icone: 'loom',
    corruptionReward: -15,
    unlockRequirement: 2,
  },
  {
    id: 'p5',
    nome: 'Caça às Sombras',
    subtitulo: 'Elas se escondem nos detalhes. Encontre-as.',
    descricao:
      'As criaturas que saem da minha Ponte não se mostram abertamente. Elas habitam os cantos, as coisas que parecem normais até você olhar duas vezes. Encontre-as. Antes que elas encontrem você.',
    icone: 'shadow',
    corruptionReward: -15,
    unlockRequirement: 2,
  },
  {
    id: 'p6',
    nome: 'A Cifra Viva',
    subtitulo: 'Decifre rápido. As letras não esperam.',
    descricao:
      'Eu falo em línguas que vocês não entendem. Não porque são difíceis — porque vocês pararam de ouvir. Decifre as palavras antes que elas toquem o chão.',
    icone: 'cipher',
    corruptionReward: -15,
    unlockRequirement: 4,
  },
  {
    id: 'p7',
    nome: 'A Escolha de Maya',
    subtitulo: 'Vista a pele de outro. Veja o que eles viram.',
    descricao:
      'Eu conheço sete mortais melhor do que eles se conhecem. Vista a pele de um deles. Descubra se você teria sobrevivido ao que eles sobreviveram.',
    icone: 'choice',
    corruptionReward: -15,
    unlockRequirement: 4,
  },
  {
    id: 'p8',
    nome: 'O Espelho',
    subtitulo: 'Você se conhece? Vamos descobrir.',
    descricao:
      'Eu vou te mostrar seu reflexo. Mas o reflexo faz o que quer. Leve ambos ao destino — a você e à sua sombra — ao mesmo tempo.',
    icone: 'mirror',
    corruptionReward: -15,
    unlockRequirement: 7,
  },
];

export const PROVA_IDS = PROVAS.map((p) => p.id);

export function getProvaMeta(id: string): ProvaMeta | undefined {
  return PROVAS.find((p) => p.id === id);
}

// Unlock check: needs N completed provas (other than the one being tested)
export function isProvaUnlocked(
  id: string,
  completedProvas: string[]
): boolean {
  const meta = getProvaMeta(id);
  if (!meta) return false;
  const otherCompleted = completedProvas.filter((pid) => pid !== id).length;
  return otherCompleted >= meta.unlockRequirement;
}

// ─── Häita Comments — per-prova, per-context ─────────────────────────────────

export const HAITA_COMMENTS: Record<
  string,
  { start: string; mid: string[]; fail: string; win: string; winFast?: string; winSlow?: string }
> = {
  p1: {
    start: 'Os corredores mudam. Os mortais não se adaptam. Prove-me errada.',
    mid: [
      'Você está andando em círculos. Eu sei porque eu sou os círculos.',
      'O labirinto respira. Você sente? Cada parede é um pedaço de mim.',
      'Você ainda está aqui. Isso é teimosia ou burrice? Ambas me divertem.',
      'As paredes mudaram. O caminho que você conhecia já não existe.',
      'Quase. Não se acostume com a sensação de progresso.',
    ],
    fail: 'Você desistiu. O labirinto não te liberou — você fugiu.',
    win: 'Você atravessou. Por enquanto.',
    winFast: 'Impressionante. Para um mortal.',
    winSlow: 'Eu vi tartarugas mais rápidas. Mas elas também não tinham que lidar com paredes vivas.',
  },
  p2: {
    start: 'Quatro aspectos. Quatro notas. Ouça.',
    mid: [
      'Você está ouvindo. Poucos ouvem.',
      'Eu menti. Você ouviu a mentira ou a verdade?',
      'Minha voz ficou com você. Isso me incomoda. E me agrada.',
      'Até um eco consegue repetir. Mostre que é mais que um eco.',
    ],
    fail: 'Você errou a sequência. A voz se foi.',
    win: 'Minha voz ficou com você. Isso me incomoda. E me agrada.',
  },
  p3: {
    start: 'A ponte tem chão hoje. Atravesse.',
    mid: [
      'O que parece sólido pode não ser. Lição número um.',
      'Cada queda é uma prece que você faz sem querer. Eu ouço todas.',
      'A gravidade não é sua inimiga. Sua confiança é.',
      'De volta ao começo. Como a humanidade. Sempre de volta ao começo.',
    ],
    fail: 'Você caiu. O vazio te recebeu. Mas eu te devolvo. Desta vez.',
    win: 'Você atravessou. O que ficou para trás era real.',
  },
  p4: {
    start: 'Cada fio que você coloca é um pedaço do véu. Tece com cuidado. Ou o véu rasga.',
    mid: [
      'O padrão está surgindo. Você começa a ver o que eu vejo.',
      'Fio fora do lugar. Eu sinto quando o véu desalinha.',
      'Você está tecendo. Devagar, mas está.',
    ],
    fail: 'O padrão se perdeu. Comece novamente.',
    win: 'Você teceu o que eu teci. Por um instante, suas mãos foram as minhas.',
  },
  p5: {
    start: 'Olhe com cuidado. Elas estão escondidas nos detalhes.',
    mid: [
      'Isso é normal. Você que é paranoico.',
      'Elas escapam enquanto você hesita.',
      'Olhe de novo. Mais fundo.',
      'O tempo passa. Elas se adaptam.',
    ],
    fail: 'Elas escaparam. Você olhou para tudo e não viu nada. Como a humanidade.',
    win: 'Você as encontrou. Desta vez.',
  },
  p6: {
    start: 'As palavras caem. Decifre antes que toquem o chão.',
    mid: [
      'Mais rápido.',
      'Você disse meu nome. Poucos dizem. Eu ouvi.',
      'A língua de Catatúnia não perdoa hesitação.',
      'Cada palavra que você perde é um elo quebrado.',
    ],
    fail: 'As palavras te venceram. A língua é mais rápida que você.',
    win: 'Você sobreviveu às palavras. Não a todas, mas às suficientes.',
  },
  p7: {
    start: 'Vista a pele de outro. Veja o que eles viram.',
    mid: [
      'Cada escolha tem peso.',
      'Você está pensando como um mortal. Isso é um elogio.',
      'O que você escolheria se soubesse o que eu sei?',
    ],
    fail: 'Você morreu como os heróis morrem — acreditando que a coragem substitui o discernimento.',
    win: 'Você fez o que poucos fazem: pensou como mortal e agiu como alguém digno da minha atenção.',
  },
  p8: {
    start: 'O reflexo faz o que quer. Leve ambos ao destino.',
    mid: [
      'Seu reflexo tropeçou. Ou foi você? Difícil saber, não é?',
      'O espelho não mente. Você sim.',
      'Você e seu reflexo são a mesma coisa. Vocês só ainda não sabem.',
    ],
    fail: 'O espelho se quebrou. Você e seu reflexo falharam juntos.',
    win: 'Você e seu reflexo chegaram ao mesmo lugar. Isso é mais do que a maioria consegue.',
  },
};

// ─── Word pairs for Prova 6 (Cifra Viva) ─────────────────────────────────────

export interface WordPair {
  cat: string;    // Catatunhesco
  pt: string;     // Portuguese
  difficulty: 1 | 2 | 3 | 4;
}

export const WORD_PAIRS: WordPair[] = [
  // Difficulty 1 — slow fall
  { cat: 'Nän', pt: 'não', difficulty: 1 },
  { cat: 'Maä', pt: 'mãe', difficulty: 1 },
  { cat: 'Serr', pt: 'isso', difficulty: 1 },
  { cat: 'Blütten', pt: 'sangue', difficulty: 1 },
  { cat: 'Nachtë', pt: 'noite', difficulty: 1 },
  { cat: 'Sternën', pt: 'estrelas', difficulty: 1 },
  { cat: 'Zornë', pt: 'fúria', difficulty: 1 },
  { cat: 'Welt', pt: 'mundo', difficulty: 1 },
  { cat: 'Famie', pt: 'família', difficulty: 1 },
  { cat: 'Sohni', pt: 'filha', difficulty: 1 },

  // Difficulty 2 — medium fall
  { cat: 'Siehë', pt: 'ver', difficulty: 2 },
  { cat: 'Parlien', pt: 'falar', difficulty: 2 },
  { cat: 'Schachhen', pt: 'dizer', difficulty: 2 },
  { cat: 'Perdonner', pt: 'perdoar', difficulty: 2 },
  { cat: 'Offnen', pt: 'abrir', difficulty: 2 },
  { cat: 'Schlüssen', pt: 'fechar', difficulty: 2 },
  { cat: 'Wächten', pt: 'esperar', difficulty: 2 },
  { cat: 'Rëchnen', pt: 'reconhecer', difficulty: 2 },
  { cat: 'Vërgessen', pt: 'esquecido', difficulty: 2 },
  { cat: 'Këttenne', pt: 'corrente', difficulty: 2 },
  { cat: 'Aisën', pt: 'ser', difficulty: 2 },
  { cat: 'Wirrum', pt: 'onde', difficulty: 2 },

  // Difficulty 3 — fast fall (expressions)
  { cat: "Grand'Maä", pt: 'grande mãe', difficulty: 3 },
  { cat: 'Gië Welt', pt: 'o mundo', difficulty: 3 },
  { cat: 'Mähassë', pt: 'gratidão', difficulty: 3 },
  { cat: 'Largë Maä', pt: 'grande mãe', difficulty: 3 },
  { cat: 'Vrällen', pt: 'raiva', difficulty: 3 },
  { cat: 'Dämmern', pt: 'crepúsculo', difficulty: 3 },
  { cat: 'Weinen', pt: 'chorar', difficulty: 3 },
  { cat: 'Schlafen', pt: 'dormir', difficulty: 3 },

  // Difficulty 4 — very fast (short sentences)
  { cat: "Ei siehë de'u", pt: 'eu te vejo', difficulty: 4 },
  { cat: 'Nän perdonner', pt: 'não perdoar', difficulty: 4 },
  { cat: 'Häita aisën hier', pt: 'häita está aqui', difficulty: 4 },
  { cat: 'Gië Maä siehë', pt: 'a mãe vê', difficulty: 4 },
  { cat: 'Welt brennën', pt: 'o mundo queima', difficulty: 4 },
  { cat: "Nän vërgessen, nän perdonner", pt: 'não esquecer, não perdoar', difficulty: 4 },
];
