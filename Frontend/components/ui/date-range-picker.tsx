"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  date?: DateRange
  setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({ className, date, setDate }: DateRangePickerProps) {
  const defaultFrom = new Date()
  const defaultTo = new Date()
  defaultTo.setDate(defaultTo.getDate() + 7)

  const from = date?.from || defaultFrom
  const to = date?.to || defaultTo

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from && to ? (
              <>
                {format(from, "dd MMM, y", { locale: es })} - {format(to, "dd MMM, y", { locale: es })}
              </>
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface DateRangePickerAltProps {
  className?: string
  from: Date
  to: Date
  onSelect: (range: { from: Date; to: Date }) => void
}

export function DateRangePicker({ className, from, to, onSelect }: DateRangePickerAltProps) {
  const dateRange: DateRange = { from, to }

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onSelect({ from: range.from, to: range.to })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from && to ? (
              <>
                {format(from, "dd MMM, y", { locale: es })} - {format(to, "dd MMM, y", { locale: es })}
              </>
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
