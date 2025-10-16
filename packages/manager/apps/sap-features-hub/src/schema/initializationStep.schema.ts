import { z } from 'zod';

export const INITIALIZATION_STEP_SCHEMA = z.object({
  serviceName: z.string().nonempty(),
  serviceDisplayName: z.string().nonempty(),
  datacenterId: z.number().int(),
  datacenterName: z.string().nonempty(),
  clusterName: z.string().nonempty(),
  clusterId: z.number().int(),
});
