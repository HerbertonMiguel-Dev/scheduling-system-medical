// src/app/(panel)/dashboard/convenios/_components/dialog-convenio-form.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

// Esquema de validação focado apenas no campo 'nome'
const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do convênio é obrigatório" }),
})

export interface UseDialogConvenioFormProps {
  initialValues?: {
    nome: string;
  }
}

export type DialogConvenioFormData = z.infer<typeof formSchema>;

export function useDialogConvenioForm({ initialValues }: UseDialogConvenioFormProps) {
  return useForm<DialogConvenioFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      nome: "",
    }
  })
}