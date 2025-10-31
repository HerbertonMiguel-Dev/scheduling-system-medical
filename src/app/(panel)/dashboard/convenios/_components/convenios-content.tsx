// src/app/(panel)/dashboard/convenios/_components/convenios-content.tsx

import { getAllConvenios } from '../_data-access/get-all-convenios' // Você deve criar esta função
import { ConveniosList } from './convenios-list';

import type { Convenio } from "@prisma/client"


export async function ConveniosContent() {
  
  // A função getAllConvenios precisa ser criada e ter a tipagem ServicoArray (Convenio[] | null)
  const conveniosResult: { data: Convenio[] | null; error?: string } = await getAllConvenios();

  if (conveniosResult.error) {
    return <div className="text-red-500 p-4 border border-red-200 rounded">Erro ao carregar convênios: {conveniosResult.error}</div>;
  }

  return (
    <ConveniosList convenios={conveniosResult.data || []} />
  )
}