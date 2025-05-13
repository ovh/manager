import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import * as database from '@/types/cloud/project/database';

export function useRenameServiceForm(service: database.Service) {
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const schema = z.object({
    description: z
      .string()
      .trim()
      .min(3, {
        message: t('renameServiceErrorMinLength', { min: 3 }),
      })
      .max(30, {
        message: t('renameServiceErrorMaxLength', { max: 30 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
    },
  });
  // fill form with service values
  useEffect(() => {
    if (!service) return;
    form.setValue('description', service.description);
  }, [service, form]);
  return form;
}
