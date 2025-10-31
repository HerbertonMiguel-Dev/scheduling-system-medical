// src/app/(panel)/dashboard/especialidades/_actions/update-especialidade.ts

"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  especialidadeId: z.string().min(1, "O id da especialidade é obrigatório para atualização"),
  nome: z.string().min(1, { message: "O nome da especialidade é obrigatório" }),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateEspecialidade(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.especialidade.update({
      where: {
        id: formData.especialidadeId,
      },
      data: {
        nome: formData.nome.trim(),
      },
    })

    // Atualiza o cache da página de especialidades
    revalidatePath("/dashboard/especialidades")

    return {
      data: "Especialidade atualizada com sucesso",
    }
  } catch (err) {
    console.error("Erro ao atualizar especialidade:", err)
    return {
      error: "Falha ao atualizar especialidade",
    }
  }
}