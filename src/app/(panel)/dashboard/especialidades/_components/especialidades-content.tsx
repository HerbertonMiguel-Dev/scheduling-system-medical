// src/app/(panel)/dashboard/especialidades/_components/especialidades-content.tsx

import { getAllEspecialidades } from '../_data-access/get-all-especialidades' // Você deve criar esta função
import { EspecialidadesList } from './especialidades-list'

import type { Especialidade } from "@prisma/client"

export async function EspecialidadesContent() {
  
  // A função getAllEspecialidades precisa ser criada e ter a tipagem EspecialidadeArray (Especialidade[] | null)
  const especialidadesResult: { data: Especialidade[] | null; error?: string } = await getAllEspecialidades()

  if (especialidadesResult.error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded">
        Erro ao carregar especialidades: {especialidadesResult.error}
      </div>
    )
  }

  return (
    <EspecialidadesList especialidades={especialidadesResult.data || []} />
  )
}
