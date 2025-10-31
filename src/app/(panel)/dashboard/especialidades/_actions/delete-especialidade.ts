// src/app/(panel)/dashboard/especialidades/_actions/delete-especialidade.ts

"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  especialidadeId: z.string().min(1, "O id da especialidade é obrigatório para exclusão"),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteEspecialidade(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.especialidade.delete({
      where: {
        id: formData.especialidadeId,
      },
    })

    // Atualiza o cache da página de especialidades
    revalidatePath("/dashboard/especialidades")

    return {
      data: "Especialidade deletada com sucesso",
    }
  } catch (err: any) {
    // Trata erro de chave estrangeira (especialidade vinculada a médicos)
    if (err.code === "P2003") {
      return {
        error: "Falha ao deletar: a especialidade está associada a um ou mais médicos.",
      }
    }

    console.error("Erro ao deletar especialidade:", err)
    return {
      error: "Falha ao deletar especialidade",
    }
  }
}
