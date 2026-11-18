import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Carregando } from "../components/Carregando";
import { SistemaLayout } from "../components/SistemaLayout";
import { ApiError } from "../services/api";
import {
  excluirProfissional,
  listarProfissionais,
  salvarProfissional,
} from "../services/cadastrosApi";
import type { DadosProfissional, Profissional } from "../services/cadastrosApi";

const formularioInicial: DadosProfissional = {
  nome: "",
  cpf: "",
  registroProfissional: "",
  especialidade: "",
  telefone: "",
  email: "",
  ativo: true,
};

function somenteNumeros(valor: string): string {
  return valor.replace(/\D/g, "");
}

function formatarCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [formulario, setFormulario] = useState<DadosProfissional>(formularioInicial);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarProfissionais(): Promise<void> {
    try {
      setErro("");
      setProfissionais(await listarProfissionais());
    } catch (error) {
      const mensagemErro = error instanceof ApiError ? error.message : "Erro ao carregar profissionais.";

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
    void carregarProfissionais();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMensagem("");
    setErro("");
    setSalvando(true);

    try {
      await salvarProfissional({
        ...formulario,
        nome: formulario.nome.trim(),
        cpf: somenteNumeros(formulario.cpf),
        registroProfissional: formulario.registroProfissional.trim().toUpperCase(),
        especialidade: formulario.especialidade.trim(),
        telefone: somenteNumeros(formulario.telefone),
        email: formulario.email.trim().toLowerCase(),
      }, idEmEdicao ?? undefined);

      setMensagem(idEmEdicao
        ? "Profissional atualizado com sucesso."
        : "Profissional cadastrado com sucesso.");
      setFormulario(formularioInicial);
      setIdEmEdicao(null);
      await carregarProfissionais();
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : "Não foi possível salvar o profissional.");
    } finally {
      setSalvando(false);
    }
  }

  function editar(profissional: Profissional): void {
    setFormulario({
      nome: profissional.nome,
      cpf: profissional.cpf,
      registroProfissional: profissional.registroProfissional,
      especialidade: profissional.especialidade,
      telefone: profissional.telefone,
      email: profissional.email,
      ativo: profissional.ativo,
    });
    setIdEmEdicao(profissional.id);
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
      await excluirProfissional(id);
      setMensagem("Profissional excluído com sucesso.");
      setIdParaExcluir(null);
      await carregarProfissionais();
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : "Não foi possível excluir o profissional.");
    }
  }

  if (carregando) {
    return <Carregando />;
  }

  return (
    <SistemaLayout paginaAtiva="profissionais">
      <section className="crud-page">
        <div className="crud-heading">
          <div>
            <span className="eyebrow">Equipe clínica</span>
            <h1>Profissionais</h1>
            <p className="description">Gerencie profissionais, registros e especialidades.</p>
          </div>
          <span className="record-count">{profissionais.length} registro(s)</span>
        </div>

        <div className="crud-layout">
          <section className="card crud-form-card">
            <h2>{idEmEdicao ? "Editar profissional" : "Novo profissional"}</h2>

            {mensagem && <p className="feedback success" role="status">{mensagem}</p>}
            {erro && <p className="feedback error-box" role="alert">{erro}</p>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="profissional-nome">Nome completo</label>
                <input
                  id="profissional-nome"
                  value={formulario.nome}
                  onChange={(event) => setFormulario({ ...formulario, nome: event.target.value })}
                  required
                  minLength={2}
                />
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="profissional-cpf">CPF</label>
                  <input
                    id="profissional-cpf"
                    value={formulario.cpf}
                    onChange={(event) => setFormulario({ ...formulario, cpf: event.target.value })}
                    inputMode="numeric"
                    maxLength={14}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="profissional-registro">Registro profissional</label>
                  <input
                    id="profissional-registro"
                    value={formulario.registroProfissional}
                    onChange={(event) => setFormulario({ ...formulario, registroProfissional: event.target.value })}
                    placeholder="Ex.: CRM 12345"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="profissional-especialidade">Especialidade</label>
                <input
                  id="profissional-especialidade"
                  value={formulario.especialidade}
                  onChange={(event) => setFormulario({ ...formulario, especialidade: event.target.value })}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="profissional-telefone">Telefone</label>
                  <input
                    id="profissional-telefone"
                    value={formulario.telefone}
                    onChange={(event) => setFormulario({ ...formulario, telefone: event.target.value })}
                    inputMode="tel"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="profissional-email">E-mail</label>
                  <input
                    id="profissional-email"
                    type="email"
                    value={formulario.email}
                    onChange={(event) => setFormulario({ ...formulario, email: event.target.value })}
                    required
                  />
                </div>
              </div>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={formulario.ativo}
                  onChange={(event) => setFormulario({ ...formulario, ativo: event.target.checked })}
                />
                Profissional ativo
              </label>

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
            <h2>Profissionais cadastrados</h2>

            {profissionais.length === 0 ? (
              <div className="empty-list">Nenhum profissional cadastrado.</div>
            ) : (
              <div className="record-list">
                {profissionais.map((profissional) => (
                  <article className="record-item" key={profissional.id}>
                    <div className="record-main">
                      <div className="record-title-row">
                        <strong>{profissional.nome}</strong>
                        <span className={profissional.ativo ? "status-tag active" : "status-tag"}>
                          {profissional.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <span>{profissional.especialidade} - {profissional.registroProfissional}</span>
                      <span>CPF: {formatarCpf(profissional.cpf)}</span>
                      <span>{profissional.email}</span>
                    </div>

                    {idParaExcluir === profissional.id ? (
                      <div className="confirm-actions">
                        <span>Confirmar exclusão?</span>
                        <button type="button" onClick={() => void confirmarExclusao(profissional.id)}>Sim</button>
                        <button className="outline-button" type="button" onClick={() => setIdParaExcluir(null)}>Não</button>
                      </div>
                    ) : (
                      <div className="record-actions">
                        <button className="small-button" type="button" onClick={() => editar(profissional)}>Editar</button>
                        <button className="small-button danger-button" type="button" onClick={() => setIdParaExcluir(profissional.id)}>Excluir</button>
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
