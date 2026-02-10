import { z } from 'zod';

export const createSharePayloadSchema = z.object({
  type: z.string(),
  description: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  networkId: z.uuid().optional(),
  size: z.number().optional(),
  snapshotId: z.uuid().nullable().optional(),
  subnetId: z.uuid().optional(),
});

export type TCreateSharePayload = z.infer<typeof createSharePayloadSchema>;
