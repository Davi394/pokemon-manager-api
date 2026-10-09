# 🎮 PokéManager API — Entrega 2

![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-v5-lightgrey?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748?logo=prisma)
![Zod](https://img.shields.io/badge/Zod-v3-3E67B1)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean--Architecture-orange)
![Swagger](https://img.shields.io/badge/Documentation-Swagger-brightgreen?logo=swagger)

API RESTful para gerenciamento de Treinadores e Pokémons desenvolvida na disciplina de **Tópicos Especiais em Engenharia de Software** (UFF).

Esta é a **Entrega 2 (Persistência Relacional, Validação Zod e Integração PokéAPI)**, uma continuação da Entrega 1. Nesta etapa a aplicação passou a:

- persistir os dados em um banco **PostgreSQL** real, utilizando o **Prisma ORM**;
- consultar a **PokéAPI** oficial para buscar dados de Pokémons;
- permitir o **cadastro de treinadores** e a **captura de Pokémons**, com o limite de **6 Pokémons no time ativo**;
- validar **todas as requisições** (body, params e query) com **Zod**;
- tratar erros com uma **hierarquia de exceções de domínio** e um **middleware global**.

---

## 🏛️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture**, separando as responsabilidades em camadas.

```text
prisma/
├── migrations/                  # Histórico versionado das alterações no banco
└── schema.prisma                # Modelos: Pokemon, Trainer e Capture

src/
├── domain/
│   ├── entities/                # Pokemon, Trainer e Capture
│   ├── errors/                  # AppError, NotFoundError e ConflictError
│   ├── gateways/                # Contrato IPokeApiGateway
│   └── repositories/            # Contratos dos repositórios
│
├── application/
│   └── useCases/                # Casos de uso (catálogo, pokédex, treinadores e capturas)
│
├── infrastructure/
│   ├── database/
│   │   ├── in-memory/           # InMemoryPokemonRepository (Entrega 1)
│   │   └── prisma/              # Client, repositórios Prisma e PrismaErrorMapper
│   ├── http/
│   │   ├── controllers/
│   │   ├── middlewares/         # validateRequest (Zod) e errorHandler
│   │   ├── routes/
│   │   └── schemas/             # Schemas Zod
│   └── providers/               # FetchPokeApiGateway (integração com a PokéAPI)
│
└── main/
    ├── config/                  # Swagger
    ├── factories/               # Composição das dependências
    └── server.ts
```

### Responsabilidade das camadas

| Camada | Responsabilidade |
|---|---|
| **Domain** | Entidades, regras de negócio, erros e contratos (repositórios e gateway da PokéAPI) |
| **Application** | Casos de uso que orquestram as regras de negócio |
| **Infrastructure** | Implementações técnicas: Prisma, PokéAPI (Fetch), Express, Zod e middlewares |
| **Main** | Configuração, composição das dependências (factories) e inicialização do servidor |

Os casos de uso dependem apenas de **interfaces** (`IPokemonRepository`, `ITrainerRepository`, `ICaptureRepository` e `IPokeApiGateway`). As implementações concretas são escolhidas somente nas **factories**.

Por isso, a troca do `InMemoryPokemonRepository` pelo `PrismaPokemonRepository` foi feita alterando apenas a factory, **sem modificar a camada de Domínio, os casos de uso ou os controllers** do catálogo.

---

## 🧩 Fluxo da Aplicação

```text
Request
   ↓
Route
   ↓
validateRequest (Zod)  ── dados inválidos → 400
   ↓
Controller
   ↓
Use Case  ── regra de negócio violada → AppError (404 / 409)
   ↓
Repositório (Prisma) / Gateway (PokéAPI)
   ↓
Response
```

Qualquer erro lançado em qualquer camada chega ao **`errorHandler`**, que monta a resposta HTTP padronizada.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js 20+**
- **TypeScript** (modo estrito, com path aliases)
- **Express 5**
- **PostgreSQL 17**
- **Prisma ORM 6**
- **Zod 3**
- **Fetch API nativa do Node.js** (integração com a PokéAPI, sem bibliotecas extras)
- **tsx**
- **ESLint** e **Prettier**
- **Swagger UI Express** + **swagger-autogen** (OpenAPI 3.0)
- **Git e GitHub**

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Git
- **PostgreSQL** instalado e em execução localmente

> No Windows, o PostgreSQL pode ser instalado pelo instalador oficial da EDB (disponível em postgresql.org/download), que já inclui o **pgAdmin**. Este projeto foi desenvolvido com o PostgreSQL 17 na porta padrão `5432`.

### 1. Clonar o repositório

```bash
git clone https://github.com/Davi394/pokemon-manager-api.git
```

### 2. Entrar na pasta do projeto

```bash
cd pokemon-manager-api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Criar o banco de dados

Crie um banco chamado `pokemanager_db`. Pode ser pelo **pgAdmin** (botão direito em *Databases* > *Create* > *Database...*) ou pelo terminal:

```bash
psql -U postgres -c "CREATE DATABASE pokemanager_db;"
```

> No Windows, se o `psql` não estiver no PATH, use o caminho completo no PowerShell:
> `& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE pokemanager_db;"`

### 5. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
# Linux / Mac / Git Bash
cp .env.example .env
```

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env
```

Depois, abra o `.env` e substitua `SUA_SENHA_AQUI` pela senha do usuário `postgres`.

> ⚠️ O arquivo `.env` contém credenciais e **não é versionado** (está no `.gitignore`). Apenas o `.env.example`, sem segredos, vai para o GitHub.

### 6. Aplicar as migrations e gerar o Prisma Client

```bash
npx prisma migrate deploy
npx prisma generate
```

- `migrate deploy` cria as tabelas `pokemons`, `trainers` e `captures` a partir das migrations versionadas em `prisma/migrations/`.
- `generate` gera o Prisma Client com os tipos de cada tabela.

### 7. Executar em modo de desenvolvimento

```bash
npm run dev
```

O comando gera a documentação Swagger e inicia o servidor.

| Recurso | Endereço |
|---|---|
| API (base) | `http://localhost:3333/api/v1` |
| Documentação Swagger | `http://localhost:3333/api/docs` |

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo (fictício) |
|---|---|---|
| `PORT` | Porta do servidor HTTP | `3333` |
| `NODE_ENV` | Ambiente de execução. Em `development`, o Prisma exibe as queries SQL no terminal | `development` |
| `DATABASE_URL` | String de conexão com o PostgreSQL usada pelo Prisma | `postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/pokemanager_db?schema=public` |

---

## 📜 Scripts Disponíveis

| Comando | Função |
|---|---|
| `npm run dev` | Gera o Swagger e inicia o servidor em modo de desenvolvimento |
| `npm run build` | Gera o Swagger e compila o projeto TypeScript |
| `npm run lint` | Analisa o código utilizando ESLint e Prettier |
| `npm run lint:fix` | Executa o ESLint aplicando correções automáticas quando possível |
| `npm run format` | Executa o Prettier para padronizar a formatação dos arquivos |
| `npm run swagger` | Gera o arquivo da especificação Swagger/OpenAPI |

### Comandos do Prisma

| Comando | Função |
|---|---|
| `npx prisma migrate deploy` | Aplica as migrations existentes no banco |
| `npx prisma migrate dev --name <nome>` | Cria e aplica uma nova migration (durante o desenvolvimento) |
| `npx prisma generate` | Gera o Prisma Client a partir do `schema.prisma` |
| `npx prisma studio` | Abre uma interface gráfica para visualizar o banco no navegador |

---

## 📖 Endpoints REST

Todas as rotas têm o prefixo `/api/v1`.

### Catálogo local de Pokémons (Entrega 1, agora persistido no PostgreSQL)

| Método | Endpoint | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/v1/pokemons` | Lista os Pokémons do catálogo (filtro opcional `?type=`) | `200 OK` |
| POST | `/api/v1/pokemons` | Cadastra um Pokémon no catálogo | `201 Created` |
| GET | `/api/v1/pokemons/:id` | Busca um Pokémon pelo ID | `200 OK` |
| PUT | `/api/v1/pokemons/:id` | Atualiza um Pokémon | `200 OK` |
| DELETE | `/api/v1/pokemons/:id` | Remove um Pokémon | `204 No Content` |

### Pokédex e Treinadores (Entrega 2)

| Método | Endpoint | Descrição | Sucesso |
|---|---|---|---|
| GET | `/api/v1/pokedex/search?name=pikachu` | Consulta um Pokémon direto na PokéAPI oficial | `200 OK` |
| POST | `/api/v1/trainers` | Cadastra um treinador | `201 Created` |
| POST | `/api/v1/trainers/:trainerId/captures` | Captura um Pokémon para o time do treinador | `201 Created` |
| GET | `/api/v1/trainers/:trainerId/team` | Lista o time atual do treinador | `200 OK` |

Todos os endpoints podem ser executados pela interface do Swagger em `http://localhost:3333/api/docs`.

---

# 🔎 Busca na Pokédex (PokéAPI)

```http
GET /api/v1/pokedex/search?name=pikachu
```

Consulta a PokéAPI oficial e retorna um **DTO formatado**, apenas com os dados relevantes:

```json
{
  "data": {
    "pokedexId": 25,
    "name": "pikachu",
    "types": ["electric"],
    "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "stats": {
      "hp": 35,
      "attack": 55,
      "defense": 40,
      "specialAttack": 50,
      "specialDefense": 50,
      "speed": 90
    }
  }
}
```

- O nome é convertido para minúsculas antes da consulta (`Pikachu` funciona).
- Os tipos são ordenados pelo `slot` da PokéAPI (tipo principal primeiro).
- Os nomes dos atributos são convertidos para camelCase (`special-attack` → `specialAttack`).

---

# 🧑 Cadastro de Treinador

```http
POST /api/v1/trainers
```

```json
{
  "name": "Ash Ketchum",
  "email": "ash@pallet.com",
  "city": "Pallet"
}
```

Resposta (`201 Created`):

```json
{
  "message": "Treinador cadastrado com sucesso!",
  "data": {
    "id": "56a26ba7-4b1d-4cc8-acfe-1aad4cbccb57",
    "name": "Ash Ketchum",
    "email": "ash@pallet.com",
    "city": "Pallet"
  }
}
```

- O `id` é um **UUID** gerado pela própria entidade `Trainer` no momento da criação.
- O e-mail é convertido para minúsculas. Um e-mail já cadastrado (mesmo com letras maiúsculas) retorna `409 Conflict`.

---

# 🎯 Captura de Pokémon

```http
POST /api/v1/trainers/:trainerId/captures
```

```json
{
  "pokemonName": "pikachu"
}
```

O caso de uso executa, nesta ordem:

```text
1. O treinador existe?                 → não: 404 Not Found
2. O time já tem 6 Pokémons?           → sim: 409 Conflict
3. O Pokémon existe na PokéAPI?        → não: 404 / PokéAPI indisponível: 502
4. Salva a captura associada ao treinador → 201 Created
```

A verificação do limite acontece **antes** da consulta à PokéAPI, evitando uma chamada externa desnecessária quando o time já está cheio.

Resposta (`201 Created`):

```json
{
  "message": "Pokémon capturado com sucesso!",
  "data": {
    "id": "ea34c4e4-b59d-4c47-94de-a6b8aa128f63",
    "trainerId": "56a26ba7-4b1d-4cc8-acfe-1aad4cbccb57",
    "pokedexId": 25,
    "name": "pikachu",
    "types": ["electric"],
    "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "stats": {
      "hp": 35,
      "attack": 55,
      "defense": 40,
      "specialAttack": 50,
      "specialDefense": 50,
      "speed": 90
    },
    "capturedAt": "2026-10-09T14:53:40.139Z"
  }
}
```

A captura guarda um "retrato" dos dados da PokéAPI no momento da captura (imagem, tipos e atributos base). Assim, o time pode ser listado sem consultar a PokéAPI novamente.

---

# 👥 Time do Treinador

```http
GET /api/v1/trainers/:trainerId/team
```

```json
{
  "data": {
    "trainer": {
      "id": "56a26ba7-4b1d-4cc8-acfe-1aad4cbccb57",
      "name": "Ash Ketchum"
    },
    "total": 6,
    "team": [
      { "id": "...", "pokedexId": 25, "name": "pikachu", "...": "..." }
    ]
  }
}
```

- Os Pokémons são listados na ordem em que foram capturados.
- Um treinador sem capturas retorna `total: 0` e `team: []`.
- Um treinador inexistente retorna `404 Not Found`.

---

# ✅ Validação com Zod

Todas as requisições são validadas na entrada pelo middleware `validateRequest` (princípio **Fail-Fast**), antes de chegarem ao controller. Dados inválidos retornam `400 Bad Request` com a lista dos campos com problema.

| Rota | O que é validado |
|---|---|
| `GET /pokemons` | `type` (query): texto opcional, não vazio |
| `POST /pokemons` | `id` (texto), `name` (mín. 2 caracteres), `type` (texto), `hp`, `attack` e `defense` (inteiros maiores que zero) |
| `GET`, `PUT` e `DELETE /pokemons/:id` | `id` (params): texto não vazio |
| `PUT /pokemons/:id` | corpo igual ao do POST, sem o `id` |
| `GET /pokedex/search` | `name` (query): obrigatório, convertido para minúsculas; apenas letras, números e hífen |
| `POST /trainers` | `name` (mín. 3 caracteres), `email` (formato válido, minúsculas), `city` (mín. 2 caracteres) |
| `POST /trainers/:trainerId/captures` | `trainerId` (UUID) e `pokemonName` (mesmas regras do `name` da Pokédex) |
| `GET /trainers/:trainerId/team` | `trainerId` (UUID) |

Campos não previstos nos schemas são descartados automaticamente (proteção contra *Mass Assignment*).

Exemplo de resposta de validação:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Dados de entrada inválidos",
  "details": [
    { "field": "name", "message": "O nome deve ter no mínimo 2 caracteres" },
    { "field": "defense", "message": "O campo defense é obrigatório" }
  ]
}
```

---

# 🛡️ Tratamento Global de Erros

A aplicação utiliza uma **hierarquia de exceções de domínio**. Os casos de uso lançam erros com significado (`NotFoundError`, `ConflictError`) em vez de códigos HTTP soltos, e o middleware global `errorHandler` traduz cada erro para a resposta HTTP.

```text
AppError (message, statusCode, details?)
   ├── NotFoundError  → 404
   └── ConflictError  → 409
```

O `errorHandler` trata, nesta ordem:

1. **`AppError`** e suas filhas (erros de domínio e de validação);
2. **`ZodError`** que não tenha passado pelo `validateRequest` (rede de segurança);
3. **Erros conhecidos do Prisma**, traduzidos pelo `PrismaErrorMapper` (`P2002` → 409, `P2025` → 404, `P2003` → 400);
4. **Qualquer outro erro** → `500`, registrado no terminal sem expor detalhes internos ao cliente.

Todas as respostas de erro seguem o mesmo formato:

```json
{
  "status": "error",
  "statusCode": 409,
  "message": "O treinador já possui o limite máximo de 6 Pokémons em seu time"
}
```

### Status de erro utilizados

| Status | Situação |
|---|---|
| `400 Bad Request` | Dados de entrada inválidos (Zod) |
| `404 Not Found` | Pokémon do catálogo, treinador ou Pokémon da PokéAPI não encontrado |
| `409 Conflict` | ID de Pokémon já cadastrado, e-mail de treinador já cadastrado ou time com 6 Pokémons |
| `502 Bad Gateway` | PokéAPI indisponível, com erro ou sem resposta em até 5 segundos |
| `500 Internal Server Error` | Erro inesperado ou não mapeado |

> **Mudança em relação à Entrega 1:** o cadastro de um Pokémon com ID já existente passou de `400 Bad Request` para **`409 Conflict`**, seguindo a hierarquia de erros apresentada nas aulas (conflito de estado não é erro de formato da requisição).

---

# 🌐 Integração com a PokéAPI

- O contrato **`IPokeApiGateway`** fica na camada de Domínio (`src/domain/gateways`).
- A implementação **`FetchPokeApiGateway`** fica em `src/infrastructure/providers` e usa a **Fetch API nativa do Node.js**, sem bibliotecas adicionais.
- Cada consulta tem **tempo limite de 5 segundos** (`AbortSignal.timeout`).

| Resposta da PokéAPI | Resultado na API |
|---|---|
| Sucesso | DTO formatado |
| `404` (Pokémon inexistente) | `404 Not Found` |
| Outro erro, falha de conexão ou timeout | `502 Bad Gateway` |

---

# 💾 Persistência com PostgreSQL e Prisma

Os dados são armazenados no PostgreSQL. A estrutura do banco é definida em `prisma/schema.prisma` e versionada pelas migrations em `prisma/migrations/`.

| Tabela | Conteúdo |
|---|---|
| `pokemons` | Catálogo local de Pokémons (Entrega 1) |
| `trainers` | Treinadores (`email` com restrição `UNIQUE`) |
| `captures` | Capturas, ligadas ao treinador por **chave estrangeira** (`trainer_id`) |

Diferente da Entrega 1, os dados **permanecem salvos** após reiniciar o servidor.

O `InMemoryPokemonRepository` continua no projeto, mas não é mais utilizado pela factory. Ele poderá ser reaproveitado em testes unitários.

---

# 🧭 Decisões de Projeto

- **Captura como tabela própria:** a captura é uma entidade separada, ligada ao treinador, em vez de um `trainerId` no Pokémon do catálogo. Isso permite que um treinador tenha dois Pokémons da mesma espécie e mantém o catálogo independente.
- **Time ativo:** todas as capturas fazem parte do time. A 7ª captura é recusada com `409 Conflict`. O limite está na constante `MAX_ACTIVE_TEAM_SIZE` da entidade `Capture`.
- **"Sem alterar o Domínio":** a entidade `Pokemon` e o `IPokemonRepository` não foram modificados. Foram **acrescentados** novos arquivos de domínio (`Trainer`, `Capture`, repositórios, `IPokeApiGateway` e erros) e o campo opcional `details` no `AppError`.
- **E-mail duplicado verificado no caso de uso:** o `CreateTrainerUseCase` consulta o e-mail antes de gravar. A restrição `UNIQUE` do banco e o `PrismaErrorMapper` funcionam como segunda linha de defesa.
- **Express 5 e `req.query`:** no Express 5, `req.query` é somente leitura. O `validateRequest` redefine a propriedade com `Object.defineProperty` para entregar ao controller a query já validada pelo Zod.
- **Swagger:** cada arquivo de rotas declara o caminho completo do seu recurso (`/pokemons`, `/pokedex/search`, `/trainers`), e todas as rotas são montadas sob o prefixo `/api/v1` no `server.ts`. O gerador lê os arquivos de rotas diretamente, com `basePath: '/api/v1'`.

---

# ⚠️ Limitações Conhecidas

- **Capturas simultâneas:** se duas capturas do mesmo treinador chegarem exatamente ao mesmo tempo quando ele tiver 5 Pokémons, ambas podem passar pela verificação do limite. A solução exigiria uma transação com bloqueio no banco de dados.
- **Mapeamentos `P2002` e `P2003` do Prisma:** estão implementados, mas normalmente não são acionados, pois os casos de uso verificam e-mail duplicado e existência do treinador antes de gravar.
- **Sem cache da PokéAPI:** cada busca e cada captura consultam a PokéAPI.

---

# 📚 Swagger / OpenAPI

A documentação é gerada automaticamente pelo `swagger-autogen` (OpenAPI 3.0) e disponibilizada pelo `swagger-ui-express` em:

```text
http://localhost:3333/api/docs
```

As rotas estão organizadas em três grupos: **Pokemons**, **Pokedex** e **Trainers**.

---

# ✅ Qualidade do Código

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

O TypeScript está configurado em modo estrito e utiliza aliases para acesso às camadas: `@domain/*`, `@application/*`, `@infrastructure/*` e `@main/*`.

---

# 🧪 Validação Manual

Os cenários abaixo foram validados manualmente pelo Swagger, pelo navegador e pelo terminal:

- persistência do catálogo após reiniciar o servidor;
- CRUD do catálogo com `201`, `200`, `204`, `404` e `409` (ID duplicado);
- validação Zod com `400` e lista de campos (`details`);
- busca na Pokédex com `200`, `404` (Pokémon inexistente), `400` (nome inválido) e `502` (sem conexão com a internet);
- cadastro de treinador com `201`, `409` (e-mail duplicado, inclusive em maiúsculas) e `400`;
- 6 capturas com `201` e a 7ª recusada com `409`;
- captura para treinador inexistente (`404`), com UUID inválido (`400`) e de Pokémon inexistente (`404`);
- listagem do time com 6 Pokémons, time vazio, treinador inexistente (`404`) e UUID inválido (`400`).

---

# 👤 Autor

Desenvolvido por **Davi Coutinho Rangel**.

Disciplina: **Tópicos Especiais em Engenharia de Software** — UFF.