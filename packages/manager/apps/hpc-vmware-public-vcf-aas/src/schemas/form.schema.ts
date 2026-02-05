import { z } from 'zod';

export const NETWORK_ACL_SCHEMA = z.object({
  network: z
    .string()
    .refine((val) => z.ipv4().safeParse(val).success || z.cidrv4().safeParse(val).success, {
      message: 'ZOD_ERROR_IPV4_OR_IPV4CIDR_INVALID',
    }),
  description: z.string().trim(),
});
