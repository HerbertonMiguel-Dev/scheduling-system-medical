// src/app/(panel)/dashboard/especialidades/_components/dialog-especialidades.tsx

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { createNewEspecialidade } from "../_actions/create-especialidade"
import { updateEspecialidade } from "../_actions/update-especialidade"
import { useDialogEspecialidadeForm, DialogEspecialidadeFormData } from "./hooks/useDialogEspecialidadeForm"

interface DialogEspecialidadesProps {
  closeModal: () => void
  especialidadeId?: string
  initialValues?: { nome: string }
}

export function DialogEspecialidades({ closeModal, initialValues, especialidadeId }: DialogEspecialidadesProps) {
  const form = useDialogEspecialidadeForm({ initialValues })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(values: DialogEspecialidadeFormData) {
    setLoading(true)

    const response = especialidadeId
      ? await updateEspecialidade({ especialidadeId, nome: values.nome })
      : await createNewEspecialidade({ nome: values.nome })

    setLoading(false)

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(especialidadeId ? "Especialidade atualizada com sucesso" : "Especialidade cadastrada com sucesso")
    handleCloseModal()
    router.refresh()
  }

  function handleCloseModal() {
    form.reset()
    closeModal()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{especialidadeId ? "Editar Especialidade" : "Nova Especialidade"}</DialogTitle>
        <DialogDescription>
          {especialidadeId ? "Atualize o nome da especialidade" : "Adicione uma nova especialidade"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="font-semibold">Nome da especialidade:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Cardiologia" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Salvando..." : especialidadeId ? "Atualizar Especialidade" : "Cadastrar Especialidade"}
          </Button>
        </form>
      </Form>
    </>
  )
}
