// src/app/(panel)/dashboard/medicos/_data-access/get-all-medico.ts
"use server";

import prisma from "@/lib/prisma";

export async function getAllMedicos() {
  try {
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

    return { data: medicos };
  } catch (err) {
    console.error(err);
    return { error: "Falha ao buscar médicos" };
  }
}
