//src/app/(panel)/servicos/_components/servicos-list.tsx

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
import { DialogServicos } from './dialog-servicos'
import { Servico } from '@prisma/client' // Importa o modelo Servico
import { deleteServico } from '../_actions/delete-servico'
import { toast } from 'sonner'
import Link from 'next/link'

interface ServicosListProps {
  servicos: Servico[];
  // Removemos a prop permission
}

export function ServicosList({ servicos }: ServicosListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<null | Servico>(null)

  // Não há limite de serviços, então lista todos
  const servicosList = servicos;

  async function handleDeleteServico(servicoId: string) {
    const response = await deleteServico({ servicoId: servicoId })
    if (response.error) {
      toast.error(response.error)
      return;
    }
    toast.success(response.data)
  }

  function handleEditServico(servico: Servico) {
    setEditingServico(servico);
    setIsDialogOpen(true);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingServico(null);
        }
      }}
    >
      <section className='mx-auto'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xl md:text-2xl font-bold'>Serviços</CardTitle>
            {/* Botão de Adicionar */}
            <DialogTrigger asChild>
              <Button>
                <Plus className='w-4 h-4' />
              </Button>
            </DialogTrigger>

            <DialogContent
              onInteractOutside={(e) => {
                // Previne fechar o dialog ao clicar fora (opcional, mas comum)
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingServico(null);
              }}
            >
              <DialogServicos
                closeModal={() => {
                  setIsDialogOpen(false);
                  setEditingServico(null);
                }}
                servicoId={editingServico ? editingServico.id : undefined}
                initialValues={editingServico ? {
                  nome: editingServico.nome || '',
                  // Converte a duração de minutos (Int) para horas e minutos (String)
                  hours: Math.floor(editingServico.duracao / 60).toString(),
                  minutes: (editingServico.duracao % 60).toString(),
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4 mt-5">
              {servicosList.length === 0 && (
                <p className='text-gray-500 text-center'>Nenhum serviço cadastrado.</p>
              )}
              {servicosList.map(servico => (
                <article
                  key={servico.id}
                  className='flex items-center justify-between border p-3 rounded-lg'
                >
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>{servico.nome}</span>
                    <span className='text-gray-500'>({servico.duracao} min)</span>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditServico(servico)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteServico(servico.id)}
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