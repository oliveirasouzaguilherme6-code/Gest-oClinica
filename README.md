
Estamos fazendo um site e sistema destinado pra uma clinica médica, aqui iremos cadastrar pacientes, profissionais e serviços, além de controlar o agendamento de consultas!!!!!!


- O adm escolhido que ira admnistrar o sistema;
- Os pacientes n possuem login;
- Os profissionais tbm n possuem login;
- N haverá prontuario, pagamento muito menos convênio;
- Sera somente usado dados fictícios por hora!;




Cruds: 

1 - Pacientes;
2 - Profissionais;
3 - Serviços;
4 - Consultas/Agendamentos;


Campos dos cruds:


*usuario do sistema*
id
nome
email
cpf
senhaHash
createdAt
updatedAt



*Paciente*
id
nome
cpf
dataNascimento
telefone
email
createdAt
updatedAt



*Profissional*
id
nome
cpf
registroProfissional
telefone
email
ativo
createdAt
updatedAt



*Serviço*
id
nome
descricao
duracaoMinutos
preco
ativo
createdAt
updatedAt



*Consulta (Agendada, concluida ou cancelada)*
id
pacienteId
profissionalId
servicoId
dataHora
status
observacao
createdAt
updatedAt