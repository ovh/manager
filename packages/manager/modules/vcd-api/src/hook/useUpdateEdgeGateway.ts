import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignIpBlock, unassignIpBlock, updateVcdEdgeGateway } from '../api';
import { GetEdgeGatewayParams, RestrictedMutationOptions } from '../types';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdIpBlockListQueryKey,
} from '../utils';

type IpBlockRef = { id: string; name: string };

type UpdateEdgeGatewayPayload = {
  name?: string;
  ipBlock?: {
    previous?: IpBlockRef;
    next?: IpBlockRef;
  };
};

type UseUpdateEdgeGatewayParams = GetEdgeGatewayParams &
  RestrictedMutationOptions<void, UpdateEdgeGatewayPayload>;

export const useUpdateEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  onSettled,
  ...options
}: UseUpdateEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, ipBlock }: UpdateEdgeGatewayPayload) => {
      if (name !== undefined) {
        await updateVcdEdgeGateway({
          id,
          vdcId,
          edgeGatewayId,
          payload: { name },
        });
      }

      if (ipBlock) {
        if (ipBlock.previous) {
          await unassignIpBlock({
            id,
            ipBlockId: ipBlock.previous.id,
            payload: { name: ipBlock.previous.name, edgeGatewayId: null },
          });
        }
        if (ipBlock.next) {
          await assignIpBlock({
            id,
            ipBlockId: ipBlock.next.id,
            payload: { name: ipBlock.next.name, edgeGatewayId },
          });
        }
      }
    },
    ...options,
    onSettled: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      queryClient.invalidateQueries({
        queryKey: getVcdIpBlockListQueryKey(id),
      });
      onSettled?.(...params);
    },
  });
};
