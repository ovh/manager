import { TGetClusterParams } from '@/data/api/vmwareServices';
import { useMockSapCapabilities } from '../sapCapabilities/useSapCapabilities';
import { useDatacentrePortGroup } from '../vmwareServices/useDatacentres';
import { useDatastores } from '../vmwareServices/useDatastores';
import { useVMwareStoragePolicy } from '../vmwareServices/useVMwareServices';

export const useServerConfigQueries = ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams) => {
  const datacentrePortGroupQuery = useDatacentrePortGroup({
    serviceName,
    datacenterId,
  });

  const storagePolicyQuery = useVMwareStoragePolicy(serviceName);

  const sapCapabilitiesQuery = useMockSapCapabilities();

  const datastoreQuery = useDatastores({
    serviceName,
    datacenterId,
    clusterId,
  });

  return {
    datacentrePortGroupQuery,
    storagePolicyQuery,
    sapCapabilitiesQuery,
    datastoreQuery,
  };
};
