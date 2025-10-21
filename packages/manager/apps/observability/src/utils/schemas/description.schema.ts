import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const createDescriptionSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .max(80, t(`${NAMESPACES.FORM}:error_max_chars`, { value: 80 }))
    .optional();
