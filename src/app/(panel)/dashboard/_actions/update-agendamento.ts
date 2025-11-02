// src/app/(panel)/dashboard/_actions/update-agendamento.ts
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// ✅ Importe o enum do Prisma Client
import { AgendamentoStatus } from "@prisma/client"

// A interface agora usa o tipo exato do Prisma: AgendamentoStatus
interface UpdateAgendamentoStatusProps {
  agendamentoId: string
  status: AgendamentoStatus // Usa o enum importado
}

export async function updateAgendamentoStatus({
  agendamentoId,
  status,
}: UpdateAgendamentoStatusProps) {
  try {
    await prisma.agendamento.update({
      where: {
        id: agendamentoId,
      },
      data: {
        // O valor da propriedade 'status' (ex: AgendamentoStatus.COMPLETED)
        // agora corresponde ao tipo esperado pelo Prisma.
        status,
      },
    })

    // ⚠️ Ajuste o caminho de revalidação se necessário.
    revalidatePath("/dashboard/agendamentos")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar o status do agendamento:", error)
    return { success: false, error: "Falha ao atualizar o status." }
  }
}