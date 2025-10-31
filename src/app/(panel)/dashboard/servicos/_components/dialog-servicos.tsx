//src/app/(panel)/servicos/_components/dialog-servicos.tsx

"use client"
import { useState } from 'react'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useDialogServicoForm, DialogServicoFormData } from "./dialog-servico-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
// Importa as Server Actions do Servico (assumindo que você as criou)
import { createNewServico } from '../_actions/create-servico'
import { updateServico } from '../_actions/update-servico'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea' // Assumindo que você tem um Textarea

interface DialogServicosProps {
  closeModal: () => void;
  servicoId?: string;
  initialValues?: {
    nome: string;
    hours: string;
    minutes: string;
  }
}

export function DialogServicos({ closeModal, initialValues, servicoId }: DialogServicosProps) {
  const form = useDialogServicoForm({ initialValues: initialValues })
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: DialogServicoFormData) {
    // Converte horas e minutos para a duração total em minutos (Int)
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;
    const duracao = (hours * 60) + minutes;

    setLoading(true);

    let response;

    if (servicoId) {
      // Ação de UPDATE
      response = await updateServico({
        servicoId: servicoId,
        nome: values.nome,
        duracao: duracao,
      });
    } else {
      // Ação de CREATE
      response = await createNewServico({
        nome: values.nome,
        duracao: duracao,
      });
    }

    setLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success(servicoId ? "Serviço atualizado com sucesso" : "Serviço cadastrado com sucesso");

    handleCloseModal();
    router.refresh();
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{servicoId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        <DialogDescription>
          {servicoId ? "Atualize os dados do serviço." : "Adicione um novo serviço (tempo em minutos)."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Campo Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="font-semibold">Nome do serviço:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome do serviço..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tempo de Duração */}
          <p className="font-semibold pt-2">Tempo de duração do serviço:</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Horas:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" min="0" type="number" />
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
                  <FormLabel className="font-semibold">Minutos:</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0" min="0" max="59" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Salvando..." : `${servicoId ? "Atualizar serviço" : "Cadastrar serviço"}`}
          </Button>
        </form>
      </Form>
    </>
  );
}