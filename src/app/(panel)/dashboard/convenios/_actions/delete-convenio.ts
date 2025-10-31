//src/app/(panel)/dashboard/convenios/_actions/delete-convenio.ts

"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  convenioId: z.string().min(1, "O id do convênio é obrigatório para exclusão"),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteConvenio(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.convenio.delete({
      where: {
        id: formData.convenioId,
      },
    })

    // Atualiza o cache da página de convênios
    revalidatePath("/dashboard/convenios")

    return {
      data: "Convênio deletado com sucesso",
    }
  } catch (err: any) {
    // Trata erro de chave estrangeira (convênio vinculado a consultas, por exemplo)
    if (err.code === "P2003") {
      return {
        error: "Falha ao deletar: o convênio está associado a uma ou mais consultas.",
      }
    }

    console.error("Erro ao deletar convênio:", err)
    return {
      error: "Falha ao deletar convênio",
    }
  }
}
