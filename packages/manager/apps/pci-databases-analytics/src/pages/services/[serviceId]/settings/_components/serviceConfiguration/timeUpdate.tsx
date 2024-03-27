import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pen, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormattedDate from '@/components/table-date';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { TableCell, TableRow } from '@/components/ui/table';
import { TimePicker } from '@/components/ui/time-picker';

interface TimeUpdateProps {
  initialValue: Date;
  onSubmit: (newValue: Date) => void;
}
const TimeUpdate = ({ initialValue, onSubmit }: TimeUpdateProps) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const schema = z.object({
    date: z.date(),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: initialValue,
    },
  });
  const handleSubmit = form.handleSubmit((formValues) => {
    onSubmit(formValues.date);
    setIsUpdate(false);
  });
  const handleReset = () => {
    form.reset();
    setIsUpdate(false);
  };
  return (
    <Form {...form}>
      <TableCell>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) =>
            isUpdate ? (
              <TimePicker date={field.value} setDate={field.onChange} />
            ) : (
              <FormattedDate
                date={field.value}
                options={{ timeStyle: 'medium' }}
              />
            )
          }
        />
      </TableCell>
      <TableCell className="text-right divide-x-2">
        {isUpdate ? (
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="table"
              className="py-0 h-auto"
              onClick={handleSubmit}
            >
              <Check />
            </Button>
            <Button
              variant="ghost"
              type="reset"
              size="table"
              className="py-0 h-auto"
              onClick={handleReset}
            >
              <X />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="table"
            className="py-0 h-auto"
            onClick={() => setIsUpdate(true)}
          >
            <Pen />
          </Button>
        )}
      </TableCell>
    </Form>
  );
};

export default TimeUpdate;
