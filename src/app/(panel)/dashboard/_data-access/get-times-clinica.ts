// src/app/(panel)/dashboard/_data-access/get-times-clinica.ts

"use server"

import prisma from "@/lib/prisma"

export async function getTimesClinica() {
  try {
    const disponibilidade = await prisma.disponibilidade.findFirst({
      select: {
        id: true,
        timeZone: true,
        times: true,
      },
    })

    if (!disponibilidade) {
      return {
        id: "",
        timeZone: "",
        times: [],
      }
    }

    return {
      id: disponibilidade.id,
      timeZone: disponibilidade.timeZone,
      times: disponibilidade.times,
    }

  } catch (err) {
    console.error("Erro ao buscar horários da clínica:", err)

    return {
      id: "",
      timeZone: "",
      times: [],
    }
  }
}
