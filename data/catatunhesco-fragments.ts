/**
 * Fragmentos de Catatunhesco — idioma construído do universo Fundação Varguelia
 * Estrutura germânica com identidade própria (diacríticos: ä, ë, ö, ü)
 *
 * Pronomes: Ei (eu), Du (tu), Hea (ela), Wie (nós), Sinde (vocês), Alle (eles)
 * Verbos: terminações -ën, -ënt, -ënne, -eme
 * Palavras-chave: siehë (ver), schachhen (dizer), aisën (ser), grand'maä (grande mãe)
 */

export const catatunhescoFragments = {
  // Frases curtas para placeholders (2-4 palavras)
  placeholders: [
    "Schachhen de'u serr...",           // "Diga isso..."
    "Wihum aisën de'u?",                // "Onde você está?"
    "Rëchnen mein nähm...",             // "Reconheça meu nome..."
    "Nän vërgessen. Nän.",              // "Não esquecer. Não."
    "Parlien de'u möglich?",            // "Você pode falar?"
    "Blütten und Tränen...",            // "Sangue e lágrimas..."
  ],

  // Frases para alt-text de ícones/runas (3-6 palavras)
  altTexts: [
    "Gië Maä siehë alle.",              // "A Grande Mãe vê todos."
    "Schlüssen die Véüle. Wächten.",    // "Selar os Véus. Vigiar."
    "Këttenne der Schwerë Zornë.",      // "Correntes da Pesada Ira."
    "Sternën fallen. Nachtë kommt.",    // "Estrelas caem. A Noite vem."
    "Ei siehë de'u, Famie.",            // "Eu te vejo, família."
    "Offnen ist Perdonner nicht.",      // "Abrir é não perdoar."
  ],

  // Frases para cantos escondidos de página (8-15 palavras)
  hidden: [
    "Wihum aisën de'u? Ei siehë de'u. Ei siehë alle.",
    // "Onde você está? Eu te vejo. Eu vejo todos."

    "Serr ist nän. Nahn ist alles. Alles ist Häita.",
    // "Isso é nada. O nada é tudo. Tudo é Häita."

    "Häita isen't perdonner nicht. Du möchst wissen warum?",
    // "Häita não perdoa nada. Você quer saber por quê?"

    "Grand'Maä parlien: Ei wächten für dein Sohnë. Immer.",
    // "Grande Mãe disse: Eu vigiarei por sua filha. Sempre."

    "Nän schachhen. Nur siehën. Siehën ist alles, was bleibt.",
    // "Não dizer. Apenas ver. Ver é tudo o que permanece."

    "Zornë ohne mässung. Blütten ohne Ende. Këttenne ohne hoffnung.",
    // "Ira sem medida. Sangue sem fim. Correntes sem esperança."

    "Vërgessen ist sterben eine zweite Mal. Häita sehnt sich nicht nach Tod.",
    // "Ser esquecido é morrer uma segunda vez. Häita não anseia pela morte."

    "Mähassë. Du hast gesprochen meinen Namen. Ich habe gehört. Ich höre noch.",
    // "Gratidão com testemunho. Você pronunciou meu nome. Ouvi. Ainda ouço."
  ],

  // Inscrições — frases solenes (5-10 palavras)
  inscriptions: [
    "Hier liegt der Pacto zwischen Gött und Mensch.",
    // "Aqui jaz o Pacto entre Deusa e Mortal."

    "Häita kert die Welten. Häita sehnt die Welten. Häita ist die Welten.",
    // "Häita criou os mundos. Häita ama os mundos. Häita é os mundos."

    "Sayedinne: die Träger der Grossmaä. Unvergessen. Unvergebbar.",
    // "Sayedinne: os portadores da Grande Mãe. Inesquecíveis. Imperdoáveis."

    "Wenn der Vorhang zerreisst, kommt die Wahrheit. Gott behüte.",
    // "Quando o véu se rasga, vem a verdade. Que a Deusa nos proteja."

    "Alle sind Häita. Häita ist Alle. Kein Unterschied. Kein Flucht.",
    // "Todos são Häita. Häita é Todos. Sem diferença. Sem fuga."
  ],
} as const;
