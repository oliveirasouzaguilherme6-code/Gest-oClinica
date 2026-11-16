export function InicioPage() {
  return (
    <article className="card institutional-card" aria-labelledby="titulo-inicio">
      <header>
        <h1 id="titulo-inicio">Gestão Clínica</h1>
        <p>Sistema de apoio à rotina administrativa de clínicas e consultórios.</p>
        <a className="button-link secondary-button" href="/login">Acessar o sistema</a>
      </header>

      <section id="sobre" aria-labelledby="titulo-sobre">
        <h2 id="titulo-sobre">Sobre o projeto</h2>
        <p>
          O Gestão Clínica é um projeto acadêmico voltado para a equipe da recepção.
          A primeira versão cuida do acesso da equipe e do acompanhamento de cadastros.
          Os módulos de pacientes, profissionais, serviços e consultas estão previstos para as próximas etapas.
        </p>
      </section>

      <section id="recursos" aria-labelledby="titulo-recursos">
        <h2 id="titulo-recursos">Recursos disponíveis</h2>
        <ul>
          <li>Cadastro de usuários com validação de e-mail, CPF e senha.</li>
          <li>Painel da equipe com os dados da conta após o login.</li>
          <li>Estatísticas com o total de usuários e um gráfico de cadastros por dia.</li>
        </ul>
      </section>

      <section aria-labelledby="titulo-acesso">
        <h2 id="titulo-acesso">Primeiro acesso</h2>
        <p>
          <a href="/cadastro">Crie sua conta</a> e depois entre no sistema com o e-mail e a senha cadastrados.
        </p>
      </section>
    </article>
  );
}
