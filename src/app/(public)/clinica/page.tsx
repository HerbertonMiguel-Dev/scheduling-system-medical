// src/app/(public)/clinica/page.tsx

import prisma from "@/lib/prisma";
import { AgendamentoContent } from "./_components/agendamento-content";

interface ClinicData {
  id: string;
  name: string;
  address: string;
}

interface MedicoFormatted {
  id: string;
  nome: string;
  especialidadeId: string;
  especialidade: { nome: string };
  convenios: { id: string; nome: string }[];
  availableTimes: Record<string, string[]>;
}

interface ServicoFormatted {
  id: string;
  nome: string;
  duracao: number;
  createdAt: Date;
  updatedAt: Date;
}

export default async function AgendamentoPage() {
  try {
    // Buscar dados do agendamento
    const [medicosRaw, servicosRaw, convenios, especialidades] = await Promise.all([
      prisma.medico.findMany({
        include: { especialidade: true, convenios: true },
        orderBy: { nome: "asc" },
      }),
      prisma.servico.findMany({ orderBy: { nome: "asc" } }),
      prisma.convenio.findMany({ orderBy: { nome: "asc" } }),
      prisma.especialidade.findMany({ orderBy: { nome: "asc" } }),
    ]);

    const medicos: MedicoFormatted[] = medicosRaw.map((m) => ({
      ...m,
      availableTimes: (m.availableTimes as Record<string, string[]>) || {},
    }));

    const servicos: ServicoFormatted[] = servicosRaw.map((s) => ({
      ...s,
      nome: s.nome || "Serviço sem nome",
    }));

   

    if (!medicos.length || !servicos.length) return null;

    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <section className="container mx-auto px-4">
          <header className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-extrabold text-emerald-600">
              Agendamento Online
            </h1>
            <p className="mt-2 text-gray-600">
              Preencha seus dados e escolha o melhor horário e médico para o seu
              atendimento.
            </p>
          </header>

          <AgendamentoContent
            medicos={medicos}
            servicos={servicos}
            convenios={convenios}
            especialidades={especialidades}
          
          />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Erro ao carregar dados do agendamento:", error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-semibold">
          Não foi possível carregar os dados do agendamento. Verifique o banco de dados.
        </p>
      </main>
    );
  }
}
