// src/app/(public)/clinica/_actions/create-agendamento.ts

"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { parse, format, addMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const agendamentoSchema = z.object({
  agendamentoDate: z.date(),
  time: z.string().min(1, "O horário é obrigatório"),
  servicoId: z.string().min(1, "O serviço é obrigatório"),
  medicoId: z.string().min(1, "O ID do médico é obrigatório"),
  convenioId: z.string().optional(),
  nome: z.string().min(3, "O nome do paciente é obrigatório"),
  email: z.string().email("Formato de e-mail inválido"),
  telefone: z.string().min(10, "O telefone é obrigatório"),
});

export type AgendamentoData = z.infer<typeof agendamentoSchema>;

export async function createNewAgendamento(formData: AgendamentoData) {
  const parsed = agendamentoSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const localTimeZone = "America/Fortaleza";

    // Combina data + hora
    const combinedDateTimeString =
      format(formData.agendamentoDate, "yyyy-MM-dd") + " " + formData.time;
    const localAppointmentDate = parse(
      combinedDateTimeString,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const agendamentoDate = toZonedTime(localAppointmentDate, localTimeZone);

    // Busca duração do serviço
    const servico = await prisma.servico.findUnique({
      where: { id: formData.servicoId },
    });

    if (!servico) {
      return { error: "Serviço não encontrado." };
    }

    const agendamentoEndDate = addMinutes(agendamentoDate, servico.duracao);

    // Verifica conflitos: qualquer agendamento que se sobreponha
    const conflito = await prisma.agendamento.findFirst({
      where: {
        medicoId: formData.medicoId,
        agendamentoDate: {
          lt: agendamentoEndDate,
        },
        AND: [
          {
            agendamentoDate: {
              gte: addMinutes(agendamentoDate, -servico.duracao),
            },
          },
        ],
      },
    });

    if (conflito) {
      return { error: "Horário já ocupado. Por favor, escolha outro horário." };
    }

    const newAgendamento = await prisma.agendamento.create({
      data: {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        agendamentoDate,
        time: formData.time,
        servicoId: formData.servicoId,
        medicoId: formData.medicoId,
        convenioId: formData.convenioId || null,
      },
    });

    return { data: newAgendamento, duration: servico.duracao };
  } catch (err) {
    console.error(err);
    return {
      error: "Erro ao cadastrar agendamento. Verifique os dados e tente novamente.",
    };
  }
}
