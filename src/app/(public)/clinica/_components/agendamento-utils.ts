// src/app/(public)/clinica/_components/agendamento-utils.ts

/**
 * Verifica se a data informada é hoje.
 */
export function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Verifica se determinado slot já passou.
 * Retorna true se o horário já passou.
 */
export function isSlotInThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (slotHour < currentHour) {
    return true;
  } else if (slotHour === currentHour && slotMinute <= currentMinute) {
    return true;
  }

  return false;
}

/**
 * Verifica se uma sequência de slots está disponível
 * para um serviço que ocupa mais de um slot.
 */
export function isSlotSequenceAvailable(
  startSlot: string,       // Primeiro horário disponível
  requiredSlots: number,   // Quantidade de slots necessários
  allSlots: string[],      // Todos horários da clínica
  blockedSlots: string[]   // Horários já bloqueados
) {
  const startIndex = allSlots.indexOf(startSlot);
  if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
    return false;
  }

  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allSlots[i];
    if (blockedSlots.includes(slotTime)) {
      return false;
    }
  }

  return true;
}

/**
 * Retorna os próximos N slots a partir de um slot inicial.
 * Útil para calcular sequência de horários ocupados por um serviço.
 */
export function getNextSlots(
  startSlot: string,
  requiredSlots: number,
  allSlots: string[]
): string[] {
  const startIndex = allSlots.indexOf(startSlot);
  if (startIndex === -1) return [];
  return allSlots.slice(startIndex, startIndex + requiredSlots);
}
