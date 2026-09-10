# 🎮 PokéManager API — Entrega 1

![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-API-lightgrey?logo=express)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean--Architecture-orange)
![Swagger](https://img.shields.io/badge/Documentation-Swagger-brightgreen?logo=swagger)

API RESTful desenvolvida para gerenciamento de um catálogo local de Pokémons na disciplina de **Tópicos Especiais em Engenharia de Software**.

Esta primeira entrega tem como foco a aplicação dos princípios de **Clean Architecture**, utilizando um repositório **In-Memory**, endpoints REST, documentação interativa com **Swagger/OpenAPI 3.0** e tratamento global de erros.

---

## 🏛️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture**, separando as responsabilidades da aplicação em diferentes camadas.

```text
src/
├── domain/
│   ├── entities/
│   ├── errors/
│   └── repositories/
│
├── application/
│   └── useCases/
│
├── infrastructure/
│   ├── database/
│   │   └── in-memory/
│   └── http/
│       ├── controllers/
│       ├── middlewares/
│       └── routes/
│
└── main/
    ├── config/
    ├── factories/
    └── server.ts
```

### Responsabilidade das camadas

| Camada | Responsabilidade |
|---|---|
| **Domain** | Entidades, regras de negócio, erros e contratos dos repositórios |
| **Application** | Casos de uso responsáveis pelas operações da aplicação |
| **Infrastructure** | Implementações técnicas, repositório em memória e camada HTTP |
| **Main** | Configuração, composição das dependências e inicialização do servidor |

A aplicação utiliza **inversão de dependência**: os casos de uso dependem da interface `IPokemonRepository`, enquanto a implementação concreta utilizada nesta entrega é `InMemoryPokemonRepository`.

---

## 🧩 Fluxo da Aplicação

Uma requisição HTTP percorre as seguintes camadas:

```text
Request
   ↓
Route
   ↓
PokemonController
   ↓
Use Case
   ↓
IPokemonRepository
   ↓
InMemoryPokemonRepository
   ↓
Response
```

Essa organização evita que as regras de negócio dependam diretamente do Express ou da forma utilizada para armazenar os dados.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js 20+**
- **TypeScript**
- **Express**
- **tsx**
- **ESLint**
- **Prettier**
- **Swagger UI Express**
- **swagger-autogen**
- **OpenAPI 3.0**
- **Git e GitHub**

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de iniciar, é necessário possuir:

- Node.js 20 ou superior
- npm
- Git

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

### 4. Executar em modo de desenvolvimento

```bash
npm run dev
```

O comando gera a documentação Swagger e inicia o servidor.

A API será executada em:

```text
http://localhost:3333
```

Endpoint base dos Pokémons:

```text
http://localhost:3333/api/v1/pokemons
```

Documentação interativa:

```text
http://localhost:3333/api/docs
```

---

## 📜 Scripts Disponíveis

| Comando | Função |
|---|---|
| `npm run dev` | Gera o Swagger e inicia o servidor em modo de desenvolvimento |
| `npm run build` | Gera o Swagger e compila o projeto TypeScript |
| `npm run lint` | Analisa o código utilizando ESLint e Prettier |
| `npm run swagger` | Gera o arquivo da especificação Swagger/OpenAPI |
| `npm run format` | Executa o Prettier para padronizar a formatação dos arquivos TypeScript |
| `npm run lint:fix` | Executa o ESLint aplicando correções automáticas quando possível |

---

## 📖 Endpoints REST

| Método | Endpoint | Descrição | Sucesso |
|---|---|---|---|
| POST | `/api/v1/pokemons` | Cadastra um novo Pokémon | `201 Created` |
| GET | `/api/v1/pokemons` | Lista todos os Pokémons | `200 OK` |
| GET | `/api/v1/pokemons?type=Electric` | Lista Pokémons filtrados por tipo | `200 OK` |
| GET | `/api/v1/pokemons/:id` | Busca um Pokémon pelo ID | `200 OK` |
| PUT | `/api/v1/pokemons/:id` | Atualiza um Pokémon | `200 OK` |
| DELETE | `/api/v1/pokemons/:id` | Remove um Pokémon | `204 No Content` |

Todos os endpoints também podem ser executados pela interface do Swagger em:

```text
http://localhost:3333/api/docs
```

---

# 🔍 Filtro por Tipo

O endpoint de listagem permite utilizar o parâmetro de consulta `type` para retornar somente Pokémons de determinado tipo.

### Listagem sem filtro

```http
GET /api/v1/pokemons
```

Retorna todos os Pokémons atualmente armazenados no catálogo.

Exemplo de resposta:

```json
{
  "data": [
    {
      "id": "25",
      "name": "Pikachu",
      "type": "Electric",
      "hp": 35,
      "attack": 55,
      "defense": 40
    }
  ]
}
```

### Listagem utilizando filtro

```http
GET /api/v1/pokemons?type=Electric
```

O parâmetro é recebido pela aplicação através de `req.query`.

Fluxo da operação:

```text
?type=Electric
      ↓
PokemonController
      ↓
ListPokemonsUseCase
      ↓
findByType("Electric")
      ↓
InMemoryPokemonRepository
```

Exemplo utilizando cURL:

```bash
curl --request GET \
  --url 'http://localhost:3333/api/v1/pokemons?type=Electric'
```

Resposta:

```json
{
  "data": [
    {
      "id": "25",
      "name": "Pikachu",
      "type": "Electric",
      "hp": 35,
      "attack": 55,
      "defense": 40
    }
  ]
}
```

Caso nenhum Pokémon possua o tipo informado, a requisição continua sendo válida e retorna `200 OK` com uma lista vazia:

```json
{
  "data": []
}
```

> Atualmente, a comparação do tipo considera exatamente o valor armazenado. Por exemplo, `Electric` corresponde a `Electric`.

---

# ➕ Cadastro de Pokémon

Para cadastrar um Pokémon:

```http
POST /api/v1/pokemons
```

### Corpo da requisição

```json
{
  "id": "25",
  "name": "Pikachu",
  "type": "Electric",
  "hp": 35,
  "attack": 55,
  "defense": 40
}
```

A entidade `Pokemon` possui regras de domínio para os atributos numéricos:

```text
hp > 0
attack > 0
defense > 0
```

Exemplo utilizando cURL:

```bash
curl --request POST \
  --url http://localhost:3333/api/v1/pokemons \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "25",
    "name": "Pikachu",
    "type": "Electric",
    "hp": 35,
    "attack": 55,
    "defense": 40
  }'
```

Em caso de sucesso:

```text
201 Created
```

Exemplo de resposta:

```json
{
  "message": "Pokémon criado com sucesso!",
  "data": {
    "id": "25",
    "name": "Pikachu",
    "type": "Electric",
    "hp": 35,
    "attack": 55,
    "defense": 40
  }
}
```

O sistema também verifica se já existe um Pokémon com o mesmo ID antes de realizar o cadastro.

---

# 🔎 Busca por ID

Para buscar um Pokémon específico:

```http
GET /api/v1/pokemons/25
```

O ID é obtido pela aplicação utilizando `req.params`.

Em caso de sucesso:

```text
200 OK
```

Exemplo:

```json
{
  "data": {
    "id": "25",
    "name": "Pikachu",
    "type": "Electric",
    "hp": 35,
    "attack": 55,
    "defense": 40
  }
}
```

Caso o ID não exista, a API retorna `404 Not Found`.

---

# ✏️ Atualização de Pokémon

Para atualizar um Pokémon:

```http
PUT /api/v1/pokemons/25
```

O ID é recebido através de `req.params` e os novos dados através de `req.body`.

Exemplo de corpo:

```json
{
  "name": "Pikachu Fortalecido",
  "type": "Electric",
  "hp": 50,
  "attack": 65,
  "defense": 45
}
```

Em caso de sucesso:

```text
200 OK
```

Caso o Pokémon não exista, a API retorna `404 Not Found`.

---

# 🗑️ Remoção de Pokémon

Para remover um Pokémon:

```http
DELETE /api/v1/pokemons/25
```

Em caso de sucesso:

```text
204 No Content
```

Como o status é `204`, nenhuma informação é enviada no corpo da resposta.

Se o ID informado não existir, a API retorna `404 Not Found`.

---

# 🛡️ Tratamento Global de Erros

A aplicação utiliza a classe `AppError` para representar erros conhecidos da aplicação e o middleware global `errorHandler` para transformar esses erros em respostas HTTP padronizadas.

O middleware é registrado após as rotas e a configuração do Swagger.

O fluxo de erro é:

```text
Use Case
   ↓
throw AppError
   ↓
errorHandler
   ↓
Resposta HTTP padronizada
```

## ID duplicado — 400 Bad Request

Ao tentar cadastrar um Pokémon cujo ID já está presente no catálogo:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Pokémon com este ID já está cadastrado."
}
```

## Pokémon não encontrado — 404 Not Found

Ao buscar, atualizar ou remover um ID inexistente:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Pokémon não encontrado no catálogo."
}
```

## Erro inesperado — 500 Internal Server Error

Erros que não foram mapeados como `AppError` são tratados como falhas internas.

O erro completo é registrado no servidor para diagnóstico, enquanto o cliente recebe apenas uma mensagem genérica:

```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Erro interno no servidor."
}
```

Isso evita que detalhes internos ou informações da stack de execução sejam enviados ao cliente.

### Status de erro utilizados

| Status | Situação |
|---|---|
| `400 Bad Request` | Tentativa de cadastro com ID já existente |
| `404 Not Found` | Pokémon solicitado não existe no catálogo |
| `500 Internal Server Error` | Erro inesperado ou não mapeado |

---

# 💾 Persistência In-Memory

Nesta entrega, os dados são armazenados pelo:

```text
InMemoryPokemonRepository
```

O repositório mantém os Pokémons em um array durante a execução da aplicação.

Isso significa que:

```text
Servidor inicia
      ↓
Catálogo vazio
      ↓
POST adiciona Pokémon
      ↓
GET / PUT / DELETE utilizam os mesmos dados
      ↓
Servidor é encerrado ou reiniciado
      ↓
Catálogo volta a ficar vazio
```

Portanto, os dados **não possuem persistência permanente nesta etapa**.

A integração com banco de dados pertence a uma entrega posterior.

---

# 📚 Swagger / OpenAPI

A documentação da API é gerada automaticamente utilizando:

```text
swagger-autogen
```

e disponibilizada por:

```text
swagger-ui-express
```

A interface pode ser acessada em:

```text
http://localhost:3333/api/docs
```

Pelo Swagger é possível:

- visualizar os endpoints disponíveis;
- consultar parâmetros e corpos das requisições;
- visualizar possíveis respostas HTTP;
- executar requisições diretamente pelo navegador.

A especificação utiliza **OpenAPI 3.0**.

---

# ✅ Qualidade do Código

O projeto utiliza ESLint e Prettier para padronização e análise do código.

Para verificar:

```bash
npm run lint
```

Para gerar a documentação e compilar o TypeScript:

```bash
npm run build
```

O TypeScript está configurado em modo estrito e utiliza aliases para acesso às diferentes camadas da aplicação.

Exemplos:

```text
@domain/*
@application/*
@infrastructure/*
@main/*
```

---

# 🧪 Validação Manual

As principais funcionalidades da API foram validadas utilizando a interface do Swagger.

Foram verificados os seguintes cenários:

- criação de Pokémon com retorno `201`;
- listagem completa com retorno `200`;
- filtro por tipo;
- busca por ID;
- atualização;
- remoção com retorno `204`;
- tentativa de cadastrar ID duplicado com retorno `400`;
- busca de Pokémon inexistente com retorno `404`;
- tratamento de erro inesperado com retorno `500`.

---

# 👤 Autor

Desenvolvido por **Davi Coutinho Rangel**.

Disciplina: **Tópicos Especiais em Engenharia de Software**.