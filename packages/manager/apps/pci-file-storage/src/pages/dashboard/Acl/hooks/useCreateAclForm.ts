import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ACL_DEFAULT_PERMISSION } from '@/pages/dashboard/Acl/acl.view-model';
import { type CreateAclFormValues, createAclSchema } from '@/pages/dashboard/Acl/schema/Acl.schema';

export const useCreateAclForm = () => {
  return useForm<CreateAclFormValues>({
    resolver: zodResolver(createAclSchema),
    defaultValues: {
      accessTo: undefined,
      permission: ACL_DEFAULT_PERMISSION,
    },
    mode: 'onChange',
  });
};
