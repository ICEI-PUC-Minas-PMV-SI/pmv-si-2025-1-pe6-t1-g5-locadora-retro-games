# Introdução

Nos últimos anos, o mercado de jogos retrô tem crescido significativamente, impulsionado tanto pela nostalgia dos jogadores veteranos quanto pelo interesse de novas gerações em experimentar clássicos que marcaram época. No entanto, a disponibilidade desses jogos ainda é um desafio, pois muitas locadoras físicas foram descontinuadas e as opções digitais nem sempre oferecem uma experiência completa.

Diante desse cenário, este projeto tem como objetivo desenvolver uma aplicação híbrida (mobile e web) para a locação de jogos retrô, proporcionando aos usuários um acesso prático e organizado a um catálogo diversificado. A plataforma permitirá que os clientes explorem títulos, realizem reservas e acompanhem suas locações de forma intuitiva e eficiente.


## Problema

A escassez de locadoras físicas e a dificuldade de acesso a jogos retrô em formato físico limitam a experiência de muitos entusiastas de videogames clássicos. Além disso, a falta de um sistema digital eficiente para gerenciar empréstimos e devoluções dificulta tanto a administração de acervos particulares quanto a experiência do usuário final.

O problema central que buscamos solucionar é a falta de uma plataforma moderna e acessível para a locação de jogos retrô, permitindo que os usuários encontrem e reservem títulos de forma prática e segura, seja pelo celular ou pelo computador.

## Objetivos

**Objetivo Geral**

Desenvolver uma aplicação web e mobile que facilite a locação de jogos retrô, proporcionando uma interface intuitiva para a busca, reserva e administração dos jogos disponíveis.

**Objetivos Específicos**

- Criar um sistema de cadastro de usuários e locações, garantindo segurança e praticidade no processo de aluguel.

- Implementar um catálogo interativo com informações detalhadas sobre os jogos disponíveis.

- Desenvolver funcionalidades para reserva e devolução de jogos, otimizando a gestão do acervo.

- Criar notificações e lembretes para usuários sobre prazos de locação.

- Garantir a compatibilidade da aplicação em diferentes dispositivos, proporcionando uma experiência fluida tanto em web quanto mobile.



## Justificativa

Descreva a importância ou a motivação para trabalhar com esta aplicação que você escolheu. Indique as razões pelas quais você escolheu seus objetivos específicos ou as razões para aprofundar em certos aspectos do software.

O grupo de trabalho pode fazer uso de questionários, entrevistas e dados estatísticos, que podem ser apresentados, com o objetivo de esclarecer detalhes do problema que será abordado pelo grupo.

> **Links Úteis**:
> - [Como montar a justificativa](https://guiadamonografia.com.br/como-montar-justificativa-do-tcc/)

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


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)

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


>Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.
>Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem
- **Frontend** - Vercel
> - Suporte nativo para React.
> - Deploy fácil (basta conectar com Github).
> - Domínio gratuito (exemplo.vercel.app).
> - CI/CD integrado (atualiza ao dar push no repositório).
- **Backend** - Render
> - Hospeda APIs Node.js gratuitamente.
> - Banco de dados PostgreSQL grátis.
> - Embora desligue após períodos de inatividade, não é um problema tendo em vista o contexto da aplicação.
- **Mobile** - Expo
> - Publicação no Expo Go para rodar em dispositivos físicos sem precisar de build nativo.
> - Expo EAS pode ser uma opção caso necessário, embora a hospedagem gratuita tenha limitações.
