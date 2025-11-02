// src/app/(panel)/dashboard/page.tsx
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { Agendamentos } from "./_components/agendamentos/agendamentos"

export default async function Dashboard() {
  //  No momento, sem autenticação, então os dados serão fixos ou mockados.
  // Caso futuramente adicione login, aqui entraria a lógica de sessão.
  const clinicId = "1" // ID da clínica (poderia vir do backend futuramente)

  return (
    <main className="p-4 md:p-6">
      {/* Cabeçalho de ações */}
      <div className="space-x-2 flex items-center justify-end">
        <Link href={`/clinica/${clinicId}`} target="_blank">
          <Button className="bg-emerald-500 hover:bg-emerald-400 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Realizar agendamento</span>
          </Button>
        </Link>
      </div>

      {/* Seção principal */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-6">
        {/* Agendamentos */}
        <Agendamentos clinicaId={clinicId} />

        {/* Placeholder para futuros lembretes ou estatísticas */}
        <div className="border rounded-md p-4 bg-white shadow-sm flex items-center justify-center text-gray-500">
          <p> Painel de estatísticas (em breve)</p>
        </div>
      </section>
    </main>
  )
}
