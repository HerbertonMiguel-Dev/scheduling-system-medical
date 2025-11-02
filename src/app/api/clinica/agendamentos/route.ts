// src/api/clinica/agendamentos/routes.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json({ error: "Nenhuma data informada" }, { status: 400 });
  }

  const [year, month, day] = dateParam.split("-").map(Number);
  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        agendamentoDate: { gte: startDate, lte: endDate },
      },
      include: {
        servico: true,
        medico: {
          include: { especialidade: true }
        },
        convenio: true,
      },
    });

    // também buscar disponibilidade
    const disponibilidade = await prisma.disponibilidade.findFirst();

    return NextResponse.json({ agendamentos, disponibilidade });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}
