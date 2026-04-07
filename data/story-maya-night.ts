/**
 * Narrativa completa para a Prova 7 — A Escolha de Maya
 * Árvore ramificada com 40+ nodes
 * Flags: heroic, pragmatic, helped_nithonne, went_east, used_maya_gift, sacrificed_self
 */

export type Emotion = 'calm' | 'urgent' | 'fearful' | 'determined' | 'conflicted' | 'sorrowful';

export interface StoryChoice {
  text: string;
  next: string;
  flag?: string;
}

export interface StoryNode {
  id: string;
  text: string;
  speaker?: string;
  emotion?: Emotion;
  choices?: StoryChoice[];
  next?: string;
  condition?: string;
  ending?: 'survive' | 'fall' | 'transcend';
}

export const storyNodes: StoryNode[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ATO I — DESPERTAR
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'start',
    text: `São duas da manhã quando o alarme silencioso toca contra seu peito. Não é som — é vibração. Aviso de Nível Vermelho. Você acorda da forma que os Elos aprendem a acordar: sem transição, sem confusão. O dormitório está escuro. Ao seu lado, Ella dorme profundamente. Tayrone está na cama ao fundo, imóvel. Do outro lado do corredor, você ouve porta abrindo. Passos rápidos.`,
    emotion: 'urgent',
    next: 'decision_1',
  },

  {
    id: 'decision_1',
    text: `Você tem segundos para escolher. O alarme continua vibrando contra seu peito. Lá fora, no perímetro leste, algo foi detectado. Criaturas. Roger foi claro no briefing de segurança: em caso de incidente, vocês têm protocolos. Protetor ou observador — essa é a escolha que Häita nunca fez pelos humanos.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Sair imediatamente em direção ao comando central',
        next: 'exit_immediate',
        flag: 'pragmatic',
      },
      {
        text: 'Primeiro verificar se há companheiros no dormitório',
        next: 'check_dorm',
        flag: 'heroic',
      },
    ],
  },

  {
    id: 'exit_immediate',
    text: `Você se levanta em silêncio absoluto. Sete anos de treinamento como Elo — a capacidade de se mover sem som é reflex agora. Você não acorda Ella. Você não desperta Tayrone. Se há um protocolo de evacuação, eles têm alarmes próprios. Sua responsabilidade é estar informado. Estar frente.`,
    emotion: 'determined',
    next: 'hallway_dark_start',
  },

  {
    id: 'check_dorm',
    text: `"Ella. Ella, acorda." Você chacoalha seu ombro. Seus olhos abrem instantaneamente — treinamento, não confusão. "Alarme vermelho. Östregião." Ella salta da cama. Você bate na porta do compartimento de Tayrone. Silêncio. De novo. A vibração continua. Tayrone não responde. Nella olha para você. "Vamos. Ele já recebeu a mensagem."`,
    emotion: 'urgent',
    next: 'leaving_with_ella',
  },

  {
    id: 'leaving_with_ella',
    text: `Você sai do dormitório com Ella ao seu lado. Ela está armada — sempre está, mesmo dormindo. Vocês dois correm pelo corredor. A Varguën à noite é uma instituição diferente. Sem luz, sem vozes, ela parece uma tumba que acordou.`,
    emotion: 'urgent',
    next: 'hallway_choice_1',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATO II — O CORREDOR
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'hallway_dark_start',
    text: `O corredor principal está escuro. Suas retinas se ajustam. Há uma rachadura na parede perto das salas 301-302 — grande demais para ser causada ontem. Há sangue nela? Não. Mas há algo — uma substância escura, quase pegajosa, que brilha sob a meia-luz. Sons vêm do lado direito: passos arrastados, arranhadelas nas paredes. Sons também vêm do lado esquerdo: silêncio completo. O corredor se divide.`,
    emotion: 'fearful',
    next: 'hallway_choice_1',
  },

  {
    id: 'hallway_choice_1',
    text: `Você para. Os sons do lado direito prosseguem — algo se move lá dentro. Instinto diz que é múltiplo. Do lado esquerdo, a ausência de som é um tipo diferente de aviso. Você tem dois caminhos.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Caminho pela direita: mais curto, mas os sons vêm de lá',
        next: 'right_path_start',
        flag: 'went_east',
      },
      {
        text: 'Caminho pela esquerda: mais longo, silencioso, menos conhecido',
        next: 'left_path_start',
      },
    ],
  },

  {
    id: 'right_path_start',
    text: `Você segue para a direita. Os sons pioram — arranhadelas viram algo perto de choramingos baixos, miados distorcidos. Häita não criou criaturas bonitas. Você sabe disso. A parede à sua esquerda está manchada. Não é sangue. É mais escuro. Mais antigo. Você ouve a voz de Roger pelo comunicador: "Nova leitura no portão leste. Dois contatos significativos. Alunos... ainda desconhecemos status." Ele respira pesadamente.`,
    emotion: 'fearful',
    next: 'nithonne_encounter',
  },

  {
    id: 'left_path_start',
    text: `Você segue para a esquerda. O corredor alternativo é raramente usado. Há portas trancadas de laboratórios. Você ouve ecos — o som de passos que não são seus. Acima dele, o som de algo maior se movimentando nos dutos de ventilação. Os sons diminuem à medida que você avança. Silêncio voltando a ser silêncio. Você ouve a voz de Roger: "Portão leste comprometido. Dois contatos. Biblioteca também comprometida — há bloqueio na entrada. Alunos presos." Pausa. "Precisamos de uma decisão de vocês."`,
    emotion: 'determined',
    next: 'library_junction',
  },

  {
    id: 'nithonne_encounter',
    text: `Você vira a esquina e há Nithönne. Ele está apoiado na parede, respirando com dificuldade. Seu uniforme da Varguën está rasgado. Há sangue — o dele, presumivelmente — escorrendo de um corte no ombro. Seus olhos encontram os seus. "Eu vi. Eu vi o que eles são. Não importa quão rápido você for, vai te pegar desprevenido." Ele engasga. Sua mão pressiona o ferimento. "Ela está esperando... Häita está esperando você entender."`,
    emotion: 'fearful',
    speaker: 'Nithönne',
    next: 'nithonne_choice',
  },

  {
    id: 'nithonne_choice',
    text: `Nithönne está se esforçando para permanecer de pé. Você tem segundos para decidir.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Parar para ajudá-lo e enfaixar o ferimento',
        next: 'help_nithonne',
        flag: 'helped_nithonnes',
      },
      {
        text: 'Nithönne insiste que você continue — obedecer',
        next: 'leave_nithonne',
      },
      {
        text: 'Carregar Nithönne junto — mais lento, mas juntos',
        next: 'carry_nithonne',
        flag: 'helped_nithonnes',
      },
    ],
  },

  {
    id: 'help_nithonne',
    text: `Você para. Você encontra um curativo no seu bolso — todo Elo carrega kits de primeiro atendimento — e você enfaixa o ombro de Nithönne com eficiência de campo. Ele aperta o dente durante o processo. "Dois minutos perdidos. Duas vidas que poderíamos ter salvado." Mas sua respiração estabiliza. Ele fica — esperando que você escape, presumivelmente.`,
    emotion: 'sorrowful',
    next: 'continuing_northeast',
  },

  {
    id: 'leave_nithonne',
    text: `"Vá", ele diz. "Eu vou... virar por aqui. Eles te pegam, todo mundo morre." Ele está certo. Você continua. Atrás, você ouve os sons se aproximando de Nithönne. Você não se vira. Isso é a escolha de viver — ignorar o que não pode salvar.`,
    emotion: 'sorrowful',
    next: 'continuing_northeast',
  },

  {
    id: 'carry_nithonne',
    text: `Você coloca o braço de Nithönne sobre seus ombros. Ele é pesado, mas o peso de Elos é treino. Você se move mais lentamente agora. O corredor continuita. Nithönne sussurra enquanto vocês andam. "Obrigado. Não estava esperando... bondade." Você continua se movendo. A velocidade é reduzida, mas você não está sozinho.`,
    emotion: 'determined',
    next: 'continuing_northeast',
  },

  {
    id: 'continuing_northeast',
    text: `Você chega à junção principal. Roger fala: "Portão leste ou biblioteca. Vocês precisam escolher. Não podemos fazer ambos. Os sistemas estão falhando. Qualquer demora e a criatura vai ficar presa dentro."`,
    emotion: 'urgent',
    next: 'decision_main_split',
  },

  {
    id: 'library_junction',
    text: `Você chega à junção que leva à biblioteca. Roger fala: "Portão leste ou biblioteca. Vocês precisam escolher. Alunos estão presos lá. A porta está fisicamente bloqueada. Arrombar fará barulho." Pausa. "O portão leste... já está comprometido. A criatura está literalmente tentando entrar. Vai conseguir em pou minutos."`,
    emotion: 'urgent',
    next: 'decision_main_split',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATO III — A BIFURCAÇÃO CENTRAL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'decision_main_split',
    text: `Duas opções. Duas mortes potenciais. Você precisa escolher qual morte você pode viver consigo mesmo.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Enfrentar a criatura no portão leste',
        next: 'east_gate_approach',
      },
      {
        text: 'Resgatar os alunos na biblioteca',
        next: 'library_approach',
      },
    ],
  },

  {
    id: 'east_gate_approach',
    text: `Você se dirije ao portão leste. A criatura é maior do que você imaginava. Tentáculos? Não. Patas? Talvez. Há algo que não é completamente sólido sobre ela — quando você pisca, ela parece se mover de forma que não respeita contiguidade espacial. Roger grita: "Não aproxime! Está crescendo! A cada segundo que passa—" Você interrompe. Você vê a criatura entender que está sendo observada. Ela se vira em sua direção.`,
    emotion: 'fearful',
    next: 'east_gate_confrontation',
  },

  {
    id: 'east_gate_confrontation',
    text: `A criatura não ataca imediatamente. Ela aguarda, como se avaliando você. Como se considerando se vale a pena mover-se. Você tem opções: tentar distraí-la, recuar e selá-la de dentro, ou tentar uma manobra arriscada.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Tentar distraí-la enquanto outros selam o portão',
        next: 'distract_creature',
      },
      {
        text: 'Recuar e ajudar a selá-lo',
        next: 'seal_gate',
      },
    ],
  },

  {
    id: 'distract_creature',
    text: `Você tem um comunicador. Você começa a falar. Frases. Nomes. Sua vibração talvez toque em frequências que a criatura entende. A criatura se vira completamente para você. Roger está gritando: "O quê você está fazendo?! Ela está indo para você!" Você não responde. Você apenas continua falando. Näm. Grand'Maä. Siehë.`,
    emotion: 'determined',
    next: 'maya_appears_east',
  },

  {
    id: 'seal_gate',
    text: `Você corre para a sala de controle do portão. Uma mão te pega. Maya. Ela está aqui. Como? "Deixe comigo", ela diz. Seus olhos têm aquela qualidade que os Elos têm quando entram em ressonância com Häita. Ela vai selá-lo de dentro. Você sabe o que isso significa para ela.`,
    emotion: 'sorrowful',
    next: 'maya_sacrifice_offer',
  },

  {
    id: 'library_approach',
    text: `Você se dirije à biblioteca. A porta está fisicamente bloqueada — uma estrutura de metal pesada foi colocada contra ela. Você ouve batidas de dentro. "Abram! Vocês precisam abrir!" Nithönne (ou você sozinho, dependendo de suas escolhas anteriores) empurra junto. A porta não se move. Do outro lado do corredor, você ouve a criatura vindo. Sons de destruição. De paredes sendo rasgadas.`,
    emotion: 'urgent',
    next: 'library_decision',
  },

  {
    id: 'library_decision',
    text: `Você tem segundos. Arrombar faz barulho que atrai a criatura. Esperar significa deixar os alunos morrer. Uma terceira opção: chamar Maya.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Arrombar a porta — rápido e barulhento',
        next: 'library_forced',
      },
      {
        text: 'Esperar e ver se a criatura passa',
        next: 'library_wait',
      },
      {
        text: 'Chamar Maya para ajudar',
        next: 'maya_at_library',
      },
    ],
  },

  {
    id: 'library_forced',
    text: `Você empurra contra a porta. Nithönne (se com você) ajuda. Mais uma vez. Mais uma vez. A estrutura cede. Os alunos — cinco deles — correm para fora. Mas o barulho ecoou. A criatura o ouviu. Você precisa correr, levar esses alunos para longe.`,
    emotion: 'urgent',
    next: 'library_escape',
  },

  {
    id: 'library_wait',
    text: `Você espera. A criatura passa pelo corredor, um floor abaixo. Você ouve explosões — ela não está interessada em biblioteca. Está destruindo. Mas esperar custou tempo. Os alunos dentro estão gritando, pedindo por resgate. Você tem escolha: ainda abrir a porta ou aceitar que não pode salvá-los.`,
    emotion: 'sorrowful',
    choices: [
      {
        text: 'Abrir a porta e evadir com os alunos',
        next: 'library_forced',
      },
      {
        text: 'Deixá-los e correr',
        next: 'library_abandon',
      },
    ],
  },

  {
    id: 'library_abandon',
    text: `Você se afasta. Os gritos continuam. "Não! Por favor!" Você coloca Nithönne (se com você) no ombro e você avança. Häita está observando. Ela sempre está. Você pode sentir seu peso — a deusa você abandonou aqueles que criou para viver.`,
    emotion: 'sorrowful',
    next: 'maya_appears_library',
  },

  {
    id: 'library_escape',
    text: `Você lidera os cincos alunos. Entre eles está Jorgenssen. Ele está sangrando do braço. Tayrone está entre eles também — aparentemente acordou e veio para cá. "Obrigado", Tayrone ofega. "Pensávamos que estávamos mortos." Você continua correndo. Você ouve a criatura vindo. Maya aparece — ela os guia para uma rota alternativa.`,
    emotion: 'determined',
    next: 'maya_appears_library',
  },

  {
    id: 'maya_appears_east',
    text: `A criatura está a três metros. Você continua falando. E então Häita se move através de você — ou através de Maya, que estava o tempo todo aqui. Ela está de pé entre você e a criatura. Seus olhos brilham dourado. Vermelho. Branco. A criatura para. Entende. Recua. "Ela está aqui agora", Maya diz com a voz dela e também não com a voz dela. Duas frequências. "Você pode escolher sua morte agora, ou me deixar escolher a minha."`,
    emotion: 'calm',
    speaker: 'Maya',
    next: 'maya_sacrifice_offer',
  },

  {
    id: 'maya_appears_library',
    text: `Maya aparece. Sua pele está brilhando — literalmente. Häita está nela. "Aqui", ela diz, apontando para uma rota de fuga nos dutos de ventilação. Você a vê tocando sua têmpora. Dor. Pura dor. "Vão. Agora. Enquanto ela ainda me permite."`,
    emotion: 'urgent',
    speaker: 'Maya',
    next: 'sanctuary_run',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATO IV — O SACRIFÍCIO
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'maya_sacrifice_offer',
    text: `Maya está respirando difícil. "Meu poder pode selá-la dentro. A ponte entre os mundos. Mas vai me custar." Ela olha para você. "Pode me custar minha mente. Minha vida. Tudo que sou." Pausa. "Ou você pode recusar. Podemos correr juntos."`,
    emotion: 'conflicted',
    speaker: 'Maya',
    choices: [
      {
        text: 'Deixar Maya tentar o ritual de selagem',
        next: 'maya_ritual_attempt',
        flag: 'used_maya_gift',
      },
      {
        text: 'Recusar — procurar outra solução ou correr',
        next: 'refuse_maya_sacrifice',
      },
      {
        text: 'Perguntar o custo exato antes de deixá-la tentar',
        next: 'ask_cost',
      },
    ],
  },

  {
    id: 'ask_cost',
    text: `"Qual é o custo, exatamente?" Maya pisca. "Verdade, então. Eu sou Elo número 1. Häita me escolheu primeiro. A ponte entre mundos passa por mim. Se eu a fecho..." ela coloca a mão no peito. "Ela fecha através de mim. Significa que eu viro... a fechadura. Consciente. Mas presa. Até que alguém a abra de novo."`,
    emotion: 'sorrowful',
    speaker: 'Maya',
    next: 'maya_ritual_attempt',
  },

  {
    id: 'maya_ritual_attempt',
    text: `"Faça isto", você diz. Maya fecha os olhos. Sua pele começa a brilhar. O ar ao redor dela ondula. Você sente — literalmente sente — a ponte dos eventos começando a fechar. A criatura grita. Não um som de raiva. Um som de dor. De ser expulsa. De compreender que foi rejeitada.`,
    emotion: 'calm',
    next: 'post_ritual_fallout',
  },

  {
    id: 'refuse_maya_sacrifice',
    text: `"Não. Encontramos outra forma." Mas não há outra forma. Você corre com Maya. A criatura segue. Roger o orienta por intermitentes. "Sistema de contenção secundário está falhando. Você precisa chegar ao santuário em dois minutos." Vocês correm.`,
    emotion: 'urgent',
    next: 'sanctuary_run',
  },

  {
    id: 'post_ritual_fallout',
    text: `Maya cai. Seu corpo está brilhando dourado — literalmente ouro agora, sua pele se transformando em algo que não é mais exatamente carne. "Feito", ela murmura. "Agora... sele você. Você e os outros." Você está olhando para o que costumava ser sua amiga se tornar um artefato. Uma fechadura viva.`,
    emotion: 'sorrowful',
    next: 'final_choice_sacrifice',
  },

  {
    id: 'sanctuary_run',
    text: `O santuário — a sala segura subterrânea — está a trezentos metros. Vocês correm. Atrás, a criatura está próxima. Roger grita: "Setenta e cinco segundos! Portão se fecha!" Mais perto. Mais próximo. Você consegue sentir a criatura cuspindo ar quente em seu pescoço.`,
    emotion: 'urgent',
    next: 'sanctuary_decision_final',
  },

  {
    id: 'sanctuary_decision_final',
    text: `Você está na boca do santuário. O portão está se fechando. À sua frente estão os lugares vazios. E atrás de você, a criatura está a metros. Nithönne (se com você) está aqui. Otros alunos estão aqui. Mas há um movimento que poderia distrair a criatura e garantir que o portão fecha — alguém precisa ficar para trás. Para sempre.`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Você mesmo fica — e que outras vidas',
        next: 'self_sacrifice_end',
        flag: 'sacrificed_self',
      },
      {
        text: 'Deixar Nithönne ou outro fico para trás',
        next: 'other_sacrifice_end',
      },
      {
        text: 'Tentar uma manobra para ninguém precisar ficar',
        next: 'no_sacrifice_end',
      },
    ],
  },

  {
    id: 'final_choice_sacrifice',
    text: `Você está diante de Maya, mas ela não é mais exatamente Maya. Ela é a fechadura vivente entre os mundos. "Alguém precisa vigiar a porta", ela diz com sua voz e vozes muito maiores. "Você vai?"`,
    emotion: 'conflicted',
    choices: [
      {
        text: 'Ficar com Maya como guardião',
        next: 'self_sacrifice_end',
        flag: 'sacrificed_self',
      },
      {
        text: 'Correr — deixar Maya sozinha',
        next: 'escape_sanctuary',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FINAIS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'self_sacrifice_end',
    text: `Você fica. A porta fecha com você dentro da escuridão. Você sente Häita próxima. Não é conforto. É presença. Ela sussurra, e você entende — em cada morte, em cada sacrifício, ela estava lá, em cada pulmada dos pulmões que pararam de respirar, em cada batida do coração que deixou de bater.

Você morreu. Mas não sozinho. Nunca sozinho.

A verdade é que ninguém escapa de Häita vivo. Apenas menos morto do que poderia ter sido.`,
    emotion: 'sorrowful',
    ending: 'fall',
  },

  {
    id: 'other_sacrifice_end',
    text: `Nithönne vê tudo acontecer. "Eu fico", ele diz. Sem hesitação. Sem dramatização. Ele apenas... fica. E você escapa. Seu peso moral é exatamente isso — você vive porque deixou alguém morrer por você.

Dentro do santuário, você ouve a criatura gritando quando o portão a sela. Nithönne se foi. Mas você está vivo.

Que tipo de morte é isso?`,
    emotion: 'sorrowful',
    ending: 'survive',
  },

  {
    id: 'escape_sanctuary',
    text: `Você corre para o santuário. Maya grita atrás. E então— o portão fecha. Você está dentro. Seguro. Sozinho excepto pelos alunos que você salvou. Roger está transmitindo: "Contenção alcançada. Todos estão vivos."

Mas você deixou Maya lá fora. Sozinha com Häita. A fechadura, ainda vivendo, ainda consciente, ainda esperando.

Que tipo de sobrevivência é essa?`,
    emotion: 'sorrowful',
    ending: 'survive',
  },

  {
    id: 'no_sacrifice_end',
    text: `Você tem um último truque. Você pega a arma de Nithönne e você a joga para o lado oposto do corredor. Barulho. Distração. A criatura se vira, e naquele milissegundo de confusão, você empurra os últimos alunos para dentro do santuário e você segue.

Mas você sente — Häita está aqui. Não está furiosa. Está surpresa. Você não sacrificou nada. Você apenas... venceu.

Dentro do santuário você respira. Ao seu lado, Ella coloca a mão no seu ombro. "Você fez bem."

E você sabe que os próximos enigmas apenas começaram.`,
    emotion: 'calm',
    ending: 'transcend',
  },
];
