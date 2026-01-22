import { z } from 'zod/v3';
import { NETWORK_ACL_SCHEMA } from '@/schemas/form.schema';

export type NetworkAclFormData = z.infer<typeof NETWORK_ACL_SCHEMA>;
