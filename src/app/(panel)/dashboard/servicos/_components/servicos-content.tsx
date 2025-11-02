//src/app/(panel)/dashboard/servicos/_components/servicos-content.tsx

import { getAllServicos } from '../_data-access/get-all-servicos'
import { ServicosList } from './servicos-list'

export async function ServicosContent() {
  const services = await getAllServicos()
  
  return (
    <section>
      <ServicosList services={services.data || []} />
    </section>
  )
}
