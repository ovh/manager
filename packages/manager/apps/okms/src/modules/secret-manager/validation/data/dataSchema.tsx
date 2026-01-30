import { safeJsonParse, safeJsonStringify } from '@secret-manager/utils/json';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const DATA_MIN_CHAR = 1;

export const useSecretDataSchema = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.FORM]);

  return z
    .string({ error: t('required_field', { ns: NAMESPACES.FORM }) })
    .min(DATA_MIN_CHAR, t('required_field', { ns: NAMESPACES.FORM }))
    .refine(
      (value) => {
        try {
          const parsedJSON = JSON.parse(value) as object;
          return typeof parsedJSON === 'object' && !Array.isArray(parsedJSON);
        } catch {
          return false;
        }
      },
      {
        error: t('error_invalid_json'),
      },
    )
    .refine(
      (value) => {
        const parsed = safeJsonParse<object>(value);
        const stringified = safeJsonStringify(parsed);

        // Normalize both strings for comparison (remove whitespace differences)
        const original = value.replace(/\s/g, '');
        const result = stringified.replace(/\s/g, '');

        // If the strings are not equal, it means there are duplicated keys
        // (duplicated keys are lost with JSON.parse)
        return original === result;
      },
      {
        error: t('error_duplicate_keys'),
      },
    )
    .refine(
      (value) => {
        const parsedJSON = safeJsonParse<object>(value);
        const keys = Object.keys(parsedJSON);
        return keys.every((key) => key !== '');
      },
      {
        error: t('error_empty_keys'),
      },
    );
};
