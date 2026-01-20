import { z } from 'zod';

import { DEPLOYMENT_MODES } from '@/domain/entities/catalog.entity';

const stringShema = z.string();

export const shareDataShema = z.object({
  name: stringShema,
  microRegion: stringShema,
});

const deploymentModesShema = z.array(z.enum(DEPLOYMENT_MODES));
const continentShema = z.union([stringShema, z.literal('all')]);

export const createShareSchema = z.object({
  shareData: shareDataShema,
  deploymentModes: deploymentModesShema,
  continent: continentShema,
  macroRegion: stringShema,
  availabilityZone: z.string().nullable(),
});

export type CreateShareFormValues = z.infer<typeof createShareSchema>;
