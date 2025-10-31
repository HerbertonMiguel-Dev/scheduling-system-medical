//src/app/(panel)/dashboard/convenios/_components/convenios-list.tsx

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
import { DialogConvenios } from './dialog-convenios'
import { deleteConvenio } from '../_actions/delete-convenio'
import { toast } from 'sonner'
import type { Convenio } from "@prisma/client"


interface ConveniosListProps {
  convenios: Convenio[];
}

export function ConveniosList({ convenios }: ConveniosListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConvenio, setEditingConvenio] = useState<null | Convenio>(null)

  async function handleDeleteConvenio(convenioId: string) {
    const response = await deleteConvenio({ convenioId: convenioId })
    if (response.error) {
      toast.error(response.error)
      return;
    }
    toast.success(response.data)
  }

  function handleEditConvenio(convenio: Convenio) {
    setEditingConvenio(convenio);
    setIsDialogOpen(true);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingConvenio(null);
        }
      }}
    >
      <section className='mx-auto'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xl md:text-2xl font-bold'>Convênios</CardTitle>
            {/* Botão de Adicionar */}
            <DialogTrigger asChild>
              <Button onClick={() => setEditingConvenio(null)}>
                <Plus className='w-4 h-4' />
              </Button>
            </DialogTrigger>

            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingConvenio(null);
              }}
            >
              <DialogConvenios
                closeModal={() => {
                  setIsDialogOpen(false);
                  setEditingConvenio(null);
                }}
                convenioId={editingConvenio ? editingConvenio.id : undefined}
                initialValues={editingConvenio ? {
                  nome: editingConvenio.nome || '',
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4 mt-5">
              {convenios.length === 0 && (
                <p className='text-gray-500 text-center'>Nenhum convênio cadastrado.</p>
              )}
              {convenios.map(convenio => (
                <article
                  key={convenio.id}
                  className='flex items-center justify-between border p-3 rounded-lg'
                >
                  <span className='font-medium'>{convenio.nome}</span>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditConvenio(convenio)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConvenio(convenio.id)}
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
  );
}