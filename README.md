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
- **Autenticação JWT**: Sistema seguro de autenticação
- **OAuth2 Google**: Login social com Google
- **Controle de Roles**: Sistema de permissões (student/manager)
- **Matrículas**: Sistema de matrículas em cursos

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
- **Autenticação**: JWT + OAuth2
- **Criptografia**: Argon2 para senhas

## 📋 Pré-requisitos

- Node.js 22.18+
- Docker e Docker Compose
- PostgreSQL (opcional, se não usar Docker)
- Conta Google Developer (para OAuth2)

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
   JWT_SECRET=sua_chave_secreta_jwt_aqui
   BASE_URL=http://localhost:3333
   GOOGLE_CLIENT_ID=seu_google_client_id
   GOOGLE_CLIENT_SECRET=seu_google_client_secret
   ```

   **Nota**: Para usar o login com Google, você precisará:

   - Criar um projeto no Google Cloud Console
   - Habilitar a API OAuth2
   - Criar credenciais OAuth2
   - Configurar as URLs de redirecionamento

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

## 🔐 Sistema de Autenticação

### JWT (JSON Web Tokens)

A API utiliza JWT para autenticação segura:

- **Secret**: Configurado via variável de ambiente `JWT_SECRET`
- **Extração**: Automática do header `Authorization: Bearer <token>`
- **Payload**: Contém `sub` (ID do usuário) e `role` (papel do usuário)

### OAuth2 com Google

Login social integrado:

- **Endpoint**: `GET /login/google`
- **Callback**: `GET /login/google/callback`
- **Escopo**: `profile` e `email`
- **Auto-registro**: Usuários novos são automaticamente registrados como estudantes

### Controle de Roles

Sistema de permissões baseado em roles:

- **Student**: Pode se matricular em cursos e visualizar cursos
- **Manager**: Pode gerenciar cursos e visualizar todas as matrículas

## 🗄️ Estrutura do Banco de Dados

### Tabela de Usuários

- `id`: UUID (chave primária)
- `name`: Nome do usuário
- `email`: Email único do usuário
- `password`: Senha criptografada com Argon2
- `role`: Role do usuário (student/manager)

### Tabela de Cursos

- `id`: UUID (chave primária)
- `title`: Título único do curso
- `description`: Descrição do curso
- `createdAt`: Data de criação

### Tabela de Matrículas

- `id`: UUID (chave primária)
- `userId`: ID do usuário (chave estrangeira)
- `courseId`: ID do curso (chave estrangeira)
- `createdAt`: Data da matrícula
- **Constraint única**: Um usuário não pode se matricular mais de uma vez no mesmo curso

## 🔌 Endpoints da API

### Health Check

- `GET /health` - Verifica o status da aplicação

### Autenticação

- `POST /sessions` - Login tradicional (email/senha)
- `GET /login/google` - Inicia fluxo OAuth2 do Google
- `GET /login/google/callback` - Callback OAuth2 do Google
- `POST /students` - Registro de novos estudantes

### Cursos

- `GET /courses` - Lista todos os cursos (requer autenticação)
- `GET /courses/:id` - Busca um curso específico
- `POST /courses` - Cria um novo curso (requer role manager)
- `PUT /courses/:id` - Atualiza um curso existente (requer role manager)
- `DELETE /courses/:id` - Remove um curso (requer role manager)

### Matrículas

- `POST /enrollments` - Cria uma nova matrícula (requer autenticação)
- `GET /enrollments` - Lista todas as matrículas (requer role manager)

## 🔒 Segurança e Autenticação

### Hooks de Autenticação

- **`checkRequestJWT`**: Verifica e valida tokens JWT
- **`checkUserRole`**: Verifica se o usuário tem a role necessária

### Validação de Dados

- **Zod**: Validação de schemas em tempo de execução
- **Type Safety**: Validação de tipos em tempo de compilação
- **Sanitização**: Prevenção de ataques de injeção

### Criptografia

- **Argon2**: Hashing seguro de senhas
- **JWT**: Tokens seguros e verificáveis

## 🧪 Testes

### Executando os testes

```bash
# Executar todos os testes
npm run test
```

### Estrutura de testes

O projeto inclui uma suíte completa de testes com:

- **Vitest**: Framework de testes moderno e rápido
- **Supertest**: Biblioteca para testar APIs HTTP
- **Factories**: Factories para criar dados de teste consistentes
- **Coverage**: Relatórios de cobertura de código
- **Autenticação**: Testes com JWT e diferentes roles

### Factories de teste

Localizadas em `src/tests/factories/`:

- `make-course.ts` - Factory para criar cursos de teste
- `make-enrollment.ts` - Factory para criar matrículas de teste
- `make-user.ts` - Factory para criar usuários de teste
- `get-course.ts` - Factory para buscar cursos de teste

### Configuração de testes

Os testes utilizam:

- Banco de dados separado para testes
- Migrações automáticas antes da execução
- Factories para dados consistentes
- Coverage reports em múltiplos formatos
- Autenticação JWT para rotas protegidas

## 📖 Documentação da API

Em modo de desenvolvimento, a documentação Swagger estará disponível em:

- **API Reference**: `/docs`
- **Swagger UI**: Integrado com Scalar

## 🔄 Fluxo da Aplicação

```mermaid
graph TD
    A[Cliente] --> B[Fastify Server]
    B --> C{Autenticação JWT}
    C -->|Token Válido| D{Verificação de Role}
    C -->|Token Inválido| E[Erro 401]
    D -->|Role Permitida| F[Validação Zod]
    D -->|Role Insuficiente| G[Erro 403]
    F -->|Sucesso| H[Route Handler]
    F -->|Erro| I[Erro de Validação]
    H --> J[Database Query]
    J --> K{PostgreSQL}
    K -->|Sucesso| L[Resposta JSON]
    K -->|Erro| M[Erro do Banco]
    L --> A
    M --> A
    I --> A
    E --> A
    G --> A

    subgraph "Autenticação"
        N[JWT Verify]
        O[Role Check]
        P[OAuth2 Google]
    end

    subgraph "Rotas Disponíveis"
        Q[GET /health]
        R[GET /courses]
        S[GET /courses/:id]
        T[POST /courses]
        U[PUT /courses/:id]
        V[DELETE /courses/:id]
        W[POST /enrollments]
        X[GET /enrollments]
        Y[POST /sessions]
        Z[GET /login/google]
    end

    subgraph "Validação de Dados"
        AA[Schema Zod]
        BB[Type Safety]
        CC[Runtime Validation]
    end

    subgraph "Banco de Dados"
        DD[Users Table]
        EE[Courses Table]
        FF[Enrollments Table]
        GG[Drizzle ORM]
    end

    H --> R
    H --> S
    H --> T
    H --> U
    H --> V
    H --> W
    H --> X
    H --> Y
    H --> Z

    F --> AA
    AA --> BB
    AA --> CC

    J --> GG
    GG --> DD
    GG --> EE
    GG --> FF
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
│   ├── update-course.ts
│   ├── create-enrollment.ts
│   ├── get-enrollments.ts
│   ├── login.ts
│   ├── login-google.ts
│   └── register-student.ts
├── routes/hooks/       # Hooks de autenticação
│   ├── check-request-jwt.ts
│   └── check-user-role.ts
├── types/              # Definições de tipos
│   ├── fastify.d.ts
│   └── roles.ts
├── utils/              # Utilitários
│   └── get-authenticated-user-from-request.ts
└── tests/              # Testes da aplicação
    └── factories/      # Factories para dados de teste
        ├── make-course.ts
        ├── make-enrollment.ts
        ├── make-user.ts
        └── get-course.ts
```

### Configuração de ambiente

Para testes, crie um arquivo `.env.test`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5433/courses_test
NODE_ENV=test
JWT_SECRET=test_secret
BASE_URL=http://localhost:3333
GOOGLE_CLIENT_ID=test_client_id
GOOGLE_CLIENT_SECRET=test_client_secret
```

## 🚀 Novidades da Versão

### ✨ Funcionalidades Adicionadas

- **Sistema de Autenticação JWT**: Autenticação segura baseada em tokens
- **OAuth2 com Google**: Login social integrado
- **Controle de Roles**: Sistema de permissões (student/manager)
- **Sistema de Matrículas**: Gerenciamento completo de matrículas em cursos
- **Hooks de Segurança**: Middleware para proteção de rotas
- **Validação Avançada**: Schemas Zod para todas as rotas
- **Testes de Autenticação**: Cobertura completa de testes para rotas protegidas

### 🔒 Melhorias de Segurança

- **JWT Secret**: Configurável via variáveis de ambiente
- **Role-based Access Control**: Controle granular de permissões
- **Validação de Tokens**: Verificação automática de autenticação
- **Proteção de Rotas**: Middleware de segurança integrado

### 📊 Banco de Dados

- **Constraint Única**: Prevenção de matrículas duplicadas
- **Enum de Roles**: Tipagem segura para papéis de usuário
- **Relacionamentos**: Chaves estrangeiras para integridade referencial
- **Timestamps**: Rastreamento automático de criação de registros

### 🧪 Qualidade de Código

- **Factories de Teste**: Dados consistentes para testes
- **Coverage Reports**: Relatórios detalhados de cobertura
- **Type Safety**: Validação de tipos em tempo de compilação
- **Linting**: Configuração Biome para qualidade de código
