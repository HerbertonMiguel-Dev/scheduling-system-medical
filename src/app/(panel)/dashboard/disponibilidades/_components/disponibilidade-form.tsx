// src/app/(panel)/dashboard/disponibilidades/_components/disponibilidade-form.tsx

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface UseDisponibilidadeFormProps {
  timeZone: string | null
}

const disponibilidadeSchema = z.object({
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
})

export type DisponibilidadeFormData = z.infer<typeof disponibilidadeSchema>

export function useDisponibilidadeForm({ timeZone }: UseDisponibilidadeFormProps) {
  return useForm<DisponibilidadeFormData>({
    resolver: zodResolver(disponibilidadeSchema),
    defaultValues: {
      timeZone: timeZone || "",
    },
  })
}
