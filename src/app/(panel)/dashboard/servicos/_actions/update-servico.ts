//src/app/(panel)/dashboard/servicos/_actions/update-servico.ts
"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  servicoId: z.string().min(1, "O id do serviço é obrigatório para atualização"),
  nome: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  duracao: z.number().int().min(15, { message: "A duração deve ser de no mínimo 15 minutos" }),
})

type FromSchema = z.infer<typeof formSchema>

export async function updateServico(formData: FromSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.servico.update({
      where: {
        id: formData.servicoId,
      },
      data: {
        nome: formData.nome,
        // Garante que a duração mínima é 15 minutos
        duracao: formData.duracao < 15 ? 15 : formData.duracao, 
      }
    })

    // Limpa o cache para que a página de serviços mostre a alteração
    revalidatePath("/dashboard/servicos")

    return {
      data: "Serviço atualizado com sucesso"
    }

  } catch (err) {
    console.error(err);
    return {
      error: "Falha ao atualizar serviço",
    }
  }
}