import { z } from 'zod';

import { CONTINENT_CODES, DEPLOYMENT_MODES } from '@/domain/entities/regions';
import { CLUSTER_NAME_CONSTRAINTS } from '@/helpers/matchers/matchers';
import { TClusterPlanEnum, UpdatePolicy } from '@/types';

export const createClusterFormContinentCodes = ['ALL', ...CONTINENT_CODES] as const;

export const createClusterFormPlanKeys = ['all', 'free', 'standard'] as const;

export const createClusterSchema = z.object({
  name: z
    .string()
    .min(1, 'kubernetes_add_cluster_name_input_error_empty')
    .regex(CLUSTER_NAME_CONSTRAINTS.PATTERN, 'kubernetes_add_cluster_name_input_error'),
  location: z.object({
    deploymentMode: z.enum(DEPLOYMENT_MODES),
    continent: z.enum(createClusterFormContinentCodes),
    plan: z.nativeEnum(TClusterPlanEnum),
    macroRegion: z.string().nullable(),
    microRegion: z.string().nullable(),
  }),
  plan: z.nativeEnum(TClusterPlanEnum),
  version: z.string().min(1),
  updatePolicy: z.nativeEnum(UpdatePolicy),
});

export type TCreateClusterSchema = z.infer<typeof createClusterSchema>;
