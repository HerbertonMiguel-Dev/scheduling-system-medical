// src/app/(panel)/dashboard/medicos/_actions/update-medico.ts

"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// Validação dos campos relevantes
const formSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  especialidadeId: z.string().min(1, { message: "A especialidade é obrigatória." }),
  availableTimes: z.record(z.string(), z.array(z.string())).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateMedico(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  const { id, nome, especialidadeId, availableTimes } = schema.data;

  try {
    const updatedMedico = await prisma.medico.update({
      where: { id },
      data: {
        nome,
        especialidadeId,
        availableTimes: availableTimes || [],
      },
    });

    return {
      data: updatedMedico,
    };
  } catch (err) {
    console.error("Erro ao atualizar médico:", err);
    return {
      error: "Falha ao atualizar Médico no banco de dados.",
    };
  }
}
