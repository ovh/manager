import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, XOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CONFIGURATION_CONFIG } from './configuration.constants';

interface LabelsFormProps {
  labelValue: ai.Label[];
  onChange: (newLabels: ai.Label[]) => void;
  disabled?: boolean;
}

const LabelsForm = React.forwardRef<HTMLInputElement, LabelsFormProps>(
  ({ labelValue, onChange, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/configuration');
    const labelSchema = z.object({
      name: z
        .string()
        .min(1)
        .max(15)
        .refine(
          (newKey) =>
            !labelValue.some((existingLabel) => existingLabel.name === newKey),
          {
            message: t('existingKeyError'),
          },
        ),
      value: z
        .string()
        .min(1)
        .max(15),
    });

    const form = useForm({
      resolver: zodResolver(labelSchema),
    });

    const onSubmit: SubmitHandler<ai.Label> = (data: ai.Label) => {
      const newLabels = [...labelValue, data];
      onChange(newLabels);
      form.reset();
    };

    const removeLabel = (indexToRemove: number) => {
      const newLabels = labelValue.filter(
        (_, index) => index !== indexToRemove,
      );
      onChange(newLabels);
    };

    return (
      <Form {...form}>
        <div className="flex w-full items-start gap-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            <FormField
              control={form.control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="name-field-label">
                    {t('keyFieldLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input data-testid="key-input-field" {...field} ref={ref} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              defaultValue=""
              render={({ field }) => (
                <FormItem data-testid="value-field-label">
                  <FormLabel>{t('valueFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input data-testid="value-input-field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            data-testid="label-add-button"
            variant={'ghost'}
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              disabled ||
              labelValue.length >= CONFIGURATION_CONFIG.maxLabelNumber
            }
            className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        <ul>
          {labelValue.map((label, index) => (
            <li key={label.name} className="flex items-center">
              <div>
                <span>{label.name}</span>
                {label.value && (
                  <>
                    <span> - </span>
                    <span className="truncate max-w-96" title={label.value}>
                      {label.value}
                    </span>
                  </>
                )}
              </div>
              <Button
                data-testid={`label-remove-button-${index}`}
                className="text-red-500 rounded-full p-2 hover:text-red-500 h-8 w-8"
                variant={'ghost'}
                type="button"
                onClick={() => removeLabel(index)}
                disabled={disabled}
              >
                <XOctagon />
              </Button>
            </li>
          ))}
        </ul>
        <p data-testid="configured-labels">
          {t('numberOfConfiguredLabels', {
            count: labelValue.length,
            max: CONFIGURATION_CONFIG.maxLabelNumber,
            context: `${labelValue.length}`,
          })}
        </p>
      </Form>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
