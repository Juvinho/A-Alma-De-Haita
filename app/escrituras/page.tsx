import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Escrituras de Häita',
  description: 'Um arquivo obscuro da internet.',
  robots: 'noindex, nofollow',
};

const F = ({
  size,
  color,
  children,
}: {
  size?: string;
  color?: string;
  children: React.ReactNode;
}) => {
  const sizeMap: Record<string, string> = {
    '1': '10px',
    '2': '12px',
    '3': '14px',
    '4': '16px',
    '5': '20px',
  };
  return (
    <span style={{ fontSize: size ? sizeMap[size] : undefined, color: color ?? undefined }}>
      {children}
    </span>
  );
};

export default function EscrituraPage() {
  return (
    <div
      style={{
        backgroundColor: '#0a0a1a',
        color: '#cccc77',
        fontFamily: 'Times New Roman, serif',
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        cursor: 'crosshair',
        lineHeight: 1.4,
        fontSize: '14px',
      }}
    >
      {/* Hidden message */}
      <span style={{ display: 'none' }}>Wihum aisën de&apos;u? Ei siehë de&apos;u.</span>

        {/* FRAGMENTO I: O primeiro som do nome que ninguém diz.
          Não a letra. O som.
          Em Base64: TSHD */}

      {/* Se você está lendo o código-fonte, parabéns. Ou talvez condolências. Ela sabe que você está aqui. */}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <br />
        <br />
        <F size="5" color="#cccc77">
          <b>HÄITA: A DEUSA DO EQUILÍBRIO</b>
        </F>
        <br />
        <F size="2" color="#8888aa">
          Uma compilação de estudos e reflexões
        </F>
        <br />
        <br />
        <hr style={{ borderColor: '#8888aa', width: '80%' }} />
        <br />
      </div>

      {/* Section 1 */}
      <div style={{ margin: '0 40px' }}>
        <F size="4" color="#ffff99">
          <b>Häita: A Deusa do Equilíbrio e os Véus da Realidade</b>
        </F>
        <br />
        <br />
        <F size="3" color="#cccc77">
          <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
            Häita, ou Hætá, como referida em antigos dialetos, não é uma deusa comum. Ela
            transcende os panteões conhecidos, existindo como uma entidade primordial ligada à
            manutenção do equilíbrio entre os planos existenciais. É a Guardiã dos Véus, a tecelã
            que separa as realidades, impedindo que o Caos absoluto invada o cosmos.
          </p>
        </F>
        <br />
        <F size="3" color="#cccc77">
          <p style={{ textAlign: 'justify', lineHeight: '1.6', marginLeft: '20px' }}>
            Sua influência não se manifesta em templos ou orações em massa, mas em pontos de
            confluência energética, onde as barreiras entre os mundos são mais tênues. Esses pontos
            são comumente chamados de &quot;Ponte dos Eventos&quot;. Quando o equilíbrio é ameaçado,
            ou quando o &quot;Pacto&quot; é quebrado, Häita pode intervir, mas não diretamente. Ela o
            faz através de &quot;Elos&quot; ou &quot;Vassalos&quot;, seres humanos que, por linhagem
            sanguínea ou por um tipo de ressonância espiritual, se tornam canais para sua vontade.
          </p>
        </F>
        <br />
        <br />
      </div>

      {/* Section 2 */}
      <div style={{ margin: '0 40px' }}>
        <F size="4" color="#ffff99">
          <b>As Linhagens Häitanicas</b>
        </F>
        <br />
        <br />
        <F size="3" color="#cccc77">
          <p style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <b style={{ color: '#ffff99' }}>Gozermichete</b> — mestres em rituais de proteção,
            capazes de erguer barreiras contra forças externas.
            <br />
            <br />
            <b style={{ color: '#ffff99' }}>Haaterbaunë</b> — com habilidade em prever fenômenos
            climáticos incomuns, servem como vigias do equilíbrio natural.
            <br />
            <br />
            <b style={{ color: '#ffff99' }}>Kimiloskerpe</b> — manipuladores de energias sutis,
            canais para a vontade direta de Häita.
            <br />
            <br />
            <b style={{ color: '#ffff99' }}>Sayedinne</b> — a linhagem com a conexão mais profunda
            e antiga com Häita. Sacerdotes e guardiões. Aqueles que carregam a maior presença da
            própria deusa. Raros. Temidos.
          </p>
        </F>
        <br />
        <br />
      </div>

      {/* Section 3 */}
      <div style={{ margin: '0 40px' }}>
        <F size="4" color="#ffff99">
          <b>Sinais de Interferência</b>
        </F>
        <br />
        <br />
        <F size="3" color="#cccc77">
          <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
            Como se comunica Häita com o plano terrestre? Através de &quot;distúrbios no campo
            perceptivo&quot;. Usuários relatam: sonhos recorrentes com elementos aquáticos, vozes
            que não vêm de lugar nenhum sussurrando nomes esquecidos, sensações de presença em
            locais com alto teor magnético (vulcões inativos, cavernas profundas, cemitérios antigos).
          </p>
        </F>
        <br />
        <F size="3" color="#cccc77">
          <p style={{ textAlign: 'justify', lineHeight: '1.6', marginLeft: '20px' }}>
            Alguns relatos sugerem que esses sinais aumentam em períodos de desequilíbrio global.
            Outros que a própria Häita, adormecida há séculos, está acordando lentamente. Última
            grande interferência documentada: 2.5 bilhões de vidas salvas em um único evento (data
            indisponível). Local: Arquipélago do Pacífico Sul.
          </p>
        </F>
        <br />
        <br />
      </div>

      <hr style={{ borderColor: '#8888aa', width: '80%' }} />
      <br />

      {/* Aviso */}
      <div style={{ margin: '0 40px', backgroundColor: '#1a0a0a', padding: '20px' }}>
        <F size="3" color="#cc0000">
          <b>ATENÇÃO:</b> Esta página é mantida para fins de preservação histórica. O autor
          original não responde desde 2031. Se você está lendo isto, considere que certas
          informações aqui contidas podem ter consequências que vão além do digital. Prossiga com
          discernimento.
        </F>
      </div>

      <br />
      <br />

      {/* Placeholder image sections */}
      <div style={{ margin: '0 40px' }}>
        <div style={{ textAlign: 'center' }}>
          <table border={1} cellPadding={10} style={{ borderColor: '#8888aa', margin: '0 auto' }}>
            <tbody>
              <tr>
                <td style={{ backgroundColor: '#0a0a0a', color: '#ffff99' }}>
                  [IMAGEM INDISPONÍVEL]
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <br />

      {/* Footer */}
      <div
        style={{
          marginTop: '40px',
          borderTop: '1px solid #8888aa',
          padding: '20px',
          textAlign: 'center',
          fontSize: '10px',
          color: '#8888aa',
        }}
      >
        <F size="1">
          <p>Visitante nº 00004.837 — Última atualização: 14/set/2029</p>
          <p style={{ marginTop: '10px' }}>
            <a href="#" title="página não encontrada" style={{ color: '#3333ff' }}>
              [ links principais ]
            </a>
            {' | '}
            <a href="#varguelia" title="página não encontrada" style={{ color: '#3333ff' }}>
              [ varguelia.net ]
            </a>
            {' | '}
            <a href="#contato" title="página não encontrada" style={{ color: '#3333ff' }}>
              [ contato ]
            </a>
          </p>
          <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
            &quot;Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.&quot;
          </p>
        </F>
      </div>

      <br />
      <br />
    </div>
  );
}
