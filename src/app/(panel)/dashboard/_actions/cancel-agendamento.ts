//src/app/(panel)/dashboard/_actions/cancel-agendamento.ts
"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { AgendamentoStatus } from "@prisma/client"

const formSchema = z.object({
  agendamentoId: z.string().min(1, "Você precisa fornecer um agendamento"),
})

type FormSchema = z.infer<typeof formSchema>

export async function cancelAgendamento(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0]?.message,
    }
  }

  try {
    await prisma.agendamento.update({
      where: {
        id: formData.agendamentoId,
      },
      data: {
        status:AgendamentoStatus.CANCELED , // status do seu enum no Prisma
      },
    })

    revalidatePath("/dashboard")

    return {
      data: "Agendamento cancelado com sucesso.",
    }
  } catch (err) {
    console.error("Erro ao cancelar agendamento:", err)
    return {
      error: "Ocorreu um erro ao cancelar este agendamento.",
    }
  }
}
