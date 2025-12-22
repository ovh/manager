import { z } from 'zod';

import { CLUSTER_NAME_CONSTRAINTS } from '@/helpers/matchers/matchers';

export const createClusterSchema = z.object({
  name: z.string().regex(CLUSTER_NAME_CONSTRAINTS.PATTERN),
});

export type TCreateClusterSchema = z.infer<typeof createClusterSchema>;
