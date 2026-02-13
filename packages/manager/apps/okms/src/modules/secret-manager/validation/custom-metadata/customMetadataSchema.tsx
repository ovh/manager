import { safeJsonParse } from '@secret-manager/utils/json';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const useCustomMetadataSchema = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.FORM]);

  const isKeyOrValueEmpty = (key: string, val: unknown): boolean =>
    key.trim() === '' || val == null || (typeof val === 'string' && val.trim() === '');

  return z.string().refine(
    (value) => {
      const parsedJSON = safeJsonParse(value);
      if (parsedJSON == null || typeof parsedJSON !== 'object' || Array.isArray(parsedJSON)) {
        return true;
      }
      return !Object.entries(parsedJSON).some(([key, val]) => isKeyOrValueEmpty(key, val));
    },
    {
      error: t('error_empty_key_or_value'),
    },
  );
};
