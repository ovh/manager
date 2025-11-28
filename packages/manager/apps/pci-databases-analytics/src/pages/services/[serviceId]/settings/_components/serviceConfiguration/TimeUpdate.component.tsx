import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Pen, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Form, FormField, TimePicker } from '@datatr-ux/uxlib';
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
    <div className="flex justify-end">
      <Button
        data-testid="edit-time-update-button"
        mode="ghost"
        className="rounded-full aspect-square h-6 p-1"
        onClick={() => setIsUpdate(true)}
        disabled={disabled}
      >
        <Pen className="size-4" />
      </Button>
    </div>
  );
  return (
    <div className={isUpdate ? "grid grid-cols-[2fr,1fr]" : "grid grid-cols-2"}>
      <Form {...form}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) =>
            isUpdate ? (
              <TimePicker date={field.value} setDate={field.onChange}/>
            ) : (
              <span>
                <FormattedDate
                  date={field.value}
                  options={{ timeStyle: 'medium' }}
                />
              </span>
            )
          }
        />
        {isUpdate ? (
          <div className="flex gap-2 items-center justify-end">
            <Button
              data-testid="submit-time-update-button"
              mode="ghost"
              className="p-0 h-auto"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="size-4" />
            </Button>
            <Button
              data-testid="cancel-time-update-button"
              type="reset"
              mode="ghost"
              variant="critical"
              className="p-0 h-auto"
              onClick={handleReset}
            >
              <XCircle className="size-4" />
            </Button>
          </div>
        ) : (
          updateButton
        )}
      </Form>
    </div>
  );
};

export default TimeUpdate;
