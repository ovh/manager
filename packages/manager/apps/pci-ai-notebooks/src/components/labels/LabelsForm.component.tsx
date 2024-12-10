import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
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
import { CONFIGURATION_CONFIG } from '../order/configuration/configuration.constants';
import { useLabelForm } from '@/components/labels/useLabelForm.hook';

interface LabelsFormProps {
  configuredLabels: ai.Label[];
  displayLabels: boolean;
  onAdd: (newLabel: ai.Label) => void;
  onRemove?: (newLabels: ai.Label[]) => void;
  disabled?: boolean;
}

const LabelsForm = React.forwardRef<HTMLInputElement, LabelsFormProps>(
  ({ configuredLabels, onAdd, onRemove, displayLabels, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/configuration');

    const { form } = useLabelForm({
      configuredLabel: configuredLabels.map((label) => label.name),
    });

    const onSubmit: SubmitHandler<ai.Label> = (data: ai.Label) => {
      onAdd(data);
      form.reset();
    };

    const removeLabel = (indexToRemove: number) => {
      const newLabels = configuredLabels.filter(
        (_, index) => index !== indexToRemove,
      );
      onRemove(newLabels);
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
              configuredLabels.length >= CONFIGURATION_CONFIG.maxLabelNumber
            }
            className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        {displayLabels && (
          <>
            <ul>
              {configuredLabels.map((label, index) => (
                <li key={label.name} className="flex items-center ml-5 text-sm">
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
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
            <p data-testid="configured-labels">
              {t('numberOfConfiguredLabels', {
                count: configuredLabels.length,
                max: CONFIGURATION_CONFIG.maxLabelNumber,
                context: `${configuredLabels.length}`,
              })}
            </p>
          </>
        )}
      </Form>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
