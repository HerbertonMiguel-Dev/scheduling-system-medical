// src/app/(public)/clinica/_components/agendamento-time-list.tsx

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isSlotInThePast, isToday, getNextSlots } from "./agendamento-utils";

export interface TimeSlot {
  time: string;
  available: boolean;
}

interface AgendamentoTimeListProps {
  selectedDate: Date;
  availableTimeSlots: TimeSlot[];
  blockedTimes: string[];
  requiredSlots: number; // quantidade de slots de 30min que o serviço ocupa
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export function AgendamentoTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  requiredSlots,
  selectedTime,
  onSelectTime,
}: AgendamentoTimeListProps) {
  const dateIsToday = isToday(selectedDate);
  const allTimes = availableTimeSlots.map((slot) => slot.time);

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {
        const sequenceSlots = getNextSlots(slot.time, requiredSlots, allTimes);
        const sequenceOK = sequenceSlots.every(
          (t) => !blockedTimes.includes(t)
        );

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        const slotEnabled = slot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            key={slot.time}
            type="button"
            variant="outline"
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            disabled={!slotEnabled}
            className={cn(
              "h-10 select-none",
              selectedTime === slot.time && "border-2 border-emerald-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-center">
              <span>{slot.time}</span>
              {!slotEnabled && <span className="text-xs">Indisponível</span>}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
