import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { VCDIpBlock } from '../types';
import { getVcdIpBlocks } from '../api';
import { getVcdIpBlockListQueryKey } from '../utils';
import { IP_BLOCK_MOCKS } from '../mocks/vcd-organization/vcd-ip-block.mock';

export const useVcdIpBlocks = (
  id: string,
): UseQueryResult<VCDIpBlock[], Error> =>
  useQuery({
    queryKey: getVcdIpBlockListQueryKey(id),
    queryFn: () => getVcdIpBlocks(id),
  });

// TODO: [EDGE] remove when unmocking
export const useVcdIpBlocksMocks = (
  id: string,
): UseQueryResult<VCDIpBlock[], Error> =>
  useQuery({
    queryKey: getVcdIpBlockListQueryKey(id),
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVcdIpBlocks api call...');
        setTimeout(() => {
          resolve(IP_BLOCK_MOCKS);
        }, 2_000);
      }),
  });
