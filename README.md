# Gestão Clínica

Sistema acadêmico para apoiar a administração de uma clínica ou consultório. O projeto está dividido em frontend React e API Node.js, com persistência em MySQL.

## Estado atual do projeto

O cadastro de usuários da Sprint 1 está concluído. O sistema também avançou para metade dos quatro módulos principais planejados:

- Pacientes: CRUD completo.
- Profissionais: CRUD completo.
- Serviços: planejado para a próxima etapa.
- Consultas: planejado para a próxima etapa.

CRUD significa cadastrar, listar, editar e excluir registros.

## Sprint 1 concluída

Esta entrega contempla os itens pedidos na Sprint 1:

- Cadastro com nome, e-mail, CPF, senha e confirmação de senha.
- Validação de CPF, e-mail e nível de senha no frontend e no backend.
- Verificação de e-mail e CPF duplicados.
- Senha protegida por hash antes de ser salva.
- Mensagens de erro da API exibidas no formulário.
- Redirecionamento para o login após o cadastro.
- Gráfico de barras usando cadastros reais do MySQL.

Além da Sprint 1, os módulos de pacientes e profissionais já estão disponíveis no sistema.

## Site institucional e sistema

- O site institucional em `/` apresenta o projeto, os recursos disponíveis e as instruções para o primeiro acesso.
- A área da equipe começa no login (`/login`). Novos usuários podem criar uma conta em `/cadastro`.
- O painel (`/sistema`) e os indicadores (`/estatisticas`) exigem sessão autenticada.
- A API devolve um JWT válido por 8 horas no login. O front-end guarda o token em `localStorage` e o envia no cabeçalho `Authorization: Bearer <token>` ao consultar rotas protegidas. Ao sair, a API encerra a sessão e o navegador remove o token.

## Tecnologias

- Frontend: React, TypeScript e Vite.
- Backend: Node.js, Express, TypeScript e Sequelize.
- Banco de dados: MySQL pelo XAMPP.

## Estrutura

```text
Gest-oClinica/
├── backend/   API, regras de negócio e acesso ao banco
├── frontend/  interface React
└── README.md
```

## Preparação do banco

1. Inicie o MySQL no painel do XAMPP.
2. Crie um banco chamado `gestao_clinica`.
3. Copie `backend/.env.example` para `backend/.env`.
4. Ajuste os dados de conexão caso seu MySQL use outra porta ou senha.
5. Gere uma chave com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` e preencha `JWT_SECRET` no `backend/.env` com o valor gerado.

Ao iniciar a API, o Sequelize cria as tabelas `usuarios`, `sessoes`, `pacientes` e `profissionais`.

## Como executar

No primeiro terminal:

```bash
cd backend
npm ci
npm run dev
```

No segundo terminal:

```bash
cd frontend
npm ci
npm run dev
```

Abra [http://127.0.0.1:5173](http://127.0.0.1:5173). O XAMPP fornece o MySQL. O site e a API rodam nos dois terminais acima.

## Rotas da API

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/api/usuarios` | Cadastrar usuário |
| POST | `/api/auth/login` | Validar credenciais, criar sessão e devolver o JWT |
| GET | `/api/auth/me` | Consultar a sessão atual |
| POST | `/api/auth/logout` | Encerrar a sessão |
| GET | `/api/estatisticas/cadastros` | Consultar cadastros por dia |
| GET | `/api/pacientes` | Listar pacientes |
| POST | `/api/pacientes` | Cadastrar paciente |
| PUT | `/api/pacientes/:id` | Atualizar paciente |
| DELETE | `/api/pacientes/:id` | Excluir paciente |
| GET | `/api/profissionais` | Listar profissionais |
| POST | `/api/profissionais` | Cadastrar profissional |
| PUT | `/api/profissionais/:id` | Atualizar profissional |
| DELETE | `/api/profissionais/:id` | Excluir profissional |
| GET | `/api/health` | Verificar a disponibilidade da API |

## Regras do cadastro

- Nome entre 2 e 100 caracteres.
- E-mail em formato válido e não repetido.
- CPF válido e não repetido.
- Senha com no mínimo 8 caracteres, incluindo letra maiúscula, letra minúscula, número e símbolo.
- A confirmação de senha existe somente no frontend.
- A senha original nunca é armazenada ou devolvida pela API.

## Encapsulamento — Tech Forge

A classe `Cpf` protege o estado do objeto:

- O CPF normalizado fica no campo privado `#valor`.
- O construtor impede a criação de um objeto com CPF inválido.
- O getter `valor` permite somente a leitura do dado validado.
- Não há setter, evitando alteração indevida após a criação.

## Probabilidade e Estatística

A página `/estatisticas` apresenta um gráfico de barras com a quantidade de usuários cadastrados por dia. O objetivo é acompanhar a entrada de responsáveis no sistema. Os valores são consultados diretamente na tabela `usuarios`.
