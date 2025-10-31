// src/app/(panel)/dashboard/especialidades/_components/dialog-especialidade-form.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

// Esquema de validação focado apenas no campo 'nome'
const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome da especialidade é obrigatório" }),
})

export interface UseDialogEspecialidadeFormProps {
  initialValues?: {
    nome: string;
  }
}

export type DialogEspecialidadeFormData = z.infer<typeof formSchema>;

export function useDialogEspecialidadeForm({ initialValues }: UseDialogEspecialidadeFormProps) {
  return useForm<DialogEspecialidadeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      nome: "",
    }
  })
}
