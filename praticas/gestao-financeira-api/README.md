# gestao-financeira-api

API REST para o app de gestão financeira, construída com **Express + Prisma + PostgreSQL**.

## Arquitetura
```
[ App React Native ]  --HTTP-->  [ API Express ]  --Prisma-->  [ PostgreSQL ]
gestao-financeira/             gestao-financeira-api/         localhost:5432

```
## Pré-requisitos

- Node.js LTS instalado
- PostgreSQL instalado e rodando
- Postman (para testar os endpoints)
- Android Studio com emulador configurado (para rodar o app)

---

## 1. Configurar o banco de dados

Abra o pgAdmin (ou psql) e crie o banco:

```sql
CREATE DATABASE gestao_financeira;
```

---

## 2. Configurar a API

Dentro da pasta `gestao-financeira-api/`:

**Instale as dependências:**
```bash
npm install
```

**Copie o `.env.example` para `.env`:**
```bash
cp .env.example .env
```

> ⚠️ **Atenção:** edite o `.env` com o usuário e senha do seu PostgreSQL antes de continuar!

**O `.env` deve ficar assim:**
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/gestao_financeira"
PORT=3000
JWT_SECRET="gestao_financeira_2026_chave_secreta"
```

> O usuário padrão do PostgreSQL é `postgres`. Troque `SUA_SENHA` pela sua senha. Se não tiver senha, deixe assim: `postgresql://postgres:@localhost:5432/gestao_financeira`

**Rode a migration para criar as tabelas:**
```bash
npx prisma migrate dev
```

**Popule as categorias iniciais:**
```bash
npm run prisma:seed
```

**Suba o servidor:**
```bash
npm run dev
```

A API estará rodando em `http://localhost:3000`. Teste no navegador — deve aparecer:
```json
{ "ok": true, "name": "gestao-financeira-api" }
```

---

## 3. Configurar o app React Native

Dentro da pasta `gestao-financeira/`:

**Instale as dependências:**
```bash
npm install
```

**Copie o `.env.example` para `.env`:**
```bash
cp .env.example .env
```

O arquivo `.env` já vem configurado para o emulador Android:
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

> Para device físico Android, troque `10.0.2.2` pelo IP da sua máquina (descubra com `ipconfig`).
> Para iOS Simulator, use `http://localhost:3000`.

> ⚠️ **Atenção:** após criar ou alterar o `.env`, reinicie o `expo start` para as variáveis serem carregadas.

**Suba o app:**
```bash
npx expo start
```

Aperte **A** para abrir no emulador Android.

---

## 4. Rodar tudo junto

Abra **2 terminais**:

| Terminal | Pasta | Comando |
|---|---|---|
| 1 | `gestao-financeira-api/` | `npm run dev` |
| 2 | `gestao-financeira/` | `npx expo start` |
| 3 (opcional) | `gestao-financeira-api/` | `npm run prisma:studio` |

---

## 5. Testar os endpoints no Postman

Importe a collection do Postman localizada em `postman/collection.json`.

Configure a variável de ambiente:
- **Variable:** `baseUrl`
- **Value:** `http://localhost:3000`

### Endpoints disponíveis

#### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastrar usuário |
| POST | `/auth/login` | Fazer login |

#### Categorias
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categories` | Listar todas |
| POST | `/categories` | Criar nova |
| PUT | `/categories/:id` | Atualizar |
| DELETE | `/categories/:id` | Excluir |

#### Transações
| Método | Rota | Descrição |
|---|---|---|
| GET | `/transactions` | Listar todas |
| POST | `/transactions` | Criar nova |
| PUT | `/transactions/:id` | Atualizar |
| DELETE | `/transactions/:id` | Excluir |

---

## 6. Funcionalidades do app

- ✅ Tela de login e cadastro com autenticação JWT
- ✅ Mensagem de boas-vindas com nome do usuário
- ✅ Listagem de transações com filtro de mês/ano
- ✅ Adicionar, editar e excluir transações (long press + modal)
- ✅ Categorias customizadas além das 5 padrão
- ✅ Gráfico de pizza no resumo por categoria
- ✅ Pull-to-refresh para atualizar os dados

---

## Scripts disponíveis

```bash
npm run dev             # Sobe o servidor em modo desenvolvimento
npm run start           # Sobe o servidor em modo produção
npm run prisma:migrate  # Roda as migrations
npm run prisma:seed     # Popula as categorias iniciais
npm run prisma:studio   # Abre o Prisma Studio (interface visual do banco)
```
