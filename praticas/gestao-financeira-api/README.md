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

## 6. Testar o app

Com a API rodando e o emulador aberto, siga o roteiro abaixo para testar todas as funcionalidades:

### 6.1 — Cadastro e Login
1. Na tela inicial clique em **"Não tem conta? Cadastre-se"**
2. Preencha nome, email e senha (mínimo 6 caracteres) e clique em **"Cadastrar"**
3. O app vai logar automaticamente e redirecionar para a tela principal
4. Confirme que aparece **"Olá, [seu nome]! 👋"** no topo da tela
5. Para testar a validação, tente logar com senha errada — deve aparecer **"Email ou senha inválidos!"**

### 6.2 — Adicionar Transação
1. Clique no botão **"+"** no menu inferior
2. Preencha descrição, valor, data e selecione uma categoria
3. Clique em **"Adicionar"** — deve aparecer **"Transação adicionada com sucesso!"**
4. Volte para a aba **"Transações"** e confirme que apareceu na lista

### 6.3 — Editar Transação
1. Na aba **"Transações"**, faça **toque longo** em uma transação
2. Selecione **"Editar"** no menu que aparecer
3. Altere a descrição ou valor e clique em **"Salvar"**
4. Confirme que a transação foi atualizada na lista

### 6.4 — Excluir Transação
1. Na aba **"Transações"**, faça **toque longo** em uma transação
2. Selecione **"Excluir"** e confirme
3. A transação deve desaparecer da lista

### 6.5 — Filtro de Mês/Ano
1. Na aba **"Transações"**, use as setas **"<"** e **">"** para navegar entre os meses
2. Confirme que só aparecem as transações do mês selecionado
3. O mesmo filtro funciona na aba **"Resumo"**

### 6.6 — Pull-to-refresh
1. Na aba **"Transações"**, puxe a lista de cima para baixo
2. Os dados devem ser recarregados do servidor

### 6.7 — Categorias Customizadas
1. Clique na aba **"Categorias"**
2. Confirme que aparecem as 5 categorias padrão (Alimentação, Casa, Educação, Renda, Viagens)
3. Crie uma nova categoria preenchendo nome técnico, nome de exibição, ícone e cor
4. A nova categoria deve aparecer na lista com o badge **"personalizada"**
5. Verifique que ela também aparece no seletor ao adicionar uma transação
6. Tente excluir uma categoria padrão — deve aparecer erro **"Categorias padrão não podem ser excluídas"**
7. Exclua a categoria personalizada criada — deve funcionar normalmente

### 6.8 — Resumo com Gráfico
1. Clique na aba **"Resumo"**
2. Confirme que aparece o gráfico de pizza com as despesas por categoria
3. Use o filtro de mês/ano para ver os totais de outros meses
4. Confirme que o saldo (Renda − Despesas) está correto

### 6.9 — Logout
1. Na aba **"Transações"**, clique no ícone de saída no canto superior direito
2. O app deve redirecionar para a tela de login

### 6.10 — Verificar no banco
Para confirmar que os dados estão sendo salvos no PostgreSQL, abra o pgAdmin e rode:

```sql
SELECT * FROM "User";
SELECT * FROM "Category";
SELECT * FROM "Transaction";
```

---

## 7. Funcionalidades implementadas

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
