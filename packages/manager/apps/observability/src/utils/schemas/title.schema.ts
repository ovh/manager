import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const TITLE_MAX_CHARS = 255;
export const TITLE_MIN_CHARS = 4;

export const createTitleSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .min(1, t(`${NAMESPACES.FORM}:required_field`))
    .min(TITLE_MIN_CHARS, t(`${NAMESPACES.FORM}:error_min_chars`, { value: TITLE_MIN_CHARS }))
    .max(TITLE_MAX_CHARS, t('shared:form.error.max_chars', { value: TITLE_MAX_CHARS }));
