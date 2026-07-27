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

export const VCF_ADVANCED_TESTING_MODE = false; // TODO: [EDGE] remove after QA tests

export const useVcdEdgeGateways = ({
  id,
  vdcId,
  ...options
}: UseVcdEdgeGatewayListParams): UseQueryResult<VCDEdgeGateway[], Error> =>
  useQuery({
    queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
    queryFn: () => {
      if (VCF_ADVANCED_TESTING_MODE) {
        // TODO: [EDGE] remove after QA tests
        return new Promise((resolve) => {
          console.log('🛜 mocking useVcdEdgeGateways api call...');
          setTimeout(() => {
            resolve(EDGE_GATEWAY_MOCKS);
          }, 2_000);
        });
      }
      return getVcdEdgeGateways(id, vdcId);
    },
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
    queryFn: () => {
      if (VCF_ADVANCED_TESTING_MODE) {
        // TODO: [EDGE] remove after QA tests
        return new Promise((resolve) => {
          console.log('🛜 mocking useVcdEdgeGateway api call...');
          setTimeout(() => {
            resolve(
              EDGE_GATEWAY_MOCKS.find((edge) => edge.id === edgeGatewayId),
            );
          }, 2_000);
        });
      }
      return getVcdEdgeGateway({ id, vdcId, edgeGatewayId });
    },
    ...options,
  });
