import { z } from 'zod';

import { NETWORK_ACL_SCHEMA } from '@/schemas/form.schema';

export type NetworkAclFormData = z.infer<typeof NETWORK_ACL_SCHEMA>;
