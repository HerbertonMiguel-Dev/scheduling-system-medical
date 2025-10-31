// src/app/(panel)/dashboard/especialidades/_data-access/get-all-especialidades.ts

"use server"

import prisma from "@/lib/prisma"
import { Especialidade } from "@prisma/client"

export async function getAllEspecialidades(): Promise<{ data: Especialidade[] | null; error?: string }> {
  try {
    const especialidades = await prisma.especialidade.findMany({
      orderBy: { nome: "asc" },
    })
    return { data: especialidades }
  } catch (err) {
    console.error("Erro ao buscar especialidades:", err)
    return {
      data: null,
      error: "Falha ao buscar a lista de especialidades. Verifique a conexão com o banco de dados.",
    }
  }
}
