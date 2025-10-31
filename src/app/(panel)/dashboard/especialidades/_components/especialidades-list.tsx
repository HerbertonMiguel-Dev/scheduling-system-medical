// src/app/(panel)/dashboard/especialidades/_components/especialidades-list.tsx

"use client"
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Plus, X } from 'lucide-react'
import { DialogEspecialidades } from './dialog-especialidades'
import { deleteEspecialidade } from '../_actions/delete-especialidade'
import { toast } from 'sonner'
import type { Especialidade } from "@prisma/client"

interface EspecialidadesListProps {
  especialidades: Especialidade[];
}

export function EspecialidadesList({ especialidades }: EspecialidadesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEspecialidade, setEditingEspecialidade] = useState<null | Especialidade>(null)

  async function handleDeleteEspecialidade(especialidadeId: string) {
    const response = await deleteEspecialidade({ especialidadeId })
    if (response.error) {
      toast.error(response.error)
      return;
    }
    toast.success(response.data)
  }

  function handleEditEspecialidade(especialidade: Especialidade) {
    setEditingEspecialidade(especialidade)
    setIsDialogOpen(true)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setEditingEspecialidade(null)
        }
      }}
    >
      <section className='mx-auto'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xl md:text-2xl font-bold'>Especialidades</CardTitle>
            {/* Botão de Adicionar */}
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEspecialidade(null)}>
                <Plus className='w-4 h-4' />
              </Button>
            </DialogTrigger>

            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault()
                setIsDialogOpen(false)
                setEditingEspecialidade(null)
              }}
            >
              <DialogEspecialidades
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingEspecialidade(null)
                }}
                especialidadeId={editingEspecialidade ? editingEspecialidade.id : undefined}
                initialValues={editingEspecialidade ? {
                  nome: editingEspecialidade.nome || '',
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4 mt-5">
              {especialidades.length === 0 && (
                <p className='text-gray-500 text-center'>Nenhuma especialidade cadastrada.</p>
              )}
              {especialidades.map(especialidade => (
                <article
                  key={especialidade.id}
                  className='flex items-center justify-between border p-3 rounded-lg'
                >
                  <span className='font-medium'>{especialidade.nome}</span>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEspecialidade(especialidade)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEspecialidade(especialidade.id)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}
