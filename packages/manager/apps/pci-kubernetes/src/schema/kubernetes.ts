import { z } from 'zod';

export const EtcdUsageSchema = z.object({
  quota: z
    .number()
    .int()
    .nonnegative(),
  usage: z
    .number()
    .int()
    .nonnegative(),
});

export type TKubeEtcdUsage = z.infer<typeof EtcdUsageSchema>;
