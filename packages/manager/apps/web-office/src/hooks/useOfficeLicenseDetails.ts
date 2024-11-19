import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getOfficeLicenseDetails,
  getlicenseOfficeServiceQueryKey,
} from '@/api/license/api';

export const useOfficeLicenseDetail = (
  serviceName?: string,
  noCache = false,
) => {
  const [searchParams] = useSearchParams();
  const selectedServiceName = searchParams.get('serviceName');

  return useQuery({
    queryKey: getlicenseOfficeServiceQueryKey({
      serviceName: serviceName || selectedServiceName,
    }),
    queryFn: () =>
      getOfficeLicenseDetails(serviceName || selectedServiceName || ''),
    enabled: Boolean(serviceName || selectedServiceName),
    gcTime: noCache ? 0 : 5000,
  });
};
