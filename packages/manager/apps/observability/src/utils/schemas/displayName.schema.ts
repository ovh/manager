import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const DISPLAY_NAME_MAX_CHARS = 255;

export const createDisplayNameSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .min(1, t(`${NAMESPACES.FORM}:required_field`))
    .max(
      DISPLAY_NAME_MAX_CHARS,
      t(`${NAMESPACES.FORM}:error_max_chars`, { value: DISPLAY_NAME_MAX_CHARS }),
    );
