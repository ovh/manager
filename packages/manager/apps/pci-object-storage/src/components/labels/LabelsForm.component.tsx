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

export interface Label {
  key?: string;
  value?: string;
}

interface LabelsFormProps {
  configuredLabels: Label[];
  onAdd?: (newLabel: Label) => void;
  onDelete?: (deleteLabel: Label) => void;
  disabled?: boolean;
}

const LabelsForm = React.forwardRef<HTMLInputElement, LabelsFormProps>(
  ({ configuredLabels, onAdd, onDelete, disabled }, ref) => {
    const { t } = useTranslation('components/labels');

    const { form } = useLabelForm({
      configuredLabel: configuredLabels?.map((label) => label.key),
    });

    const onSubmit: SubmitHandler<Label> = (data: Label) => {
      if (onAdd) {
        onAdd(data);
      }
      form.reset();
    };

    const removeLabel = (key: string) => {
      if (onDelete) {
        const labelToRemove = configuredLabels.find(
          (label: Label) => label.key === key,
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
            name="key"
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
            mode="outline"
            className="shrink-0 mt-8 ml-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={disabled}
          >
            <Plus className="size-4 mr-2" />
            <span className="font-semibold">{t('addButtonLabel')}</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {configuredLabels.map((label) => (
            <Badge key={label.key} variant="primary">
              <div className="flex flex-row gap-1 inline-flex items-center justify-center">
                <span key={`span_${label.key}`}>
                  {`${label.key} = ${label.value}`}
                </span>
                <Button
                  data-testid={`button_${label.key}`}
                  key={`button_${label.key}`}
                  type="button"
                  className="h-3 w-3 px-2 py-2 rounded-full border border-white hover:bg-primary-200 bg-transparent text-white"
                  onClick={() => removeLabel(label.key)}
                >
                  <X className="text-white shrink-0 size-3 stroke-[3]" />
                </Button>
              </div>
            </Badge>
          ))}
        </div>
      </Form>
    );
  },
);

LabelsForm.displayName = 'LabelsForm';

export default LabelsForm;
