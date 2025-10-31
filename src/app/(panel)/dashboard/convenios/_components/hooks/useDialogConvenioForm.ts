// src/app/(panel)/dashboard/convenios/_components/hooks/convenios-content.tsx

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"

// Validação
const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do convênio é obrigatório" }),
})

export interface UseDialogConvenioFormProps {
  initialValues?: { nome: string }
}

export type DialogConvenioFormData = z.infer<typeof formSchema>

export function useDialogConvenioForm({ initialValues }: UseDialogConvenioFormProps) {
  return useForm<DialogConvenioFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialValues?.nome ?? "",
    },
  })
}
