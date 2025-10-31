// _actions/update-medico-disponibilidade.ts
"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const disponibilidadeSchema = z.object({
  medicoId: z.string(),
  availableTimes: z.record(z.string(), z.array(z.string())),
})

export async function updateMedicoDisponibilidade(data: z.infer<typeof disponibilidadeSchema>) {
  const schema = disponibilidadeSchema.safeParse(data)

  if (!schema.success) {
    return {
      error: "Dados inválidos.",
    }
  }

  try {
    await prisma.medico.update({
      where: {
        id: schema.data.medicoId,
      },
      data: {
        availableTimes: schema.data.availableTimes,
      },
    })

    // Atualiza a listagem de médicos após a mudança
    revalidatePath("/dashboard/medicos")

    return {
      data: "Disponibilidade atualizada com sucesso!",
    }
  } catch (err) {
    console.error("Erro ao atualizar disponibilidade:", err)
    return {
      error: "Falha ao salvar a disponibilidade.",
    }
  }
}
