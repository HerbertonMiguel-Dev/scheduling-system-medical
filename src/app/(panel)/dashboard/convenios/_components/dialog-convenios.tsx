// src/app/(panel)/dashboard/convenios/_components/dialog-convenios.tsx

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { createNewConvenio } from "../_actions/create-convenio"
import { updateConvenio } from "../_actions/update-convenio"
import { useDialogConvenioForm, DialogConvenioFormData } from "../_components/hooks/useDialogConvenioForm"

interface DialogConveniosProps {
  closeModal: () => void
  convenioId?: string
  initialValues?: { nome: string }
}

export function DialogConvenios({ closeModal, initialValues, convenioId }: DialogConveniosProps) {
  const form = useDialogConvenioForm({ initialValues })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(values: DialogConvenioFormData) {
    setLoading(true)

    const response = convenioId
      ? await updateConvenio({ convenioId, nome: values.nome })
      : await createNewConvenio({ nome: values.nome })

    setLoading(false)

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(convenioId ? "Convênio atualizado com sucesso" : "Convênio cadastrado com sucesso")
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
        <DialogTitle>{convenioId ? "Editar Convênio" : "Novo Convênio"}</DialogTitle>
        <DialogDescription>
          {convenioId ? "Atualize o nome do convênio" : "Adicione um novo convênio"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="font-semibold">Nome do convênio:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Unimed" />
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
            {loading ? "Salvando..." : convenioId ? "Atualizar Convênio" : "Cadastrar Convênio"}
          </Button>
        </form>
      </Form>
    </>
  )
}