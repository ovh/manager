import { useMutation, useQueryClient } from '@tanstack/react-query';

import { aclsQueryKey } from '@/adapters/acl/queryKeys';
import { deleteAcl } from '@/data/api/acl.api';

export type TUseDeleteAclOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteAcl = (
  projectId: string,
  region: string,
  shareId: string,
  options?: TUseDeleteAclOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess: onSuccessOption, onError } = options ?? {};

  return useMutation({
    mutationFn: (aclId: string) => deleteAcl(projectId, region, shareId, aclId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: aclsQueryKey(projectId, region, shareId),
      });
      onSuccessOption?.();
    },
    onError,
  });
};
