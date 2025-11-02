//src/app/(panel)/dashboard/servicos/_actions/update-servico.ts
"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  servicoId: z.string().min(1, "O id do serviço é obrigatório"),
  nome: z.string().min(1, "O nome do serviço é obrigatório"),
  duracao: z.number().min(1, "A duração do serviço é obrigatória"),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateServico(formData: FormSchema) {
  const parsed = formSchema.safeParse(formData)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    const servico = await prisma.servico.update({
      where: { id: formData.servicoId },
      data: {
        nome: formData.nome,
        duracao: formData.duracao,
      }
    })

    return { data: servico }
  } catch (err) {
    console.log(err)
    return { error: "Falha ao atualizar serviço" }
  }
}