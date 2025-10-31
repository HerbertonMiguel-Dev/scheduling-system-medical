// src/app/(panel)/dashboard/medicos/_actions/create-medico.ts

"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// Validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  especialidadeId: z.string().min(1, { message: "A especialidade é obrigatória." }),
  availableTimes: z.any().optional(), // JSON opcional para horários disponíveis
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewMedico(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    const newMedico = await prisma.medico.create({
      data: {
        nome: schema.data.nome,
        especialidadeId: schema.data.especialidadeId,
        availableTimes: schema.data.availableTimes || {},
      },
    });

    return {
      data: newMedico,
    };
  } catch (err) {
    console.error("Erro ao criar médico:", err);
    return {
      error: "Falha ao cadastrar Médico no banco de dados.",
    };
  }
}
