# Gestão Clínica

Sistema acadêmico para apoiar a administração de uma clínica ou consultório. O projeto está dividido em frontend React e API Node.js, com persistência em MySQL.

## Escopo da Sprint 1

Esta entrega contempla os itens pedidos na Sprint 1:

- Cadastro com nome, e-mail, CPF, senha e confirmação de senha.
- Validação de CPF, e-mail e nível de senha no frontend e no backend.
- Verificação de e-mail e CPF duplicados.
- Senha protegida por hash antes de ser salva.
- Mensagens de erro da API exibidas no formulário.
- Redirecionamento para o login após o cadastro.
- Gráfico de barras usando cadastros reais do MySQL.

Os módulos de pacientes, profissionais, serviços e consultas pertencem às próximas sprints.

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

Ao iniciar a API, o Sequelize cria as tabelas `usuarios` e `sessoes`.

## Como executar

No primeiro terminal:

```bash
cd backend
npm install
npm run dev
```

No segundo terminal:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Acesse [http://localhost:5173](http://localhost:5173).

## Rotas da API

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/api/usuarios` | Cadastrar usuário |
| POST | `/api/auth/login` | Validar credenciais e criar sessão |
| GET | `/api/auth/me` | Consultar a sessão atual |
| POST | `/api/auth/logout` | Encerrar a sessão |
| GET | `/api/estatisticas/cadastros` | Consultar cadastros por dia |
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
