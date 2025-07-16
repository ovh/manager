import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const MIN_CHAR = 1;
export const MAX_CHAR = 255;
export const useSecretPathSchema = () => {
  // a secret path can't
  // - start with a '/'
  // - contain '//'
  // - end with a '/'
  const PATH_STRUCTURE_REGEX = /^(?!\/)(?!.*\/\/).*(?<!\/)$/;

  const PATH_ALLOWED_CHARACTER_REGEX = /^[\w.:/=@-]*$/;

  const { t } = useTranslation(['secret-manager:create', NAMESPACES.FORM]);

  return z
    .string({ error: t('required_field', { ns: NAMESPACES.FORM }) })
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
