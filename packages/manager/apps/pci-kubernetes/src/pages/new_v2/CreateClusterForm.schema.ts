import { z } from 'zod';

import { CLUSTER_NAME_CONSTRAINTS } from '@/helpers/matchers/matchers';

export const createClusterSchema = z.object({
  name: z
    .string()
    .min(1, 'kubernetes_add_cluster_name_input_error_empty')
    .regex(CLUSTER_NAME_CONSTRAINTS.PATTERN, 'kubernetes_add_cluster_name_input_error'),
});

export type TCreateClusterSchema = z.infer<typeof createClusterSchema>;
