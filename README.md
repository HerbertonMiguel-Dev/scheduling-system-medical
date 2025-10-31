# 🏥 Agendamento Médico

Este guia detalha o processo de **configuração e inicialização completa** do ambiente de banco de dados, utilizando **Prisma ORM** e **PostgreSQL com Docker**.

---

## 🚀 Guia de Inicialização Rápida (Passo a Passo Único)

Siga esta sequência de comandos e ações para colocar o ambiente de desenvolvimento em funcionamento.

### 1. Pré-requisitos

Certifique-se de que o **Docker** e o **Node.js/npm** estão instalados e em execução.

### 2. Inicialização e Migração

Execute os comandos a seguir em sequência. **Após o `npx prisma init`, edite o arquivo `.env` antes de prosseguir com `docker compose up -d` e `npx dotenv ...`**.

```bash
# Instala o Prisma CLI, dotenv-cli e o @prisma/client
npm install prisma dotenv-cli --save-dev
npm install @prisma/client

# Cria o schema.prisma e o arquivo .env
npx prisma init

# --- AQUI VOCÊ DEVE EDITAR O ARQUIVO .env ---
# No seu .env, adicione a URL de conexão do Docker (substitua USUARIO/SENHA/DB):
# DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"

# Inicia o servidor PostgreSQL em segundo plano (requer que o Docker esteja ativo)
docker compose up -d

# Roda a migração, cria as tabelas e gera o Prisma Client
# O dotenv-cli garante que a DATABASE_URL seja carregada.
npx dotenv -e .env -- npx prisma migrate dev