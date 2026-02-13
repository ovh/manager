import { z } from 'zod';

import { DEPLOYMENT_MODES } from '@/domain/entities/catalog.entity';

const stringSchema = z.string();

const nameSchema = z
  .string()
  .min(1, { message: 'name_required' })
  .max(255, { message: 'name_max_length' })
  .regex(/^[a-zA-Z0-9_.-]+$/, { message: 'name_invalid_format' });

export const shareDataSchema = z.object({
  name: nameSchema,
  microRegion: stringSchema,
  specName: stringSchema,
  size: z.number(),
  privateNetworkId: z.string().min(1),
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
