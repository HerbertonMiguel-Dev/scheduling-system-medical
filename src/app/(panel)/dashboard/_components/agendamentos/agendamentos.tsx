//src/app/(panel)/dashboard/_components/agendamentos/agendamentos.tsx

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { AgendamentosList } from "./agendamentos-list"

export async function Agendamentos({ clinicaId }: { clinicaId: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-green-500">
          <Loader2 className="h-8 w-8 animate-spin duration-2000" />
          <p className="mt-2 text-sm">Carregando...</p>
        </div>
      }
    >
      <AgendamentosList clinicaId={clinicaId} />
    </Suspense>
  )
}