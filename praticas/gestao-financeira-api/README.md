# gestao-financeira-api

API REST para o app de gestão financeira, construída com Express + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js LTS
- PostgreSQL instalado e rodando

## Como rodar

1. Instale as dependências:
```bash
npm install
```

2. Crie o banco no PostgreSQL:
```sql
CREATE DATABASE gestao_financeira;
```

3. Copie o `.env.example` para `.env` e preencha com seus dados:
```bash
cp .env.example .env
```

4. Rode a migration:
```bash
npx prisma migrate dev
```

5. Popule as categorias iniciais:
```bash
npm run prisma:seed
```

6. Suba o servidor:
```bash
npm run dev
```

A API estará rodando em `http://localhost:3000`.