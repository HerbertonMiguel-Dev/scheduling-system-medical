//src/app/(panel)/dashboard/convenios/_actions/create-convenio.ts

"use server"

import prisma from "@/lib/prisma"

interface CreateConvenioProps {
  nome: string;
}

export async function createNewConvenio({ nome }: CreateConvenioProps) {
  
  // 1. Validação básica (nome não pode ser vazio)
  if (!nome || nome.trim() === '') {
    return {
      error: "O nome do convênio é obrigatório."
    }
  }

  try {
    const newConvenio = await prisma.convenio.create({
      data: {
        nome: nome.trim(),
      },
    })

    return {
      data: `Convênio "${newConvenio.nome}" cadastrado com sucesso!`,
    }

  } catch (error) {
    console.error("Erro ao criar convênio:", error);
    // Erro comum: violação de unicidade (se o campo 'nome' for unique)
    // Se você tiver um campo único, pode adicionar uma checagem mais específica aqui.
    return {
      error: "Falha ao cadastrar o convênio. Tente novamente."
    }
  }
}