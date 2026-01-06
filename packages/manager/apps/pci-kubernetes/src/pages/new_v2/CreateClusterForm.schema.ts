import { z } from 'zod';

import { CLUSTER_NAME_CONSTRAINTS } from '@/helpers/matchers/matchers';
import { TClusterPlanEnum } from '@/types';

export const createClusterSchema = z.object({
  name: z.string().regex(CLUSTER_NAME_CONSTRAINTS.PATTERN),
  plan: z.nativeEnum(TClusterPlanEnum),
});

export type TCreateClusterSchema = z.infer<typeof createClusterSchema>;
