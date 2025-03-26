import { useQuery } from '@tanstack/react-query';
import {
  getDatacentrePortGroup,
  getVMwareDatacentres,
  TGetDatacentreParams,
} from '@/data/api/vmwareServices';

export const useVMwareDatacentres = (serviceName: string) =>
  useQuery({
    queryKey: ['vmwareServices', serviceName, 'datacentres'],
    queryFn: () => getVMwareDatacentres(serviceName),
    select: (res) => res.data.results,
    enabled: !!serviceName,
  });

export const useDatacentrePortGroup = ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams) =>
  useQuery({
    queryKey: [
      'vmwareServices',
      serviceName,
      'datacentres',
      datacenterId,
      'portgroup',
    ],
    queryFn: () => getDatacentrePortGroup({ serviceName, datacenterId }),
    select: (res) => res.data,
    enabled: !!serviceName && !!datacenterId,
  });
