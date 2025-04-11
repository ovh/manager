import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getOfficeLicenseDetails,
  getOfficeLicenseDetailsQueryKey,
} from '@/data/api/license';

export const useLicenseDetail = (serviceName?: string, noCache = false) => {
  const { serviceName: selectedServiceName } = useParams();

  return useQuery({
    queryKey: getOfficeLicenseDetailsQueryKey(
      serviceName || selectedServiceName || '',
    ),
    queryFn: () =>
      getOfficeLicenseDetails(serviceName || selectedServiceName || ''),
    enabled: Boolean(serviceName || selectedServiceName),
    gcTime: noCache ? 0 : 5000,
  });
};
