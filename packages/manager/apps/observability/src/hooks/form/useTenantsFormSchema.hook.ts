import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TenantFormData } from '@/types/tenants.type';
import { createDescriptionSchema } from '@/utils/schemas/description.schema';
import { createTitleSchema } from '@/utils/schemas/title.schema';

export const useTenantsFormSchema = () => {
  const { t } = useTranslation(['shared', NAMESPACES.FORM]);

  const tFn = t as (key: string, options?: { value?: number }) => string;

  // Note: retentionDuration and maxSeries min/max validation is handled dynamically
  // in TenantConfigurationForm because the bounds depend on the selected infrastructure
  const tenantFormSchema = z.object({
    title: createTitleSchema(tFn),
    description: createDescriptionSchema(tFn),
    infrastructureId: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    retentionDuration: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    retentionUnit: z.string().length(1),
    maxSeries: z
      .union([z.number(), z.null()])
      .refine((val) => val !== null, { message: t(`${NAMESPACES.FORM}:required_field`) }),
  });

  const defaultValues: TenantFormData = {
    title: '',
    description: '',
    infrastructureId: '',
    retentionDuration: '',
    retentionUnit: '',
    maxSeries: null,
  };

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  return { form, schema: tenantFormSchema };
};
