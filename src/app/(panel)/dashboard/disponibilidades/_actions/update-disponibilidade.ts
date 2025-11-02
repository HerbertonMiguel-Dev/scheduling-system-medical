// src/app/(panel)/dashboard/disponibilidades/_actions/update-disponibilidade.ts
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const formSchema = z.object({
  id: z.string().optional(),
  timeZone: z.string().optional(),
  times: z.array(z.string()).default([]),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateDisponibilidade(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return { error: "Dados inválidos. Verifique os campos e tente novamente." }
  }

  const { id, timeZone, times } = schema.data

  try {
    // Usa upsert para criar se não existir
    await prisma.disponibilidade.upsert({
      where: { id: id || "1" }, // se não houver ID, usa "1"
      update: {
        timeZone,
        times,
      },
      create: {
        id: id || "1",
        timeZone,
        times,
      },
    })

    revalidatePath("/dashboard/disponibilidades")

    return { data: "Disponibilidade atualizada com sucesso!" }
  } catch (err) {
    console.error("Erro ao atualizar disponibilidade:", err)
    return {
      error: "Falha ao atualizar disponibilidade. Verifique a conexão com o banco de dados.",
    }
  }
}
