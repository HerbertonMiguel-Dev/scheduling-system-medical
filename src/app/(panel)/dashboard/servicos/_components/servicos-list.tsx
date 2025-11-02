//src/app/(panel)/dashboard/servicos/_components/servicos-list.tsx

"use client"
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, X } from 'lucide-react'
import { DialogServico } from './dialog-servicos'
import { Servico } from '@prisma/client'
import { deleteServico } from '../_actions/delete-servico'
import { toast } from 'sonner'

interface ServicosListProps {
  services: Servico[]
}

export function ServicosList({ services }: ServicosListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<null | Servico>(null)

  async function handleDeleteService(serviceId: string) {
    const response = await deleteServico({ servicoId: serviceId })
    if (response.error) return toast.error(response.error)
    toast.success(response.data)
  }

  function handleEditService(service: Servico) {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open)
      if (!open) setEditingService(null)
    }}>
      <section className="mx-auto">
        <Card>
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold'>Serviços</CardTitle>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogServico
                closeModal={() => { setIsDialogOpen(false); setEditingService(null) }}
                servicoId={editingService?.id}
                initialValues={editingService ? {
                  nome: editingService.nome || "",
                  hours: Math.floor(editingService.duracao / 60).toString(),
                  minutes: (editingService.duracao % 60).toString()
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4 mt-5">
              {services.map(service => (
                <article key={service.id} className='flex items-center justify-between'>
                  <span>{service.nome} - {Math.floor(service.duracao / 60)}h {service.duracao % 60}m</span>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                      <X className="w-4 h-4" />
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