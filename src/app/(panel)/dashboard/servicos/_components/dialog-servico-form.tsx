//src/app/(panel)/servicos/_components/dialog-servico-form.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

// Esquema de validação focado apenas em nome e duração (horas/minutos)
const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  hours: z.string(), // Input de horas como string
  minutes: z.string(), // Input de minutos como string
})

export interface UseDialogServicoFormProps {
  initialValues?: {
    nome: string;
    hours: string;
    minutes: string;
  }
}

export type DialogServicoFormData = z.infer<typeof formSchema>;

export function useDialogServicoForm({ initialValues }: UseDialogServicoFormProps) {
  return useForm<DialogServicoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      nome: "",
      hours: "0",
      minutes: "0",
    }
  })
}