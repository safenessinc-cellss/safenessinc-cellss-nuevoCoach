import { Link, useLocation } from 'react-router-dom';

const sections = {
  '/privacidade': {
    title: 'Política de Privacidade',
    intro: 'Esta política explica como o site Coach ISO trata dados pessoais quando você navega, solicita contato, agenda uma conversa ou utiliza áreas autenticadas.',
    blocks: [
      ['Responsável pelo tratamento', 'Coach ISO é a marca profissional apresentada neste site. O responsável pelo tratamento indicado para esta operação é DEUWY ROBERT TERÁN MEDINA, que utiliza o nome profissional Robert Terán. Contato: safeness.inc@gmail.com. A pessoa jurídica responsável está identificada pelo CNPJ 54.366.022/0001-07. O nome empresarial e o endereço cadastral deverão ser conferidos no comprovante oficial da Receita Federal antes de completar a identificação pública.'],
      ['Dados tratados e finalidades', 'Podem ser tratados dados de identificação e contato fornecidos em formulários ou solicitações (como nome, e-mail, telefone, empresa e conteúdo da mensagem), dados necessários à autenticação e gestão de contas no portal, e dados técnicos de navegação e segurança. As finalidades incluem responder solicitações, organizar reuniões, prestar os serviços solicitados, proteger contas e sistemas, cumprir obrigações legais e manter o funcionamento do site.'],
      ['Bases legais', 'Conforme o contexto, o tratamento poderá se apoiar em procedimentos preliminares ou execução de contrato, cumprimento de obrigação legal, exercício regular de direitos, legítimo interesse após avaliação aplicável, ou consentimento quando necessário. O consentimento para cookies opcionais é separado e pode ser revogado.'],
      ['Compartilhamento e fornecedores', 'Os dados podem ser processados por fornecedores de infraestrutura e tecnologia utilizados para hospedar o site (Vercel), autenticar usuários e armazenar dados (Google Firebase/Google Cloud). O site também carrega recursos externos de fontes e imagens quando configurados. Links para serviços externos, como WhatsApp e LinkedIn, seguem as políticas desses terceiros. A relação final de operadores, suboperadores, serviços ativados e respectivas finalidades deve ser confirmada na configuração de produção e nos contratos aplicáveis.'],
      ['Transferências internacionais', 'Como a infraestrutura tecnológica pode operar em outros países, alguns dados podem ser processados fora do Brasil. Quando aplicável, serão adotados mecanismos e garantias exigidos pela LGPD e regulamentação da ANPD. Os locais efetivos de processamento e os instrumentos contratuais devem ser confirmados na configuração dos fornecedores.'],
      ['Retenção e segurança', 'Os dados são mantidos pelo período necessário às finalidades informadas e, depois, eliminados ou anonimizados quando possível, ressalvadas obrigações legais, regulatórias, exercício regular de direitos e hipóteses legais de conservação. Os prazos concretos devem ser definidos em uma tabela interna de retenção por categoria de dado. São adotadas medidas técnicas e administrativas proporcionais, como controle de acesso, autenticação e regras de segurança. Nenhum sistema conectado à internet pode garantir risco zero.'],
      ['Direitos dos titulares', 'Você pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação quando cabível, portabilidade nos termos da regulamentação, informação sobre compartilhamentos, revisão de decisões automatizadas quando aplicável e revogação do consentimento. Alguns pedidos podem estar sujeitos a exceções legais e à conservação obrigatória. Se o tratamento estiver sujeito ao GDPR/Regulamento Geral sobre a Proteção de Dados da União Europeia, também serão observados os direitos e fundamentos previstos nesse regulamento, conforme o contexto e seu âmbito de aplicação.'],
      ['Como exercer seus direitos', 'Envie sua solicitação para safeness.inc@gmail.com com o assunto “Privacidade — solicitação LGPD”. Poderemos solicitar informações proporcionais para confirmar sua identidade e proteger seus dados. O canal de contato divulgado aqui não significa, por si só, a nomeação formal de um encarregado (DPO); a necessidade de designação deve ser avaliada conforme o porte e as operações do controlador.'],
      ['Atualizações', 'Esta política poderá ser atualizada para refletir mudanças no site, nos fornecedores ou na legislação. A data da última atualização será indicada nesta página.']
    ]
  },
  '/cookies': {
    title: 'Política de Cookies',
    intro: 'Cookies são pequenos arquivos ou identificadores armazenados no navegador. Tecnologias semelhantes, como armazenamento local, também podem guardar preferências.',
    blocks: [
      ['Categorias', 'Cookies estritamente necessários ajudam a manter segurança, navegação e funcionalidades solicitadas. Cookies de análise medem o uso do site. Cookies de marketing podem ser usados para personalização e medição de campanhas. As categorias não essenciais permanecem desativadas até uma escolha afirmativa do visitante.'],
      ['Escolha livre e granular', 'O banner oferece aceitar todos, rejeitar os opcionais e personalizar por categoria. A recusa não deve impedir o acesso às funções essenciais. A escolha pode ser alterada a qualquer momento pelo link “Preferências de cookies” no rodapé.'],
      ['Como alterar ou revogar', 'Use “Preferências de cookies” no rodapé para abrir novamente o painel e salvar outra escolha. Você também pode apagar dados do site nas configurações do navegador. A revogação não afeta a licitude de tratamentos anteriores.'],
      ['Tecnologias de terceiros', 'O site pode carregar recursos de fornecedores externos, como fontes, hospedagem de imagens ou serviços de comunicação. A lista efetiva de cookies, nomes, fornecedores, duração e finalidades deve ser conferida periodicamente nas ferramentas do navegador e nos painéis dos fornecedores antes de ativar qualquer tecnologia opcional.'],
      ['Registro da preferência', 'A preferência é armazenada localmente no navegador para lembrar sua escolha. O registro contém as categorias escolhidas e a data da decisão.']
    ]
  },
  '/termos': {
    title: 'Termos de Uso',
    intro: 'Ao utilizar o site Coach ISO, você concorda com estas condições. Se não concordar, interrompa a navegação e não utilize as áreas autenticadas.',
    blocks: [
      ['Finalidade do site', 'O site apresenta informações profissionais sobre consultoria, sistemas de gestão, qualidade, melhoria operacional e desenvolvimento de equipes, além de canais de contato e acesso a áreas restritas. O conteúdo é informativo e não constitui garantia de resultado ou aconselhamento jurídico, fiscal, médico ou financeiro.'],
      ['Uso permitido', 'Você se compromete a fornecer informações verdadeiras, não tentar acessar contas ou dados sem autorização, não interferir no funcionamento do site e não enviar conteúdo ilícito, malicioso ou que viole direitos de terceiros.'],
      ['Conteúdo e propriedade intelectual', 'Textos, identidade visual, materiais e elementos próprios do site são protegidos pelas normas aplicáveis. Não é permitido copiar, distribuir ou explorar comercialmente conteúdo protegido sem autorização, ressalvadas as utilizações permitidas por lei.'],
      ['Links externos', 'Links para plataformas de terceiros são oferecidos por conveniência. Coach ISO não controla a disponibilidade, conteúdo ou políticas desses serviços.'],
      ['Disponibilidade e responsabilidade', 'São realizados esforços razoáveis para manter o site disponível e atualizado, sem garantia de funcionamento ininterrupto. Na extensão permitida pela lei, não se responde por danos decorrentes de indisponibilidade, uso indevido ou decisões tomadas exclusivamente com base em conteúdo geral do site.'],
      ['Privacidade', 'O tratamento de dados pessoais é descrito na Política de Privacidade e o uso de cookies na Política de Cookies, ambas disponíveis no rodapé.'],
      ['Lei aplicável e contato', 'Estes termos devem ser interpretados conforme a legislação aplicável no Brasil, sem afastar direitos obrigatórios do consumidor ou de titulares protegidos por outras normas. Contato: safeness.inc@gmail.com.']
    ]
  }
};

export default function LegalPage() {
  const { pathname } = useLocation();
  const page = sections[pathname as keyof typeof sections] || sections['/privacidade'];
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800 sm:px-6">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Link to="/" className="text-sm font-semibold text-blue-700">← Coach ISO</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Informações legais</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1>
        <p className="mt-5 text-base leading-7 text-slate-600">{page.intro}</p>
        <p className="mt-3 text-xs text-slate-500">Última atualização: 28 de novembro de 2026</p>
        <div className="mt-8 space-y-7">
          {page.blocks.map(([heading, body]) => <section key={heading}><h2 className="text-lg font-semibold">{heading}</h2><p className="mt-2 leading-7 text-slate-600">{body}</p></section>)}
        </div>
        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm">
          <Link className="text-blue-700 underline" to="/privacidade">Privacidade</Link>
          <Link className="text-blue-700 underline" to="/cookies">Cookies</Link>
          <Link className="text-blue-700 underline" to="/termos">Termos de uso</Link>
        </div>
      </article>
    </main>
  );
}
