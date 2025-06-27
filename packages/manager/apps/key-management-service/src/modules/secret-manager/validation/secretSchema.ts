import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

// const PATH_REGEX = /^(?!\/)(?!.*\/\/)[a-zA-Z0-9_.:/=@-]*(?<!\/)$/;

export const UseSecretPathSchema = () => {
  // a secret path can't
  // - start with a '/'
  // - contain '//'
  // - end with a '/'
  const PATH_STRUCTURE_REGEX = /^(?!\/)(?!.*\/\/).*(?<!\/)$/;

  const PATH_ALLOWED_CHARACTER_REGEX = /^[\w.:/=@-]*$/;

  const { t } = useTranslation(['secret-manager:create', NAMESPACES.FORM]);

  const MIN_CHAR = 1;
  const MAX_CHAR = 20;

  return z
    .string({ message: t('required_field', { ns: NAMESPACES.FORM }) })
    .regex(
      PATH_ALLOWED_CHARACTER_REGEX,
      t('secret-manager/create:path_error_allowed_characters'),
    )
    .regex(
      PATH_STRUCTURE_REGEX,
      t('secret-manager/create:path_error_structure'),
    )
    .min(
      MIN_CHAR,
      t('error_min_chars', { value: MIN_CHAR, ns: NAMESPACES.FORM }),
    )
    .max(
      MAX_CHAR,
      t('error_max_chars', { value: MAX_CHAR, ns: NAMESPACES.FORM }),
    );
};

export const UseSecretValueSchema = () => {
  const { t } = useTranslation(['secret-manager:create', NAMESPACES.FORM]);

  return z
    .string({ message: t('required_field', { ns: NAMESPACES.FORM }) })
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
        message: t('secret-manager/create:values_error_invalid_json'),
      },
    );
};
