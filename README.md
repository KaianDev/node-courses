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
- **Testes**: Suíte completa de testes com Vitest e Supertest
- **Factories**: Factories para criação de dados de teste
- **Coverage**: Relatórios de cobertura de código

## 🚀 Tecnologias

- **Backend**: Node.js + Fastify
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Documentação**: Swagger + Scalar
- **Logging**: Pino
- **Linting**: Biome
- **Containerização**: Docker
- **Testes**: Vitest + Supertest
- **Factories**: Faker.js para dados de teste

## 📋 Pré-requisitos

- Node.js 22.18+
- Docker e Docker Compose
- PostgreSQL (opcional, se não usar Docker)

## 🛠️ Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/KaianDev/node-courses.git
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
- `npm run db:seed` - Popula o banco com dados de exemplo
- `npm run test` - Executa todos os testes
- `npm run pretest` - Executa migrações de teste antes dos testes

## 🧪 Testes

### Executando os testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test -- --watch

# Executar testes com coverage
npm run test -- --coverage
```

### Estrutura de testes

O projeto inclui uma suíte completa de testes com:

- **Vitest**: Framework de testes moderno e rápido
- **Supertest**: Biblioteca para testar APIs HTTP
- **Factories**: Factories para criar dados de teste consistentes
- **Coverage**: Relatórios de cobertura de código

### Factories de teste

Localizadas em `src/tests/factories/`:

- `make-course.ts` - Factory para criar cursos de teste
- `make-enrollment.ts` - Factory para criar matrículas de teste
- `get-course.ts` - Factory para buscar cursos de teste

### Configuração de testes

Os testes utilizam:

- Banco de dados separado para testes
- Migrações automáticas antes da execução
- Factories para dados consistentes
- Coverage reports em múltiplos formatos

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

### Tabela de Matrículas

- `id`: UUID (chave primária)
- `userId`: ID do usuário (chave estrangeira)
- `courseId`: ID do curso (chave estrangeira)
- `enrolledAt`: Data da matrícula

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

## 🧪 Desenvolvimento

### Estrutura do projeto

```
src/
├── app.ts              # Configuração principal da aplicação
├── server.ts           # Servidor HTTP
├── env.ts              # Configuração de variáveis de ambiente
├── database/
│   ├── client.ts       # Cliente do banco de dados
│   ├── schema.ts       # Schemas das tabelas
│   └── seed.ts         # Script para popular o banco
├── routes/             # Rotas da API
│   ├── create-course.ts
│   ├── delete-course.ts
│   ├── get-course-by-id.ts
│   ├── get-courses.ts
│   ├── health.ts
│   └── update-course.ts
└── tests/              # Testes da aplicação
    └── factories/      # Factories para dados de teste
        ├── make-course.ts
        ├── make-enrollment.ts
        └── get-course.ts
```

### Configuração de ambiente

Para testes, crie um arquivo `.env.test`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5433/courses_test
NODE_ENV=test

```
