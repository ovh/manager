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
import { useLabelForm } from '@/components/labels/useLabelForm.hook';
import { CONFIGURATION_CONFIG } from '../order/configuration/configuration.constants';

interface LabelFormProps {
  labelValue: string[];
  onChange: (newLabel: ai.Label) => void;
  disabled?: boolean;
}

const LabelForm = React.forwardRef<HTMLInputElement, LabelFormProps>(
  ({ labelValue, onChange, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/configuration');
    const { form } = useLabelForm({
      configuredLabel: labelValue,
    });

    const onSubmit: SubmitHandler<ai.Label> = (data: ai.Label) => {
      onChange(data);
      form.reset();
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
      </Form>
    );
  },
);

LabelForm.displayName = 'LabelForm';

export default LabelForm;
