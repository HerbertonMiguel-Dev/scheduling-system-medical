//src/app/(panel)/dashboard/servicos/_components/dialog-servicos.tsx

"use client"
import { useState } from 'react'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useDialogServicoForm, DialogServicoFormData } from "./dialog-servico-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createServico } from '../_actions/create-servico'
import { updateServico } from '../_actions/update-servico'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface DialogServicoProps {
  closeModal: () => void;
  servicoId?: string;
  initialValues?: {
    nome: string;
    hours: string;
    minutes: string;
  }
}

export function DialogServico({ closeModal, initialValues, servicoId }: DialogServicoProps) {
  const form = useDialogServicoForm({ initialValues })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(values: DialogServicoFormData) {
    const hours = parseInt(values.hours) || 0
    const minutes = parseInt(values.minutes) || 0
    const duracao = (hours * 60) + minutes

    setLoading(true)

    if (servicoId) {
      const response = await updateServico({
        servicoId,
        nome: values.nome,
        duracao
      })
      setLoading(false)
      if (response.error) return toast.error(response.error)
      toast.success("Serviço atualizado com sucesso")
    } else {
      const response = await createServico({
        nome: values.nome,
        duracao
      })
      setLoading(false)
      if (response.error) return toast.error(response.error)
      toast.success("Serviço cadastrado com sucesso")
    }

    form.reset()
    closeModal()
    router.refresh()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{servicoId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        <DialogDescription>
          {servicoId ? "Atualize os dados do serviço" : "Adicione um novo serviço"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do serviço:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome do serviço..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="font-semibold">Tempo de duração do serviço:</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minutos:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : servicoId ? "Atualizar serviço" : "Cadastrar serviço"}
          </Button>
        </form>
      </Form>
    </>
  )
}