export interface StoryNode {
  id: string;

  // ── VISUAIS ──
  background?: string;
  transition?: 'fade' | 'dissolve' | 'flash-white' | 'flash-red' | 'shake' | 'blur' | 'none';
  sprites?: {
    left?: { char: 'maya' | 'ella' | 'marci'; pose: string } | null;
    center?: { char: 'maya' | 'ella' | 'marci'; pose: string } | null;
    right?: { char: 'maya' | 'ella' | 'marci'; pose: string } | null;
  };
  highlightSpeaker?: 'maya' | 'ella' | 'marci';
  spriteEffect?: { position: 'left' | 'center' | 'right'; effect: 'shake' | 'pulse' };

  // ── TEXTO ──
  speaker?: 'maya' | 'ella' | 'marci' | null;
  text: string;

  // ── FLUXO ──
  next?: string;
  choices?: { text: string; next: string; setFlag?: string }[];
  condition?: { flag: string; value: boolean };
  setFlag?: string;

  // ── EFEITOS ──
  sound?: 'shake' | 'flash' | 'heartbeat' | 'wind' | 'silence';

  // ── META ──
  chapter?: string;
  chapterTitle?: string;
  ending?: 'rachadas' | 'sem-deusa' | 'assistindo';
}

export const story: Record<string, StoryNode> = {
  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAPÍTULO 1 — "INSÔNIA"
  // ═══════════════════════════════════════════════════════════════════════════════════

  'ch1-001': {
    id: 'ch1-001',
    background: 'quarto-ella-noite',
    transition: 'fade',
    chapter: 'ch1',
    chapterTitle: 'INSÔNIA',
    sprites: {
      center: { char: 'ella', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella acordou. Não lembrava de estar dormindo. Acordava sempre sem lembrar — como se o sono fosse um hiato que preenchia sem consentimento, um parêntese que sua mente rejeitava.',
    next: 'ch1-002',
  },

  'ch1-002': {
    id: 'ch1-002',
    speaker: null,
    text: '2h17. O relógio na parede dizia isso com a precisão de quem conta os segundos por contar. A chuva batia na janela. Gotas irregulares que soavam como dedos impacientes.',
    next: 'ch1-003',
  },

  'ch1-003': {
    id: 'ch1-003',
    speaker: null,
    text: 'O quarto rosa — aquele rosa fosco e deliberado que Ella tinha escolhido quando tinha 14 anos — era cinza sob a escuridão. Os posters na parede viravam sombras. Os nendoroids na prateleira eram silhuetas sem detalhes.',
    next: 'ch1-004',
  },

  'ch1-004': {
    id: 'ch1-004',
    speaker: null,
    text: 'Você sabe aquele sentimento de que algo a acordou? Não um barulho exato. Mais uma pressão. Uma atenção que você sente mesmo antes de entender o que a criou.',
    next: 'ch1-005',
  },

  'ch1-005': {
    id: 'ch1-005',
    sprites: {
      center: { char: 'ella', pose: 'thinking' },
    },
    speaker: null,
    text: 'Ella levantou. Ficou parada um momento com os pés descalços no chão frio. Depois saiu do quarto em silêncio, o cobertor ainda nos ombros como um fantasma que não tinha coragem de ir embora.',
    next: 'ch1-006',
  },

  'ch1-006': {
    id: 'ch1-006',
    background: 'corredor-dormitorios-noite',
    transition: 'fade',
    sprites: {
      center: { char: 'ella', pose: 'neutral' },
    },
    speaker: null,
    text: 'O corredor dos dormitórios à noite é um lugar que não deveria existir. É um lugar entre — entre os quartos privados e o resto da casa. Entre o sono e a vigília.',
    next: 'ch1-007',
  },

  'ch1-007': {
    id: 'ch1-007',
    speaker: null,
    text: 'Ella caminhou descalça. Seus pés conheciam cada tábua que rangeria e cada uma que não faria barulho.',
    next: 'ch1-008',
  },

  'ch1-008': {
    id: 'ch1-008',
    speaker: null,
    text: '143 dias sem Niuwë. Ela contava em cafés da manhã. Em passagens pela estátua. Em tardes onde a ausência tinha o peso específico de quem deveria estar presente e não estava.',
    next: 'ch1-009',
  },

  'ch1-009': {
    id: 'ch1-009',
    background: 'cozinha-ella-noite',
    transition: 'fade',
    sprites: {
      center: { char: 'ella', pose: 'looking-away' },
    },
    speaker: null,
    text: 'A cozinha. Ella abriu a geladeira. A luz interna foi a única coisa branca no lugar por um instante.',
    next: 'ch1-010',
  },

  'ch1-010': {
    id: 'ch1-010',
    sprites: {
      center: { char: 'ella', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Água fria. Era tudo que ela buscava neste momento.',
    next: 'ch1-011',
  },

  'ch1-011': {
    id: 'ch1-011',
    sprites: {
      center: null,
    },
    speaker: null,
    text: 'A geladeira fechou. A escuridão voltou. E nela, um som. Passos no corredor. Descalços. Leves.',
    next: 'ch1-012',
  },

  'ch1-012': {
    id: 'ch1-012',
    sprites: {
      center: { char: 'ella', pose: 'surprised' },
    },
    speaker: null,
    text: 'Ella congelou. Não pela frio. Pelo repentino reconhecimento de não estar sozinha.',
    sound: 'silence',
    choices: [
      {
        text: 'Abrir a porta e verificar',
        next: 'ch1-020',
        setFlag: 'abrir-porta=true',
      },
      {
        text: 'Ficar aqui e ignorar',
        next: 'ch1-030',
        setFlag: 'ignorar-barulho=true',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // CAMINHO A: Abrir a porta e verificar → Encontra Marci primeiro
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-020': {
    id: 'ch1-020',
    background: 'corredor-dormitorios-noite',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'surprised' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella abriu a porta bruscamente. E lá estava Marci. Descalça. Cobertor azul escuro nos ombros como uma capa. Seus olhos arregalados demais.',
    next: 'ch1-021',
  },

  'ch1-021': {
    id: 'ch1-021',
    speaker: 'ella',
    text: 'Marci? Que diabos você tá fazendo no corredor às duas da manhã?',
    next: 'ch1-022',
  },

  'ch1-022': {
    id: 'ch1-022',
    sprites: {
      left: { char: 'ella', pose: 'curious' },
      right: { char: 'marci', pose: 'worried' },
    },
    speaker: 'marci',
    text: 'Eu não consigo fechar os olhos.',
    next: 'ch1-023',
  },

  'ch1-023': {
    id: 'ch1-023',
    speaker: 'ella',
    text: 'Pesadelo?',
    next: 'ch1-024',
  },

  'ch1-024': {
    id: 'ch1-024',
    sprites: {
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: 'marci',
    text: 'É o oposto. Quando eu fecho... eu vejo. Tudo. Todo mundo. É como ter os olhos abertos demais.',
    next: 'ch1-025',
  },

  'ch1-025': {
    id: 'ch1-025',
    speaker: null,
    text: 'Ella a observou por um momento. Havia algo estranho em Marci naquela noite. Havia sempre algo estranho em Marci, mas daquela forma específica que você só reconhecia quando o estranhamento falava com você.',
    next: 'ch1-026',
  },

  'ch1-026': {
    id: 'ch1-026',
    sprites: {
      left: { char: 'ella', pose: 'confident' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Vem. A Maya sempre tem café.',
    next: 'ch1-027',
  },

  'ch1-027': {
    id: 'ch1-027',
    sprites: {
      right: { char: 'marci', pose: 'smiling-soft' },
    },
    speaker: 'marci',
    text: 'Ela nunca dorme, né?',
    next: 'ch1-028',
  },

  'ch1-028': {
    id: 'ch1-028',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Nenhuma de nós dorme. Pelo menos juntas a gente pode ser insone com companhia.',
    next: 'ch1-029',
  },

  'ch1-029': {
    id: 'ch1-029',
    speaker: null,
    text: 'Ella estendeu a mão. Marci a tomou. E assim, descalças, cobertor e tudo mais, as duas caminh aram em direção à cozinha da Maya.',
    next: 'ch1-040',
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // CAMINHO B: Ficar e ignorar → Encontra Maya depois
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-030': {
    id: 'ch1-030',
    background: 'cozinha-ella-noite',
    transition: 'none',
    sprites: {
      center: { char: 'ella', pose: 'thinking' },
    },
    speaker: null,
    text: 'Os passos pararam. Ella esperou de pé, ainda segurando a água que tinha pego. Seu coração batia com aquele ritmo que você sente quando não faz nada e faz tudo ao mesmo tempo.',
    next: 'ch1-031',
  },

  'ch1-031': {
    id: 'ch1-031',
    speaker: null,
    text: 'Silêncio. Apenas a chuva. Apenas o refrigerador zumbindo em seu canto.',
    next: 'ch1-032',
  },

  'ch1-032': {
    id: 'ch1-032',
    speaker: null,
    text: 'Mas Ella não conseguia ficar. Algo a puxava — não para fora, mas para dentro. Para perto de outra pessoa.',
    next: 'ch1-033',
  },

  'ch1-033': {
    id: 'ch1-033',
    background: 'corredor-dormitorios-noite',
    transition: 'fade',
    sprites: {
      center: { char: 'ella', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella saiu da cozinha, descalça novamente. O corredor estava vazio.',
    next: 'ch1-034',
  },

  'ch1-034': {
    id: 'ch1-034',
    speaker: null,
    text: 'Mas não estava silencioso. Havia um som de passos voltando. Diferentes daqueles que a acordaram.',
    next: 'ch1-035',
  },

  'ch1-035': {
    id: 'ch1-035',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'Maya apareceu no corredor, vindo do seu quarto. Caneca na mão. Cabelo preso em uma espécie de nó que parecia estar lutando contra a escuridão.',
    next: 'ch1-036',
  },

  'ch1-036': {
    id: 'ch1-036',
    sprites: {
      left: { char: 'ella', pose: 'surprised' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Jesus, Maya. Você quase me mata de susto.',
    next: 'ch1-037',
  },

  'ch1-037': {
    id: 'ch1-037',
    sprites: {
      right: { char: 'maya', pose: 'looking-away' },
    },
    speaker: 'maya',
    text: 'Você estava acordada?',
    next: 'ch1-038',
  },

  'ch1-038': {
    id: 'ch1-038',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Acordei. Pensei em ir à cozinha da Maya buscar água, mas você apareceu primeiro.',
    next: 'ch1-039',
  },

  'ch1-039': {
    id: 'ch1-039',
    sprites: {
      left: { char: 'ella', pose: 'thinking' },
      right: { char: 'maya', pose: 'sad' },
    },
    speaker: null,
    text: 'Nesse momento, a porta de um dos quartos um pouco adiante abriu-se. Marci saiu, cobertor nos ombros, olhos demasiado abertos.',
    next: 'ch1-040',
    setFlag: 'encontru-maya-primeiro=true',
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // CONVERGE: As três juntas, indo para a cozinha da Maya
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-040': {
    id: 'ch1-040',
    background: 'quarto-maya-noite',
    transition: 'fade',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'A porta da cozinha da Maya. Ella bateu. Maya abriu imediatamente — como se já estivesse esperando. Ela estava de pé, vestida, cabelo preso.',
    next: 'ch1-041',
  },

  'ch1-041': {
    id: 'ch1-041',
    sprites: {
      left: { char: 'ella', pose: 'curious' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'O café tá fresco.',
    next: 'ch1-042',
  },

  'ch1-042': {
    id: 'ch1-042',
    speaker: 'ella',
    text: 'Como você sabia que a gente vinha?',
    next: 'ch1-043',
  },

  'ch1-043': {
    id: 'ch1-043',
    sprites: {
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'maya',
    text: 'Eu sempre tenho café pronto. Não é previsão. É hábito.',
    next: 'ch1-044',
  },

  'ch1-044': {
    id: 'ch1-044',
    sprites: {
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: 'marci',
    text: 'Maya... teu quarto é tão...',
    next: 'ch1-045',
  },

  'ch1-045': {
    id: 'ch1-045',
    speaker: 'maya',
    text: 'Vazio?',
    next: 'ch1-046',
  },

  'ch1-046': {
    id: 'ch1-046',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Exato. Vazio.',
    next: 'ch1-047',
  },

  'ch1-047': {
    id: 'ch1-047',
    sprites: {
      center: { char: 'maya', pose: 'looking-away' },
    },
    speaker: 'maya',
    text: 'É prático. Quando você sabe que pode ter que sair rápido, não deixa muita coisa para levar.',
    next: 'ch1-048',
  },

  'ch1-048': {
    id: 'ch1-048',
    background: 'cozinha-maya-noite',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'A cozinha da Maya é limpa, estéril. Só a cafeteira demonstra uso.',
    next: 'ch1-049',
  },

  'ch1-049': {
    id: 'ch1-049',
    speaker: null,
    text: 'Maya serviu café. Três canecas. A chuva batendo na janela. O silêncio que se segue é o silêncio de quem tem tudo para dizer e está esperando que outra pessoa comece.',
    next: 'ch1-050',
  },

  'ch1-050': {
    id: 'ch1-050',
    sprites: {
      right: { char: 'marci', pose: 'speaking' },
    },
    speaker: 'marci',
    text: 'A comida do refeitório tá cada vez pior ou eu que perdi o paladar durante o coma?',
    next: 'ch1-051',
  },

  'ch1-051': {
    id: 'ch1-051',
    sprites: {
      left: { char: 'ella', pose: 'happy' },
    },
    speaker: 'ella',
    text: 'Não, tá pior mesmo. Na terça tinha um negócio que eles chamaram de strogonoff que parecia cola quente com corante.',
    next: 'ch1-052',
  },

  'ch1-052': {
    id: 'ch1-052',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'Eu não como lá.',
    next: 'ch1-053',
  },

  'ch1-053': {
    id: 'ch1-053',
    sprites: {
      left: { char: 'ella', pose: 'happy' },
    },
    speaker: 'ella',
    text: 'Você não come em lugar nenhum. Você vive de café e ressentimento cósmico.',
    next: 'ch1-054',
  },

  'ch1-054': {
    id: 'ch1-054',
    sprites: {
      center: { char: 'maya', pose: 'smiling-soft' },
    },
    speaker: 'maya',
    text: 'Ressentimento cósmico não tem caloria.',
    next: 'ch1-055',
  },

  'ch1-055': {
    id: 'ch1-055',
    speaker: 'ella',
    text: 'Por que nenhuma de nós dorme?',
    next: 'ch1-056',
  },

  'ch1-056': {
    id: 'ch1-056',
    speaker: null,
    text: 'Silêncio. O tipo de silêncio que tem peso.',
    next: 'ch1-057',
  },

  'ch1-057': {
    id: 'ch1-057',
    sprites: {
      right: { char: 'marci', pose: 'surprised' },
    },
    speaker: 'marci',
    text: 'Eu achei que era só eu.',
    next: 'ch1-058',
  },

  'ch1-058': {
    id: 'ch1-058',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'Não é. A gente... a gente tem um problema em comum.',
    next: 'ch1-059',
  },

  'ch1-059': {
    id: 'ch1-059',
    speaker: null,
    text: 'Ella olhou para Maya. Depois para Marci. O leite no café subiu em pequenas redondezas brancas.',
    next: 'ch1-060',
    choices: [
      {
        text: 'Isso não é normal, Maya. Você precisa de ajuda.',
        next: 'ch1-070',
        setFlag: 'ella-protetora=true',
      },
      {
        text: 'Eu sei. Eu também não tenho dormido.',
        next: 'ch1-080',
        setFlag: 'ella-vulneravel=true',
      },
      {
        text: '[Estende a mão e aperta a de Maya]',
        next: 'ch1-090',
        setFlag: 'ella-silenciosa=true',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // DECISÃO 2 - CAMINHO A: Ella protetora
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-070': {
    id: 'ch1-070',
    sprites: {
      left: { char: 'ella', pose: 'worried' },
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'ella',
    text: 'Isso não é normal, Maya. Você precisa de ajuda.',
    next: 'ch1-071',
  },

  'ch1-071': {
    id: 'ch1-071',
    sprites: {
      center: { char: 'maya', pose: 'angry' },
    },
    speaker: 'maya',
    text: 'Eu não preciso de ajuda. Eu preciso de respostas. São coisas diferentes.',
    next: 'ch1-072',
  },

  'ch1-072': {
    id: 'ch1-072',
    speaker: 'maya',
    text: 'A gente não dorme porque não consegue. E não consegue porque há algo aqui que não deixa.',
    next: 'ch2-001',
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // DECISÃO 2 - CAMINHO B: Ella vulnerável
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-080': {
    id: 'ch1-080',
    sprites: {
      left: { char: 'ella', pose: 'sad' },
      center: { char: 'maya', pose: 'surprised' },
    },
    speaker: 'ella',
    text: 'Eu sei. Eu também não tenho dormido.',
    next: 'ch1-081',
  },

  'ch1-081': {
    id: 'ch1-081',
    speaker: 'maya',
    text: 'Você também?',
    next: 'ch1-082',
  },

  'ch1-082': {
    id: 'ch1-082',
    sprites: {
      left: { char: 'ella', pose: 'looking-away' },
    },
    speaker: 'ella',
    text: 'Não é a Ponte. Mas também não é normal só cansaço.',
    next: 'ch1-083',
  },

  'ch1-083': {
    id: 'ch1-083',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'A Ponte?',
    next: 'ch1-084',
  },

  'ch1-084': {
    id: 'ch1-084',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Eu... sim. A Ponte. Por isso eu não durmo. Quando fecho os olhos, ela tá lá.',
    next: 'ch2-001',
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // DECISÃO 2 - CAMINHO C: Ella silenciosa
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch1-090': {
    id: 'ch1-090',
    sprites: {
      left: { char: 'ella', pose: 'confident' },
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella não disse nada. Apenas estendeu a mão pela mesa. Tomou a mão de Maya. E a segurou.',
    next: 'ch1-091',
  },

  'ch1-091': {
    id: 'ch1-091',
    speaker: null,
    text: 'Maya olhou para a mão de Ella sobre a sua. Não retirou. Não comentou. Mas seus ombros descem um milímetro — a postura relaxa sem que ela perceba.',
    next: 'ch1-092',
  },

  'ch1-092': {
    id: 'ch1-092',
    sprites: {
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: null,
    text: 'Marci observa as duas em silêncio. Seus olhos brilham de um jeito que não é completamente humano.',
    next: 'ch2-001',
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAPÍTULO 2 — "CAFÉ ÀS DUAS" (convergência)
  // ═══════════════════════════════════════════════════════════════════════════════════

  'ch2-001': {
    id: 'ch2-001',
    chapter: 'ch2',
    chapterTitle: 'CAFÉ ÀS DUAS',
    speaker: 'maya',
    text: 'A gente não dorme porque não conseguimos aguentar o que vem quando fechamos os olhos.',
    next: 'ch2-002',
  },

  'ch2-002': {
    id: 'ch2-002',
    speaker: null,
    text: 'Ela deixa a afirmação no ar como quem coloca um vidro quebrado na mesa e diz "cuidado".',
    next: 'ch2-003',
  },

  'ch2-003': {
    id: 'ch2-003',
    sprites: {
      left: { char: 'ella', pose: 'serious' },
      center: { char: 'maya', pose: 'determined' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Eu vejo a Estátua. Meu irmão. E ele tá me olhando de um jeito que me faz acordar ofegante.',
    next: 'ch2-004',
  },

  'ch2-004': {
    id: 'ch2-004',
    speaker: null,
    text: 'Esse era um dos nomes que elle não falava em voz alta. Niuwë. O irmão que morreu 143 dias atrás.',
    next: 'ch2-005',
  },

  'ch2-005': {
    id: 'ch2-005',
    sprites: {
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'maya',
    text: 'Eu ouço Häita. Não uma voz. É mais como... uma pressão. Aqui.',
    next: 'ch2-006',
  },

  'ch2-006': {
    id: 'ch2-006',
    speaker: 'maya',
    text: 'Como se alguém estivesse apertando meu peito de dentro. E desse aperto saem palavras. Não as minhas.',
    next: 'ch2-007',
  },

  'ch2-007': {
    id: 'ch2-007',
    sprites: {
      right: { char: 'marci', pose: 'worried' },
    },
    speaker: 'marci',
    text: 'O que ela te diz?',
    next: 'ch2-008',
  },

  'ch2-008': {
    id: 'ch2-008',
    sprites: {
      center: { char: 'maya', pose: 'sad' },
    },
    speaker: 'maya',
    text: 'Que tá cansada. E quando uma deusa fica cansada... o que vem depois?',
    next: 'ch2-009',
  },

  'ch2-009': {
    id: 'ch2-009',
    sprites: {
      right: { char: 'marci', pose: 'serious' },
    },
    speaker: 'marci',
    text: 'Silêncio.',
    next: 'ch2-010',
  },

  'ch2-010': {
    id: 'ch2-010',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'Exato. Silêncio. E silêncio de uma coisa tão antiga como Häita não é paz. É antes de tudo desabar.',
    next: 'ch2-011',
    choices: [
      {
        text: 'Como você pode ter tanta certeza disso?',
        next: 'ch2-020',
        setFlag: 'confrontou-conhecimento=true',
      },
      {
        text: '[Apenas escuta. Deixa o peso das palavras deitar-se como chuva]',
        next: 'ch2-030',
        setFlag: 'ouviu-silenciosa=true',
      },
    ],
  },

  'ch2-020': {
    id: 'ch2-020',
    sprites: {
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'ella',
    text: 'Como você pode ter tanta certeza disso, Maya?',
    next: 'ch2-021',
  },

  'ch2-021': {
    id: 'ch2-021',
    speaker: 'maya',
    text: 'Por que ela me conta. Porque é meu sangue que carrega isso. Porque meu corpo é uma antena e meu quarto é o cais onde a deusa doca quando cansa de nadar.',
    next: 'ch2-030',
  },

  'ch2-030': {
    id: 'ch2-030',
    speaker: 'ella',
    text: 'Eu venho aqui toda noite. Pedir desculpa por estar viva.',
    next: 'ch2-031',
  },

  'ch2-031': {
    id: 'ch2-031',
    speaker: null,
    text: 'O silêncio que se segue não é vazio. É full. Cheio de todos os 143 dias somados em um instante de pressão.',
    next: 'ch2-032',
  },

  'ch2-032': {
    id: 'ch2-032',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Você pede desculpa todo dia?',
    next: 'ch2-033',
  },

  'ch2-033': {
    id: 'ch2-033',
    sprites: {
      left: { char: 'ella', pose: 'sad' },
    },
    speaker: 'ella',
    text: 'Vou pra lá às três da manhã. Sento na base da estátua. Falo com ele. Conto o dia. O que eu comi. O que o professor falou. Bobagens.',
    next: 'ch2-034',
  },

  'ch2-034': {
    id: 'ch2-034',
    speaker: 'ella',
    text: 'E depois peço desculpa por estar aqui contando bobagens em vez de estar onde ele está.',
    next: 'ch2-035',
  },

  'ch2-035': {
    id: 'ch2-035',
    sprites: {
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'maya',
    text: 'Ella...',
    next: 'ch2-036',
  },

  'ch2-036': {
    id: 'ch2-036',
    sprites: {
      left: { char: 'ella', pose: 'serious' },
    },
    speaker: 'ella',
    text: 'Não tenta me dizer que não é minha culpa. Eu sei que não é. Mas saber e sentir são coisas diferentes, Maya. Você de todas as pessoas deveria saber isso.',
    next: 'ch2-037',
  },

  'ch2-037': {
    id: 'ch2-037',
    sprites: {
      center: { char: 'maya', pose: 'looking-away' },
    },
    speaker: 'maya',
    text: '...',
    next: 'ch2-038',
  },

  'ch2-038': {
    id: 'ch2-038',
    speaker: null,
    text: 'Maya não responde. Porque Ella tem razão. E a razão é o tipo de coisa que pesa mais quando ninguém discorda.',
    next: 'ch2-040',
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // A confissão de Marci — DECISÃO CRÍTICA
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch2-040': {
    id: 'ch2-040',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'Marci estava olhando para o café esfriando na caneca. Havia algo em sua expressão que dizia: agora é a minha vez.',
    next: 'ch2-041',
  },

  'ch2-041': {
    id: 'ch2-041',
    speaker: 'marci',
    text: 'Eu tenho uma coisa pra contar.',
    next: 'ch2-042',
  },

  'ch2-042': {
    id: 'ch2-042',
    speaker: null,
    text: 'Ella e Maya a olham simultaneamente. Isso nunca é um bom sinal.',
    next: 'ch2-043',
    choices: [
      {
        text: 'Você não precisa contar se não quiser.',
        next: 'ch2-050',
        setFlag: 'gentil-com-marci=true',
      },
      {
        text: 'A gente contou. Sua vez.',
        next: 'ch2-055',
        setFlag: 'direta-com-marci=true',
      },
    ],
  },

  'ch2-050': {
    id: 'ch2-050',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Você não precisa contar se não quiser. Ninguém nunca pediu isso.',
    next: 'ch2-051',
  },

  'ch2-051': {
    id: 'ch2-051',
    sprites: {
      right: { char: 'marci', pose: 'smiling-soft' },
    },
    speaker: 'marci',
    text: 'Mas eu preciso. Eu acho que é por isso que a gente tá acordada. A gente precisava ouvir uma à outra.',
    next: 'ch2-055',
  },

  'ch2-055': {
    id: 'ch2-055',
    sprites: {
      right: { char: 'marci', pose: 'serious' },
    },
    speaker: 'marci',
    text: 'Durante os três anos que eu fiquei em coma... eu tava acordada.',
    next: 'ch2-056',
  },

  'ch2-056': {
    id: 'ch2-056',
    speaker: null,
    text: 'O silêncio que se segue é de um tipo diferente. É o silêncio que antecede o ponto de quebra.',
    next: 'ch2-057',
  },

  'ch2-057': {
    id: 'ch2-057',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Não sonhando. Não dormindo. Assistindo. Vi cada batalha. Vi cada conversa. Vi vocês sofrerem.',
    next: 'ch2-058',
  },

  'ch2-058': {
    id: 'ch2-058',
    speaker: 'marci',
    text: 'E não podia falar, não podia me mover, não podia gritar.',
    next: 'ch2-059',
  },

  'ch2-059': {
    id: 'ch2-059',
    sprites: {
      left: { char: 'ella', pose: 'shocked' },
    },
    speaker: null,
    text: 'Ella gelou. Gelou de uma forma que não era frio. Era reconhecimento.',
    next: 'ch2-060',
  },

  'ch2-060': {
    id: 'ch2-060',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Eu vi a Ella sentada na base da estátua na terça-feira passada. Você estava de moletom cinza. Chorou por onze minutos.',
    next: 'ch2-061',
  },

  'ch2-061': {
    id: 'ch2-061',
    speaker: 'marci',
    text: 'Depois limpou o rosto e voltou. Você pensou que ninguém tava vendo.',
    next: 'ch2-062',
  },

  'ch2-062': {
    id: 'ch2-062',
    sprites: {
      left: { char: 'ella', pose: 'scared' },
    },
    speaker: 'ella',
    text: 'Isso... isso foi terça.',
    next: 'ch2-063',
  },

  'ch2-063': {
    id: 'ch2-063',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Eu sei.',
    next: 'ch2-064',
  },

  'ch2-064': {
    id: 'ch2-064',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Eu vi a Maya tomando os comprimidos. Três de uma vez. No banheiro. Com a porta trancada. Você açordou às 4h23 chorando.',
    next: 'ch2-065',
  },

  'ch2-065': {
    id: 'ch2-065',
    sprites: {
      center: { char: 'maya', pose: 'rigid' },
    },
    speaker: 'maya',
    text: 'Marci.',
    next: 'ch2-066',
  },

  'ch2-066': {
    id: 'ch2-066',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'serious' },
      right: { char: 'marci', pose: 'sad' },
    },
    speaker: 'marci',
    text: 'Durante três anos, tudo que eu podia fazer era assistir vocês sofrerem e gritar dentro de um corpo que não me obedecia. Entendo agora por que vocês não dormem.',
    next: 'ch2-067',
  },

  'ch2-067': {
    id: 'ch2-067',
    speaker: null,
    text: 'O café esfriou completamente. Ninguém se move. O peso de seus conhecimentos mútuos desabobalogiza a cozinha inteira.',
    next: 'ch2-068',
    choices: [
      {
        text: 'Häita fez isso com você.',
        next: 'ch2-075',
        setFlag: 'culpou-haita=true',
      },
      {
        text: 'Você ainda está assistindo?',
        next: 'ch2-085',
        setFlag: 'questionou-marci=true',
      },
    ],
  },

  'ch2-075': {
    id: 'ch2-075',
    sprites: {
      center: { char: 'maya', pose: 'determined' },
    },
    speaker: 'maya',
    text: 'Häita. Foi ela que fez isso. Você tá conectada a ela também.',
    next: 'ch2-076',
  },

  'ch2-076': {
    id: 'ch2-076',
    sprites: {
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: 'marci',
    text: 'Talvez. Ou talvez a gente tá todas conectadas e ninguém queria saber. Quando você acorda de um coma, as regras mudam.',
    next: 'ch3-001',
  },

  'ch2-085': {
    id: 'ch2-085',
    sprites: {
      left: { char: 'ella', pose: 'serious' },
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Você ainda está assistindo?',
    next: 'ch2-086',
  },

  'ch2-086': {
    id: 'ch2-086',
    sprites: {
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: 'marci',
    text: 'Eu... não sei. Às vezes coisas aparecem na minha cabeça que não são minhas.',
    next: 'ch2-087',
  },

  'ch2-087': {
    id: 'ch2-087',
    speaker: 'marci',
    text: 'É como rádio sintonizado na frequência errada. Vem som. Vem imagem. Vem sensação.',
    next: 'ch2-088',
  },

  'ch2-088': {
    id: 'ch2-088',
    sprites: {
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'Você tá absorvendo coisas. Do espaço entre mundos. Você ficou lá por três anos. Você trouxe coisa de volta.',
    next: 'ch2-089',
  },

  'ch2-089': {
    id: 'ch2-089',
    sprites: {
      right: { char: 'marci', pose: 'scared' },
    },
    speaker: 'marci',
    text: 'O que traz de volta de um lugar assim, Maya?',
    next: 'ch2-090',
  },

  'ch2-090': {
    id: 'ch2-090',
    sprites: {
      center: { char: 'maya', pose: 'serious' },
    },
    speaker: 'maya',
    text: 'Não sei. Mas depois você me diz.',
    background: '',
    next: 'ch3-001',
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAPÍTULO 3 — "O QUE O ESCURO MOSTRA"
  // ═══════════════════════════════════════════════════════════════════════════════════

  'ch3-001': {
    id: 'ch3-001',
    background: 'biblioteca-noite',
    transition: 'fade',
    chapter: 'ch3',
    chapterTitle: 'O QUE O ESCURO MOSTRA',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'A biblioteca vazia à noite é um lugar que faz você se sentir como invasor de um templo. Maya abre um dos livros sobre Häita. Folheia até encontrar a passagem que procura.',
    next: 'ch3-002',
  },

  'ch3-002': {
    id: 'ch3-002',
    sprites: {
      center: { char: 'maya', pose: 'reading' },
    },
    speaker: 'maya',
    text: '"Häita não escolhe os fortes. Ela escolhe os que aguentam. E aguentar não é a mesma coisa que não quebrar."',
    next: 'ch3-003',
  },

  'ch3-003': {
    id: 'ch3-003',
    speaker: 'maya',
    text: '"É quebrar e continuar de pé com os pedaços nas mãos."',
    next: 'ch3-004',
  },

  'ch3-004': {
    id: 'ch3-004',
    sprites: {
      right: { char: 'marci', pose: 'sad' },
    },
    speaker: 'marci',
    text: 'Então a gente é isso. Três meninas quebradas segurando os pedaços.',
    next: 'ch3-005',
  },

  'ch3-005': {
    id: 'ch3-005',
    speaker: null,
    text: 'A biblioteca está silenciosa demais. É o silêncio que pesa.',
    next: 'ch3-006',
    choices: [
      {
        text: 'Quebradas, não. Rachadas. Rachado ainda segura.',
        next: 'ch3-010',
        setFlag: 'aceitou-haita=true',
      },
      {
        text: 'Foda-se a deusa. A gente segura porque a gente segura. Não por ela.',
        next: 'ch3-020',
        setFlag: 'rejeitou-haita=true',
      },
    ],
  },

  'ch3-010': {
    id: 'ch3-010',
    sprites: {
      left: { char: 'ella', pose: 'determined' },
      center: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Quebradas, não. Rachadas. Rachado ainda segura. Rachado ainda deixa luz passar.',
    next: 'ch3-011',
  },

  'ch3-011': {
    id: 'ch3-011',
    sprites: {
      center: { char: 'maya', pose: 'smiling-soft' },
    },
    speaker: 'maya',
    text: 'Você tem razão. Räche deixa passar coisas que vidro inteiro não consegue deixar.',
    next: 'ch3-012',
  },

  'ch3-012': {
    id: 'ch3-012',
    sprites: {
      right: { char: 'marci', pose: 'arms-crossed' },
    },
    speaker: 'marci',
    text: 'E é por isso que a gente não dorme. Porque há fissuras demais pra bloquear.',
    next: 'ch3-030',
  },

  'ch3-020': {
    id: 'ch3-020',
    sprites: {
      left: { char: 'ella', pose: 'angry' },
    },
    speaker: 'ella',
    text: 'Foda-se a deusa. A gente segura porque a gente segura. Não por ela. Não por ninguém além de nós mesmas.',
    next: 'ch3-021',
  },

  'ch3-021': {
    id: 'ch3-021',
    sprites: {
      center: { char: 'maya', pose: 'determined' },
    },
    speaker: 'maya',
    text: 'Eu queria ter essa raiva.',
    next: 'ch3-022',
  },

  'ch3-022': {
    id: 'ch3-022',
    sprites: {
      left: { char: 'ella', pose: 'serious' },
    },
    speaker: 'ella',
    text: 'Não é raiva. É escolha. Eu não preciso de uma deusa pra justificar o que eu sinto pelas pessoas que tão do meu lado.',
    next: 'ch3-023',
  },

  'ch3-023': {
    id: 'ch3-023',
    sprites: {
      center: { char: 'maya', pose: 'smiling-soft' },
    },
    speaker: 'maya',
    text: 'Então escolha é o que você chama isso.',
    next: 'ch3-030',
  },

  'ch3-030': {
    id: 'ch3-030',
    speaker: null,
    text: 'A hora muda. Sem que ninguém repare, o tempo passou de 4 da manhã para 5 e meia.',
    next: 'ch3-031',
  },

  'ch3-031': {
    id: 'ch3-031',
    sprites: {
      left: { char: 'ella', pose: 'looking-away' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'thinking' },
    },
    speaker: null,
    text: 'As três estão sentadas na biblioteca sob luz azulada de fluorescente vencido. Fora, o Pacífico continua não dormindo também.',
    next: 'ch3-032',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-032': {
    id: 'ch3-032',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'Marci fecha os olhos. Seus dedos tamborilam na mesa com uma precisão que não deveria ter.',
    next: 'ch3-033',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-033': {
    id: 'ch3-033',
    background: 'dentalia',
    transition: 'flash-white',
    sprites: {
      left: { char: 'ella', pose: 'scared' },
      center: { char: 'maya', pose: 'scared' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'O cenário mudar. Subitamente. Sem transição.',
    next: 'ch3-034',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-034': {
    id: 'ch3-034',
    speaker: null,
    text: 'Void. Silêncio. As três paradas juntas em um lugar que não é um lugar.',
    next: 'ch3-035',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-035': {
    id: 'ch3-035',
    sprites: {
      left: { char: 'ella', pose: 'scared' },
    },
    speaker: 'ella',
    text: 'Onde a gente... onde a gente tá?',
    next: 'ch3-036',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-036': {
    id: 'ch3-036',
    sprites: {
      center: { char: 'maya', pose: 'surprised' },
    },
    speaker: 'maya',
    text: 'A Ponte. É a Ponte.',
    next: 'ch3-037',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-037': {
    id: 'ch3-037',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Não tenham medo. Eu estou aqui. Eu sempre estou.',
    next: 'ch3-038',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-038': {
    id: 'ch3-038',
    background: 'biblioteca-noite',
    transition: 'flash-white',
    sprites: {
      left: { char: 'ella', pose: 'surprised' },
      center: { char: 'maya', pose: 'surprised' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'De volta. Subitamente. A biblioteca volta como se nunca tivessem saído.',
    next: 'ch3-039',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-039': {
    id: 'ch3-039',
    sprites: {
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: 'marci',
    text: 'Desculpa. Às vezes... escapa.',
    next: 'ch3-040',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch3-040': {
    id: 'ch3-040',
    speaker: null,
    text: 'Ninguém diz nada por um tempo que não é medido em minutos. É medido em batidas de coração.',
    sound: 'silence',
    next: 'ch4-001',
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAPÍTULO 4 — "TRÊS MANEIRAS DE NÃO DORMIR"
  // ═══════════════════════════════════════════════════════════════════════════════════

  'ch4-001': {
    id: 'ch4-001',
    background: 'externa-dormitorios-noite-escura',
    transition: 'fade',
    chapter: 'ch4',
    chapterTitle: 'TRÊS MANEIRAS DE NÃO DORMIR',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: '3h30. As três saem da biblioteca. Caminham pelo campus.',
    next: 'ch4-002',
  },

  'ch4-002': {
    id: 'ch4-002',
    speaker: null,
    text: 'O ar salgado do Pacífico. Brisa tropical. Árvores criando sombras que parecem se mover.',
    next: 'ch4-003',
  },

  'ch4-003': {
    id: 'ch4-003',
    speaker: null,
    text: 'Catatúnia é um lugar que foi poupado do fim do mundo. Ainda não sabe se agradece por isso.',
    next: 'ch4-004',
  },

  'ch4-004': {
    id: 'ch4-004',
    speaker: null,
    text: 'Três silhuetas em silêncio. Depois de tanto peso, o silêncio é diferente.',
    next: 'ch4-005',
  },

  'ch4-005': {
    id: 'ch4-005',
    speaker: null,
    text: 'Não é vazio. É cheio. Como o silêncio depois de um temporal quando a chuva para e o mundo tá lavado.',
    next: 'ch4-006',
  },

  'ch4-006': {
    id: 'ch4-006',
    background: 'estatua-imortais-noite-escura',
    transition: 'fade',
    sprites: {
      center: { char: 'ella', pose: 'sad' },
    },
    speaker: null,
    text: 'A estátua de Niuwë, Selenna e Mensa-Viktör. Ella para.',
    next: 'ch4-007',
  },

  'ch4-007': {
    id: 'ch4-007',
    speaker: null,
    text: 'À noite, o metal escuro absorve a escuridão. As três figuras adolescentes parecem mais jovens. Mais vulneráveis.',
    next: 'ch4-008',
  },

  'ch4-008': {
    id: 'ch4-008',
    speaker: null,
    text: 'Como se a escuridão tirasse a grandiosidade e devolvesse a idade real deles.',
    next: 'ch4-009',
  },

  'ch4-009': {
    id: 'ch4-009',
    sprites: {
      center: { char: 'ella', pose: 'looking-away' },
      left: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella olha para o rosto que é como o seu. O rosto de metal do irmão.',
    next: 'ch4-010',
    choices: [
      {
        text: 'Tocando a base, encontrando perdão',
        next: 'ch4-020',
        setFlag: 'ella-cresceu=true',
      },
      {
        text: 'Afastando, não conseguindo conforto',
        next: 'ch4-050',
        setFlag: 'ella-fugiu=true',
      },
    ],
  },

  'ch4-020': {
    id: 'ch4-020',
    sprites: {
      center: { char: 'ella', pose: 'confident' },
    },
    speaker: 'ella',
    text: 'Eu venho aqui toda noite pedir desculpa por estar viva.',
    next: 'ch4-021',
  },

  'ch4-021': {
    id: 'ch4-021',
    speaker: 'ella',
    text: 'Mas hoje... hoje não quero pedir desculpa.',
    next: 'ch4-022',
  },

  'ch4-022': {
    id: 'ch4-022',
    speaker: null,
    text: 'Ella toca a base da estátua. Não fala com Niuwë. Apenas toca.',
    next: 'ch4-023',
  },

  'ch4-023': {
    id: 'ch4-023',
    speaker: null,
    text: 'Maya e Marci ficam a alguns passos. Esperando. Entendendo sem precisar de palavras.',
    next: 'ch4-024',
  },

  'ch4-024': {
    id: 'ch4-024',
    speaker: null,
    text: 'Pela primeira vez em 143 noites, Ella não pediu desculpa. Desculpa pela morte dele. Desculpa por estar viva.',
    next: 'ch4-025',
  },

  'ch4-025': {
    id: 'ch4-025',
    speaker: null,
    text: 'Não porque a culpa tivesse ido embora. Mas porque naquela noite ela não estava sozinha ao carregá-la.',
    next: 'ch4-030',
  },

  'ch4-050': {
    id: 'ch4-050',
    sprites: {
      center: { char: 'ella', pose: 'sad' },
      left: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'ella',
    text: 'Vamos. Não quero ficar aqui.',
    next: 'ch4-051',
  },

  'ch4-051': {
    id: 'ch4-051',
    sprites: {
      center: null,
      left: { char: 'ella', pose: 'neutral' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: 'maya',
    text: 'Ok. A gente vai.',
    next: 'ch4-052',
  },

  'ch4-052': {
    id: 'ch4-052',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'Ella se afasta rápido. Maya a segue.',
    next: 'ch4-053',
  },

  'ch4-053': {
    id: 'ch4-053',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'marci', pose: 'thinking' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'Marci olha para a estátua um momento a mais do que o comum. Como se os três guerreiros de metal estivessem lhe dizendo algo que só ela consegue ouvir.',
    next: 'ch4-054',
  },

  'ch4-054': {
    id: 'ch4-054',
    background: 'externa-dormitorios-nublado',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'marci', pose: 'neutral' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'Marci segue as amigas.',
    next: 'ch4-030',
  },

  'ch4-030': {
    id: 'ch4-030',
    background: 'biblioteca-noite',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'De volta à biblioteca. Ou nunca saíram? O tempo en Catatúnia não é linear quando você não dorme.',
    next: 'ch4-031',
  },

  'ch4-031': {
    id: 'ch4-031',
    speaker: null,
    text: 'A conversa foi morrendo naturalmente. Não porque acabou, mas porque o corpo tem limites.',
    next: 'ch4-032',
  },

  'ch4-032': {
    id: 'ch4-032',
    speaker: null,
    text: 'As três ficaram aqui até o amanhecer.',
    next: 'ch4-033',
  },

  'ch4-033': {
    id: 'ch4-033',
    speaker: null,
    text: 'O céu muda de cor pela janela da biblioteca. De preto para cinza-rosa.',
    next: 'ch4-034',
  },

  'ch4-034': {
    id: 'ch4-034',
    speaker: null,
    text: 'Não vermelho. Não desta vez. Apenas o cinza honesto de uma manhã nublada em uma ilha no Pacífico.',
    next: 'ch5-001',
  },

  // ═══════════════════════════════════════════════════════════════════════════════════
  // CAPÍTULO 5 — "AMANHECER"
  // ═══════════════════════════════════════════════════════════════════════════════════

  'ch5-001': {
    id: 'ch5-001',
    background: 'externa-dormitorios-nublado',
    transition: 'fade',
    chapter: 'ch5',
    chapterTitle: 'AMANHECER',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'marci', pose: 'neutral' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'O amanhecer chegou sem pedir permissão. Como faz.',
    next: 'ch5-002',
  },

  'ch5-002': {
    id: 'ch5-002',
    speaker: null,
    text: 'Caminham de volta. O campus está acordando. Pessoas normais começando um dia normal.',
    next: 'ch5-003',
  },

  'ch5-003': {
    id: 'ch5-003',
    speaker: null,
    text: 'As três em silêncio. Mas é um silêncio diferente do início da noite.',
    next: 'ch5-004',
  },

  'ch5-004': {
    id: 'ch5-004',
    speaker: null,
    text: 'É o silêncio de quem disse o que precisava dizer.',
    next: 'ch5-005',
  },

  'ch5-005': {
    id: 'ch5-005',
    speaker: null,
    text: 'Na frente dos dormitórios. Antes de se separarem. O caminho se divide novamente.',
    next: 'ch5-006',
  },

  'ch5-006': {
    id: 'ch5-006',
    sprites: {
      center: { char: 'marci', pose: 'speaking' },
    },
    speaker: 'marci',
    text: 'A gente podia fazer isso de novo. Assado noites, dormindo segurança em companhia.',
    next: 'ch5-007',
  },

  'ch5-007': {
    id: 'ch5-007',
    sprites: {
      center: { char: 'marci', pose: 'smiling-soft' },
    },
    speaker: 'marci',
    text: 'Só o café. Só vocês.',
    next: 'ch5-008',
    choices: [
      {
        text: 'Toda noite que eu não conseguir dormir, a porta da minha cozinha tá aberta.',
        next: 'ch5-final-setup',
        setFlag: 'promise-aberta=true',
      },
      {
        text: 'Amanhã. Mesma hora. Sem desculpas.',
        next: 'ch5-final-setup',
        setFlag: 'promise-determinada=true',
      },
      {
        text: '[Abraça as duas sem dizer nada]',
        next: 'ch5-final-setup',
        setFlag: 'promise-abraco=true',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────────
  // Lógica de Endings
  // ─────────────────────────────────────────────────────────────────────────────────

  'ch5-final-setup': {
    id: 'ch5-final-setup',
    speaker: null,
    text: 'O amanhecer continua. As três se olham. É tempo de escolher.',
    next: 'ch5-route-picker',
  },

  'ch5-route-picker': {
    id: 'ch5-route-picker',
    speaker: null,
    text: '',
    condition: { flag: 'questionou-marci', value: true },
    next: 'ch5-ending-assistindo',
  },

  'ch5-route-picker-alt': {
    id: 'ch5-route-picker-alt',
    speaker: null,
    text: '',
    condition: { flag: 'rejeitou-haita', value: true },
    next: 'ch5-ending-sem-deusa',
  },

  'ch5-route-picker-default': {
    id: 'ch5-route-picker-default',
    speaker: null,
    text: '',
    next: 'ch5-ending-rachadas',
  },

  'ch5-ending-rachadas': {
    id: 'ch5-ending-rachadas',
    background: 'estatua-imortais-nublado',
    transition: 'fade',
    chapter: 'ch5',
    chapterTitle: 'AMANHECER',
    sprites: {
      center: { char: 'ella', pose: 'confident' },
    },
    speaker: null,
    text: 'Ella olha para a estátua de manhã pela primeira vez sem culpa. O metal brilha sob o sol nublado.',
    next: 'ch5-ending-rachadas-02',
    ending: 'rachadas',
  },

  'ch5-ending-rachadas-02': {
    id: 'ch5-ending-rachadas-02',
    sprites: {
      center: { char: 'ella', pose: 'confident' },
    },
    speaker: null,
    text: 'Três meninas rachadas. Segurando os pedaços umas das outras. Não porque uma deusa mandou. Não porque o destino exigiu.',
    next: 'ch5-ending-rachadas-03',
    ending: 'rachadas',
  },

  'ch5-ending-rachadas-03': {
    id: 'ch5-ending-rachadas-03',
    sprites: {
      center: { char: 'ella', pose: 'confident' },
    },
    speaker: null,
    text: 'Porque às duas da manhã, quando o peso é demais para uma pessoa, três cafés amargos e uma cozinha vazia são suficientes para aguentar mais uma noite.',
    next: 'ch5-ending-rachadas-04',
    ending: 'rachadas',
  },

  'ch5-ending-rachadas-04': {
    id: 'ch5-ending-rachadas-04',
    sprites: {
      center: { char: 'ella', pose: 'confident' },
    },
    speaker: null,
    text: 'E amanhã, quando a insônia voltar — porque vai voltar — a porta vai estar aberta.',
    ending: 'rachadas',
  },

  'ch5-ending-sem-deusa': {
    id: 'ch5-ending-sem-deusa',
    background: 'externa-dormitorios-nublado',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'marci', pose: 'neutral' },
      right: { char: 'maya', pose: 'neutral' },
    },
    speaker: null,
    text: 'As três se separam com um aceno. Sem abraço. Sem promessa verbalizada.',
    ending: 'sem-deusa',
    next: 'ch5-ending-sem-deusa-02',
  },

  'ch5-ending-sem-deusa-02': {
    id: 'ch5-ending-sem-deusa-02',
    speaker: null,
    text: 'Mas com o entendimento silencioso de que aquilo vai se repetir. Toda noite. Enquanto precisarem.',
    ending: 'sem-deusa',
    next: 'ch5-ending-sem-deusa-03',
  },

  'ch5-ending-sem-deusa-03': {
    id: 'ch5-ending-sem-deusa-03',
    speaker: null,
    text: 'Häita pode ter escolhido elas. Mas elas escolheram umas às outras. E isso é mais.',
    ending: 'sem-deusa',
  },

  'ch5-ending-assistindo': {
    id: 'ch5-ending-assistindo',
    background: 'dentalia',
    transition: 'fade',
    sprites: {
      left: { char: 'ella', pose: 'neutral' },
      center: { char: 'maya', pose: 'neutral' },
      right: { char: 'marci', pose: 'neutral' },
    },
    speaker: null,
    text: 'As três se separam. Ella e Maya entram. Marci fica.',
    ending: 'assistindo',
    next: 'ch5-ending-assistindo-02',
    condition: { flag: 'confrontou-marci', value: true },
  },

  'ch5-ending-assistindo-02': {
    id: 'ch5-ending-assistindo-02',
    speaker: null,
    text: 'Marci sorri. Não é um sorriso humano.',
    ending: 'assistindo',
    next: 'ch5-ending-assistindo-03',
  },

  'ch5-ending-assistindo-03': {
    id: 'ch5-ending-assistindo-03',
    speaker: null,
    text: 'Eu vejo tudo. Sempre vi. E vou continuar vendo.',
    ending: 'assistindo',
    next: 'ch5-ending-assistindo-04',
  },

  'ch5-ending-assistindo-04': {
    id: 'ch5-ending-assistindo-04',
    speaker: null,
    text: 'Blackout.',
    ending: 'assistindo',
  },
};
