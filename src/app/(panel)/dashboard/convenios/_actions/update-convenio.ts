//src/app/(panel)/dashboard/convenios/_actions/update-convenio.ts"use server"

"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  convenioId: z.string().min(1, "O id do convênio é obrigatório para atualização"),
  nome: z.string().min(1, { message: "O nome do convênio é obrigatório" }),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateConvenio(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.convenio.update({
      where: {
        id: formData.convenioId,
      },
      data: {
        nome: formData.nome.trim(),
      },
    })

    // Atualiza o cache da página de convênios
    revalidatePath("/dashboard/convenios")

    return {
      data: "Convênio atualizado com sucesso",
    }
  } catch (err) {
    console.error("Erro ao atualizar convênio:", err)
    return {
      error: "Falha ao atualizar convênio",
    }
  }
}