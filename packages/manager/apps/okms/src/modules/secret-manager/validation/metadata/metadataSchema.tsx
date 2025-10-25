import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const MAX_VERSIONS_MIN_VALUE = 0;
export const MAX_VERSIONS_MAX_VALUE = 24_000;

export const useSecretMetadataSchema = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.FORM]);

  return z.object({
    casRequired: z.enum(['active', 'inactive']),
    deactivateVersionAfter: z.string().regex(/^(?:\d+[dhms])+$/, {
      message: t('error_invalid_duration'),
    }),
    maxVersions: z
      .number()
      .min(
        MAX_VERSIONS_MIN_VALUE,
        t('error_min_exclusive', {
          ns: NAMESPACES.FORM,
          value: MAX_VERSIONS_MIN_VALUE,
        }),
      )
      .max(
        MAX_VERSIONS_MAX_VALUE,
        t('error_max_inclusive', {
          ns: NAMESPACES.FORM,
          value: MAX_VERSIONS_MAX_VALUE,
        }),
      ),
  });
};
