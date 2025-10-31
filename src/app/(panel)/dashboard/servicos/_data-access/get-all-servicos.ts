"use server"

import prisma from "@/lib/prisma"

export async function getAllServicos() {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { createdAt: "desc" }
    })

    return {
      data: servicos
    }
  } catch (err) {
    console.error(err)
    return {
      error: "Falha ao buscar serviços"
    }
  }
}
