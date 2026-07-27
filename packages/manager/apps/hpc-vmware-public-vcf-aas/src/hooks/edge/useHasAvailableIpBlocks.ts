import { useParams } from 'react-router-dom';
import { useVcdIpBlocks } from '@ovh-ux/manager-module-vcd-api';
import { isIpBlockAvailable } from '@/utils/ipBlockAvailability';

export const useHasAvailableIpBlocks = () => {
  const { id } = useParams();
  const { data: ipBlocks = [], isLoading } = useVcdIpBlocks({ id });

  const availableIpBlocks = ipBlocks.filter(isIpBlockAvailable);

  return {
    isLoading,
    ipBlocks,
    availableIpBlocks,
    hasAvailableIpBlocks: availableIpBlocks.length > 0,
  };
};
