import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TenantFormData } from '@/types/tenants.type';
import { createDescriptionSchema } from '@/utils/schemas/description.schema';
import { createTitleSchema } from '@/utils/schemas/title.schema';
import { INGESTION_BOUNDS } from '@/utils/tenants.constants';

export const useTenantsFormSchema = () => {
  const { t } = useTranslation(['shared', NAMESPACES.FORM]);

  // Create the schema with translations
  const tenantFormSchema = z.object({
    title: createTitleSchema(t as (key: string, options?: { value?: number }) => string),
    description: createDescriptionSchema(
      t as (key: string, options?: { value?: number }) => string,
    ),
    infrastructureId: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    retentionId: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    maxSeries: z
      .union([z.number(), z.null()])
      .refine((val) => !!val, {
        message: t(`${NAMESPACES.FORM}:error_min_inclusive`, { value: INGESTION_BOUNDS.MIN }),
      })
      .refine((val) => !!val && val >= INGESTION_BOUNDS.MIN, {
        message: t(`${NAMESPACES.FORM}:error_min_inclusive`, { value: INGESTION_BOUNDS.MIN }),
      })
      .refine((val) => !!val && val <= INGESTION_BOUNDS.MAX, {
        message: t(`${NAMESPACES.FORM}:error_max_inclusive`, { value: INGESTION_BOUNDS.MAX }),
      }),
  });

  type ZTenantFormData = z.infer<typeof tenantFormSchema>;

  const defaultValues: ZTenantFormData = {
    title: '',
    description: '',
    infrastructureId: '',
    retentionId: '',
    maxSeries: INGESTION_BOUNDS.DEFAULT,
  };

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

  return {
    form,
    schema: tenantFormSchema,
  };
};
