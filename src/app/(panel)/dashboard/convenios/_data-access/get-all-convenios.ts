//src/app/(panel)/dashboard/convenios/_data-access/get-all-convenios.ts

"use server"

import prisma from "@/lib/prisma"
import { Convenio } from "@prisma/client"

export async function getAllConvenios(): Promise<{ data: Convenio[] | null; error?: string }> {
  try {
    const convenios = await prisma.convenio.findMany({
      orderBy: { nome: "asc" },
    })
    return { data: convenios }
  } catch (err) {
    console.error("Erro ao buscar convênios:", err)
    return {
      data: null,
      error: "Falha ao buscar a lista de convênios. Verifique a conexão com o banco de dados.",
    }
  }
}