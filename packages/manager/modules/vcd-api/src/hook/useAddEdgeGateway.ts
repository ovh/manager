import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignIpBlock, createVcdEdgeGateway } from '../api';
import {
  GetVCDDatacentreParams,
  RestrictedMutationOptions,
  VCDEdgeGateway,
  VCDEdgeGatewayTargetSpec,
} from '../types';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdIpBlockListQueryKey,
} from '../utils';

type NewEdgeGatewayPayload = VCDEdgeGatewayTargetSpec & {
  ipBlock: { id: string; name: string };
};

type UseAddEdgeGatewayParams = GetVCDDatacentreParams &
  RestrictedMutationOptions<VCDEdgeGateway, NewEdgeGatewayPayload>;

export const useAddEdgeGateway = ({
  id,
  vdcId,
  onSettled,
  ...options
}: UseAddEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, ipBlock }: NewEdgeGatewayPayload) => {
      const edge = await createVcdEdgeGateway({ id, vdcId, payload: { name } });

      await assignIpBlock({
        id,
        ipBlockId: ipBlock.id,
        payload: { name: ipBlock.name, edgeGatewayId: edge.id },
      });

      return edge;
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
