// src/app/(public)/clinica/_components/agendamento-content.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "./date-picker";
import { AgendamentoTimeList, TimeSlot } from "./agendamento-time-list";
import { useAgendamentoForm } from "./agendamento-form";

import { createNewAgendamento, AgendamentoData } from "../_actions/create-agendamento";

interface Medico {
  id: string;
  nome: string;
  especialidadeId: string;
  especialidade: { nome: string };
  availableTimes: Record<string, string[]>;
  convenios: { id: string; nome: string }[];
}

interface Servico {
  id: string;
  nome: string;
  duracao: number; // duração em minutos
}

interface Convenio {
  id: string;
  nome: string;
}

interface Especialidade {
  id: string;
  nome: string;
}

interface ClinicData {
  id: string;
  name: string;
  address: string;
}

interface AgendamentoContentProps {
  medicos: Medico[];
  servicos: Servico[];
  convenios: Convenio[];
  especialidades: Especialidade[];
  clinic?: ClinicData;
}

export function AgendamentoContent({
  medicos,
  servicos,
  convenios,
  especialidades,
  clinic,
}: AgendamentoContentProps) {
  const form = useAgendamentoForm();
  const router = useRouter();

  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const selectedDate = form.watch("agendamentoDate");
  const selectedEspecialidadeId = form.watch("especialidadeId");
  const selectedMedicoId = form.watch("medicoId");
  const selectedConvenioId = form.watch("convenioId");
  const selectedServicoId = form.watch("servicoId");

  const selectedMedico = medicos.find((m) => m.id === selectedMedicoId);
  const selectedServico = servicos.find((s) => s.id === selectedServicoId);

  const requiredSlots = selectedServico ? Math.ceil(selectedServico.duracao / 30) : 1;

  const filteredMedicos = medicos.filter(
    (m) =>
      m.especialidadeId === selectedEspecialidadeId &&
      selectedConvenioId &&
      m.convenios.some((c) => c.id === selectedConvenioId)
  );

  // Busca os horários bloqueados no backend com duração de cada agendamento
  const fetchBlockedTimes = useCallback(
  async (date: Date, medicoId: string): Promise<{ availableTimes: string[]; blockedTimes: string[] }> => {
    if (!date || !medicoId) return { availableTimes: [], blockedTimes: [] };
    setLoadingSlots(true);
    try {
      const dateString = date.toISOString().split("T")[0];
      const response = await fetch(
        `/api/agendamento/get-atendimento?medicoId=${medicoId}&date=${dateString}`
      );
      const json: { availableTimes: string[]; blockedTimes: string[] } = await response.json();
      setLoadingSlots(false);
      return json;
    } catch {
      setLoadingSlots(false);
      return { availableTimes: [], blockedTimes: [] };
    }
  },
  []
);


useEffect(() => {
  if (selectedDate && selectedMedico) {
    fetchBlockedTimes(selectedDate, selectedMedico.id).then(({ availableTimes, blockedTimes }) => {
      setBlockedTimes(blockedTimes);

      const slots = availableTimes.map((time: string) => ({
        time,
        available: !blockedTimes.includes(time),
      }));

      setAvailableTimeSlots(slots);
    });
  } else {
    setAvailableTimeSlots([]);
  }
}, [selectedDate, selectedMedico, fetchBlockedTimes]);


  async function handleSubmit(data: AgendamentoData) {
    const selectedTime = form.getValues("time");
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário para o agendamento.");
      return;
    }

    try {
      const result = await createNewAgendamento(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      const allTimes = availableTimeSlots.map((s) => s.time);
      const slotsToBlock: string[] = [];
      let currentIndex = allTimes.indexOf(selectedTime);
      for (let i = 0; i < requiredSlots; i++) {
        if (currentIndex + i < allTimes.length) {
          slotsToBlock.push(allTimes[currentIndex + i]);
        }
      }

      setBlockedTimes((prev) => [...prev, ...slotsToBlock]);
      setAvailableTimeSlots((prev) =>
        prev.map((slot) =>
          slotsToBlock.includes(slot.time)
            ? { ...slot, available: false }
            : slot
        )
      );

      form.setValue("time", "");
      toast.success("Agendamento criado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao criar agendamento");
    }
  }

  const safeEspecialidades = especialidades || [];

  return (
    <>
      <Toaster position="top-right" richColors />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-2xl mx-auto bg-white p-6 border rounded-md shadow-sm space-y-6"
        >
          {clinic && (
            <div className="mb-4">
              <h2 className="text-xl font-bold">{clinic.name}</h2>
              <p className="text-gray-500">{clinic.address}</p>
            </div>
          )}

          <h2 className="text-xl font-bold">Novo Agendamento</h2>

          {/* Campos do formulário */}
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do paciente</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="exemplo@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="telefone" render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="agendamentoDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Serviço */}
          <FormField control={form.control} name="servicoId" render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.nome} - {s.duracao} min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Convênio */}
          <FormField control={form.control} name="convenioId" render={({ field }) => (
            <FormItem>
              <FormLabel>Convênio</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {convenios.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Especialidade */}
          <FormField control={form.control} name="especialidadeId" render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidade</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => { field.onChange(value); form.setValue("medicoId", ""); }} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {safeEspecialidades.length > 0 ? safeEspecialidades.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                    )) : <SelectItem value="none" disabled>Nenhuma especialidade</SelectItem>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Médico */}
          <FormField control={form.control} name="medicoId" render={({ field }) => (
            <FormItem>
              <FormLabel>Médico</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMedicos.length > 0 ? filteredMedicos.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                    )) : <SelectItem value="none" disabled>Nenhum médico disponível</SelectItem>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Horário */}
          {selectedMedico && selectedDate && (
            <FormItem>
              <FormLabel>Horários disponíveis</FormLabel>
              <AgendamentoTimeList
                selectedDate={selectedDate}
                availableTimeSlots={availableTimeSlots}
                blockedTimes={blockedTimes}
                requiredSlots={requiredSlots}
                selectedTime={form.watch("time")}
                onSelectTime={(time: string) => form.setValue("time", time)}
              />
            </FormItem>
          )}

          <Button type="submit" className="w-full mt-4">
            Confirmar Agendamento
          </Button>
        </form>
      </Form>
    </>
  );
}
