"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "./date-picker-medico";
import { DialogMedico } from "./dialog-medico";
import { deleteMedico } from "../_actions/delete-medico";
import { updateMedicoDisponibilidade } from "../_actions/update-medico-disponibilidade";

// ✅ Novo tipo para refletir os dados do Prisma (com especialidade e convênios)
interface MedicoItem {
  id: string;
  nome: string;
  especialidade: { id: string; nome: string };
  convenios: { id: string; nome: string }[];
  availableTimes: Record<string, string[]>;
  especialidadeId: string;
}

interface MedicosListProps {
  medicos: MedicoItem[];
  especialidades: { id: string; nome: string }[];
  convenios: { id: string; nome: string }[];
}

export function MedicosList({ medicos, especialidades, convenios }: MedicosListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<MedicoItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availableTimes, setAvailableTimes] = useState<{ [key: string]: string[] }>({});
  const [selectedForAvailability, setSelectedForAvailability] = useState<MedicoItem | null>(null);

  const allHours = Array.from({ length: 29 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  });

  const handleOpenAvailability = (medico: MedicoItem) => {
    setSelectedForAvailability(medico);
    if (medico.availableTimes && typeof medico.availableTimes === "object") {
      setAvailableTimes(medico.availableTimes);
    } else {
      setAvailableTimes({});
    }
    setSelectedDate(new Date());
    setIsAvailabilityOpen(true);
  };

  const toggleHour = (hour: string) => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString().split("T")[0];
    const current = availableTimes[key] || [];
    setAvailableTimes({
      ...availableTimes,
      [key]: current.includes(hour)
        ? current.filter((h) => h !== hour)
        : [...current, hour].sort(),
    });
  };

  const handleSaveAvailability = async () => {
    if (!selectedForAvailability) return;
    const result = await updateMedicoDisponibilidade({
      medicoId: selectedForAvailability.id,
      availableTimes,
    });
    if (result.data) {
      toast.success(result.data);
      setIsAvailabilityOpen(false);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedico) return;
    setIsDeleting(true);
    const result = await deleteMedico({ id: selectedMedico.id });
    if (result.data) {
      toast.success(result.data);
      setIsDeleteOpen(false);
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };

  const hoursForDate = selectedDate
    ? availableTimes[selectedDate.toISOString().split("T")[0]] || []
    : [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Médicos Cadastrados</h2>
        <Button onClick={() => { setSelectedMedico(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Novo Médico
        </Button>
      </div>

      {medicos.length === 0 ? (
        <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
          <p className="text-muted-foreground">Nenhum médico cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicos.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.nome}</CardTitle>
                <CardDescription>
                  <strong>Especialidade:</strong> {m.especialidade?.nome || "—"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p>
                  <strong>Convênios:</strong>{" "}
                  {m.convenios.length > 0
                    ? m.convenios.map((c) => c.nome).join(", ")
                    : "Nenhum convênio"}
                </p>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  className="bg-emerald-500 hover:bg-emerald-400"
                  onClick={() => handleOpenAvailability(m)}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Disponibilidade
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => { setSelectedMedico(m); setIsFormOpen(true); }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => { setSelectedMedico(m); setIsDeleteOpen(true); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogMedico
            closeModal={() => setIsFormOpen(false)}
            initialValues={
              selectedMedico
                ? {
                    nome: selectedMedico.nome,
                    especialidadeId: selectedMedico.especialidadeId,
                    convenioId: "",
                    availableTimes: selectedMedico.availableTimes,
                  }
                : undefined
            }
            medicoId={selectedMedico?.id}
            especialidades={especialidades}
            convenios={convenios}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Disponibilidade */}
      <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Horários de {selectedForAvailability?.nome}</DialogTitle>
            <DialogDescription>Selecione a data e os horários disponíveis.</DialogDescription>
          </DialogHeader>
          <section className="py-4 space-y-4">
            <DateTimePicker value={selectedDate} onChange={setSelectedDate} />
            <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
              {allHours.map((h) => (
                <Button
                  key={h}
                  variant="outline"
                  className={cn(
                    "h-10",
                    hoursForDate.includes(h) && "border-2 border-emerald-500 text-primary"
                  )}
                  onClick={() => toggleHour(h)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </section>
          <DialogFooter>
            <Button onClick={handleSaveAvailability} className="w-full">
              Salvar Disponibilidade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Exclusão */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Médico</DialogTitle>
            <DialogDescription>
              Deseja realmente excluir <strong>{selectedMedico?.nome}</strong>? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
