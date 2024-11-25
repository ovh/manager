import { z } from 'zod';

export const IP_ALLOCATION_SCHEMA = z.object({
  ipStart: z.string().ip(),
  ipEnd: z.string().ip(),
});
