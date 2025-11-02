// src/app/(panel)/dashboard/medicos/_actions/create-medico.ts
"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  especialidadeId: z.string().min(1, { message: "A especialidade é obrigatória." }),
  convenioId: z.string().optional(), // convênio opcional
  availableTimes: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewMedico(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  const { nome, especialidadeId, convenioId, availableTimes } = schema.data;

  try {
    const newMedico = await prisma.medico.create({
      data: {
        nome,
        especialidadeId,
        availableTimes: availableTimes || {},
        convenios: convenioId
          ? {
              connect: [{ id: convenioId }], // vincula o médico ao convênio selecionado
            }
          : undefined,
      },
      include: {
        especialidade: true,
        convenios: true,
      },
    });

    return { data: newMedico };
  } catch (err) {
    console.error("Erro ao criar médico:", err);
    return { error: "Falha ao cadastrar Médico no banco de dados." };
  }
}
