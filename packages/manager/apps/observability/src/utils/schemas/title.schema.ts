import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const createTitleSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .min(1, t(`${NAMESPACES.FORM}:required_field`))
    .min(4, t(`${NAMESPACES.FORM}:error_min_chars`, { value: 4 }))
    .max(255, t(`${NAMESPACES.FORM}:error_max_chars`, { value: 255 }));
