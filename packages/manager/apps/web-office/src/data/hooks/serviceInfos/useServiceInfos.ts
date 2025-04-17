import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getOfficeLicenseServiceInfos,
  getOfficeLicenseServiceInfosKey,
  getOfficeLicenseServiceInfoTenantQueryKey,
  OfficeLicenseServiceInfosType,
} from '@/data/api/serviceInfos';
import { useServiceType } from '../serviceType/useServiceType';

export const useServiceInfos = () => {
  const { serviceName } = useParams();
  const serviceType = useServiceType(serviceName);
  return useQuery<OfficeLicenseServiceInfosType>({
    queryKey:
      serviceType === 'payAsYouGo'
        ? getOfficeLicenseServiceInfosKey(serviceName)
        : getOfficeLicenseServiceInfoTenantQueryKey(serviceName),
    queryFn: () => getOfficeLicenseServiceInfos(serviceName),
  });
};
