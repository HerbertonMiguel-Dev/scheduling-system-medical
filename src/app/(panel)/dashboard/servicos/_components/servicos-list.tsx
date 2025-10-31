//src/app/(panel)/servicos/_components/servicos-list.tsx

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, X } from "lucide-react"
import type { Servico } from "@prisma/client"

import { toast } from "sonner"

interface ServicosListProps {
  servicos: Servico[];
}

export function ServicosList({ servicos }: ServicosListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<null | Servico>(null)

  function handleEdit(servico: Servico) {
    setEditingServico(servico)
    setIsDialogOpen(true)
  }

  function handleDelete(servicoId: string) {
    // Simulação (mock)
    toast.success(`Serviço ${servicoId} removido com sucesso!`)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) setEditingServico(null)
      }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Serviços</CardTitle>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </CardHeader>

        <CardContent>
          {servicos.length === 0 ? (
            <p className="text-gray-500">Nenhum serviço cadastrado.</p>
          ) : (
            <section className="space-y-3">
              {servicos.map(servico => (
                <article
                  key={servico.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{servico.nome}</span>
                    <span className="text-gray-500 text-sm">
                      Duração: {servico.duracao} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(servico)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(servico.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-sm text-gray-500">
            Total de serviços: {servicos.length}
          </p>
        </CardFooter>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingServico ? "Editar Serviço" : "Cadastrar Serviço"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          (Aqui entraria o formulário — mockado para o teste)
        </p>
      </DialogContent>
    </Dialog>
  )
}
