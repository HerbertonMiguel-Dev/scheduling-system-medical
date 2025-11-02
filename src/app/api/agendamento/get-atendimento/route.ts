//src/api/agendamento/get-atendimento/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const medicoId = searchParams.get("medicoId");
  const dateParam = searchParams.get("date"); // "YYYY-MM-DD"

  if (!medicoId || !dateParam) {
    return NextResponse.json({ error: "MedicoId ou date ausente" }, { status: 400 });
  }

  try {
    const medico = await prisma.medico.findUnique({
      where: { id: medicoId },
      include: { agendamentos: { include: { servico: true } } },
    });

    if (!medico) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    // Converte Json para objeto seguro
    const availableTimesObj = medico.availableTimes as Record<string, string[]> || {};
    const availableTimesForDate: string[] = availableTimesObj[dateParam] || [];

    // Cria set de slots bloqueados pelos agendamentos
    const blockedSlots = new Set<string>();

    for (const ag of medico.agendamentos) {
      const agDate = ag.agendamentoDate.toISOString().split("T")[0];
      if (agDate !== dateParam) continue;

      const requiredSlots = Math.ceil(ag.servico.duracao / 30);
      const startIndex = availableTimesForDate.indexOf(ag.time);
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slot = availableTimesForDate[startIndex + i];
          if (slot) blockedSlots.add(slot);
        }
      }
    }

    return NextResponse.json({
      availableTimes: availableTimesForDate,
      blockedTimes: Array.from(blockedSlots),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar horários" }, { status: 500 });
  }
}
