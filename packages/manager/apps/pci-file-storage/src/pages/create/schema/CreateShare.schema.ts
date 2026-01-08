import { z } from 'zod';

export const createShareSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'form_name_required' })
    .max(255, { message: 'form_name_max_length' }),
  deploymentMode: z
    .string()
    .min(1, { message: 'form_deployment_mode_required' }),
  continent: z.string().min(1, { message: 'form_continent_required' }),
  macroRegion: z.string().min(1, { message: 'form_macro_region_required' }),
  microRegion: z.string().min(1, { message: 'form_micro_region_required' }),
  availabilityZone: z.string().optional(),
});

export type CreateShareFormValues = z.infer<typeof createShareSchema>;

