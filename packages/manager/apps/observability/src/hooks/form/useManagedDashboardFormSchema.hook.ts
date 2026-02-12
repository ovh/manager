import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ManagedDashboardFormData } from '@/types/managedDashboards.type';
import { createDescriptionSchema } from '@/utils/schemas/description.schema';
import { createTitleSchema } from '@/utils/schemas/title.schema';

// IPv4 regex pattern (supports CIDR notation)
const IPV4_REGEX =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

export const useManagedDashboardFormSchema = () => {
  const { t } = useTranslation(['shared', 'managed-dashboards', NAMESPACES.FORM]);

  const tFn = t as (key: string, options?: { value?: number }) => string;

  const managedDashboardFormSchema = z.object({
    title: createTitleSchema(tFn),
    description: createDescriptionSchema(tFn),
    infrastructureId: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    releaseId: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
    allowedNetworks: z
      .array(z.string())
      .optional()
      .refine(
        (networks) => {
          if (!networks || networks.length === 0) return true;
          return networks.every((ip) => IPV4_REGEX.test(ip));
        },
        {
          message: t('managed-dashboards:grafana.allowedNetworks.error'),
        },
      ),
  });

  const defaultValues: ManagedDashboardFormData = {
    title: '',
    description: '',
    infrastructureId: '',
    releaseId: '',
    allowedNetworks: [],
  };

  const form = useForm<ManagedDashboardFormData>({
    resolver: zodResolver(managedDashboardFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  return { form, schema: managedDashboardFormSchema };
};
