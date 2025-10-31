// src/app/(panel)/dashboard/disponibilidades/_actions/update-disponibilidade.ts

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validação dos campos relevantes
const formSchema = z.object({
  timeZone: z.string().optional(),
  times: z.array(z.string()).default([]),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateDisponibilidade(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
    }
  }

  const { timeZone, times } = schema.data

  try {
    // Atualiza todas as disponibilidades (ou a única existente)
    await prisma.disponibilidade.updateMany({
      data: {
        timeZone,
        times,
      },
    })

    // Revalida o cache da rota do dashboard
    revalidatePath("/dashboard/disponibilidades")

    return {
      data: "Disponibilidade atualizada com sucesso!",
    }
  } catch (err) {
    console.error("Erro ao atualizar disponibilidade:", err)
    return {
      error: "Falha ao atualizar disponibilidade. Verifique a conexão com o banco de dados.",
    }
  }
}
