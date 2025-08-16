# 🎓 API de Cursos

Uma API REST moderna e robusta para gerenciamento de cursos, construída com Fastify, TypeScript e PostgreSQL.

## ✨ Características

- **Fastify**: Framework web rápido e eficiente
- **TypeScript**: Tipagem estática para maior segurança
- **PostgreSQL**: Banco de dados relacional robusto
- **Drizzle ORM**: ORM moderno e type-safe
- **Zod**: Validação de schemas
- **Swagger**: Documentação automática da API
- **Docker**: Containerização para desenvolvimento

## 🚀 Tecnologias

- **Backend**: Node.js + Fastify
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Documentação**: Swagger + Scalar
- **Logging**: Pino
- **Linting**: Biome
- **Containerização**: Docker

## 📋 Pré-requisitos

- Node.js 22.18+
- Docker e Docker Compose
- PostgreSQL (opcional, se não usar Docker)

## 🛠️ Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd node-courses
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Configure as seguintes variáveis:

   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/courses
   NODE_ENV=development
   ```

4. **Inicie o banco de dados com Docker**

   ```bash
   docker-compose up -d
   ```

5. **Execute as migrações**
   ```bash
   npm run db:migrate
   ```

## 🚀 Executando a aplicação

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3333`

### Produção

```bash
npm start
```

## 📚 Scripts disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run db:generate` - Gera novas migrações do banco de dados
- `npm run db:migrate` - Executa as migrações pendentes
- `npm run db:studio` - Abre o Drizzle Studio para visualizar o banco

## 🗄️ Estrutura do Banco de Dados

### Tabela de Usuários

- `id`: UUID (chave primária)
- `name`: Nome do usuário
- `email`: Email único do usuário

### Tabela de Cursos

- `id`: UUID (chave primária)
- `title`: Título do curso
- `description`: Descrição do curso
- `createdAt`: Data de criação

## 🔌 Endpoints da API

### Health Check

- `GET /health` - Verifica o status da aplicação

### Cursos

- `GET /courses` - Lista todos os cursos
- `GET /courses/:id` - Busca um curso específico
- `POST /courses` - Cria um novo curso
- `PUT /courses/:id` - Atualiza um curso existente
- `DELETE /courses/:id` - Remove um curso

## 📖 Documentação da API

Em modo de desenvolvimento, a documentação Swagger estará disponível em:

- **API Reference**: `/docs`

## 🔄 Fluxo da Aplicação

```mermaid
graph TD
    A[Cliente] --> B[Fastify Server]
    B --> C{Validação Zod}
    C -->|Sucesso| D[Route Handler]
    C -->|Erro| E[Erro de Validação]
    D --> F[Database Query]
    F --> G{PostgreSQL}
    G -->|Sucesso| H[Resposta JSON]
    G -->|Erro| I[Erro do Banco]
    H --> A
    I --> A
    E --> A

    subgraph "Rotas Disponíveis"
        J[GET /health]
        K[GET /courses]
        L[GET /courses/:id]
        M[POST /courses]
        N[PUT /courses/:id]
        O[DELETE /courses/:id]
    end

    subgraph "Validação de Dados"
        P[Schema Zod]
        Q[Type Safety]
        R[Runtime Validation]
    end

    subgraph "Banco de Dados"
        S[Users Table]
        T[Courses Table]
        U[Drizzle ORM]
    end

    D --> J
    D --> K
    D --> L
    D --> M
    D --> N
    D --> O

    C --> P
    P --> Q
    P --> R

    F --> U
    U --> S
    U --> T
```

## 🐳 Docker

### Iniciar serviços

```bash
docker-compose up -d
```

### Parar serviços

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f
```

## 🧪 Desenvolvimento

### Estrutura do projeto

```
src/
├── app.ts              # Configuração principal da aplicação
├── server.ts           # Servidor HTTP
├── env.ts              # Configuração de variáveis de ambiente
├── database/
│   ├── client.ts       # Cliente do banco de dados
│   └── schema.ts       # Schemas das tabelas
└── routes/             # Rotas da API
    ├── create-course.ts
    ├── delete-course.ts
    ├── get-course-by-id.ts
    ├── get-courses.ts
    ├── health.ts
    └── update-course.ts
```
