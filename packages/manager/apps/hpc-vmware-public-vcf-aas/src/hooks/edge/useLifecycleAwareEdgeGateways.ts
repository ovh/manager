import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  GetVCDDatacentreParams,
  getVcdIpBlockListQueryKey,
  useVcdEdgeGateways,
  VCDEdgeGateway,
} from '@ovh-ux/manager-module-vcd-api';

const EDGE_LIFECYCLE_POLL_INTERVAL = 4000;

const isEdgeTransitioning = (edge: VCDEdgeGateway): boolean => {
  const transitionStatuses: VCDEdgeGateway['resourceStatus'][] = [
    'CREATING',
    'DELETING',
  ];
  return transitionStatuses.includes(edge.resourceStatus);
};

// Follow EdgeGateway lifecycle: poll while transition (CREATING / DELETING)
// and refetch IP Blocks whenever one settles since the backend assigns on creation and frees on deletion.
export const useLifecycleAwareEdgeGateways = ({
  id,
  vdcId,
}: GetVCDDatacentreParams) => {
  const queryClient = useQueryClient();

  const edgeQuery = useVcdEdgeGateways({
    id,
    vdcId,
    refetchInterval: (query) =>
      query.state.data?.some(isEdgeTransitioning)
        ? EDGE_LIFECYCLE_POLL_INTERVAL
        : false,
  });

  const transitioningCount =
    edgeQuery.data?.filter(isEdgeTransitioning).length ?? 0;
  const previousTransitioningCount = useRef(transitioningCount);

  useEffect(() => {
    if (transitioningCount < previousTransitioningCount.current) {
      queryClient.invalidateQueries({
        queryKey: getVcdIpBlockListQueryKey(id),
      });
    }
    previousTransitioningCount.current = transitioningCount;
  }, [transitioningCount, queryClient, id]);

  return edgeQuery;
};
