import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { updateNetworkAcl } from '../api/vcd-network-acl';
import { VCDNetworkAclSpec } from '../types';
import { getVcdNetworkAclListQueryKey } from '../utils';

export const useUpdateVcdNetworkAcl = ({
  id,
  aclId,
  onSuccess,
  ...options
}: {
  id: string;
  aclId: string;
} & Partial<
  UseMutationOptions<unknown, ApiError, VCDNetworkAclSpec, unknown>
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VCDNetworkAclSpec) =>
      updateNetworkAcl({ id, aclId, payload }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdNetworkAclListQueryKey(id),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
