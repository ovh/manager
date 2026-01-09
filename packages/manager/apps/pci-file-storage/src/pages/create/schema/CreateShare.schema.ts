import { z } from 'zod';
import { DEPLOYMENT_MODES } from '@/domain/entities/catalog.entity';

export const createShareSchema = z.object({
  name: z.string(),
  deploymentModes: z.array(z.enum(DEPLOYMENT_MODES)),
  continent: z.string(),
  city: z.string(),
  dataCenter: z.string(),
  availabilityZone: z.string().optional(),
});

export type CreateShareFormValues = z.infer<typeof createShareSchema>;

