//src/app/(panel)/dashboard/servicos/_components/dialog-servico-form.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  hours: z.string(),
  minutes: z.string(),
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
      hours: "",
      minutes: "",
    }
  })
}
