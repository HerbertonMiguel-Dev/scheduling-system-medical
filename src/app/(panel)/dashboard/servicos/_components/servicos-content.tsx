//src/app/(panel)/servicos/_components/servicos-content.tsx

import { getAllServicos } from "../_data-access/get-all-servicos"
import { ServicosList } from "./servicos-list"

export async function ServicosContent() {
  const servicos = await getAllServicos()

  return (
    <section className="mx-auto">
      <h2 className="text-2xl font-bold mb-4">Serviços disponíveis</h2>

      {servicos.error && (
        <p className="text-red-500">{servicos.error}</p>
      )}

      {!servicos.error && (
        <ServicosList servicos={servicos.data || []} />
      )}
    </section>
  )
}
