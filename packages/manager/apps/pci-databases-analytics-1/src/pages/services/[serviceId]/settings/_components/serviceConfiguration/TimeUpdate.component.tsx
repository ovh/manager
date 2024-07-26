import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pen, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { TableCell } from '@/components/ui/table';
import { TimePicker } from '@/components/ui/time-picker';

interface TimeUpdateProps {
  initialValue: Date;
  onSubmit: (newValue: Date) => void;
  readonly?: boolean;
  disabled?: boolean;
}
const TimeUpdate = ({
  initialValue,
  onSubmit,
  readonly,
  disabled,
}: TimeUpdateProps) => {
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
  const updateButton = readonly ? (
    <></>
  ) : (
    <Button
      data-testid="edit-time-update-button"
      variant="ghost"
      size="table"
      className="py-0 h-auto"
      onClick={() => setIsUpdate(true)}
      disabled={disabled}
    >
      <Pen />
    </Button>
  );
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
              data-testid="submit-time-update-button"
              variant="ghost"
              size="table"
              className="py-0 h-auto"
              onClick={handleSubmit}
            >
              <Check />
            </Button>
            <Button
              data-testid="cancel-time-update-button"
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
          updateButton
        )}
      </TableCell>
    </Form>
  );
};

export default TimeUpdate;
