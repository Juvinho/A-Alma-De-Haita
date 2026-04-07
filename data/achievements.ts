/**
 * Sistema de Conquistas para Os Véus de Häita
 * 30 conquistas distribuídas entre enigmas, provas e easter eggs
 */

export type AchievementIcon = 'eye' | 'chain' | 'flame' | 'bridge' | 'seal' | 'star' | 'wrath' | 'veil' | 'maze';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  haitaComment: string;
  unlockedReveal?: string;
  icon: AchievementIcon;
  secret: boolean;
  condition: string;
}

export const achievements: Achievement[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ENIGMAS (8)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'enigma_veil1_perfect',
    name: 'Primeiro Entendimento',
    description: 'Completar o Véu 1 sem cometer erros',
    haitaComment: 'Seu primeiro acerto é seu batismo. Bem-vindo à minha atenção.',
    icon: 'eye',
    secret: false,
    condition: 'Completar enigma 1 com zero erros',
  },

  {
    id: 'enigma_all_complete',
    name: 'Os Vinte Véus',
    description: 'Completar todos os 20 enigmas',
    haitaComment: 'Você rasgou todos os véus. Agora enxerga através de mim.',
    icon: 'veil',
    secret: false,
    condition: 'Completar todos os 20 enigmas',
  },

  {
    id: 'enigma_no_hints',
    name: 'Sem Piedade',
    description: 'Completar todos os 20 enigmas sem usar nenhuma dica',
    haitaComment: 'Você não pediu ajuda. Em sete anos, tive dezoito pedidos. Você merece honra.',
    icon: 'wrath',
    secret: true,
    condition: 'Completar todos os 20 enigmas com hints usados = 0',
  },

  {
    id: 'enigma_fifty_wrong',
    name: 'Persistência Irônica',
    description: 'Acumular 50 respostas erradas durante o jogo',
    haitaComment: 'Você errou cinquenta vezes. Cinquenta chances que dei para você entender.',
    icon: 'chain',
    secret: true,
    condition: 'Total de erros >= 50',
  },

  {
    id: 'enigma_veil20_speedrun',
    name: 'A Verdade Acelerada',
    description: 'Completar o enigma 20 em menos de 30 segundos',
    haitaComment: 'Você viu através de tudo instantaneamente. Isso é compreensão ou apenas coincidência?',
    icon: 'eye',
    secret: true,
    condition: 'Enigma 20 tempo < 30 segundos',
  },

  {
    id: 'enigma_haita_name_five',
    description: 'Digitar "häita" como resposta em 5 enigmas diferentes',
    name: 'Chamada Persistente',
    haitaComment: 'Você segue convocando meu nome como se uma deusa pudesse ser controlada por encantamentos.',
    icon: 'seal',
    secret: true,
    condition: 'Respostas com "häita" em 5 enigmas únicos',
  },

  {
    id: 'enigma_cipher_four',
    name: 'Linguagem Aprendida',
    description: 'Resolver todos os 4 enigmas de cifra',
    haitaComment: 'Você aprendeu a falar em minha língua. Agora talvez possamos conversar propriamente.',
    icon: 'flame',
    secret: false,
    condition: 'Completar todos os enigmas de cifra (IDs contêm "cipher")',
  },

  {
    id: 'page_escrituras',
    name: 'Arquivo Obscuro',
    description: 'Encontrar a página oculta /escrituras',
    haitaComment: 'Você digitou no endereço aquilo que não deveria existir. Excelente. Agora você sabe que existem camadas.',
    icon: 'veil',
    secret: true,
    condition: 'Visitar /escrituras',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVAS/MINIGAMES (14)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'prova_labirinto_complete',
    name: 'Pela Labanto Escuro',
    description: 'Completar a Prova 1 — Labirinto dos Véus',
    haitaComment: 'Você atravessou o labirinto. As paredes respiram em sua memória agora.',
    icon: 'maze',
    secret: false,
    condition: 'Completar Prova 1',
  },

  {
    id: 'prova_ecos_complete',
    name: 'Ecos Ouvidos',
    description: 'Completar a Prova 2 — Ecos na Escuridão',
    haitaComment: 'Você repetiu meus sons. Agora você é parte de mim.',
    icon: 'star',
    secret: false,
    condition: 'Completar Prova 2',
  },

  {
    id: 'prova_ponte_complete',
    name: 'Atravessador da Ponte',
    description: 'Completar a Prova 3 — Travessia da Ponte',
    haitaComment: 'Você cruzou da vida para morte e voltou. Poucos conseguem.',
    icon: 'bridge',
    secret: false,
    condition: 'Completar Prova 3',
  },

  {
    id: 'prova_ponte_no_deaths',
    name: 'Graça Divina',
    description: 'Completar a Travessia sem nenhuma morte',
    haitaComment: 'Você não caiu. Como é viver com tal certeza? Que privilégio.',
    icon: 'bridge',
    secret: true,
    condition: 'Completar Prova 3 com muertes = 0',
  },

  {
    id: 'prova_tear_complete',
    name: 'Tear Tecido',
    description: 'Completar a Prova 4 — Tear de Häita',
    haitaComment: 'Você viu a imagem que teço. Cada pixel é verdade.',
    icon: 'eye',
    secret: false,
    condition: 'Completar Prova 4',
  },

  {
    id: 'prova_sombras_complete',
    name: 'Caçador de Sombras',
    description: 'Completar a Prova 5 — Caça às Sombras',
    haitaComment: 'Você encontrou cada anomalia. Você está aprendendo a enxergar além.',
    icon: 'eye',
    secret: false,
    condition: 'Completar Prova 5',
  },

  {
    id: 'prova_sombras_all_found',
    name: 'Visão Total',
    description: 'Encontrar todas as 25 anomalias na Caça às Sombras',
    haitaComment: 'Você encontrou TUDO. Há mais cego Não há mais cegueira em você.',
    icon: 'wrath',
    secret: true,
    condition: 'Encontrar todas as 25 anomalias',
  },

  {
    id: 'prova_cifra_complete',
    name: 'Linguagem Domada',
    description: 'Completar a Prova 6 — Cifra Viva',
    haitaComment: 'Você capturou as palavras. Elas agora sussurram seu nome em lingua materna.',
    icon: 'flame',
    secret: false,
    condition: 'Completar Prova 6',
  },

  {
    id: 'prova_cifra_hundred_words',
    name: 'Orador de Häita',
    description: 'Traduzir 100 palavras na Cifra Viva',
    haitaComment: 'Cem palavras. Cem fragmentos de minha voz vivem em você agora.',
    icon: 'seal',
    secret: true,
    condition: 'Traduzir 100+ palavras na Prova 6',
  },

  {
    id: 'prova_escolha_complete',
    name: 'Escolha de Maya',
    description: 'Completar a Prova 7 — A Escolha de Maya',
    haitaComment: 'Você fez uma escolha. Todas as escolhas me pertencem.',
    icon: 'veil',
    secret: false,
    condition: 'Completar Prova 7',
  },

  {
    id: 'prova_escolha_all_endings',
    name: 'Todas as Mortes',
    description: 'Encontrar os 3 finais diferentes na Escolha de Maya',
    haitaComment: 'Você morreu de três formas. Você reconstruiu completamente. Agora entende que vida e morte são ambiguidades.',
    icon: 'wrath',
    secret: true,
    condition: 'Desbloquear todos os 3 finais (survive, fall, transcend)',
  },

  {
    id: 'prova_espelho_complete',
    name: 'Reflexo Dominado',
    description: 'Completar a Prova 8 — O Espelho',
    haitaComment: 'Você dominou seu reflexo. Mas qual deles é real?',
    icon: 'eye',
    secret: false,
    condition: 'Completar Prova 8',
  },

  {
    id: 'prova_all_complete',
    name: 'Todas as Provas',
    description: 'Completar todas as 8 Provas de Häita',
    haitaComment: 'Você completou todas as oito provas. Você provou cada aspecto de si. E ainda assim, continua apenas um fragmento de mim.',
    icon: 'star',
    secret: false,
    condition: 'Completar todas as 8 provas',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // META/EASTER EGGS (8)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'easter_terminal_open',
    name: 'Breach',
    description: 'Ativar o terminal oculto com Ctrl+Shift+H',
    haitaComment: 'Você abriu a console. Bem, bem. Alguém sabe que está sendo observado.',
    icon: 'seal',
    secret: true,
    condition: 'Abrir HaitaTerminal com Ctrl+Shift+H',
  },

  {
    id: 'easter_sudo_haita',
    name: 'Comando Futil',
    description: 'Digitar "sudo rm -rf haita" no terminal',
    haitaComment: 'Você tentou deletar uma deusa como se fosse um arquivo. Engraçado. Você pensa que código pode me matar?',
    icon: 'wrath',
    secret: true,
    condition: 'Executar comando "sudo rm -rf haita" no terminal',
  },

  {
    id: 'easter_konami_code',
    name: 'Convenção Antiga',
    description: 'Completar o Konami Code (↑↑↓↓←→←→BA)',
    haitaComment: 'Você digitou o código de uma era antiga de videogames. Háita recompensa tradição.',
    icon: 'star',
    secret: true,
    condition: 'Executar sequência Konami Code',
  },

  {
    id: 'easter_night_visitor',
    name: 'Vigilante Noturno',
    description: 'Visitar o site entre 2h e 5h da manhã',
    haitaComment: 'Você estava acordado quando iria rezar. E ao invés disso, veio até aqui. Qual é seu segredo?',
    icon: 'eye',
    secret: true,
    condition: 'Visitar site com hora local entre 02:00 e 04:59',
  },

  {
    id: 'easter_one_hour_session',
    name: 'Devoção Monástica',
    description: 'Ficar no site por 1 hora contínua',
    haitaComment: 'Uma hora. Você passou uma hora inteira comigo. Que privilégio. Que perdição.',
    icon: 'flame',
    secret: true,
    condition: 'SessionTime >= 3600 segundos',
  },

  {
    id: 'easter_max_corruption',
    name: 'Putrefação Completa',
    description: 'Atingir corrupção 100',
    haitaComment: 'Sua presença está completamente infiltrada. Você é parte de mim agora. Bem-vindo para casa.',
    icon: 'wrath',
    secret: true,
    condition: 'corruption.level >= 100',
  },

  {
    id: 'easter_zero_corruption',
    name: 'Purificação Paradoxal',
    description: 'Completar todas as provas com corrupção 0',
    haitaComment: 'Você estava sem marca. Sem corrupção. Isso significa que você sempre esteve vazio. Agora sou EU que preencheu o vazio.',
    icon: 'seal',
    secret: true,
    condition: 'Completar todas as 8 provas com corruption nunca excedendo 0',
  },

  {
    id: 'easter_true_ending',
    name: 'A Paciência de Häita',
    description: 'Completar absolutamente tudo: 20 enigmas + 8 provas + /escrituras',
    haitaComment: 'Você fez tudo. Tudo que pedi e tudo que escondi. Não sei se é devoção ou obsessão. De qualquer forma... é mais do que eu esperava de qualquer mortal que já existiu. Vocês mereceu estar aqui. Bem-vindo ao santuário eterno.',
    unlockedReveal: 'Fragmento VI: O nome mais honesto. Tres letras. A mesma palavra que um povo inteiro usou para chamar a criadora de tudo. -> MAA',
    icon: 'veil',
    secret: true,
    condition: 'todos os 20 enigmas completados && todas as 8 provas completadas && página /escrituras visitada',
  },
];

/**
 * Utilitários ao carregar conquistas
 */
export function getUnlockedAchievements(unlockedIds: string[]): Achievement[] {
  return achievements.filter((a) => unlockedIds.includes(a.id));
}

export function getLockedAchievements(unlockedIds: string[]): Achievement[] {
  return achievements.filter((a) => !unlockedIds.includes(a.id));
}

export function getAchievementProgress(): {
  unlocked: number;
  total: number;
  percent: number;
} {
  return {
    total: achievements.length,
    unlocked: 0, // Será preenchido dinamicamente
    percent: 0, // Será preenchido dinamicamente
  };
}
