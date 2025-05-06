"use client";

import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

export function DatePickerWithRange({ className, onDateChange }) {
    const today = new Date();
    const [date, setDate] = React.useState({
        from: today,
        to: today,
    });

    const handleSelect = (selectedDate) => {
        setDate(selectedDate);
        if (onDateChange) {
            onDateChange(selectedDate.from, selectedDate.to);
        }
    };

    return (
      <div className={cn("grid gap-2 w-full", className)}>
          <Popover>
              <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[250px] flex justify-start text-left font-normal px-3 py-2 bg-secondary shadow-none border-none",
                      !date && "text-muted-foreground"
                    )}
                  >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date?.from ? (
                        date.to ? (
                          <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                  />
              </PopoverContent>
          </Popover>
      </div>
    );
}
