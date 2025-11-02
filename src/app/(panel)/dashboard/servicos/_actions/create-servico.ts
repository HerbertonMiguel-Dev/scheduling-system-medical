//src/app/(panel)/dashboard/servicos/_actions/create-servico.ts
"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  duracao: z.number().min(1, { message: "A duração do serviço é obrigatória" }),
})

type FormSchema = z.infer<typeof formSchema>

export async function createServico(formData: FormSchema) {
  const parsed = formSchema.safeParse(formData)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    const servico = await prisma.servico.create({
      data: {
        nome: formData.nome,
        duracao: formData.duracao,
      }
    })

    return { data: servico }
  } catch (err) {
    console.log(err)
    return { error: "Falha ao cadastrar serviço" }
  }
}