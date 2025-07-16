import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const useSecretDataSchema = () => {
  const { t } = useTranslation(['secret-manager:create', NAMESPACES.FORM]);

  return z
    .string({ error: t('required_field', { ns: NAMESPACES.FORM }) })
    .refine(
      (value) => {
        try {
          JSON.parse(value);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        error: t('secret-manager/create:data_error_invalid_json'),
      },
    );
};
