import { Address4 } from 'ip-address';
import { z } from 'zod';

import { permissionOptions } from '@/pages/dashboard/Acl/acl.view-model';

export const createAclSchema = z.object({
  accessTo: z.string('acl:columns.accessTo.invalidFormat').refine(
    (value) => {
      const address = new Address4(value);
      return address.isCorrect();
    },
    {
      message: 'acl:columns.accessTo.invalidFormat',
    },
  ),
  permission: z.enum(permissionOptions),
});

export type CreateAclFormValues = z.infer<typeof createAclSchema>;
