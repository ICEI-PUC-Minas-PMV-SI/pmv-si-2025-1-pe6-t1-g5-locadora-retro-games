# APIs e Web Services

_O planejamento de uma aplicação de APIS Web é uma etapa fundamental para o sucesso do projeto. Ao planejar adequadamente, você pode evitar muitos problemas e garantir que a sua API seja segura, escalável e eficiente._

### Descrição do Projeto:

<p align="justify">
O projeto tem como finalidade desenvolver uma plataforma para gerenciar aluguéis de mídias físicas e consoles em uma locadora de jogos retrô. Buscando tornar acessível esta coletânea ao público-alvo, o processo de aluguel tende a ser realizado de forma objetiva e eficiente. A aplicação, utilizando APIs e Web Services, permitirá que a plataforma possua um gerenciamento do estoque de jogos e consoles; a realização de reservas, devoluções e cancelamentos; o cadastro, edição e exclusão de clientes; e integração com soluções de pagamento.
</p>
<br>

## Objetivos da API

O objetivo é criar uma ferramenta prática, segura e moderna, que facilite a gestão do negócio e proporcione um atendimento de qualidade aos apaixonados por jogos clássicos. A aplicação deve ser intuitiva tanto para os administradores quanto para os clientes. 

- **Usuários**
  - Administrador: Permitir gerenciamento das contas de usuários.
  - Cliente: Permitir criar e gerenciar a própria conta.
  
- **Catálogo**
  - Administrador: Permitir adição, remoção e gerenciamento do controle de estoque dos jogos e consoles ofertados.
  - Cliente: Permitir visualização dos jogos e consoles. Esses serão adicionados ao carrinho pelo frontend (localStorage).
    
- **Reserva**
  - Administrador: Pode visualizar e cancelar as reservas (não há hard delete, nesse caso apenas muda seus status). Motivo: evitar perca de dados importantes de pagamentos.
  - Cliente: Permitir a realização de reservas das unidades de interesse do catálogo e checkout.

<br>

## Modelagem da Aplicação
[Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.]

<br>

## Tecnologias Utilizadas
Para o desenvolvimento do sistema foram utilizadas as seguintes tecnologias:

- **Node.js:** Tecnologia utilizada para o desenvolvimendo do Back-End.
- **Express e Prisma:** Tecnologia utilizada para o uso de Frameworks.
- **PostgreSQL:** Tecnologia utilizada para a criação e armazenamento do Banco de Dados.

<br>

## API Endpoints

Para acessar a documentação dos endpoints, basta acessar https://pmv-si-2025-1-pe6-t1-g5-locadora-retro.onrender.com/docs. Lá estará todos os detalhes das rotas disponíveis.

## Considerações de Segurança

Na aplicação para acessar as rotas é preciso estar autenticado. Usamos tokens JWT para confirmarmos se o usuário está autenticado. 

Na parte de autorização, os usuários possui uma relação com uma tabela de "role". Lá temos dois grandes grupos: administrador e usuário comum. Através de middlewares verificamos além da autenticação, o tipo de usuário para que certas ações no servidor sejam liberadas para o administrador e outras bloqueadas para usuários.

Quanto a proteção de ataques, nosso servidor possui algumas travas importantes como limite de requisições e timeouts para evitar ataques que comprometam a disponibilidade da aplicação.

Importante citar também que dados de senhas são encriptografados. Usamos hashes para salvar essas senhas no banco de dados e conferimos se o valor da senha bate com o hash para que os usuários se autentiquem. Tivemos o cuidado também de nunca retornar a senha criptografada pelas rotas, para evitar ataques de força bruta fora do servidor.

## Implantação

Para subir a aplicação em produção, foi necessário usar o Render. Ele nos permite um ambiente gratuito assim como um banco de dados. Nesse caso, para acessar a nossa api, basta acessar o site https://pmv-si-2025-1-pe6-t1-g5-locadora-retro.onrender.com.

Usamos um ambiente de produção específico, com env de produção para acesso ao Sandbox do Asaas, nosso gateway de pagamentos, endpoint do banco de dados do Render e o nosso segredo do JWT. A aplicação foi subida com configurações do Dockerfile.prod.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

A maioria das referências foram diretamente das documentações oficiais dos recursos que utilizamos. Alguns membros da equipe já possuíam certos conhecimentos que foram repassados durantes as reuniões internas.

- https://github.com/kelektiv/node.bcrypt.js

- https://github.com/auth0/node-jsonwebtoken

- https://docs.asaas.com/

- http://expressjs.com/

- https://docs.docker.com/

- https://nodejs.org/docs/latest/api/

- https://davibaltar.medium.com/documenta%C3%A7%C3%A3o-autom%C3%A1tica-de-apis-em-node-js-com-swagger-parte-2-usando-openapi-v3-cbc371d8c5ee