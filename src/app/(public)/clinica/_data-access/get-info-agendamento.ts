// src/app/(public)/_data-access/get-info-agendamento.ts

"use server";

import prisma from "@/lib/prisma";

export async function getInfoAgendamento() {
  try {
    // Busca todos os médicos com suas especialidades e convênios vinculados
    const medicos = await prisma.medico.findMany({
      include: {
        especialidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        convenios: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        nome: "asc",
      },
    });

    // Busca todas as especialidades disponíveis
    const especialidades = await prisma.especialidade.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    // Busca todos os convênios cadastrados
    const convenios = await prisma.convenio.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return {
      medicos,
      especialidades,
      convenios,
    };
  } catch (err) {
    console.error("Erro ao buscar informações para agendamento:", err);
    return {
      error: "Falha ao buscar informações de agendamento.",
    };
  }
}
