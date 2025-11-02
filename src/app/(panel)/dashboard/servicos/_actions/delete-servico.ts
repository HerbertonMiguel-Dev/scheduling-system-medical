//src/app/(panel)/dashboard/servicos/_actions/delete-servico.ts

"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  servicoId: z.string().min(1, "O id do serviço é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteServico(formData: FormSchema) {
  const parsed = formSchema.safeParse(formData)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    // Aqui não tem `status` no seu model, então vamos deletar de fato
    await prisma.servico.delete({
      where: { id: formData.servicoId }
    })

    return { data: "Serviço deletado com sucesso" }
  } catch (err) {
    console.log(err)
    return { error: "Falha ao deletar serviço" }
  }
}