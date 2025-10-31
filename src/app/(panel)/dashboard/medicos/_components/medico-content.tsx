// src/app/(panel)/dashboard/medicos/_components/medico-content.tsx

import { getAllMedicos } from "../_data-access/get-all-medico";
import { getAllEspecialidades } from "../../especialidades/_data-access/get-all-especialidades";
import { getAllConvenios } from "../../convenios/_data-access/get-all-convenios";
import { MedicosList } from "./medicos-list";

export async function MedicoContent() {
  const [medicos, especialidades, convenios] = await Promise.all([
    getAllMedicos(),
    getAllEspecialidades(),
    getAllConvenios(),
  ]);

  // Normaliza os nomes para garantir que não sejam null
  const medicosNormalized = (medicos.data || []).map((m) => ({
    ...m,
    especialidade: {
      id: m.especialidade.id,
      nome: m.especialidade.nome ?? "", // <- normaliza
    },
    convenios: (m.convenios || []).map((c) => ({
      id: c.id,
      nome: c.nome ?? "", // <- normaliza
    })),
    availableTimes: (m.availableTimes as Record<string, string[]>) || {},
  }));

  return (
    <MedicosList
      medicos={medicosNormalized}
      especialidades={especialidades.data || []}
      convenios={(convenios.data || []).map((c) => ({
        id: c.id,
        nome: c.nome ?? "",
      }))}
    />
  );
}
