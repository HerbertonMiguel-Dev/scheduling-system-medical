"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"

export const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  especialidadeId: z.string().min(1, { message: "A especialidade é obrigatória." }),
  convenioId: z.string().optional(),
  availableTimes: z.record(z.string(), z.array(z.string())).optional(),
})

export interface UseDialogMedicoFormProps {
  initialValues?: Partial<DialogMedicoFormData>;
}

export type DialogMedicoFormData = z.infer<typeof formSchema>

export function useDialogMedicoForm({ initialValues }: UseDialogMedicoFormProps) {
  return useForm<DialogMedicoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      nome: "",
      especialidadeId: "",
      convenioId: "",
      availableTimes: {},
    },
  })
}
