import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  getDatacentrePortGroup,
  getVMwareDatacentres,
  TGetDatacentreParams,
} from '@/data/api/vmwareServices';
import { VMwareDatacentre } from '@/types/vmwareService.type';

export const useVMwareDatacentres = (
  serviceName: string,
  options?: Partial<
    UseQueryOptions<
      IcebergFetchResultV6<VMwareDatacentre>,
      ApiError,
      VMwareDatacentre[]
    >
  >,
) =>
  useQuery({
    queryKey: ['vmwareServices', serviceName, 'datacentres'],
    queryFn: () => getVMwareDatacentres(serviceName),
    select: (res) => res.data,
    enabled: !!serviceName,
    ...options,
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
