import { useParams } from 'react-router-dom';
import {
  RestrictedQueryOptions,
  useVcdIpBlocks,
  VCDIpBlock,
} from '@ovh-ux/manager-module-vcd-api';
import { isIpBlockAvailable } from '@/utils/ipBlockAvailability';

export const useHasAvailableIpBlocks = (
  options?: RestrictedQueryOptions<VCDIpBlock[]>,
) => {
  const { id } = useParams();
  const { data: ipBlocks = [], isLoading } = useVcdIpBlocks({ id, ...options });

  const availableIpBlocks = ipBlocks.filter(isIpBlockAvailable);

  return {
    isLoading,
    ipBlocks,
    availableIpBlocks,
    hasAvailableIpBlocks: availableIpBlocks.length > 0,
  };
};
