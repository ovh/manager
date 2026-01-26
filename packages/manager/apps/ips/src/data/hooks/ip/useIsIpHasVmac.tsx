import { ipFormatter } from '@/utils';

import { useGetIpVmacWithIp } from './useGetIpVmacWithIp';

export type UseIpHasVmacParams = {
  ip: string;
  serviceName?: string | null;
  enabled?: boolean;
};

export const useIpHasVmac = ({
  serviceName,
  ip,
  enabled = true,
}: UseIpHasVmacParams) => {
  const { vmacsWithIp, loading } = useGetIpVmacWithIp({
    serviceName,
    enabled: Boolean(serviceName) && enabled,
  });

  const vmacs = vmacsWithIp
    ?.filter((vmac) => vmac.ip?.includes(ipFormatter(ip).ip))
    .map((vmac) => vmac);

  return {
    isVmacAlreadyExist: vmacs.length > 0,
    ipvmac: vmacs,
    loading,
  };
};
