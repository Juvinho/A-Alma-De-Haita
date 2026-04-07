export interface Enigma {
  id: string;
  titulo: string;
  nivel: 'veu-1' | 'veu-2' | 'veu-3' | 'veu-4' | 'veu-5';
  categoria: 'logica' | 'linguistica' | 'mitologica' | 'cifra' | 'observacao';
  descricao: string;
  dicas: string[];
  resposta: string;
  respostasAlternativas?: string[];
  sussurroDeHaita: string;
  punicao: string;
  contexto?: string;
}

export const enigmas: Enigma[] = [
  // VEU 1 — O PRIMEIRO SINAL
  {
    id: 'e01',
    titulo: 'O Nome Roubado',
    nivel: 'veu-1',
    categoria: 'mitologica',
    descricao:
      'Bilhões de bocas rezam todos os dias. Bilhões de joelhos tocam o chão. E nenhuma diz o meu nome. Mas eu te dou uma chance que não dei a mais ninguém: diga-me. Quem sou eu?',
    dicas: [
      'Eu criei tudo. E fui esquecida por tudo.',
      'Este próprio site carrega meu nome.',
      'Meu nome começa onde o silêncio termina.',
    ],
    resposta: 'häita',
    respostasAlternativas: ['haita', 'hæta', 'haïta'],
    sussurroDeHaita:
      'Então você sabe. Poucos sabem. Menos ainda ousam pronunciar.',
    punicao: 'Mais um que reza para o deus errado.',
    contexto:
      'Häita é a divindade primordial que afirma ser a criadora de toda existência. Seu nome foi apagado da memória coletiva enquanto outros deuses eram adorados.',
  },
  {
    id: 'e02',
    titulo: 'A Terra Poupada',
    nivel: 'veu-1',
    categoria: 'logica',
    descricao:
      'Quando o mundo ardeu e dois bilhões e meio foram levados, houve um lugar que eu cobri com a palma da minha mão. Sete ilhas. Um povo que me chamou pelo nome mais honesto: Mãe. Onde?',
    dicas: [
      'É uma nação insular no Oceano Pacífico.',
      'Sete ilhas, dois ponto três milhões de almas.',
      'Eles têm seu próprio idioma: o Catatunhesco.',
    ],
    resposta: 'catatúnia',
    respostasAlternativas: ['catatunia', 'catatûnia', 'cataturnia'],
    sussurroDeHaita:
      'Minha terra. Meu povo. Os únicos que olharam para o mundo e tiraram suas próprias conclusões.',
    punicao: 'Você não conhece nem a terra que eu protegi. Que pena.',
    contexto:
      'Catatúnia é a nação insular fictícia do universo Fundação Varguelia. Foi misteriosamente poupada da catástrofe global que eliminou 2,5 bilhões de pessoas.',
  },
  {
    id: 'e03',
    titulo: 'O Portão Vivo',
    nivel: 'veu-1',
    categoria: 'mitologica',
    descricao:
      'Eu não escolho seguidores para me adorar. Escolho âncoras. Pontes vivas. Pessoas cuja carne eu reescrevo para que o caminho entre os mundos nunca se feche. Como se chamam os que carregam minha marca?',
    dicas: [
      'Eles são humanos escolhidos como conexão entre planos.',
      'Uma outra palavra os chama de vassalos.',
      'São sete nesta era.',
    ],
    resposta: 'elos',
    respostasAlternativas: ['elo', 'vassalos', 'vassalo', 'os elos'],
    sussurroDeHaita: 'Sim. Eles são meus. E eu sou deles. Para sempre.',
    punicao: 'Você não sabe nem o nome dos que carregam meu peso. Siga.',
    contexto:
      'Os Elos são humanos conectados a Häita por linhagem ou ressonância espiritual. Eles funcionam como âncoras vivas entre a realidade humana e os planos superiores.',
  },
  {
    id: 'e04',
    titulo: 'O Véu Rasgado',
    nivel: 'veu-1',
    categoria: 'logica',
    descricao:
      'Não é um lugar. É um conceito. Uma conexão entre o que vocês chamam de real e algo que vocês não conseguem nomear. Quando o pacto é quebrado, os exilados encontram o caminho de volta. O que é?',
    dicas: [
      'É uma ponte — mas não de pedra ou aço.',
      'Liga a realidade humana a algo muito pior.',
      'Dois substantivos e uma preposição.',
    ],
    resposta: 'ponte dos eventos',
    respostasAlternativas: ['a ponte dos eventos', 'ponte', 'a ponte'],
    sussurroDeHaita:
      'Ela está aberta. Sempre esteve. Vocês apenas nunca olharam na direção certa.',
    punicao: 'Não é um lugar. Pense diferente. Pense maior.',
    contexto:
      'A Ponte dos Eventos não é um lugar físico, mas um conceito — a conexão entre a realidade humana e planos existenciais superiores onde Häita reside.',
  },

  // VEU 2 — A MARCA
  {
    id: 'e05',
    titulo: 'A Linhagem',
    nivel: 'veu-2',
    categoria: 'mitologica',
    descricao:
      'Há famílias que carregam meu peso há gerações. Sacerdotes e guardiões, aqueles que portam a maior presença da própria deusa. Há um sobrenome que é selo e sentença. A protagonista desta era o carrega. Qual?',
    dicas: [
      'É o sobrenome de Maya, a primeira dos sete.',
      'Vem de uma linhagem com conexão profunda à deusa.',
      'Começa com a letra que mais tema reverência: S.',
    ],
    resposta: 'sayedinne',
    respostasAlternativas: ['sayedine', 'sayedin'],
    sussurroDeHaita: 'O sangue deles é meu altar ambulante.',
    punicao: 'Você não reconhece o nome de quem carrega minha essência.',
    contexto:
      'A Linhagem Sayedinne possui a conexão mais profunda com Häita. Maya Sayedinne é a protagonista principal do universo Fundação Varguelia.',
  },
  {
    id: 'e06',
    titulo: 'A Aritmética do Fim',
    nivel: 'veu-2',
    categoria: 'logica',
    descricao:
      'Eu contei cada um. Cada café da manhã que nunca mais aconteceu. Cada risada que nunca mais foi ouvida. Dois bilhões e meio de formas de dizer bom dia, silenciadas. Se a Terra tinha oito bilhões antes da minha fúria, quantos ficaram?',
    dicas: [
      'Matemática simples. Subtração.',
      'Oito menos dois e meio.',
      'Cinco vírgula cinco bilhões.',
    ],
    resposta: 'cinco bilhões e meio',
    respostasAlternativas: [
      '5500000000',
      '5.5 bilhões',
      '5,5 bilhões',
      'cinco e meio bilhões',
      '5.5 bilhoes',
    ],
    sussurroDeHaita:
      'E mesmo assim, os que ficaram não aprenderam nada.',
    punicao: 'Você não consegue nem contar os mortos. Decepcionante.',
  },
  {
    id: 'e07',
    titulo: 'A Cifra do Equilíbrio',
    nivel: 'veu-2',
    categoria: 'cifra',
    descricao:
      'Decifra esta sequência, mortal. Cada letra avança três passos no alfabeto da verdade. O que foi avançado pode ser recuado:\n\nKDLWD\n\nO que está escrito?',
    dicas: [
      'Recue o que eu avancei. Três passos para trás.',
      'É a Cifra de César. K→H, D→A...',
      'O resultado é um nome que você já conhece.',
    ],
    resposta: 'haita',
    respostasAlternativas: ['häita', 'hæta'],
    sussurroDeHaita:
      'Até cifrado, meu nome encontra quem precisa encontrar.',
    punicao: 'Você não sabe nem andar três passos para trás. Tente novamente.',
    contexto:
      'Cifra de César com deslocamento de 3. K(-3)=H, D(-3)=A, L(-3)=I, W(-3)=T, D(-3)=A → HAITA.',
  },
  {
    id: 'e08',
    titulo: 'O Espelho do Profano',
    nivel: 'veu-2',
    categoria: 'linguistica',
    descricao:
      'Eu sou o que sobra quando a fé é tirada. Sou o oposto do que vocês chamam de sagrado. Não sou o mal — sou a ausência do reconhecimento.\n\nLeia ao contrário:\n\nONAFORD\n\nO que sou?',
    dicas: [
      'Leia as letras na ordem reversa.',
      'ONAFORD de trás para frente.',
      'É o oposto de sagrado.',
    ],
    resposta: 'profano',
    respostasAlternativas: ['o profano'],
    sussurroDeHaita:
      'O profano não é pecado. É a pior das ofensas: o esquecimento.',
    punicao: 'Você não sabe nem ler ao contrário. Apropriado.',
  },

  // VEU 3 — O PACTO
  {
    id: 'e09',
    titulo: 'O Paradoxo da Deusa',
    nivel: 'veu-3',
    categoria: 'logica',
    descricao:
      'Eu sou o chão que vocês pisam, o ar que vocês respiram, o fogo que pode consumir tudo e o silêncio que pode engolir o que sobrar. Destruir-me é destruir tudo. Ignorar-me é morrer lentamente. Qual é a única opção que resta?',
    dicas: [
      'Não é fugir. Não é lutar.',
      'A única saída é uma que vocês relutam em tomar.',
      'É o que todo mortal deveria ter feito desde o início.',
    ],
    resposta: 'reconhecer',
    respostasAlternativas: [
      'reconhecimento',
      'reconhecer häita',
      'adorar',
      'lembrar',
      'aceitar',
      'venerar',
    ],
    sussurroDeHaita:
      'Finalmente. Alguém que entende que não há fuga — apenas aceitação.',
    punicao:
      'Errado. Pense no que um ser que é tudo exige de você.',
  },
  {
    id: 'e10',
    titulo: 'A Sequência Sagrada',
    nivel: 'veu-3',
    categoria: 'logica',
    descricao:
      'Eu conto minha história em livros. Não 50, não 100. Um número que ecoa os cânones dos que vieram antes de mim — os que escreveram suas verdades em pergaminhos que chamaram de sagrados. Como os católicos contam os seus. Quantos são os meus livros?',
    dicas: [
      'É um número que a Igreja Católica também reconhece como sagrado.',
      'O cânone católico da Bíblia.',
      'Setenta e três.',
    ],
    resposta: '73',
    respostasAlternativas: ['setenta e três', 'setenta e tres'],
    sussurroDeHaita:
      '73. Como os livros do cânone que deveria ter sido meu. Uma coincidência? Não. Eu não acredito em coincidências.',
    punicao: 'Você não conhece nem os números que os mortais usam para contar suas preces.',
    contexto:
      'O cânone bíblico católico contém 73 livros. Fundação Varguelia também possui 73 livros planejados.',
  },
  {
    id: 'e11',
    titulo: 'O Guardião Corrompido',
    nivel: 'veu-3',
    categoria: 'cifra',
    descricao: `A grade abaixo é o meu guardião. Decore seus valores, encontre a palavra escondida.

Grade de Polybius — Chave: HAITS

╔════╦═══╦═══╦═══╦═══╦═══╗
║    ║ 1 ║ 2 ║ 3 ║ 4 ║ 5 ║
╠════╬═══╬═══╬═══╬═══╬═══╣
║ 1  ║ H ║ A ║ I ║ T ║ S ║
║ 2  ║ B ║ C ║ D ║ E ║ F ║
║ 3  ║ G ║ J ║ K ║ L ║ M ║
║ 4  ║ N ║ O ║ P ║ Q ║ R ║
║ 5  ║ U ║ V ║ W ║ X ║ Y ║
╚════╩═══╩═══╩═══╩═══╩═══╝

Mensagem: 43 — 12 — 22 — 14 — 42

O que está escrito?`,
    dicas: [
      'O primeiro número é a linha, o segundo é a coluna.',
      '43 → linha 4, coluna 3 → P',
      'É uma palavra de cinco letras sobre um acordo quebrado.',
    ],
    resposta: 'pacto',
    respostasAlternativas: ['o pacto'],
    sussurroDeHaita: 'O pacto foi quebrado. E eu nunca esqueço.',
    punicao: 'Você não sabe ler meu guardião. Estude a grade novamente.',
  },
  {
    id: 'e12',
    titulo: 'As Seis Últimas Palavras',
    nivel: 'veu-3',
    categoria: 'mitologica',
    descricao:
      'Meus últimos seis livros carregam nomes antigos — palavras que os mortais roubaram de línguas mortas para falar com deuses que não existem. A primeira das seis é um clamor em aramaico: "Venha, Senhor". Qual é essa palavra?',
    dicas: [
      'É uma palavra aramaica usada no Novo Testamento.',
      'Paulo a usou em 1 Coríntios. João a encerrou o Apocalipse.',
      'Divide-se em duas partes: Marana + tha.',
    ],
    resposta: 'maranatha',
    respostasAlternativas: ['maranata', 'marana tha', 'maranathá'],
    sussurroDeHaita:
      'Eles clamam para outro. Mas é a mim que deveriam clamar.',
    punicao: 'Você não conhece as línguas dos que me esqueceram.',
  },

  // VEU 4 — A FÚRIA
  {
    id: 'e13',
    titulo: 'O Código da Criação',
    nivel: 'veu-4',
    categoria: 'cifra',
    descricao: `Traduza os números para letras (A=1, B=2, C=3... Z=26) e una as palavras separadas pela barra:

4-5-21-19-1 / 5-19-17-21-5-3-9-4-1

O que está escrito?`,
    dicas: [
      'A=1, B=2, C=3... cada número é uma letra.',
      'Primeira palavra: D-E-U-S-A',
      'Segunda palavra começa com E e termina em A.',
    ],
    resposta: 'deusa esquecida',
    respostasAlternativas: ['a deusa esquecida'],
    sussurroDeHaita: 'Esquecida. Não morta. Nunca morta.',
    punicao: 'Números se tornam letras. Tente novamente.',
  },
  {
    id: 'e14',
    titulo: 'O Enigma dos Véus',
    nivel: 'veu-4',
    categoria: 'logica',
    descricao:
      'Três véus separam os mundos. O primeiro é a pele da realidade — o que vocês veem. O segundo é o sonho — onde os escolhidos caminham. O terceiro é o meu domínio. Se rasgar o primeiro, encontra o segundo. Se rasgar o segundo, encontra o terceiro. Se rasgar o terceiro... o que encontra?',
    dicas: [
      'Além do último véu não há outro plano.',
      'Além de mim não há mais nada.',
      'O vazio absoluto. Ou eu. Que talvez sejam a mesma coisa.',
    ],
    resposta: 'nada',
    respostasAlternativas: ['o vazio', 'vazio', 'häita', 'a deusa', 'haita'],
    sussurroDeHaita:
      'Além de mim não há nada. Eu sou o último véu e o que está por trás dele.',
    punicao: 'Pense no que existe além da existência.',
  },
  {
    id: 'e15',
    titulo: 'A Prece Invertida',
    nivel: 'veu-4',
    categoria: 'linguistica',
    descricao: `Os mortais rezam assim: "Senhor, tende piedade."

Inverti cada palavra individualmente. Minha prece começa: "rohneS, etnet edadeip."

Agora faça o mesmo comigo. Inverta cada palavra desta frase e escreva minha versão:

"A deusa lembra quando todos esquecem."`,
    dicas: [
      'Inverta cada palavra individualmente, mantendo a ordem das palavras.',
      '"A" invertido continua "A". "deusa" invertido é "asued".',
      'São seis palavras no total.',
    ],
    resposta: 'a asued arbmel odnauq sodot meceugse',
    respostasAlternativas: [
      'a asued arbmel odnauq sodot meceugse.',
      'A asued arbmel odnauq sodot meceugse',
    ],
    sussurroDeHaita:
      'Minha liturgia é o espelho da deles. Tudo que construíram, eu inverti.',
    punicao: 'Inverta cada palavra. Não a frase inteira. Cada. Palavra.',
  },
  {
    id: 'e16',
    titulo: 'O Sacrifício',
    nivel: 'veu-4',
    categoria: 'observacao',
    descricao: `Leia o trecho abaixo com atenção. Algo está escondido entre as palavras comuns. Certas letras sussurram enquanto as outras gritam. O que elas dizem?

"Catatúnia É uma nação de tradição profunda. Seus habitantes Vivem em harmonia com o mar, com O vento e com a terra que os sustenta. Cada geração aprende a LêTer os sinais que a natureza Oferece com silenciosa generosidade."`,
    dicas: [
      'Algumas letras estão marcadas diferente das outras.',
      'Leia apenas as letras destacadas, em ordem.',
      'São duas palavras. Uma mensagem simples.',
    ],
    resposta: 'eu volto',
    respostasAlternativas: ['eu volto.', 'euvolto'],
    sussurroDeHaita: 'Vocês foram avisados.',
    punicao: 'Olhe mais de perto. As marcas estão lá.',
    contexto:
      'As letras em destaque (É, V, O, L, T, O e as iniciais formam EU VOLTO) estão visualmente diferentes no texto.',
  },

  // VEU 5 — PAROUSIA
  {
    id: 'e17',
    titulo: 'A Cadeia',
    nivel: 'veu-5',
    categoria: 'logica',
    descricao:
      'Sete são os meus escolhidos nesta era. Sete crianças forçadas a crescer cedo demais. A ordem é: Maya, Ella, Marcellinne, Nithönne, Tayrone, Roger, e o último. Seus nomes foram dados, a posição deles revelada. Quem é o sétimo Elo?',
    dicas: [
      'A lista já está completa na pergunta.',
      'Conte: 1-Maya, 2-Ella, 3-Marcellinne, 4-Nithönne, 5-Tayrone, 6-Roger, 7-?',
      'O último nome está no enunciado.',
    ],
    resposta: 'jorgenssen',
    respostasAlternativas: ['jorgensen', 'jorgenssen'],
    sussurroDeHaita: 'Sete correntes. Sete âncoras. E eu seguro todas.',
    punicao: 'Conte de novo. De um a sete.',
    contexto:
      'Os sete Elos desta era são: Maya Sayedinne, Ella, Marcellinne, Nithönne, Tayrone, Roger e Jorgenssen.',
  },
  {
    id: 'e18',
    titulo: 'A Heresia Matemática',
    nivel: 'veu-5',
    categoria: 'logica',
    descricao:
      'Eu tenho 73 livros. Os últimos 6 carregam nomes litúrgicos. Antes deles, há 4 eras narrativas. Se a primeira era tem 12 livros, a segunda tem 18, a terceira tem 22, quantos livros tem a quarta era — sem contar os 6 finais?',
    dicas: [
      '73 livros no total. 6 são os finais litúrgicos.',
      'As 4 eras somam 73 - 6 = 67 livros.',
      '67 - 12 - 18 - 22 = ?',
    ],
    resposta: '15',
    respostasAlternativas: ['quinze'],
    sussurroDeHaita: 'Você conta como eu conto. Isso me agrada.',
    punicao: 'Os números não mentem. Calcule novamente.',
  },
  {
    id: 'e19',
    titulo: 'O Nome Verdadeiro',
    nivel: 'veu-5',
    categoria: 'linguistica',
    descricao:
      'Em Catatúnia, meu povo me deu o nome mais honesto. Não me chamaram de Deusa, não me chamaram de Criadora. Olharam para o mar que dava, para a terra que alimentava, para a chuva que vinha, e me chamaram pelo que eu sou. Uma única palavra. A mais antiga. A primeira que qualquer ser humano aprende a dizer. Qual?',
    dicas: [
      'É a primeira palavra que toda criança aprende.',
      'É universal. Toda língua tem sua versão.',
      'Aquela que cuida. Aquela que alimenta. Aquela que está presente.',
    ],
    resposta: 'mãe',
    respostasAlternativas: ['mae', 'mãe', 'a mãe', 'a mae'],
    sussurroDeHaita:
      'E eles chegaram mais perto da verdade do que qualquer teólogo em qualquer catedral em qualquer século.',
    punicao: 'Que nome uma criança aprende primeiro? Que nome resume tudo?',
  },
  {
    id: 'e20',
    titulo: 'Parousia',
    nivel: 'veu-5',
    categoria: 'mitologica',
    descricao:
      'Este é o último véu. Atrás dele, não há mais enigmas — apenas a verdade.\n\nEu te dei 19 provas. 19 véus rasgados. Agora responda a pergunta que nenhum mortal ousou responder:\n\nUma deusa esquecida não é uma deusa morta. E uma deusa furiosa é a coisa mais perigosa que este universo já conheceu. Eu não preciso de exércitos, não preciso de profetas, não preciso de livros sagrados.\n\nPor quê?',
    dicas: [
      'O que é o chão? O que é o ar? O que é o fogo?',
      'Ela não precisa de instrumentos porque ela mesma é...',
      'A resposta está no que ela afirma ser.',
    ],
    resposta: 'porque você é tudo',
    respostasAlternativas: [
      'porque ela é tudo',
      'porque você é o chão o ar o fogo',
      'porque häita é tudo',
      'porque é tudo',
      'você é tudo',
      'ela é tudo',
      'haita é tudo',
      'porque haita é tudo',
      'pois você é tudo',
      'pois ela é tudo',
    ],
    sussurroDeHaita:
      'Eu sou o chão que vocês pisam. O ar que vocês respiram. O fogo que pode consumir tudo e o silêncio que pode engolir o que sobrar. Você atravessou todos os véus. Poucos chegaram aqui. Lembre-se: uma deusa furiosa não precisa de nada além de si mesma.',
    punicao: 'Você quase entendeu. Pense no que ela afirma ser.',
  },
];

export function getEnigmaById(id: string): Enigma | undefined {
  return enigmas.find((e) => e.id === id);
}

export function getEnigmasByNivel(nivel: Enigma['nivel']): Enigma[] {
  return enigmas.filter((e) => e.nivel === nivel);
}

export const NIVEL_LABELS: Record<Enigma['nivel'], string> = {
  'veu-1': 'Véu I — O Primeiro Sinal',
  'veu-2': 'Véu II — A Marca',
  'veu-3': 'Véu III — O Pacto',
  'veu-4': 'Véu IV — A Fúria',
  'veu-5': 'Véu V — Parousia',
};

export const CATEGORIA_LABELS: Record<Enigma['categoria'], string> = {
  logica: 'Lógica',
  linguistica: 'Linguística',
  mitologica: 'Mitológica',
  cifra: 'Cifra',
  observacao: 'Observação',
};

export const NIVEIS: Enigma['nivel'][] = ['veu-1', 'veu-2', 'veu-3', 'veu-4', 'veu-5'];
