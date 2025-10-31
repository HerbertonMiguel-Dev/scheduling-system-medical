//src/app/(panel)/dashboard/servicos/_actions/delete-servico.ts

"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  servicoId: z.string().min(1, "O id do serviço é obrigatório para exclusão"),
})

type FromSchema = z.infer<typeof formSchema>

export async function deleteServico(formData: FromSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.servico.delete({
      where: {
        id: formData.servicoId,
      },
    })

    // Limpa o cache para que a página de serviços mostre a alteração
    revalidatePath("/dashboard/servicos")

    return {
      data: "Serviço deletado com sucesso"
    }

  } catch (err) {
    // Trata erro de integridade (Foreign Key) se o serviço estiver sendo usado em um agendamento
    if (err instanceof Error && 'code' in err && err.code === 'P2003') {
      return {
        error: "Falha ao deletar: O serviço está associado a um ou mais agendamentos.",
      }
    }

    console.error(err);
    return {
      error: "Falha ao deletar serviço",
    }
  }
}