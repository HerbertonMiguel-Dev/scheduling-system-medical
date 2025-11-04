# 🩺 Scheduling System Medical

## 🧠 Sistema de Agendamento Médico Completo

Este projeto é um **sistema full-stack** para gerenciamento de **agendamentos médicos**, desenvolvido com **Next.js (App Router)**, **TypeScript** e **Prisma**, garantindo alta performance, tipagem forte e integração eficiente com banco de dados.

---

## 🏷️ Status do Projeto

> ✅ **Concluído — versão funcional e estável**

---

🏠 Página Inicial
![Página Inicial](./public/public.png)

### 📅 lista de Agendamentos
![Agendamento](./public/dashboard-1.png)

### Horarios de atendimento
![Agendamento](./public/2.png)

### dashboard de convenios 
![Agendamento](./public/3.png)

### dashboard de Especialidades 
![Agendamento](./public/4.png)

### 🧑‍⚕️ Dashboard Médico
![Dashboard](./public/5.png)

###  Dashboard Serviços
![Agendamento](./public/6.png)

###  Area de agendamento do paciente 
![Agendamento](./public/7.png)

###  Area de agendamento do paciente realizando agendamento 
![Agendamento](./public/8.png)

###  Listagem de atendimento com paciente  
![Agendamento](./public/9.png)

## 🎯 Funcionalidades Principais

O sistema é dividido em **duas grandes áreas**:

1. **Área Pública (Paciente)** — para agendamentos online  
2. **Painel Administrativo/Clínico** — para gestão interna da clínica

---

### 🚀 Área Pública (Agendamento Online)

- 🔎 **Busca por filtros:** Filtra **médicos, especialidades e convênios**
- ⏰ **Consulta de horários:** API calcula horários livres com base nos agendamentos existentes e duração dos serviços
- ✅ **Formulário validado com Zod:** Garantia de integridade e consistência nos dados enviados

---

### 📊 Painel de Controle (Dashboard)

- 📅 **Gestão de agendamentos:** Listagem e busca por data
- 🔍 **Detalhamento completo:** Exibe informações de paciente, serviço, médico e convênio
- ⚡ **Renderização otimizada:** Uso de `React.Suspense` para carregamento inteligente

---

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
|------------|-------------|-----------|
| **Framework** | [Next.js 14+](https://nextjs.org/) | Framework React full-stack (App Router, Server Actions) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estática e robustez |
| **Banco de Dados** | [Prisma ORM](https://www.prisma.io/) | ORM moderno para PostgreSQL |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) | Estilização rápida e responsiva |
| **Gerenciamento de Estado** | [TanStack Query](https://tanstack.com/query) | Cache e controle de requisições assíncronas |
| **UI/UX** | [shadcn/ui](https://ui.shadcn.com/) | Componentes acessíveis e reutilizáveis |

---

## ⚙️ Instalação Local

### 🧩 Pré-requisitos

- Node.js **v18+**
- npm ou yarn
- Banco de dados **PostgreSQL**

---

### 🪜 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/HerbertonMiguel-Dev/scheduling-system-medical.git
cd scheduling-system-medical

npm install


# .env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"


# Aplica o schema no banco
npx prisma db push

# Gera o cliente Prisma
npx prisma generate


npm run dev

O projeto estará disponível em:
👉 http://localhost:3000

🐳 Configuração com Docker (recomendada)
Pré-requisito

Certifique-se de ter o Docker Desktop instalado e rodando.

Passo 1: Build e Inicialização
# Faz o build e inicia os containers em background
docker-compose up --build -d


O docker-compose.yml injeta automaticamente a variável DATABASE_URL apontando para o serviço PostgreSQL interno.

🧱 Passo 2: Aplicar o Schema do Prisma

Após o contêiner subir:

docker-compose exec app npx prisma db push

Passo 3 (Opcional): Inserir Dados Iniciais (Seed)
docker-compose exec app npx prisma db seed


O sistema estará disponível em:
👉 http://localhost:3000

├── prisma/
│   └── schema.prisma         # Definição dos modelos de banco
├── src/
│   ├── api/                  # Rotas de API (lógica de agendamento)
│   │   ├── agendamento/
│   │   └── clinica/
│   ├── app/
│   │   ├── (panel)/          # Painel Administrativo
│   │   └── (public)/         # Área Pública (agendamentos)
│   │       ├── _data-access/ # Server Actions
│   │       └── clinica/
│   ├── components/
│   │   └── ui/               # Componentes shadcn/ui
│   ├── lib/
│   │   └── prisma.ts         # Instância Singleton do Prisma
│   ├── providers/            # Providers globais
│   └── utils/                # Funções auxiliares
└── package.json


✨ Autor

Desenvolvido com por Herberton Miguel
