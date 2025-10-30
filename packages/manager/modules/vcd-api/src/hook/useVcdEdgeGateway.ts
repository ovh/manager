import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GetEdgeGatewayParams, VCDEdgeGateway } from '../types';
import { getVcdEdgeGateway, getVcdEdgeGateways } from '../api';
import { EDGE_GATEWAY_MOCKS } from '../mocks';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdEdgeGatewayQueryKey,
} from '../utils';

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

export const useVcdEdgeGateway = (
  params: GetEdgeGatewayParams,
): UseQueryResult<VCDEdgeGateway, Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayQueryKey(params),
    queryFn: () => getVcdEdgeGateway(params),
  });

export const useVcdEdgeGatewayMocks = (
  params: GetEdgeGatewayParams,
): UseQueryResult<VCDEdgeGateway, Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayQueryKey(params),
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVcdEdgeGateway api call...');
        setTimeout(() => {
          resolve(
            EDGE_GATEWAY_MOCKS.find((edge) => edge.id === params.edgeGatewayId),
          );
        }, 2_000);
      }),
  });
