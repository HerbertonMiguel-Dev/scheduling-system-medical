// src/app/(panel)/dashboard/especialidades/_components/hooks/useDialogEspecialidadeForm.ts

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"

// Validação
const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome da especialidade é obrigatório" }),
})

export interface UseDialogEspecialidadeFormProps {
  initialValues?: { nome: string }
}

export type DialogEspecialidadeFormData = z.infer<typeof formSchema>

export function useDialogEspecialidadeForm({ initialValues }: UseDialogEspecialidadeFormProps) {
  return useForm<DialogEspecialidadeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialValues?.nome ?? "",
    },
  })
}
