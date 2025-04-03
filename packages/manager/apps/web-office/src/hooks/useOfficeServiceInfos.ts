import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getOfficeLicenseServiceInfos,
  getOfficeLicenseServiceInfosKey,
  getOfficeLicenseServiceInfoTenantQueryKey,
  OfficeLicenseServiceInfosType,
} from '@/api/serviceInfos';
import { useOfficeServiceType } from './useOfficeServiceType';

export const useOfficeServiceInfos = () => {
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  return useQuery<OfficeLicenseServiceInfosType>({
    queryKey:
      serviceType === 'payAsYouGo'
        ? getOfficeLicenseServiceInfosKey(serviceName)
        : getOfficeLicenseServiceInfoTenantQueryKey(serviceName),
    queryFn: () => getOfficeLicenseServiceInfos(serviceName),
  });
};
