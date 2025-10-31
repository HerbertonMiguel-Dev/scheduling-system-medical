"use client"
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'
import "react-datepicker/dist/react-datepicker.css"

registerLocale("pt-BR", ptBR)

interface DateTimePickerProps {
  value?: Date | null;
  className?: string;
  onChange: (date: Date | null) => void;
}

export function DateTimePicker({ value, className, onChange }: DateTimePickerProps) {
  return (
    <DatePicker
      className={className}
      selected={value}
      locale="pt-BR"
      minDate={new Date()}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
    />
  )
}
