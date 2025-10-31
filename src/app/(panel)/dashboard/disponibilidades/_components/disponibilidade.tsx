// src/app/(panel)/dashboard/disponibilidades/_components/disponibilidade.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { updateDisponibilidade } from "../_actions/update-disponibilidade"
import { useDisponibilidadeForm, DisponibilidadeFormData } from "./disponibilidade-form"

interface Disponibilidade {
  id: string
  timeZone: string | null
  times: string[]
}

interface DisponibilidadeContentProps {
  disponibilidade: Disponibilidade
}

export function DisponibilidadeContent({ disponibilidade }: DisponibilidadeContentProps) {
  const router = useRouter()
  const [selectedHours, setSelectedHours] = useState<string[]>(disponibilidade.times || [])

  const form = useDisponibilidadeForm({
    timeZone: disponibilidade.timeZone
  })

  // Gerar horários de 30 em 30 minutos das 08:00 às 22:00
  function generateTimeSlots(): string[] {
    const hours: string[] = []

    for (let i = 8; i <= 21; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0")
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
    }

    hours.push("22:00")
    return hours
  }

  const hours = generateTimeSlots()

  // Alternar horários selecionados
  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    )
  }

  // Lista filtrada de timezones (Brasil)
  const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")
  )

  async function onSubmit(values: DisponibilidadeFormData) {
    console.log("onSubmit values:", values);
    console.log("disponibilidade.id:", disponibilidade.id);

    const response = await updateDisponibilidade({
      
      timeZone: values.timeZone,
      times: selectedHours
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(response.data)
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fuso horário</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="font-semibold">
                  Selecione os horários disponíveis
                </FormLabel>

                <div className="grid grid-cols-5 gap-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-10",
                        selectedHours.includes(hour) &&
                        "border-2 border-emerald-500 text-primary"
                      )}
                      onClick={() => toggleHour(hour)}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold"
              >
                Salvar disponibilidade
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
