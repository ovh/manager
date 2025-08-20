import { z } from 'zod';

export const DEPLOYMENT_FORM_SCHEMA = z.object({
  applicationVersion: z.string().min(1),
  applicationType: z.string().min(1),
  deploymentType: z.string().min(1),
});
