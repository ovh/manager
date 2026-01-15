import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const DESCRIPTION_MAX_CHARS = 1000;

export const createDescriptionSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .min(1, t(`${NAMESPACES.FORM}:required_field`))
    .max(DESCRIPTION_MAX_CHARS, t('shared:form.error.max_chars', { value: DESCRIPTION_MAX_CHARS }));
