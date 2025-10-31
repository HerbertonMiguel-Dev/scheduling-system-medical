//src/app/(panel)/dashboard/servicos/_actions/create-servico.ts
"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  // O campo nome não pode ser nulo no formulário
  nome: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  // duracao deve ser um número inteiro, com um mínimo razoável (ex: 15 minutos)
  duracao: z.number().int().min(15, { message: "A duração deve ser de no mínimo 15 minutos" }),
})

type FromSchema = z.infer<typeof formSchema>

export async function createNewServico(formData: FromSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const newServico = await prisma.servico.create({
      data: {
        nome: formData.nome,
        duracao: formData.duracao,
      }
    })

    return {
      data: newServico
    }
  } catch (err) {
    console.error(err);
    return {
      error: "Falha ao cadastrar serviço",
    }
  }
}