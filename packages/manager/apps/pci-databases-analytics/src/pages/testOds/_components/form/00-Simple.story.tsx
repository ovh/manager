import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StoryResult } from '../Stories';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default {
  story: 'Simple form',
  customComponentExemple: () => {
    const toast = useToast();
    const { t } = useTranslation(
      'pci-databases-analytics/services/service/databases',
    );
    const schema = z.object({
      name: z
        .string()
        .min(3, {
          message: t('addDatabaseErrorMinLength', { min: 1 }),
        })
        .max(100, {
          message: t('addDatabaseErrorMaxLength', { max: 100 }),
        }),
    });
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: '',
      },
    });

    const onSubmit = form.handleSubmit((formValues) => {
      toast.toast({
        title: 'success',
        description: `Added ${formValues.name}`,
      });
    });
    return (
      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addDatabaseInputLabel')}</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="add-database-name-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" data-testid="add-database-submit-button">
            {t('addDatabaseButtonAdd')}
          </Button>
        </form>
      </Form>
    );
  },
  customComponentResult: StoryResult.success,
  ODSComponentExemple: () => {
    const toast = useToast();
    const { t } = useTranslation(
      'pci-databases-analytics/services/service/databases',
    );
    const schema = z.object({
      name: z
        .string()
        .min(3, {
          message: t('addDatabaseErrorMinLength', { min: 1 }),
        })
        .max(100, {
          message: t('addDatabaseErrorMaxLength', { max: 100 }),
        }),
    });
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: '',
      },
    });

    const onSubmit = form.handleSubmit((formValues) => {
      toast.toast({
        title: 'success',
        description: `Added ${formValues.name}`,
      });
    });
    return (
      <form onSubmit={onSubmit} className="grid gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <OdsFormField>
              <label>{t('addDatabaseInputLabel')}</label>
              <OdsInput
                name={field.name}
                onOdsBlur={field.onBlur}
                onOdsChange={(e) =>
                  form.setValue(field.name, e.target.value as string)
                }
                data-testid="add-database-name-input"
              />
            </OdsFormField>
          )}
        />
        <Button type="submit" data-testid="add-database-submit-button">
          {t('addDatabaseButtonAdd')}
        </Button>
      </form>
    );
  },
  ODSComponentResult: StoryResult.fail,
};
