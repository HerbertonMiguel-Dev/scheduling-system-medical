// src/app/(panel)/dashboard/_components/agendaments/dialog-agendamento.tsx

import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/utils/formatCurrency"
import { AgendamentoComRelacoes } from "./agendamentos-list"

interface DialogAgendamentoProps {
  agendamento: AgendamentoComRelacoes | null
}

export function DialogAgendamento({ agendamento }: DialogAgendamentoProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do Agendamento</DialogTitle>
        <DialogDescription>Veja as informações completas do agendamento</DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {agendamento && (
          <article>
            <p>
              <span className="font-semibold">Horário:</span> {agendamento.time}
            </p>
            <p>
              <span className="font-semibold">Data:</span>{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(agendamento.agendamentoDate))}
            </p>
            <section className="bg-gray-100 mt-4 p-2 rounded-md">
              <p>
                <span className="font-semibold">Serviço:</span> {agendamento.servico?.nome}
              </p>
              
            </section>

            <p className="mt-3">
              <span className="font-semibold">Médico:</span> {agendamento.medico?.nome || "-"}
            </p>
          </article>
        )}
      </div>
    </DialogContent>
  )
}
