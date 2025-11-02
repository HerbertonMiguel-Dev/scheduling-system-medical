// src/app/(public)/clinica/_components/agendamento-form.tsx
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const agendamentoSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(1, "O telefone é obrigatório"),
  agendamentoDate: z.date().refine((val) => !!val, { message: "A data é obrigatória" }),
  time: z.string().min(1, "O horário é obrigatório"),
  servicoId: z.string().min(1, "O serviço é obrigatório"),
  medicoId: z.string().min(1, "O médico é obrigatório"),
  convenioId: z.string().optional(),
  especialidadeId: z.string().min(1), 
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

export function useAgendamentoForm() {
  return useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      agendamentoDate: new Date(),
      time: "",
      servicoId: "",
      medicoId: "",
      convenioId: "",
      especialidadeId: "",
    },
  });
}
