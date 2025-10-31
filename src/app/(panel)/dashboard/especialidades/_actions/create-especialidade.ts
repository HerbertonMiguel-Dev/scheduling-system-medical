// src/app/(panel)/dashboard/especialidades/_actions/create-especialidade.ts

"use server"

import prisma from "@/lib/prisma"

interface CreateEspecialidadeProps {
  nome: string;
}

export async function createNewEspecialidade({ nome }: CreateEspecialidadeProps) {
  
  // 1. Validação básica (nome não pode ser vazio)
  if (!nome || nome.trim() === '') {
    return {
      error: "O nome da especialidade é obrigatório."
    }
  }

  try {
    const newEspecialidade = await prisma.especialidade.create({
      data: {
        nome: nome.trim(),
      },
    })

    return {
      data: `Especialidade "${newEspecialidade.nome}" cadastrada com sucesso!`,
    }

  } catch (error) {
    console.error("Erro ao criar especialidade:", error);
    // Erro comum: violação de unicidade (se o campo 'nome' for unique)
    return {
      error: "Falha ao cadastrar a especialidade. Tente novamente."
    }
  }
}