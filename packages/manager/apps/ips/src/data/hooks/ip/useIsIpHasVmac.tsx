import { ipFormatter } from '@/utils';
import { useGetIpVmacWithIp } from './useGetIpVmacWithIp';

export type UseIpHasVmacParams = {
  serviceName: string;
  ip: string;
  enabled?: boolean;
};

export const useIpHasVmac = ({
  serviceName,
  ip,
  enabled,
}: UseIpHasVmacParams) => {
  const { vmacsWithIp, isLoading } = useGetIpVmacWithIp({
    serviceName,
    enabled,
  });

  const vmacs = vmacsWithIp
    ?.filter((vmac) => vmac.ip?.includes(ipFormatter(ip).ip))
    .map((vmac) => vmac);

  return {
    isVmacAlreadyExist: vmacs.length > 0,
    ipvmac: vmacs,
    isLoading,
  };
};
