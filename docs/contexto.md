# Introdução

Texto descritivo com a visão geral do projeto abordado. Inclui o contexto, o problema, os objetivos, a justificativa e o público-alvo do projeto.

<br>

## Problema
Nesse momento você deve apresentar o problema que a sua aplicação deve  resolver. No entanto, não é a hora de comentar sobre a aplicação.

Descreva também o contexto em que essa aplicação será usada, se  houver: empresa, tecnologias, etc. Novamente, descreva apenas o que de  fato existir, pois ainda não é a hora de apresentar requisitos  detalhados ou projetos.

Nesse momento, o grupo pode optar por fazer uso  de ferramentas como Design Thinking, que permite um olhar de ponta a ponta para o problema.

> **Links Úteis**:
> - [Objetivos, Problema de pesquisa e Justificativa](https://medium.com/@versioparole/objetivos-problema-de-pesquisa-e-justificativa-c98c8233b9c3)
> - [Matriz Certezas, Suposições e Dúvidas](https://medium.com/educa%C3%A7%C3%A3o-fora-da-caixa/matriz-certezas-suposi%C3%A7%C3%B5es-e-d%C3%BAvidas-fa2263633655)
> - [Brainstorming](https://www.euax.com.br/2018/09/brainstorming/)

<br>

## Objetivos

Aqui você deve descrever os objetivos do trabalho indicando que o objetivo geral é desenvolver um software para solucionar o problema apresentado acima. 

Apresente também alguns (pelo menos 2) objetivos específicos dependendo de onde você vai querer concentrar a sua prática investigativa, ou como você vai aprofundar no seu trabalho.
 
> **Links Úteis**:
> - [Objetivo geral e objetivo específico: como fazer e quais verbos utilizar](https://blog.mettzer.com/diferenca-entre-objetivo-geral-e-objetivo-especifico/)

<br>

## Justificativa

O mercado de jogos retrô tem ganhado cada vez mais relevância, seja pelo crescimento da comunidade de colecionadores, pelo aumento da nostalgia entre jogadores veteranos ou pela curiosidade das novas gerações. No entanto, a disponibilidade desses jogos é limitada nos dias atuais, especialmente no formato físico. Muitas locadoras tradicionais deixaram de existir, e o acesso a jogos antigos tornou-se restrito a coleções particulares ou a compras de títulos muitas vezes inflacionados.

Diante desse contexto, a criação de uma plataforma digital para locação de jogos retrô se justifica pela necessidade de modernizar o acesso a esse acervo, tornando a experiência mais acessível, organizada e conveniente para os usuários. A aplicação permitirá que tanto entusiastas quanto novos jogadores tenham a oportunidade de explorar títulos clássicos sem a necessidade de um grande investimento inicial na compra de mídias físicas.

Além disso, o projeto se destaca por sua abordagem híbrida (mobile e web), garantindo flexibilidade e acessibilidade. A proposta também beneficia empreendedores e donos de acervos, que poderão administrar suas coleções de maneira mais eficiente, alcançando um público maior e facilitando o gerenciamento das locações.

<br>

## Público-Alvo
A **NintendIN** tem como público-alvo entusiastas por videogames clássicos, aqueles que vivenciaram a era dos consoles dos anos 80 e 90, e jogadores mais jovens, que têm curiosidade sobre os clássicos e desejam experimentar jogos que definiram as bases da indústria de entretenimento eletrônico. O apelo nostálgico e a possibilidade de explorar jogos que não estão mais amplamente disponíveis nas plataformas modernas tornam esse público fiel e engajado.

### Usuários
 - **Participantes da Comunidade Geek/Nerd:** Pessoas que têm interesse por cultura pop, jogos, filmes e séries retro, colecionadores de itens vintage e fãs de eventos de cultura geek.
 - **Jogadores Antigos:** Aqueles que, apesar de estarem atualizados com as tecnologias de jogos modernos, têm uma conexão emocional e nostálgica com os jogos retro.
 - **Novas Geração de jogadores:** Jovens que têm curiosidade sobre jogos antigos e querem conhecê-los sem grandes investimentos.
 - **Colecionadores:** Pessoas que colecionam jogos e consoles, que podem ser atraídas pela oportunidade de experimentar títulos que não possuem e encontram dificuldade em disponibilidade de compra.
 - **Nostalgia Familiar**: Muitos pais podem querer relembrar os jogos da sua juventude com seus filhos, como uma maneira de compartilhar essa parte de sua história e cultura.

### Mapa de Stakeholders
- **Usuários Diretos:** Jogadores da antiga geração, Comunidade Geek/Nerd, Colecionadores.
- **Usuários Indiretos:** Jogadores da nova geração de jogos virtuais
- **Influenciadores:** Integrantes de Famílias, Grupos e Comunidades

<br>

# Especificações do Projeto

## Requisitos
As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

| ID      | Descrição do Requisito                                                            | Prioridade |
|---------|----------------------------------------------------------------------------------|------------|
| RF-001  | Permitir que o usuário realize seu cadastro                                     | ALTA       |
| RF-002  | Permitir que o usuário edite seus dados cadastrais                              | ALTA       |
| RF-003  | Permitir que o usuário exclua sua conta                                         | ALTA       |
| RF-004  | Permitir que o administrador cadastre novos jogos no sistema                   | ALTA       |
| RF-005  | Permitir que o administrador edite os dados dos jogos cadastrados              | ALTA       |
| RF-006  | Permitir que o administrador exclua jogos do catálogo                          | ALTA       |
| RF-007  | Permitir que o usuário visualize a lista de jogos disponíveis                  | ALTA       |
| RF-008  | Permitir que o usuário realize reservas de jogos disponíveis                   | ALTA       |
| RF-009  | Permitir que o usuário cancele suas reservas                                   | ALTA       |
| RF-010  | Ao reservar um jogo pelo sistema, o jogo fica reservado temporariamente por 24h | ALTA       |
| RF-011  | Impedir que um jogo já reservado seja alugado por outro usuário               | ALTA       |
| RF-012  | Se a reserva não for aprovada pelo administrador em até 24h, será cancelada   | ALTA       |
| RF-013  | A reserva deve ser completada fisicamente na loja e aprovada pelo administrador | ALTA       |
| RF-014  | Notificar o usuário sobre o status de sua reserva (confirmação, cancelamento) | MÉDIA      |
| RF-015  | Permitir que o administrador visualize todas as reservas realizadas           | MÉDIA      |
| RF-016  | Permitir que o usuário filtre os jogos por categoria, console ou ano         | MÉDIA      |
| RF-017  | Permitir que o administrador gere relatórios de reservas realizadas           | MÉDIA      |
| RF-018  | Após a reserva, o usuário tem até X dias para usufruir da locação. Após isso, será enviado um e-mail de alerta | MÉDIA |
| RF-019  | Enviar lembretes automáticos sobre a data de devolução dos jogos              | BAIXA      |
| RF-020  | Permitir que o usuário consiga prorrogar apenas uma vez sua entrega          | BAIXA      |

<br> 

### Requisitos Não Funcionais

| ID      | Descrição do Requisito Não Funcional                                             | Prioridade |
|---------|----------------------------------------------------------------------------------|------------|
|RNF-001|	O banco de dados deve ser capaz de armazenar e recuperar informações de pelo menos X jogos sem degradação de performance.	|ALTA|
|RNF-002|	O sistema deve utilizar autenticação segura com senha criptografada.	|ALTA|
|RNF-003|	As informações dos usuários devem ser armazenadas.	|ALTA|
|RNF-004|	A interface deve ser responsiva e acessível em dispositivos móveis e desktops.	|ALTA|
|RNF-005|	O sistema deve ser compatível com os navegadores mais populares (Chrome, Firefox, Edge, Safari).	|ALTA|
|RNF-006|	As páginas devem carregar em no máximo 6 segundos em condições normais de rede.	|MÉDIA|
|RNF-007|	O sistema deve bloquear a conta do usuário após 5 tentativas consecutivas de login mal-sucedidas.	|MÉDIA|
|RNF-008|	O sistema deve ser intuitivo e de fácil uso, proporcionando uma experiência fluida para todos os usuários. Garantindo compatibilidade com leitores de tela e contrastes adequados.	|MÉDIA|

<br>

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                                                                               |
|--|---------------------------------------------------------------------------------------------------------|
|01| O sistema deve estar disponível 24 horas por dia                                                        |
|02| O sistema deve permitir no máximo 3 tentativas de login antes de bloquear o usuário por 5 minutos       |
|03| O sistema deve permitir que um usuário compre no máximo 5 unidades do mesmo jogo por pedido             |
|04| Apenas usuários cadastrados podem deixar avaliações nos produtos                                        |
|05| O sistema deve permitir diferentes métodos de pagamento, incluindo cartão de crédito e boleto           |
|06| O site deve ter um layout compatível com celulares e tablets                                            |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

<br>

# Catálogo de Serviços

|ID|	Serviço	Descrição                                                                                    |
|--|------------------------------------------------------------------------------------------------------|
|Catálogo de Jogos|	Permite aos clientes visualizar e pesquisar jogos disponíveis para compra.            |
|Carrinho de Compras|	Permite adicionar, remover e modificar itens antes da finalização da compra.        |
|Processamento de Pagamento|	Garante pagamentos seguros via cartão de crédito, boleto e PIX.              |
|Gestão de Pedidos|	Registra e acompanha pedidos, permitindo ao usuário visualizar o status da compra.    |
|Avaliação de Produtos|	Usuários cadastrados podem deixar avaliações e comentários nos jogos.             |
|Controle de Estoque|	Atualiza automaticamente a quantidade de produtos disponíveis após cada compra.     |
|Suporte ao Cliente|	Canal de atendimento para dúvidas, trocas e devoluções.                              |

<br>

# Arquitetura da Solução

A imagem abaixo representa como a solução será arquitetada, visando atender os requisitos de maneira otimizada, tanto tecnologicamente quanto do conhecimento e domínio da equipe no uso das mesmas.

![arq](./img/arquitetura.png)

<br> 

# Tecnologias Utilizadas 

Essas são as tecnologias utilizadas para o desenvolvimento de nosso sistema de aluguel de jogos, **Nintendin**:  

| Atuação | Linguagem | Descrição |                                  
|---------|-----------|-----------|
| **Front-End**  | **`React`** <br><br>  **`React Native + Expo`** <br><br> **`JavaScript`** | Para a aplicação web, garantindo uma experiência interativa e responsiva. <br><br> Para o desenvolvimento do aplicativo mobile. <br><br>  Como linguagem principal para o frontend.| 
| **APIs**  | **`Axios`** <br><br> **`REST API`**| Biblioteca para realizar requisições HTTP de maneira simplificada, permitindo chamadas à API do backend. <br><br> O backend será estruturado para expor endpoints RESTful. | 
| **Back-End**  | **`Node.js + Express`** <br><br> **`PostgreSQL`** |  Para o desenvolvimento da API backend. <br><br> Utilizado como banco de dados relacional.|

| Atuação | Ferramenta de Desenvolvimento | Descrição |                                  
|---------|-----------|-----------|
| **IDE** | **`Visual Studio Code (VSCode)`** | Será a principal IDE utilizada no desenvolvimento, devido à sua versatilidade e ampla compatibilidade com extensões.  

<br>

## Hospedagem
| Atuação | Hospedagem | Descrição |                                  
|---------|-----------|-----------|
| **Front-End**  | **`Vercel`** | Suporte nativo para React. <br> Deploy fácil (basta conectar com Github). <br> Domínio gratuito (exemplo.vercel.app). <br> CI/CD integrado (atualiza ao dar push no repositório). |
| **Back-End** |**`Render`** | Hospeda APIs Node.js gratuitamente. <br> Banco de dados PostgreSQL grátis. <br> Embora desligue após períodos de inatividade, não é um problema tendo em vista o contexto da aplicação. |
| **Mobile** |**`Expo`** | Publicação no Expo Go para rodar em dispositivos físicos sem precisar de build nativo. <br> Expo EAS pode ser uma opção caso necessário, embora a hospedagem gratuita tenha limitações.| 
