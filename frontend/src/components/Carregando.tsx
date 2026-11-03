export function Carregando() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Carregando dados do sistema...</p>
    </div>
  );
}
