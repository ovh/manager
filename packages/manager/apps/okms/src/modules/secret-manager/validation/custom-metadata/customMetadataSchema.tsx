import { safeJsonParse } from '@secret-manager/utils/json';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const useCustomMetadataSchema = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.FORM]);

  return z.string().refine(
    (value) => {
      const parsedJSON = safeJsonParse(value);
      const keys = Object.keys(parsedJSON);
      return keys.every((key) => key !== '');
    },
    {
      error: t('error_empty_keys'),
    },
  );
};
