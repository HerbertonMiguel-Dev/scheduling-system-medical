// src/app/(panel)/dashboard/_components/agendamentos/agendamentos-list.tsx

"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Prisma, AgendamentoStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { X, Eye, Loader2, BadgeCheck, CalendarX } from "lucide-react"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { DialogAgendamento } from "./dialog-agendamento"
import { ButtonPickerAgendamento } from "./button-date"
import { cancelAgendamento } from "../../_actions/cancel-agendamento"
import { updateAgendamentoStatus } from "../../_actions/update-agendamento"

export type AgendamentoComRelacoes = Prisma.AgendamentoGetPayload<{
  include: {
    servico: true
    medico: { include: { especialidade: true } }
    convenio: true
  }
}>

interface AgendamentosListProps {
  clinicaId: string
}

export function AgendamentosList({ clinicaId }: AgendamentosListProps) {
  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailAgendamento, setDetailAgendamento] = useState<AgendamentoComRelacoes | null>(null)
  const [isPending, startTransition] = useTransition()

  // Buscar agendamentos e disponibilidade
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-agendamentos", date],
    queryFn: async () => {
      const activeDate = date ?? format(new Date(), "yyyy-MM-dd")
      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinica/agendamentos?date=${activeDate}`
      const response = await fetch(url)
      if (!response.ok) return { agendamentos: [], disponibilidade: { times: [] } }
      return (await response.json()) as {
        agendamentos: AgendamentoComRelacoes[]
        disponibilidade: { times: string[] }
      }
    },
    staleTime: 20000,
    refetchInterval: 60000,
  })

  // Usar os horários da disponibilidade
  const timesArray = data?.disponibilidade?.times ?? []

  // Agrupar agendamentos por horário
  const groupedAgendamentos =
    data?.agendamentos?.reduce((acc, ag) => {
      const slot = ag.time
      if (!acc[slot]) acc[slot] = []
      acc[slot].push(ag)
      return acc
    }, {} as Record<string, AgendamentoComRelacoes[]>) ?? {}

  // Funções de ação
  const handleViewDetails = (agendamento: AgendamentoComRelacoes) => {
    setDetailAgendamento(agendamento)
    setIsDialogOpen(true)
  }

  const handleCancel = (id: string) =>
    startTransition(async () => {
      const response = await cancelAgendamento({ agendamentoId: id })
      if (response.error) {
      toast.error(response.error)
      return 
      }
    await queryClient.invalidateQueries({ queryKey: ["get-agendamentos"] })
    await refetch()
    toast.success(response.data)
  })


  const handleMarkCompleted = (id: string) =>
    startTransition(async () => {
      const res = await updateAgendamentoStatus({
        agendamentoId: id,
        status: AgendamentoStatus.COMPLETED,
      })
      
      if (!res.success) {
        toast.error(res.error || "Falha ao marcar como realizado.")
        return 
      }
      
      await queryClient.invalidateQueries({ queryKey: ["get-agendamentos"] })
      await refetch()
      toast.success("Agendamento marcado como realizado!")
      
    })

  const handleMarkNoShow = (id: string) =>
    startTransition(async () => {
      const res = await updateAgendamentoStatus({
        agendamentoId: id,
        status: AgendamentoStatus.NO_SHOW,
      })
      
      if (!res.success) {
        toast.error(res.error || "Falha ao marcar como não compareceu.")
        return // Early exit com retorno VOID
      }
      
      await queryClient.invalidateQueries({ queryKey: ["get-agendamentos"] })
      await refetch()
      toast.success("Agendamento marcado como não compareceu.")
      // Finaliza com VOID
    })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">Agendamentos</CardTitle>
          <ButtonPickerAgendamento />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-green-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="mt-2 text-sm">Carregando agenda...</p>
              </div>
            ) : (
              timesArray.map((slot) => {
                const agendamentosAtSlot = groupedAgendamentos[slot] || []
                return (
                  <div key={slot} className="py-2 border-t last:border-b">
                    <div className="w-full text-sm font-semibold">{slot}</div>
                    {agendamentosAtSlot.length > 0 ? (
                      agendamentosAtSlot.map((ag) => (
                        <div key={ag.id} className="flex items-center gap-2 pl-4 py-1">
                          <div className="flex-1 text-sm">
                            <div className="font-semibold">{ag.nome}</div>
                            <div className="text-xs text-black">
                              Médico: {ag.medico?.nome || "Não informado"} <br />
                              Especialidade: {ag.medico?.especialidade?.nome || "Não informada"} <br />
                              Convênio: {ag.convenio?.nome || "Não informado"} <br />
                              Serviço: {ag.servico?.nome || "Não informado"}
                            </div>
                          </div>

                          <div className="ml-auto flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewDetails(ag)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Detalhes</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleMarkCompleted(ag.id)}
                                      disabled={
                                        ag.status === AgendamentoStatus.CANCELED ||
                                        ag.status === AgendamentoStatus.NO_SHOW
                                      }
                                    >
                                      <BadgeCheck
                                        className={`w-5 h-5 ${
                                          ag.status === AgendamentoStatus.COMPLETED
                                            ? "text-green-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Realizado</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleMarkNoShow(ag.id)}
                                      disabled={
                                        ag.status === AgendamentoStatus.CANCELED ||
                                        ag.status === AgendamentoStatus.COMPLETED
                                      }
                                    >
                                      <CalendarX
                                        className={`w-5 h-5 ${
                                          ag.status === AgendamentoStatus.NO_SHOW
                                            ? "text-red-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Não compareceu</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleCancel(ag.id)}
                                      disabled={
                                        ag.status === AgendamentoStatus.NO_SHOW ||
                                        ag.status === AgendamentoStatus.COMPLETED
                                      }
                                    >
                                      <X
                                        className={`w-4 h-4 ${
                                          ag.status === AgendamentoStatus.CANCELED
                                            ? "text-red-500"
                                            : "text-black"
                                        }`}
                                      />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cancelar agendamento</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center pl-4 text-gray-400 text-sm">Disponível</div>
                    )}
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <DialogAgendamento agendamento={detailAgendamento} />
    </Dialog>
  )
}
