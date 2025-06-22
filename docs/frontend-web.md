# Front-end Web
A NintendIN é uma plataforma de aluguel de jogos e consoles retrô com o objetivo de tornar acessível essa coletânia para os entusiastas da cultura pop e diferentes públicos. Sua plataforma Front-End é voltada para o uso administrativo da empresa, permitindo o gerenciamento dos aluguéis realizados pelos clientes, jogos e consoles em estoque e o acompanhamento das métricas da plataforma.

<br>

# Projeto da Interface Web
A aplicação apresenta uma interface moderna, funcional e intuitiva, com foco na usabilidade e na organização das informações para uma experiência agradável ao usuário. As cores utilizadas seguem com predominância dos tons amarelo, rosa, roxo e laranja para o login e os tons branco e roxo para as telas de visualização, contrastando com elementos em cores vibrantes para destacar ações e informações importantes.

## 🔐 Tela de Login

### Design Visual
Interface simples e direta, com fundo colorido e campos destacados em branco para entrada de dados.

### Layout
- Centralizado com campos para usuário e senha.
- Botão de login.
- Logo no topo.

### Interações
- Validação de campos obrigatórios (e-mail e senha).
- Redirecionamento para o dashboard após login bem-sucedido.

### Usabilidade
Foco total na ação de login, sem elementos distrativos.

---

## 🧭 Dashboard (Painel Principal)

### Design Visual
A interface do dashboard é moderna e intuitiva, com cards coloridos e ícones bem definidos, proporcionando uma navegação rápida e agradável. As cores seguem o padrão visual da aplicação — com fundo branco, e elementos visuais em tons que destacam a hierarquia da informação. Ícones minimalistas ajudam na identificação rápida das seções.

### Layout
- Barra lateral fixa à esquerda, com ícones verticais para acesso rápido às seções principais: Jogos, Reservas, Usuários e Consoles.
- Ícones possuem destaque visual ao serem selecionados (fundo com leve sombra e mudança de cor).
- Área principal dividida em cards grandes e interativos, centralizados ou em grade, representando cada seção.

#### Cada card exibe:
- Ícone ilustrativo.
- Nome da seção.
- Um contador ou resumo (ex: “15 jogos cadastrados”).
- Efeito de realce ao passar o cursor (hover).

### Interações
- Cada card exibe um contador.
- Itens da barra lateral redirecionam para uma tela específica.
- Feedback visual claro ao interagir com qualquer item (ex: animação suave, sombra ao clicar).

### Usabilidade
A estrutura é planejada para proporcionar acesso rápido, informações visuais resumidas e experiência agradável.

---

## 👤 Tela de Usuário

### Design Visual
Estrutura em tabela com cabeçalho destacado e fundo claro, contendo também cards com resumo de usuários cadastrados e usuários com mais reservas.

### Layout
- Tabela centralizada listando usuários com colunas como nome, e-mail e ações (editar/excluir).

### Interações
- Botão de “Adicionar novo usuário”.
- Ações de editar e excluir ao lado de cada registro.

### Usabilidade
Fácil gerenciamento de usuários com ações claras e diretas.

---

## 🎮 Tela de Jogos

### Design Visual
Estrutura em tabela, contendo a lista exibindo os jogos cadastrados, contendo também cards com resumo dos jogos, com contador de total de jogos e jogos mais alugados.

### Layout
- Tabela centralizada listando jogos com colunas como nome, console, preço, descrição e com botão de ação (editar/excluir).

### Interações
- Inclusão de novo jogo.
- Visualização e edição rápida de dados.

### Usabilidade
Interface visualmente atrativa com foco na identificação rápida dos jogos.

---

## 🕹️ Tela de Consoles

### Design Visual
Estrutura em tabela, utilizando lista e cards com resumo do total de consoles e console com mais jogos.

### Layout
- Tabela centralizada listando consoles com colunas como nome e quantidade de jogos, e com botão de ação (editar/excluir).

### Interações
- Cadastro, edição e exclusão de consoles.

### Usabilidade
Organização clara para manter o controle dos dispositivos disponíveis.

---

## 📅 Tela de Reservas

### Design Visual
Estrutura em tabela, utilizando lista e cards com resumo do total de reservas, reservas pendentes e reservas atrasadas.

### Layout
- Apresenta uma tabela de reservas com colunas como usuário, jogo, status, data e horário da reserva, data e horário da aprovação, data e horário da devolução.
- Estrutura de tabela bem definida com botões de ação (editar/excluir).

### Interações
- Criação de nova reserva.
- Edição/cancelamento de reservas existentes.

### Usabilidade
Permite gestão eficiente das reservas com clareza das informações.
### Wireframes


## 1. Tela de Login
![Tela de Login](./img/Wireframe%20-%20Login.png)

## 2. Tela de Dashboard
![Tela de Dashboard](./img/Wireframe%20-%20Dashboard.png)

## 3. Tela de Usuários
![Tela de Usuários](./img/Wireframe%20-%20Tela%20Usuários.png)

## 4. Tela de Reservas
![Tela de Reservas](./img/Wireframe%20-%20Tela%20Reservas.png)

## 5. Tela de Jogos
![Tela de Jogos](./img/Wireframe%20-%20Tela%20Jogos.png)

## 6. Tela de Consoles
![Tela de Consoles](./img/Wireframe_Tela_consoles.png)


## Design Visual

O design visual da interface é moderno, vibrante e acessível. A seguir estão os principais elementos que compõem o estilo do sistema:

### 🎨 Paleta de Cores

A identidade visual é baseada principalmente em tons de **roxo (purple)** como cor primária e **laranja (orange)** como cor de destaque.

#### Roxo (Purple)
- `#f3e8ff`
- `#e9d5ff`
- `#d8b4fe`
- `#c084fc`
- `#a855f7` ← cor primária
- `#9333ea`
- `#7e22ce`
- `#6b21a8`
- `#581c87`
- `#3b0764`

#### Laranja (Orange)
- `#fff7ed`
- `#ffedd5`
- `#fed7aa`
- `#fdba74`
- `#fb923c`
- `#f97316`
- `#ea580c`
- `#c2410c`
- `#9a3412`
- `#7c2d12`
- #### Branco (White)
- `#ffffff`
  
### 🔤 Tipografia

- **Fonte principal:** `Poppins, sans-serif`

### 🧩 Ícones

- Utilizamos a biblioteca **[@tabler/icons-react](https://tabler.io/icons)** para ícones vetoriais com estilo clean e alinhados à linguagem visual moderna.
- Os ícones são aplicados com consistência em botões, navegação e componentes de feedback.

### 🧱 Elementos Gráficos

- **Botões:** Cores sólidas com cantos levemente arredondados, sombras sutis e animações suaves de hover.
- **Cards:** Layouts com bordas arredondadas e sombreamento leve para destacar blocos de conteúdo.
- **Inputs e Selects:** Estilo minimalista.
- **Responsividade:** O layout é flexível e adaptável.

---

# Fluxo de Dados

![Userflow](./img/UserFlow.png)
<br>

## Tecnologias Utilizadas

Essas são as tecnologias utilizadas para o desenvolvimento de nosso sistema de aluguel de jogos, **Nintendin**:  

| Atuação | Linguagem / Biblioteca | Descrição |                                  
|---------|------------------------|-----------|
| **Front-End**  | **`React`** <br><br> **`JavaScript`** <br><br> **`React Router DOM`** | Para a aplicação web, garantindo uma experiência interativa e responsiva. <br><br> Como linguagem principal para o frontend. <br><br> Para gerenciamento de rotas SPA (Single Page Application). | 
| **Estilização e UI** | **`Mantine`** <br><br> **`@tabler/icons-react`** | Biblioteca de componentes e hooks para criação de UI moderna e acessível. <br><br> Ícones SVG integrados à interface com Mantine. |
| **APIs e Utilitários**  | **`Axios`** <br><br> **`Moment.js`** | Biblioteca para realizar requisições HTTP de maneira simplificada, permitindo chamadas à API do backend. <br><br> Para manipulação e formatação de datas. | 
| **Gráficos e Visualização** | **`Recharts`** | Biblioteca de gráficos baseada em componentes React para visualização de dados. |
| **Testes** | **`Testing Library (React, DOM, User Event, Jest DOM)`** | Conjunto de ferramentas para testes unitários e de comportamento em componentes React. |
| **Back-End**  | **`Node.js + Express`** <br><br> **`PostgreSQL`** | Para o desenvolvimento da API backend. <br><br> Utilizado como banco de dados relacional. |
| **Roteamento e Monitoramento** | **`Web Vitals`** | Para medir e reportar métricas de performance da aplicação. |

| Atuação | Ferramenta de Desenvolvimento | Descrição |                                  
|---------|-------------------------------|-----------|
| **IDE** | **`Visual Studio Code (VSCode)`** | Principal IDE utilizada no desenvolvimento, devido à sua versatilidade e ampla compatibilidade com extensões. |
| **Gerenciador de Pacotes** | **`Yarn`** | Utilizado para instalar e gerenciar dependências do projeto de forma rápida e eficiente. |

<br>

# Considerações de Segurança

Autenticação: é usado JWT para autenticação das requisições. Apenas após se autenticar o usuário conseguirá usar as aplicação. O token fica salvo no localStorage.

Autorização: apenas usuários com o cargo de administrador conseguem acessar essa aplicação. Os demais usuários de cargo comum, não conseguem acessar a aplicação.

É utilizado CORS para que apenas essa aplicação web se comunique com o servidor backend.

# Implantação

O sistema está hospedado na Vercel. A Vercel fornece ferramentas de desenvolvedor e infraestrutura de nuvem para criar, dimensionar e proteger uma web mais rápida e personalizada. Toda a infraestrutura é abstraída e nos é servida um domínio gratuito .vercel.app, basta escolher o repositório e fazer certas configurações. A hospedagem é linkada ao repositório e o deploy é feito automaticamente a cada mudança na branch main.

https://nintendin.vercel.app/login

# Testes
## 🔹 Cenário 1: [Login](./videos/Login/2025-05-10%2019-25-28.mkv)

```
Dado que o usuário está na tela inicial  
Quando preencher o e-mail e a senha corretamente  
E clicar no botão de login  
Então o sistema deve autenticar o usuário  
E redirecioná-lo para o ambiente interno da aplicação  
```

---

## 🔹 Cenário 2: [Consoles Criar, Editar, Visualizar, Deletar](./videos/Consoles/2025-05-10%2019-38-54.mkv)

```
Dado que o usuário acessa a seção de consoles  
Quando o usuário criar um novo console com dados válidos  
Então o console deve ser salvo com sucesso  

Quando o usuário editar um console existente  
Então as informações devem ser atualizadas  

Quando o usuário visualizar a lista de consoles  
Então todos os registros devem ser exibidos corretamente  

Quando o usuário deletar um console  
Então ele deve ser removido da base de dados  
```

---

## 🔹 Cenário 3: [Jogos Criar, Editar, Visualizar, Deletar](./videos/Jogos/2025-05-10%2019-41-03.mkv)

```
Dado que o usuário acessa a seção de jogos  
Quando o usuário criar um novo jogo com informações válidas  
Então o jogo deve ser adicionado à lista  

Quando o usuário editar um jogo existente  
Então as alterações devem ser aplicadas  

Quando o usuário visualizar os jogos disponíveis  
Então todos os jogos devem ser apresentados corretamente  

Quando o usuário excluir um jogo  
Então ele deve ser removido da listagem  
```

---

## 🔹 Cenário 4: [Reservas Criar, Editar, Visualizar, Deletar](./videos/Reservas/2025-05-12%2000-52-56.mkv)

```
Dado que o usuário está na seção de reservas  
Quando o usuário criar uma nova reserva  
Então ela deve ser registrada corretamente  

Quando o usuário editar uma reserva existente  
Então os dados devem ser atualizados  

Quando o usuário visualizar a lista de reservas  
Então todas as informações devem estar visíveis  

Quando o usuário excluir uma reserva  
Então ela deve ser removida do sistema  
```

---

## 🔹 Cenário 5: [Usuário Criar, Editar, Visualizar, Deletar](./videos/Usuário/2025-05-10%2019-29-00.mkv)

```
Dado que o usuário está na tela de gerenciamento de usuários  
Quando preencher o formulário com dados válidos e salvar  
Então o novo usuário deve ser cadastrado  

Quando o usuário editar um cadastro existente  
Então as informações devem ser atualizadas  

Quando o usuário visualizar a lista de usuários  
Então todos os cadastros devem ser listados  

Quando o usuário deletar um registro  
Então ele deve ser removido com sucesso  
```

---

## 🔹 Cenário 6: [Ordenação de Páginas](./videos/Ordenacao/2025-05-12%2000-44-00.mkv)

```
Dado que o usuário está em uma tabela com dados  
Quando o usuário clicar em uma coluna  
Então os registros devem ser ordenados com base na coluna selecionada  
```

---

## 🔹 Cenário 7: [Busca nas Páginas](./videos/Buscas/2025-05-12%2000-47-36.mkv)

```
Dado que o usuário está visualizando uma tabela de dados  
Quando digitar um termo no campo de busca  
Então os resultados devem ser filtrados conforme o termo inserido  
```

---

## 🔹 Cenário 8: [Logout](./videos/Logout/2025-05-12%2000-57-17.mkv)

```
Dado que o usuário está logado na aplicação  
Quando clicar no botão "Sair"  
Então a sessão deve ser encerrada  
E o usuário deve ser redirecionado para a tela de login  
```


# Referências

* Criação de Wireframes: https://www.figma.com/
* Criação do Fluxo de Dados:  https://www.canva.com/
