import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { RestrictedQueryOptions, VCDIpBlock } from '../types';
import { getVcdIpBlocks } from '../api';
import { getVcdIpBlockListQueryKey } from '../utils';
import { IP_BLOCK_MOCKS } from '../mocks/vcd-organization/vcd-ip-block.mock';
import { VCF_ADVANCED_TESTING_MODE } from './useVcdEdgeGateway';

type UseVcdIpBlockParams = RestrictedQueryOptions<VCDIpBlock[]> & {
  id: string;
};

export const useVcdIpBlocks = ({
  id,
  ...options
}: UseVcdIpBlockParams): UseQueryResult<VCDIpBlock[], Error> =>
  useQuery({
    queryKey: getVcdIpBlockListQueryKey(id),
    queryFn: () => {
      if (VCF_ADVANCED_TESTING_MODE) {
        // TODO: [EDGE] remove after QA tests
        return new Promise((resolve) => {
          console.log('🛜 mocking useVcdIpBlocks api call...');
          setTimeout(() => {
            resolve(IP_BLOCK_MOCKS);
          }, 2_000);
        });
      }
      return getVcdIpBlocks(id);
    },
    ...options,
  });
