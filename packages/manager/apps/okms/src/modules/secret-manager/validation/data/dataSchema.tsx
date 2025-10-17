import { z } from 'zod';
import { useTranslation } from 'react-i18next';
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
          const parsedJSON = JSON.parse(value);
          return typeof parsedJSON === 'object' && !Array.isArray(parsedJSON);
        } catch (error) {
          return false;
        }
      },
      {
        error: t('error_invalid_json'),
      },
    )
    .refine(
      (value) => {
        try {
          const parsedJSON = JSON.parse(value);
          const keys = Object.keys(parsedJSON);
          // check if keys are unique
          const uniqueKeys = new Set(keys);
          return uniqueKeys.size === keys.length;
        } catch (error) {
          return true;
        }
      },
      {
        error: t('error_duplicated_keys'),
      },
    )
    .refine(
      (value) => {
        try {
          const parsedJSON = JSON.parse(value);
          const keys = Object.keys(parsedJSON);
          return keys.every((key) => key !== '');
        } catch (error) {
          return true;
        }
      },
      {
        error: t('error_empty_keys'),
      },
    );
};
