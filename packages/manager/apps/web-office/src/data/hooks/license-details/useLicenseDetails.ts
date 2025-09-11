import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficeLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey } from '@/data/api/license/key';

export const useLicenseDetail = (serviceName?: string, noCache = false) => {
  const { serviceName: selectedServiceName } = useParams();

  return useQuery({
    queryKey: getOfficeLicenseDetailsQueryKey(serviceName || selectedServiceName || ''),
    queryFn: () => getOfficeLicenseDetails(serviceName || selectedServiceName || ''),
    enabled: Boolean(serviceName || selectedServiceName),
    gcTime: noCache ? 0 : 5000,
  });
};
