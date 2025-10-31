// src/app/(panel)/dashboard/medicos/_actions/delete-medico.ts

"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// Validação do id
const formSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteMedico(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    };
  }

  try {
    await prisma.medico.delete({
      where: {
        id: schema.data.id,
      },
    });

    return {
      data: "Médico excluído com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao deletar médico:", err);
    return {
      error: "Falha ao excluir Médico no banco de dados.",
    };
  }
}
