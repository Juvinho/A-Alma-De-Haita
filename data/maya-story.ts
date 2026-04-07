/**
 * "A Escolha de Maya" — Prova 7 visual novel story tree.
 * A Varguën night incident. 8 decision points, 3 endings.
 */

export type EndingType = 'survive' | 'fall' | 'transcend';

export interface StoryChoice {
  text: string;
  next: string;
}

export interface StoryNode {
  id: string;
  text: string;
  speaker?: string;          // undefined = narrator
  choices?: StoryChoice[];
  next?: string;             // linear node — no choices
  ending?: EndingType;
}

export const STORY_NODES: Record<string, StoryNode> = {
  // ─── Intro ────────────────────────────────────────────────────────────────
  start: {
    id: 'start',
    text: 'A Varguën. 02:47 da manhã. O alarme de perímetro dispara — três pulsos curtos, um longo. Código Vesper. Criaturas detectadas no bloco leste.',
    next: 'wake',
  },
  wake: {
    id: 'wake',
    text: 'Você acorda com os pulmões cheios de adrenalina. Ao lado da sua cama: uma lanterna, seu rádio de emergência, e a faca de ritual que Maya te deu na semana passada.',
    next: 'choice1',
  },
  choice1: {
    id: 'choice1',
    text: 'Você precisa agir rápido. O que você faz primeiro?',
    choices: [
      { text: 'Pega o rádio e reporta sua posição ao comando', next: 'radio_first' },
      { text: 'Pega a faca e vai direto verificar o corredor', next: 'knife_first' },
      { text: 'Acende a lanterna e avalia a situação antes de se mover', next: 'assess_first' },
    ],
  },

  // ─── Branch A: Rádio primeiro ─────────────────────────────────────────────
  radio_first: {
    id: 'radio_first',
    text: 'Você aciona o rádio. Estática. Depois a voz de Leander: "Bloco leste comprometido. Fiquem no quarteirão sul. Não saiam sozinhos."',
    next: 'leander_warning',
  },
  leander_warning: {
    id: 'leander_warning',
    text: 'Através da parede, você ouve algo — um arranhado rítmico, como unhas em madeira. Está ficando mais próximo.',
    next: 'choice2_a',
  },
  choice2_a: {
    id: 'choice2_a',
    text: 'O rádio fuzila de novo: "Alguém no ala C? Precisamos de uma contagem." Você está sozinho no ala C.',
    choices: [
      { text: 'Responde no rádio confirmando sua posição', next: 'confirm_position' },
      { text: 'Fica em silêncio — não quer revelar sua localização à criatura', next: 'stay_silent' },
    ],
  },
  confirm_position: {
    id: 'confirm_position',
    text: 'Você responde. Trinta segundos depois, Kael aparece na sua porta — e atrás dele, mais escuridão do que deveria existir naquele corredor.',
    next: 'choice3_a',
  },
  stay_silent: {
    id: 'stay_silent',
    text: 'Você silencia o rádio. O arranhado para. Por três longos minutos, nada. Então você percebe: não parou. Mudou de direção.',
    next: 'choice3_b',
  },

  // ─── Branch B: Faca primeiro ──────────────────────────────────────────────
  knife_first: {
    id: 'knife_first',
    text: 'Você pega a faca e abre a porta do quarto. O corredor está escuro — a iluminação de emergência piscando vermelho a cada três segundos.',
    next: 'corridor_knife',
  },
  corridor_knife: {
    id: 'corridor_knife',
    text: 'No fim do corredor, algo se move. Baixo, quase rastejando, mas rápido. Muito rápido para ser humano.',
    next: 'choice2_b',
  },
  choice2_b: {
    id: 'choice2_b',
    text: 'A criatura para. Levanta a cabeça. Você acha que está sendo observado, mas os olhos que ela deveria ter estão no lugar errado.',
    choices: [
      { text: 'Recua devagar, volta ao quarto, tranca a porta', next: 'retreat' },
      { text: 'Avança, tenta assustar com a faca', next: 'advance_knife' },
      { text: 'Fica absolutamente imóvel', next: 'freeze' },
    ],
  },
  retreat: {
    id: 'retreat',
    text: 'Você recua centímetro por centímetro. A criatura segue seu movimento, cabeça inclinada. Você chega ao quarto, tranca a porta. O arranhado começa imediatamente.',
    next: 'locked_in',
  },
  advance_knife: {
    id: 'advance_knife',
    text: 'Você avança. A criatura recua — mas só um passo. Ela está te estudando.',
    next: 'advance_knife2',
  },
  advance_knife2: {
    id: 'advance_knife2',
    speaker: 'Narrador',
    text: 'E então você entende que estava sendo testado. A faca serve para rituais. Não para caça. Você não é o caçador nesta equação.',
    ending: 'fall',
  },
  freeze: {
    id: 'freeze',
    text: 'Você para de respirar. A criatura inclina a cabeça para o outro lado. Trinta segundos. Um minuto. Ela se afasta.',
    next: 'freeze_success',
  },

  // ─── Branch C: Avaliar primeiro ───────────────────────────────────────────
  assess_first: {
    id: 'assess_first',
    text: 'Você acende a lanterna com cuidado, mantém baixa. Verifica as saídas: porta principal, janela (2º andar, viável), e o duto de ventilação que Maya te mostrou na semana passada.',
    next: 'choice2_c',
  },
  choice2_c: {
    id: 'choice2_c',
    text: 'O rádio na sua mesa fuzila. Voz de Seren: "Alguém consegue chegar ao gerador? Precisamos da grade de contenção."',
    choices: [
      { text: 'Tenta chegar ao gerador — é arriscado mas crítico', next: 'generator_run' },
      { text: 'Usa o duto de ventilação para se mover sem ser detectado', next: 'ventilation' },
    ],
  },
  generator_run: {
    id: 'generator_run',
    text: 'Você vai. No caminho, passa pela biblioteca — e vê pela janela que há mais do que uma criatura. São cinco. Todas olhando para cima.',
    next: 'generator_run2',
  },
  generator_run2: {
    id: 'generator_run2',
    text: 'Você chega ao gerador. Sua mão está no painel quando percebe: um dos "fios de segurança" da grade de contenção foi cortado. Isto não foi acidente.',
    next: 'choice3_c',
  },
  ventilation: {
    id: 'ventilation',
    text: 'Você entra no duto. Escuro, estreito, silencioso. Você consegue ver — através das grelhas — criaturas passando pelo corredor que você teria usado.',
    next: 'ventilation2',
  },
  ventilation2: {
    id: 'ventilation2',
    text: 'Você emerge perto do gerador. Seren está lá. "Como você chegou aqui?" ela pergunta, com uma expressão que você não consegue interpretar.',
    next: 'choice3_d',
  },

  // ─── Convergência e finais ────────────────────────────────────────────────
  choice3_a: {
    id: 'choice3_a',
    text: 'Kael entra. "Você reportou sua posição no rádio." Não é uma pergunta. A escuridão atrás dele pulsa. "Isso foi inteligente ou foi sorte?"',
    choices: [
      { text: '"Foi protocolo. Treinamento."', next: 'survive_end' },
      { text: '"Foi sorte. Não vou mentir."', next: 'transcend_end' },
    ],
  },
  choice3_b: {
    id: 'choice3_b',
    text: 'Você rastreia o som pelo quarto sem se mover. Está acima de você. No teto. E então percebe: não é uma criatura. É uma pessoa.',
    next: 'person_ceiling',
  },
  person_ceiling: {
    id: 'person_ceiling',
    text: 'Maya desce do teto com a agilidade de quem passou anos da Varguën. "Quieto", ela sussurra. "Há três delas no corredor. Mas elas não entraram. Elas estão esperando que alguém abra a porta."',
    next: 'transcend_end',
  },
  locked_in: {
    id: 'locked_in',
    text: 'O arranhado continua. Horas. Com o amanhecer, para. A grade de contenção foi reativada. Você sobreviveu — sozinho, dentro do quarto, sem resolver nada.',
    ending: 'survive',
  },
  freeze_success: {
    id: 'freeze_success',
    text: 'Você permanece imóvel por mais dez minutos. Então ouve Kael e Leander chegando com equipamento de contenção. A criatura foi isolada. Você fez a coisa certa sem saber exatamente por quê.',
    ending: 'survive',
  },
  choice3_c: {
    id: 'choice3_c',
    text: 'Alguém cortou o fio de segurança. Isso significa que alguém de dentro da Varguën queria que as criaturas entrassem. O quê você faz com essa informação?',
    choices: [
      { text: 'Conserta o fio e aciona a grade — depois investiga', next: 'survive_end' },
      { text: 'Aciona o alarme geral e grita o que descobriu', next: 'fall_end_naive' },
    ],
  },
  choice3_d: {
    id: 'choice3_d',
    text: 'Seren te olha com algo que parece cálculo. "O duto. Claro." ela diz. "Eu não sabia que você sabia do duto." Silêncio. "Quem te mostrou?"',
    choices: [
      { text: '"Maya." — direto', next: 'transcend_end' },
      { text: '"Descobri por conta própria." — mentira estratégica', next: 'survive_end' },
    ],
  },
  fall_end_naive: {
    id: 'fall_end_naive',
    speaker: 'Narrador',
    text: 'Você grita. A criatura mais próxima reorienta. Você sobreviveu à noite, mas revelou tudo que sabia para todos que estavam ouvindo — inclusive quem não devia ouvir.',
    ending: 'fall',
  },

  // ─── Finais formais ───────────────────────────────────────────────────────
  survive_end: {
    id: 'survive_end',
    speaker: 'Häita',
    text: 'Você sobreviveu. Como um rato sobrevive — por instinto, por sorte, por não chamar atenção. Não é elogio. Não é crítica. É apenas o que é.',
    ending: 'survive',
  },
  transcend_end: {
    id: 'transcend_end',
    speaker: 'Häita',
    text: 'Você viu além do óbvio. Ouviu o que não foi dito. Agiu antes de entender completamente. Para um mortal, isso é o máximo que se pode pedir. Eu pedi. Você entregou.',
    ending: 'transcend',
  },
};

export const STORY_START = 'start';

export const ENDING_MESSAGES: Record<EndingType, string> = {
  survive: 'Você sobreviveu. Como um rato. Mas sobreviveu.',
  fall: 'Você morreu como os heróis morrem — acreditando que a coragem substitui o discernimento.',
  transcend: 'Você fez o que poucos fazem: pensou como mortal e agiu como alguém digno da minha atenção.',
};

export const ENDING_LABELS: Record<EndingType, string> = {
  survive: 'Sobrevivência',
  fall: 'Queda',
  transcend: 'Transcendência',
};

export const ENDING_ICONS: Record<EndingType, string> = {
  survive: '⚔',
  fall: '☠',
  transcend: '✦',
};
