import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignIpBlock, unassignIpBlock } from '../api';
import { GetEdgeGatewayParams, RestrictedMutationOptions } from '../types';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdIpBlockListQueryKey,
} from '../utils';

type IpBlockRef = { id: string; name: string };

type ReassignEdgeIpBlockPayload = {
  previous?: IpBlockRef;
  next: IpBlockRef;
};

type UseReassignEdgeIpBlockParams = GetEdgeGatewayParams &
  RestrictedMutationOptions<void, ReassignEdgeIpBlockPayload>;

export const useReassignEdgeIpBlock = ({
  id,
  vdcId,
  edgeGatewayId,
  onSettled,
  ...options
}: UseReassignEdgeIpBlockParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ previous, next }: ReassignEdgeIpBlockPayload) => {
      if (previous) {
        await unassignIpBlock({
          id,
          ipBlockId: previous.id,
          payload: { name: previous.name, edgeGatewayId: null },
        });
      }
      await assignIpBlock({
        id,
        ipBlockId: next.id,
        payload: { name: next.name, edgeGatewayId },
      });
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
