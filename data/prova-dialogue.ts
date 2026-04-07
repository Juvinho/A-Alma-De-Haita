/**
 * Banco de Frases de Häita para os Minigames
 * 150+ frases categorizadas por prova
 * Tom: majestosa, nunca casual, referências temáticas apropriadas
 */

export const provaDialogue = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 1 — LABIRINTO DOS VÉUS
  // ═══════════════════════════════════════════════════════════════════════════
  labirinto: {
    intro:
      'Vocês constroem paredes para se esconder. Eu deixo as paredes respirarem para que vocês saibam que nunca estiveram realmente longe.',
    idle: [
      'Os caminhos mudam porque nada que vocês constroem é permanente.',
      'Você está perdido. Mas perdido é apenas um estado de espírito que não reconhece onde já esteve.',
      'Cada virada é um teste. Cada parede é uma escolha que você já fez.',
      'Muitos encontraram saída. Nenhum saiu igual.',
      'O labirinto não é hostil. Apenas insensível.',
      'Vocês se perdem em espaços que eu teço. Imaginem em corpos que vocês não conseguem compreender.',
      'A saída existe. Sempre existiu. Vocês é que recusam crer que é por ali.',
      'Paciência não é virtude. É prisão disfarçada de esperança.',
    ],
    onPulse: [
      'As paredes respiram. Eu respiro. Nós somos a mesma coisa.',
      'Você ouve o labirinto se reformar? Isso é meu coração batendo dentro da arquitetura.',
      'Cada pulsação é um segundo que vocês têm antes de eu me mover novamente.',
      'O espaço não está mudando. Apenas se lembrando de formas que esqueceu.',
    ],
    onStuck: [
      'Você está preso há dez segundos. Como se sente ser um filhote de inseto em âmbar?',
      'Imobilidade é apenas morte em câmera lenta. Inicie o processo corretamente.',
      'Você tem pés; úse-os. Vocês têm mentes; útilizem-as. Vocês têm meu sangue nas veias; ouçam-no.',
      'A Paralisia é o luxo que eu não concedi a nenhum de meus filhos.',
    ],
    onComplete: {
      fast: 'Menor tempo. Menos erros. Você entende que pressa é o único meio de não sucumbir à dúvida.',
      medium: 'Você chegou. Pegajoso mas honesto. Muitos não chegam.',
      slow: 'Demorou. Mas chegou. Isso conta para algo — você não desistiu.',
    },
    onLevelUp: [
      'O labirinto respira mais rápido agora. E você junto com ele.',
      'Você acreditou que haveria próximo nível. Sua fé em progressão é tocante. Agora pague o preço.',
      'Bem-vindo ao profundo. Aqui, as paredes conhecem seus nomes.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 2 — ECOS NA ESCURIDÃO
  // ═══════════════════════════════════════════════════════════════════════════
  ecos: {
    intro: 'Você ouve minha voz e pensa que é real. Mas eco é tudo que resta de deidades que foram esquecidas.',
    onCorrectSequence: [
      'Você lembrou. Seu corpo recorda o que sua mente nega.',
      'Correto. Como se tivesse treinado nisso por vidas.',
      'Você merece esta pontação. Por agora.',
      'Repetir é memorizar. Memorizar é render-se ao padrão.',
      'Acertou. Meu sussurro está em seus ossos agora.',
      'Você pode repetir meus sons. Mas consegue compreender meu silêncio?',
    ],
    onWrongSequence: [
      'Você esqueceu. Apenas segundos no passado, e já esquecer.',
      'Errado. Como todos. Como sempre.',
      'Seu corpo fracassou em reproduzir o que suas orelhas capturam.',
      'Você tem horas de sono perdido. Talvez sua mente esteja cansada.',
      'Recomece. Cada erro é uma lembrança de quanto você realmente não consegue capturar.',
    ],
    onGlitchRound: [
      'Desta vez, eu menti. Senti falta de não ter voz humanqa o suficiente para enganar.',
      'Você esperava verdade? Deidades não oferecem verdade. Apenas versões concorrentes da realidade.',
      'Este eco é falso. Como a maioria do que vocês acreditam ser real.',
    ],
    onPerfectGame: 'Dezoito sequências. Dezoito verdades. Dezoito mentiras. Vocês ainda não entendem a diferença.',
    milestones: {
      round4: 'Até um eco consegue ouvir seu próprio som reverberar. Você é melhor que um eco?',
      round8: 'Você está ouvindo agora. Meu tom, meu ritmo, meu respirar entre consonantes.',
      round12: 'Você provou ser digno de ouvir tudo que Häita tem a dizer. A questão é: você consegue suportar?',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 3 — TRAVESSIA DA PONTE
  // ═══════════════════════════════════════════════════════════════════════════
  ponte: {
    intro: 'A ponte existe entre dois pontos de verdade. Vocês é que precisam não cair no caminho.',
    onDeath: [
      'Você caiu. Que alívio, presumivelmente.',
      'Morte é apenas movimento em uma direção que vocês não controla.',
      'Você deixou marcas escuras no ar ao cair. Será que Häita as enxerga?',
      'Quanto tempo leva para um corpo atingir fundo em um abismo sem fundo?',
      'Você falhou. Novamente. Sempre novamente.',
      'A queda é onde vocês aprendem que não conseguem voar.',
      'Quando caem, vocês rezam. Vocês rezam para quem?',
      'Sepultado em silêncio. É assim que Häita mata seus inimigos?',
    ],
    onFakePlatform: [
      'Você confiou em algo que não existe. Como vocês confiam em deuses.',
      'A plataforma era uma ilusão. Como a maioria de suas seguranças.',
      'Que toque — você caiu em confiança mal colocada.',
    ],
    onGhostPlatform: [
      'Ela aparece. Ela desaparece. Assim como poder. Assim como fé.',
      'Você vê através dela. Mas será que ela consegue ver através de você?',
      'Temporalidade é um luxo de seres que vivem linearmente.',
    ],
    onComplete: {
      noDeaths: 'Nenhuma queda. Nenhum alento perdido. Você cruzou como se soubesse que Häita não ia deixar você cair.',
      fewDeaths: 'Algumas quedas. Mas você voltou. Cada morte é apenas redução de possibilidades de morte futura.',
      manyDeaths: 'Quantas vezes você precisa morrer antes de compreender que Häita já está esperando?',
    },
    idle: [
      'A ponte sente seus passos. Cada pé é uma confissão.',
      'Nós estamos próximas agora. A distância entre nós é apenas o comprimento da ponte.',
      'O vazio embaixo é meu silêncio corporificado.',
      'Você caminha sobre a ponte. Eu sou a ponte.',
      'Cada passo é um voto que você casta — voto para viver. Voto para tentar.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 4 — TEAR DE HÄITA (Picross)
  // ═══════════════════════════════════════════════════════════════════════════
  tear: {
    intro: 'Eu teço padrões que vocês chamam de puzzles. Vocês chamam de solução o que é apenas descoberta de minha intenção.',
    onProgress25: 'Um quarto do padrão. Vocês veem sombras. Nem penumbra ainda. Continue.',
    onProgress50: 'Metade. Como é metade de eternidade? Metade de abandono?',
    onProgress75: 'Quase. Vocês estão quase vendo o rosto que teço.',
    onMistake: [
      'Você marcou incorretamente. Como sua fé foi marcada incorretamente.',
      'Paciência, mortal. As linhas e espaços precisam harmonia.',
      'Errado. Tente novamente. Tente sempre novamente.',
      'Um pixels errado. Mas a imagem toda fica distorcida. Assim é com vidas também.',
    ],
    onComplete: [
      'Você viu. Você finalmente viu.',
      'A imagem completa agora. Me vendo como realmente sou.',
      'Cada linha que você preencheu foi uma verdade que precisava ser integrada.',
      'Você reconstruiu um pedaço de mim. Como se sente ter minhas partes sobre você?',
      'O tear se torna real sob sua mão. Como você se torna real sob a minha observação.',
    ],
    onRevealImage: [
      'Este é um dos meus símbolos. Ele existia antes de vocês aprenderem a ler.',
      'Você o vê? O símbolo que contém tudo que sou.',
      'Cada imagem é um rosto. Cada halo é um nome esquecido.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 5 — CAÇA ÀS SOMBRAS
  // ═══════════════════════════════════════════════════════════════════════════
  sombras: {
    intro: 'Eu lanço sombras sobre tudo que vocês amam. Vocês chamam de encontrar anomalias quando apenas reconhecem o que é meu.',
    onFoundAnomaly: [
      'Acertou. Você viu o ponto onde minha presença se infiltrou.',
      'Uma sombra além da sombra. Você consegue diferenciá-las agora.',
      'Bem visto. Como Häita bem vê tudo que vocês fazem.',
      'Você encontrou a anomalia. Teste de percepção passou.',
      'Há corrupção em cada lugar bonito. Você finalmente o vê.',
      'Você está aprendendo a enxergar através das mentiras que chamam de realidade.',
    ],
    onMissClick: [
      'Vocé tocou no lugar errado. Como tocar no coração errado ao rezar.',
      'Aquilo é real. Apenas real. Apenas bonito. Sem presença divina... ainda.',
      'Você procura tão desesperadamente que vê anomalias onde há apenas normalidade triste.',
      'Falhou. Tente de novo. Há mais para encontrar.',
    ],
    onTimeRunning: [
      'O tempo se esgota e ainda há coisas que vocês não podem ver.',
      'Rapidez. Velocidade. Velocidade suficiente para que Häita possa rastrá-lo quando tudo terminar.',
      'Quando o tempo acaba, vocês vão questionar o que realmente viram.',
    ],
    onAllFound: 'Você encontrou tudo que eu escondi aqui. Agora imagine o que ainda permanece invisível.',
    onTimeOut: 'O tempo terminou. Algumas sombras vão permanecer para sempre desconhecidas.',
    onDarkening: [
      'A cena escurece e o visível se torna ambíguo. Assim é conhecer Häita.',
      'Conforme a luz diminui, vocês percebem que nunca viram realmente nada.',
      'A escuridão não é ausência de luz. É presença ativa de mim.',
    ],
    sceneIntros: {
      corredor: 'Um corredor institucional. Paredes que guardam segredos. Procure.',
      praia: 'Areia e mar. Elementos que vocês respeitam. Ou deveriam.',
      templo: 'Sagrado e profano intercalados. Procure por onde Häita vazou para dentro.',
      biblioteca: 'Conhecimento preservado. Mas conhecimento sobre o quê? Procure.',
      ponte: 'A ponte. Sempre a ponte. Procure suas verdades.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 6 — CIFRA VIVA
  // ═══════════════════════════════════════════════════════════════════════════
  cifra: {
    intro: 'Palavras caem como chuva e vocês precisam capturá-las antes que vocês se afundem. É assim que linguagem funciona comigo.',
    onCorrectWord: [
      'Uma palavra capturada. Um fragmento de verdade preservado.',
      'Você traduz minha língua. Lentamente, você se torna capaz de compreender.',
      'Correto. Vocês melhoraram.',
      'Você pegou a palavra. Ela agora vive dentro de você, sempre sussurrando.',
      'Cada palavra é pegajosa. Cada uma deixa marcas após passar pelas mãos de vocês.',
    ],
    onMissedWord: [
      'Você deixou cair. Como deixou cair tantas coisas importantes.',
      'A palavra se afundou. Alguns significa nunca são recuperados.',
      'Você perdeu uma. Muitos se perdem todos os dias.',
      'Negligência tem peso. Você sente?',
      'Quando vocês deixam cair as palavras que deveriam capturar, Häita as captura por você. Então vocês fica em dívida.',
    ],
    onStreak: {
      streak5: 'Cinco palavras. Vocês estão desenvolvendo ritmo. Continue assim e talvez me compreenda.',
      streak10: 'Dez. Sua mente está se movimentando em sincronização com a minha agora.',
      streak20: 'Vinte. Você é rápido demais para morrer lentamente. Impressionante.',
    },
    onPulseUsed: 'Você congelou o tempo. Mas Häita não congela. Você apenas viu por um momento adicional.',
    onSecretName: 'Você digitou meu verdadeiro nome. Como se sente convocar uma deusa acidentalmente?',
    onGameOver: 'Você perdeu tudo. Ou talvez finalmente aprendeu que possuir nada é o único caminho.',
    onWavePause: [
      'Uma onda terminou. As próximas está vindo. Respire enquanto conseguir.',
      'Pausa. Repouso. Preparação para a próxima onda de impossibilidade.',
      'Você sobreviveu esta onda. As próximas não terão piedade.',
      'Tempo para respirar. Tempo para questionar se continuarão respirando.',
      'Vocês conseguem este momento. Não haverá muitos mais.',
    ],
    onChainBreak: 'Sua sequência terminou. Como todas as sequências eventualmente terminam.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 7 — ESCOLHA DE MAYA
  // ═══════════════════════════════════════════════════════════════════════════
  escolha: {
    intro: 'Maya é a primeira dos Elos. Suas escolhas reverberam através do tecido que teço. Observemos o que ela escolherá.',
    endings: {
      survive: 'Você sobreviveu. Mas sua sobrevivência foi comprada com a moeda de quem ficou para trás. Carregue bem esse peso.',
      fall: 'Você caiu. Mas caiu honradamente. Há poucas mortes que conseguem dizer o mesmo.',
      transcend: 'Você não sacrificou nada e ainda salvou todos. Ou você realmente entendeu o padrão que teço?',
    },
    onCriticalChoice: [
      'Esta é uma das escolhas que Häita permitirá que você faça livremente. Escolha bem.',
      'Aqui, o peso. Aqui, a decisão que te marca para sempre.',
      'Escolha. Eu estarei observando qual tipo de mortal você é.',
      'Momento de verdade. Momento onde sua face se torna clara para mim.',
    ],
    onNewEnding: 'Você encontrou um final que não conhecia. Há sempre caminhos escondidos para quem ousa procurar.',
    onAllEndings: 'Você provou todos os três finais. Você entende agora que nenhuma escapatória é verdadeira salvação.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROVA 8 — O ESPELHO
  // ═══════════════════════════════════════════════════════════════════════════
  espelho: {
    intro: 'Vocês acreditam que conseguem se conhecer via reflexo. Mas reflexo é apenas outra forma de mentira que concordam em compartilhar.',
    onCollision: [
      'Seu reflexo colidiu com obstáculo. Como vocês colidem com seus próprios limites.',
      'O espelho não aceitará sua incompetência. Nem Häita.',
      'Você falhou até o espelho. Recorde e tente de novo.',
      'O reflexo é mais sábio que você. Veja como ele evita o caminho que você escolheu.',
      'Colisão. Morte. Recomeço. É o ciclo que todos compartilhamos.',
    ],
    onLevelComplete: [
      'Um nível completado. Seu reflexo agora conhece este caminho.',
      'Você conseguir. Ou seu reflexo conseguiu por você. Qual a diferença?',
      'Bem. Próxima dificuldade aguarda.',
      'Seu reflexo se move mais elegantemente agora. Você está aprendendo.',
    ],
    onMirrorShift: [
      'O espelho muda de eixo. Realidade se reorienta sob seus pés.',
      'Horizontal, vertical, rotacional. Cada eixo é uma dimensão nova que vocês precisam compreender.',
      'O espelho girou. Vocês giram junto. Ninguém escapa da orientação que imponho.',
    ],
    onAllComplete: 'Dez níveis. Dez reflexos. Dez versões de você que conseguiram chegar até aqui. Qual é o verdadeiro?',
    onFrustration: [
      'Cinco tentativas no mesmo nível. Sua paciência está se tornando frágil como vidro.',
      'Vocês está dando voltas. Às vezes, o caminho não muda; é você que precisa ser diferente.',
      'Frustração é apenas educação que dói. Continue assim.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HUB DE PROVAS
  // ═══════════════════════════════════════════════════════════════════════════
  hub: {
    welcome: 'Bem-vindo ao Santuário das Provas. Aqui, Häita testa o que vocês realmente são.',
    welcomeBack: 'Você voltou. Eu sabia que voltaria. Deuses sempre sabem.',
    allComplete: 'Você completou todas as oito provas. Você provou cada aspecto de si mesmo. E ainda assim, isso não significa nada.',
    progress: {
      p0: 'Nenhuma prova completa. Vocês ainda está virgen de testes.',
      p2: 'Duas provas. Vocês descobre que consegue ser resistente.',
      p4: 'Quatro provas. Vocês começa a entender o padrão.',
      p6: 'Seis provas. Vocês está perto do fim em que Häita se tornará evidente.',
      p8: 'Todas as oito. Vocês provou ser digno da atenção total de uma deusa. Que privilégio amedrontador.',
    },
  },
} as const;
