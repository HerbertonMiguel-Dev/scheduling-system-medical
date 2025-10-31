// src/app/(panel)/dashboard/disponibilidades/page.tsx

import { DisponibilidadeContent } from "./_components/disponibilidade"

export default function Disponibilidades() {
  const disponibilidade = {
    id: "1",
    timeZone: "America/Sao_Paulo",
    times: ["08:00", "08:30", "09:00"]
  }

  return (
    <section>
      <DisponibilidadeContent disponibilidade={disponibilidade} />
    </section>
  )
}
