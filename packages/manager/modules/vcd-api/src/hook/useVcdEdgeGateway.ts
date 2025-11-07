import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  GetEdgeGatewayParams,
  GetVCDDatacentreParams,
  VCDEdgeGateway,
} from '../types';
import { getVcdEdgeGateway, getVcdEdgeGateways } from '../api';
import { EDGE_GATEWAY_MOCKS } from '../mocks';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdEdgeGatewayQueryKey,
} from '../utils';
import { RestrictedQueryOptions } from '../types/query-options';

type UseVcdEdgeGatewayListParams = GetVCDDatacentreParams &
  RestrictedQueryOptions<VCDEdgeGateway[]>;

type UseVcdEdgeGatewayParams = GetEdgeGatewayParams &
  RestrictedQueryOptions<VCDEdgeGateway>;

export const useVcdEdgeGateways = ({
  id,
  vdcId,
  ...options
}: UseVcdEdgeGatewayListParams): UseQueryResult<VCDEdgeGateway[], Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
    queryFn: () => getVcdEdgeGateways(id, vdcId),
    ...options,
  });

// TODO: [EDGE] remove when unmocking
export const useVcdEdgeGatewaysMocks = ({
  id,
  vdcId,
  ...options
}: UseVcdEdgeGatewayListParams): UseQueryResult<VCDEdgeGateway[], Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVcdEdgeGateways api call...');
        setTimeout(() => {
          resolve(EDGE_GATEWAY_MOCKS);
        }, 2_000);
      }),
    ...options,
  });

export const useVcdEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  ...options
}: UseVcdEdgeGatewayParams): UseQueryResult<VCDEdgeGateway, Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayQueryKey({ id, vdcId, edgeGatewayId }),
    queryFn: () => getVcdEdgeGateway({ id, vdcId, edgeGatewayId }),
    ...options,
  });

// TODO: [EDGE] remove when unmocking
export const useVcdEdgeGatewayMocks = ({
  id,
  vdcId,
  edgeGatewayId,
  ...options
}: UseVcdEdgeGatewayParams): UseQueryResult<VCDEdgeGateway, Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayQueryKey({ id, vdcId, edgeGatewayId }),
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVcdEdgeGateway api call...');
        setTimeout(() => {
          resolve(EDGE_GATEWAY_MOCKS.find((edge) => edge.id === edgeGatewayId));
        }, 2_000);
      }),
    ...options,
  });
