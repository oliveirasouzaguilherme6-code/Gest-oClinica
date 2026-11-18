import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Carregando } from "../components/Carregando";
import { SistemaLayout } from "../components/SistemaLayout";
import { ApiError } from "../services/api";
import {
  excluirPaciente,
  listarPacientes,
  salvarPaciente,
} from "../services/cadastrosApi";
import type { DadosPaciente, Paciente } from "../services/cadastrosApi";

const formularioInicial: DadosPaciente = {
  nome: "",
  cpf: "",
  dataNascimento: "",
  telefone: "",
  email: "",
};

function somenteNumeros(valor: string): string {
  return valor.replace(/\D/g, "");
}

function formatarCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarData(data: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${data}T12:00:00`));
}

export function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [formulario, setFormulario] = useState<DadosPaciente>(formularioInicial);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarPacientes(): Promise<void> {
    try {
      setErro("");
      setPacientes(await listarPacientes());
    } catch (error) {
      const mensagemErro = error instanceof ApiError ? error.message : "Erro ao carregar pacientes.";

      if (mensagemErro.includes("sessão")) {
        window.location.replace("/login");
        return;
      }

      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarPacientes();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMensagem("");
    setErro("");
    setSalvando(true);

    try {
      await salvarPaciente({
        ...formulario,
        nome: formulario.nome.trim(),
        cpf: somenteNumeros(formulario.cpf),
        telefone: somenteNumeros(formulario.telefone),
        email: formulario.email.trim().toLowerCase(),
      }, idEmEdicao ?? undefined);

      setMensagem(idEmEdicao ? "Paciente atualizado com sucesso." : "Paciente cadastrado com sucesso.");
      setFormulario(formularioInicial);
      setIdEmEdicao(null);
      await carregarPacientes();
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : "Não foi possível salvar o paciente.");
    } finally {
      setSalvando(false);
    }
  }

  function editar(paciente: Paciente): void {
    setFormulario({
      nome: paciente.nome,
      cpf: paciente.cpf,
      dataNascimento: paciente.dataNascimento,
      telefone: paciente.telefone,
      email: paciente.email ?? "",
    });
    setIdEmEdicao(paciente.id);
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao(): void {
    setFormulario(formularioInicial);
    setIdEmEdicao(null);
  }

  async function confirmarExclusao(id: number): Promise<void> {
    try {
      await excluirPaciente(id);
      setMensagem("Paciente excluído com sucesso.");
      setIdParaExcluir(null);
      await carregarPacientes();
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : "Não foi possível excluir o paciente.");
    }
  }

  if (carregando) {
    return <Carregando />;
  }

  return (
    <SistemaLayout paginaAtiva="pacientes">
      <section className="crud-page">
        <div className="crud-heading">
          <div>
            <span className="eyebrow">Cadastro clínico</span>
            <h1>Pacientes</h1>
            <p className="description">Cadastre e mantenha os dados básicos dos pacientes.</p>
          </div>
          <span className="record-count">{pacientes.length} registro(s)</span>
        </div>

        <div className="crud-layout">
          <section className="card crud-form-card">
            <h2>{idEmEdicao ? "Editar paciente" : "Novo paciente"}</h2>

            {mensagem && <p className="feedback success" role="status">{mensagem}</p>}
            {erro && <p className="feedback error-box" role="alert">{erro}</p>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="paciente-nome">Nome completo</label>
                <input
                  id="paciente-nome"
                  value={formulario.nome}
                  onChange={(event) => setFormulario({ ...formulario, nome: event.target.value })}
                  required
                  minLength={2}
                />
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="paciente-cpf">CPF</label>
                  <input
                    id="paciente-cpf"
                    value={formulario.cpf}
                    onChange={(event) => setFormulario({ ...formulario, cpf: event.target.value })}
                    inputMode="numeric"
                    maxLength={14}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="paciente-nascimento">Data de nascimento</label>
                  <input
                    id="paciente-nascimento"
                    type="date"
                    value={formulario.dataNascimento}
                    onChange={(event) => setFormulario({ ...formulario, dataNascimento: event.target.value })}
                    max={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="paciente-telefone">Telefone</label>
                  <input
                    id="paciente-telefone"
                    value={formulario.telefone}
                    onChange={(event) => setFormulario({ ...formulario, telefone: event.target.value })}
                    inputMode="tel"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="paciente-email">E-mail (opcional)</label>
                  <input
                    id="paciente-email"
                    type="email"
                    value={formulario.email}
                    onChange={(event) => setFormulario({ ...formulario, email: event.target.value })}
                  />
                </div>
              </div>

              <div className="crud-form-actions">
                <button type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : idEmEdicao ? "Atualizar" : "Cadastrar"}
                </button>
                {idEmEdicao && (
                  <button className="outline-button" type="button" onClick={cancelarEdicao}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="card crud-list-card">
            <h2>Pacientes cadastrados</h2>

            {pacientes.length === 0 ? (
              <div className="empty-list">Nenhum paciente cadastrado.</div>
            ) : (
              <div className="record-list">
                {pacientes.map((paciente) => (
                  <article className="record-item" key={paciente.id}>
                    <div className="record-main">
                      <strong>{paciente.nome}</strong>
                      <span>CPF: {formatarCpf(paciente.cpf)}</span>
                      <span>Nascimento: {formatarData(paciente.dataNascimento)}</span>
                      <span>Telefone: {paciente.telefone}</span>
                    </div>

                    {idParaExcluir === paciente.id ? (
                      <div className="confirm-actions">
                        <span>Confirmar exclusão?</span>
                        <button type="button" onClick={() => void confirmarExclusao(paciente.id)}>Sim</button>
                        <button className="outline-button" type="button" onClick={() => setIdParaExcluir(null)}>Não</button>
                      </div>
                    ) : (
                      <div className="record-actions">
                        <button className="small-button" type="button" onClick={() => editar(paciente)}>Editar</button>
                        <button className="small-button danger-button" type="button" onClick={() => setIdParaExcluir(paciente.id)}>Excluir</button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </SistemaLayout>
  );
}
