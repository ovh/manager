import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@datatr-ux/uxlib';
import { useLabelForm } from '@/components/labels/useLabelForm.hook';
import ai from '@/types/AI';
import { CONFIGURATION_CONFIG } from '../order/configuration/configuration.constants';

interface LabelsFormProps {
  configuredLabels: ai.Label[];
  onAdd?: (newLabel: ai.Label) => void;
  onDelete?: (deleteLabel: ai.Label) => void;
  onChange?: (newLabels: ai.Label[]) => void;
  disabled?: boolean;
}

const LabelsForm = React.forwardRef<HTMLInputElement, LabelsFormProps>(
  ({ configuredLabels, onAdd, onDelete, onChange, disabled }, ref) => {
    const { t } = useTranslation('ai-tools/components/labels');

    const { form } = useLabelForm({
      configuredLabel: configuredLabels.map((label) => label.name),
    });

    const onSubmit: SubmitHandler<ai.Label> = (data: ai.Label) => {
      if (onAdd) {
        onAdd(data);
      }
      if (onChange) {
        const newLabels = [...configuredLabels, data];
        onChange(newLabels);
      }
      form.reset();
    };

    const removeLabel = (key: string) => {
      if (onChange) {
        const newLabels = configuredLabels.filter(
          (label: ai.Label) => label.name !== key,
        );
        onChange(newLabels);
      }
      if (onDelete) {
        const labelToRemove = configuredLabels.find(
          (label: ai.Label) => label.name === key,
        );
        onDelete(labelToRemove);
      }
    };

    return (
      <Form {...form}>
        <div
          className="w-full grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]"
          data-testid="labels-form-container"
        >
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
          <Button
            data-testid="label-add-button"
            size="menu"
            variant="menu"
            mode="menu"
            className="shrink-0 mt-8 ml-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              disabled ||
              configuredLabels.length >= CONFIGURATION_CONFIG.maxLabelNumber
            }
          >
            <Plus className="size-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 p-2">
          {configuredLabels.map((label) => (
            <Badge
              className="py-4 px-2 rounded-md text-sm"
              key={label.name}
              variant="primary"
            >
              <div className="flex flex-row gap-1">
                <span key={`span_${label.name}`}>
                  {`${label.name} = ${label.value}`}
                </span>
                <Button
                  data-testid={`button_${label.name}`}
                  key={`button_${label.name}`}
                  type="button"
                  mode="ghost"
                  className="inline-flex items-center justify-center h-3 w-3 px-2 py-2 rounded-full border border-primary bg-primary-100 hover:bg-primary-200"
                  onClick={() => removeLabel(label.name)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-sm" data-testid="configured-labels">
          {t('numberOfConfiguredLabels', {
            count: configuredLabels.length,
            max: CONFIGURATION_CONFIG.maxLabelNumber,
          })}
        </p>
      </Form>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
