import { OdsCard, OdsDatepicker } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { StoryResult } from '../Stories';
import { TimePicker } from '@/components/ui/time-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { Calendar } from '@/components/ui/calendar';

export default {
  story: 'Datepicker with time',
  customComponentExemple: () => {
    const [value, setValue] = useState(new Date());
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'ghost'}
            className={cn(
              'text-left justify-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <FormattedDate
                date={value}
                options={{
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                }}
              />
            ) : (
              <span>Select a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={setValue}
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <TimePicker setDate={setValue} date={value} />
          </div>
        </PopoverContent>
      </Popover>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
