import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  GetVCDDatacentreParams,
  getVcdIpBlockListQueryKey,
  useVcdEdgeGateways,
} from '@ovh-ux/manager-module-vcd-api';
import { isEdgeCreating } from '@/utils/edgeGatewayStatus';

const EDGE_CREATION_POLL_INTERVAL = 4000;

// Follow Edge Gateway lifecycle (CREATING / READY) and refetch IP Blocks when creation is complete.
export const useLifecycleAwareEdgeGateways = ({
  id,
  vdcId,
}: GetVCDDatacentreParams) => {
  const queryClient = useQueryClient();

  const edgeQuery = useVcdEdgeGateways({
    id,
    vdcId,
    refetchInterval: (query) =>
      query.state.data?.some(isEdgeCreating)
        ? EDGE_CREATION_POLL_INTERVAL
        : false,
  });

  const creatingCount = edgeQuery.data?.filter(isEdgeCreating).length ?? 0;
  const previousCreatingCount = useRef(creatingCount);

  useEffect(() => {
    if (creatingCount < previousCreatingCount.current) {
      queryClient.invalidateQueries({
        queryKey: getVcdIpBlockListQueryKey(id),
      });
    }
    previousCreatingCount.current = creatingCount;
  }, [creatingCount, queryClient, id]);

  return edgeQuery;
};
