import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VCDEdgeGateway } from '../types';
import { getVcdEdgeGateways } from '../api';
import { EDGE_GATEWAY_MOCKS } from '../mocks';
import { getVcdEdgeGatewayListQueryKey } from '../utils';

export const useVcdEdgeGateways = (
  id: string,
  vdcId: string,
): UseQueryResult<VCDEdgeGateway[], Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
    queryFn: () => getVcdEdgeGateways(id, vdcId),
  });

export const useVcdEdgeGatewaysMocks = (
  id: string,
  vdcId: string,
): UseQueryResult<VCDEdgeGateway[], Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVcdEdgeGateways api call...');
        setTimeout(() => {
          resolve(EDGE_GATEWAY_MOCKS);
        }, 2_000);
      }),
  });
