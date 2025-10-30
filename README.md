# 🏥 Agendamento Médico

Este guia detalha os passos essenciais para configurar o ambiente de desenvolvimento, instalar as dependências necessárias e inicializar o banco de dados utilizando o **Prisma ORM** e **PostgreSQL**.

---

## 🚀 Configuração do Banco de Dados com Prisma

Siga os passos abaixo para preparar a camada de dados do projeto.

### 1. Pré-requisito: PostgreSQL

Certifique-se de que o seu servidor **PostgreSQL** esteja instalado e em execução, seja localmente, via Docker ou em um serviço em nuvem.

---

### 2. Instalação do Prisma ORM

O Prisma CLI é uma ferramenta de desenvolvimento essencial para criar schemas, rodar migrações e gerar o cliente.

```bash
# Instala o Prisma CLI como dependência de desenvolvimento
npm install prisma --save-dev