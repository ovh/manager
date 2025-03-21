import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pen, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Form,
  FormField,
  TableCell,
  TimePicker,
} from '@datatr-ux/uxlib';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

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
      className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
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
              className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
              onClick={handleSubmit}
            >
              <Check />
            </Button>
            <Button
              data-testid="cancel-time-update-button"
              type="reset"
              className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
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
