import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ObservabilityServiceFormData } from '@/types/observability.type';
import { createDisplayNameSchema } from '@/utils/schemas/displayName.schema';

export const useServiceFormSchema = (defaultDisplayName: string) => {
  const { t } = useTranslation([NAMESPACES.FORM]);

  const tFn = t as (key: string, options?: { value?: number }) => string;

  const serviceEditSchema = z.object({
    displayName: createDisplayNameSchema(tFn),
  });

  const defaultValues: ObservabilityServiceFormData = {
    displayName: defaultDisplayName,
  };

  const form = useForm<ObservabilityServiceFormData>({
    resolver: zodResolver(serviceEditSchema),
    defaultValues,
    mode: 'onChange',
  });

  return { form, schema: serviceEditSchema };
};
