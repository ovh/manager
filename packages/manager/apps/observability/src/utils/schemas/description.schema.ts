import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const createDescriptionSchema = (t: (key: string, options?: { value?: number }) => string) =>
  z
    .string()
    .trim()
    .min(1, t(`${NAMESPACES.FORM}:required_field`));
