const atendimentos = [
  {
    numero: "01",
    titulo: "Clínica geral",
    descricao: "Avaliação inicial, acompanhamento de rotina e orientação para diferentes necessidades de saúde.",
  },
  {
    numero: "02",
    titulo: "Pediatria",
    descricao: "Consultas para acompanhar a saúde, o crescimento e o desenvolvimento das crianças.",
  },
  {
    numero: "03",
    titulo: "Cardiologia",
    descricao: "Prevenção, avaliação e acompanhamento dos cuidados relacionados à saúde do coração.",
  },
  {
    numero: "04",
    titulo: "Dermatologia",
    descricao: "Cuidados preventivos e avaliação da saúde da pele, dos cabelos e das unhas.",
  },
];

const etapas = [
  {
    numero: "1",
    titulo: "Fale com a recepção",
    descricao: "Informe a especialidade desejada e tire suas dúvidas sobre o atendimento.",
  },
  {
    numero: "2",
    titulo: "Escolha o horário",
    descricao: "A recepção verifica a agenda e encontra uma opção adequada para você.",
  },
  {
    numero: "3",
    titulo: "Venha para a consulta",
    descricao: "Chegue com antecedência e traga seus documentos e exames anteriores.",
  },
];

export function SitePage() {
  return (
    <div className="clinic-site">
      <div className="site-topbar">
        <span>Atendimento de segunda a sexta, das 8h às 18h</span>
        <a href="tel:+551140001234">Agendamentos: (11) 4000-1234</a>
      </div>

      <header className="site-header">
        <a className="site-brand" href="#inicio" aria-label="Clínica Vida - início">
          <span className="site-brand-mark" aria-hidden="true">+</span>
          <span className="site-brand-text">
            <strong>Clínica Vida</strong>
            <small>Centro médico integrado</small>
          </span>
        </a>

        <nav aria-label="Navegação do site">
          <a href="#especialidades">Especialidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#clinica">A clínica</a>
          <a href="#contato">Contato</a>
          <a className="site-nav-button" href="/login">Área do sistema</a>
        </nav>
      </header>

      <main>
        <section className="site-hero" id="inicio">
          <div className="site-hero-content">
            <span className="site-label">Clínica médica e especialidades</span>
            <h1>Cuidado médico próximo, organizado e humano.</h1>
            <p>
              Um espaço pensado para oferecer consultas médicas com tranquilidade,
              atenção e acompanhamento para toda a família.
            </p>

            <div className="site-actions">
              <a className="site-primary-button" href="#contato">Agendar uma consulta</a>
              <a className="site-secondary-button" href="#especialidades">Conhecer especialidades</a>
            </div>

            <p className="site-hero-note">
              Atendimento com horário marcado e orientação da recepção.
            </p>
          </div>

          <aside className="site-service-box" aria-label="Informações de atendimento">
            <div className="site-service-box-header">
              <span className="site-service-icon" aria-hidden="true">+</span>
              <span>Atendimento programado</span>
            </div>
            <h2>Como podemos ajudar?</h2>
            <p>Entre em contato e nossa recepção orientará os próximos passos.</p>

            <ul className="site-quick-list">
              <li>Consultas em diferentes especialidades</li>
              <li>Horários organizados por agendamento</li>
              <li>Atendimento para adultos e crianças</li>
            </ul>

            <a className="site-card-link" href="#contato">Ver informações de contato →</a>
          </aside>
        </section>

        <section className="site-trust-bar" aria-label="Diferenciais da clínica">
          <article>
            <strong>Atendimento integrado</strong>
            <span>Diferentes especialidades no mesmo espaço.</span>
          </article>
          <article>
            <strong>Agenda organizada</strong>
            <span>Consultas marcadas diretamente com a recepção.</span>
          </article>
          <article>
            <strong>Cuidado contínuo</strong>
            <span>Acompanhamento pensado para cada fase da vida.</span>
          </article>
        </section>

        <section className="site-section" id="especialidades">
          <div className="site-section-heading">
            <span className="site-label">Especialidades</span>
            <h2>Cuidados essenciais em um só lugar</h2>
            <p>
              Conheça algumas das áreas disponíveis para consulta e acompanhamento
              na Clínica Vida.
            </p>
          </div>

          <div className="site-service-grid">
            {atendimentos.map((atendimento) => (
              <article className="site-service-card" key={atendimento.titulo}>
                <span aria-hidden="true">{atendimento.numero}</span>
                <h3>{atendimento.titulo}</h3>
                <p>{atendimento.descricao}</p>
                <a href="#contato">Consultar disponibilidade</a>
              </article>
            ))}
          </div>
        </section>

        <section className="site-process-section" id="como-funciona">
          <div className="site-process-inner">
            <div className="site-section-heading site-heading-center">
              <span className="site-label">Como funciona</span>
              <h2>Seu atendimento em três passos</h2>
              <p>Um processo simples para você cuidar da saúde com mais tranquilidade.</p>
            </div>

            <div className="site-process-grid">
              {etapas.map((etapa) => (
                <article className="site-process-card" key={etapa.numero}>
                  <span>{etapa.numero}</span>
                  <h3>{etapa.titulo}</h3>
                  <p>{etapa.descricao}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-about" id="clinica">
          <div className="site-about-title">
            <span className="site-label">A Clínica Vida</span>
            <h2>Um ambiente preparado para receber e cuidar.</h2>
          </div>
          <div className="site-about-content">
            <p>
              A Clínica Vida é um centro médico demonstrativo criado para este projeto
              acadêmico. O site apresenta como uma clínica pode organizar sua comunicação
              com pacientes e o acesso da equipe ao sistema administrativo.
            </p>
            <ul>
              <li>Atendimento com horário marcado</li>
              <li>Comunicação clara com os pacientes</li>
              <li>Organização digital para a equipe</li>
            </ul>
          </div>
        </section>

        <section className="site-contact" id="contato">
          <div className="site-contact-intro">
            <span className="site-label">Contato e localização</span>
            <h2>Fale com a nossa recepção.</h2>
            <p>
              Entre em contato para consultar horários, especialidades e orientações
              para o atendimento.
            </p>
            <a className="site-primary-button" href="tel:+551140001234">Ligar para a clínica</a>
          </div>

          <div className="site-contact-details">
            <div>
              <span>Telefone</span>
              <strong>(11) 4000-1234</strong>
            </div>
            <div>
              <span>E-mail</span>
              <strong>contato@clinicavida.com.br</strong>
            </div>
            <div>
              <span>Endereço</span>
              <strong>Rua das Flores, 120 - Centro</strong>
            </div>
            <div>
              <span>Funcionamento</span>
              <strong>Segunda a sexta, 8h às 18h</strong>
            </div>
          </div>
        </section>

        <section className="site-system-access">
          <div>
            <span className="site-label">Acesso administrativo</span>
            <h2>Área exclusiva para a equipe da clínica</h2>
            <p>Entre no sistema ou cadastre o usuário responsável pela administração.</p>
          </div>
          <div className="site-actions">
            <a className="site-primary-button" href="/login">Entrar no sistema</a>
            <a className="site-secondary-button" href="/cadastro">Criar cadastro</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a className="site-brand site-footer-brand" href="#inicio">
            <span className="site-brand-mark" aria-hidden="true">+</span>
            <span>Clínica Vida</span>
          </a>
          <p>Site institucional demonstrativo de uma clínica médica.</p>
        </div>
        <div className="site-footer-links">
          <a href="#especialidades">Especialidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#contato">Contato</a>
          <a href="/login">Área do sistema</a>
        </div>
        <small>Projeto acadêmico - Informações demonstrativas.</small>
      </footer>
    </div>
  );
}
