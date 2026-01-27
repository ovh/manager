import { z } from 'zod';

import { DEPLOYMENT_MODES } from '@/domain/entities/catalog.entity';

const stringSchema = z.string();

export const shareDataSchema = z.object({
  name: stringSchema,
  microRegion: stringSchema,
  specName: stringSchema,
  size: z.number(),
  privateNetworkId: z.string().optional(),
});

const deploymentModesShema = z.array(z.enum(DEPLOYMENT_MODES));
const continentShema = z.union([stringSchema, z.literal('all')]);

export const createShareSchema = z.object({
  shareData: shareDataSchema,
  deploymentModes: deploymentModesShema,
  continent: continentShema,
  macroRegion: stringSchema,
  availabilityZone: z.string().nullable(),
});

export type CreateShareFormValues = z.infer<typeof createShareSchema>;
