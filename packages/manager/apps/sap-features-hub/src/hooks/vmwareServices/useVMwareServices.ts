import { useQuery } from '@tanstack/react-query';
import {
  GetClusterProps,
  getDatacentreClusters,
  getVMwareDatacentres,
  getVMwareServices,
} from '@/data/api/vmwareServices';

export const useVMwareServices = () =>
  useQuery({
    queryKey: ['vmwareServices'],
    queryFn: getVMwareServices,
    select: (res) => res.data,
  });

export const useVMwareDatacentres = (serviceName: string) =>
  useQuery({
    queryKey: ['vmwareServices', serviceName, 'datacentres'],
    queryFn: () => getVMwareDatacentres(serviceName),
    select: (res) => res.data.results,
    enabled: !!serviceName,
  });

export const useDatacentreClusters = ({
  serviceName,
  datacenterId,
}: GetClusterProps) =>
  useQuery({
    queryKey: [
      'vmwareServices',
      serviceName,
      'datacentres',
      datacenterId,
      'clusters',
    ],
    queryFn: () => getDatacentreClusters({ serviceName, datacenterId }),
    select: (res) => res.data.list.results,
    enabled: !!serviceName && !!datacenterId,
  });
