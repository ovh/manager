import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const useCustomMetadataSchema = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.FORM]);

  return z.string().refine(
    (value) => {
      try {
        const parsedJSON = JSON.parse(value) as object;
        const keys = Object.keys(parsedJSON);
        return keys.every((key) => key !== '');
      } catch {
        return true;
      }
    },
    {
      error: t('error_empty_keys'),
    },
  );
};
