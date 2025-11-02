// src/app/(panel)/dashboard/medicos/_components/dialog-medico.tsx

"use client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useDialogMedicoForm, DialogMedicoFormData } from "./dialog-medico-form"
import { createNewMedico } from "../_actions/create-medico"
import { updateMedico } from "../_actions/update-medico"

interface DialogMedicoProps {
  closeModal: () => void;
  medicoId?: string;
  initialValues?: Partial<DialogMedicoFormData>;
  especialidades: { id: string; nome: string }[];
  convenios: { id: string; nome: string }[];
}

export function DialogMedico({ closeModal, initialValues, medicoId, especialidades, convenios }: DialogMedicoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditMode = !!initialValues
  const form = useDialogMedicoForm({ initialValues })

  async function onSubmit(values: DialogMedicoFormData) {
    startTransition(async () => {
      try {
        const result = isEditMode && medicoId
          ? await updateMedico({ id: medicoId, ...values })
          : await createNewMedico(values)

        if (result.error) throw new Error(result.error)

        toast.success(isEditMode ? "Médico atualizado com sucesso!" : "Médico criado com sucesso!")
        router.refresh()
        closeModal()
      } catch (error) {
        toast.error((error as Error).message || "Erro ao salvar médico.")
      }
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Editar Médico" : "Adicionar Novo Médico"}</DialogTitle>
        <DialogDescription>
          Preencha as informações abaixo para {isEditMode ? "atualizar o" : "cadastrar um novo"} médico.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input placeholder="Dr. João da Silva" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Especialidade */}
          <FormField
            control={form.control}
            name="especialidadeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp.id} value={esp.id}>
                          {esp.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Convênio */}
          <FormField
            control={form.control}
            name="convenioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Convênio</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um convênio" />
                    </SelectTrigger>
                    <SelectContent>
                      {convenios.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
