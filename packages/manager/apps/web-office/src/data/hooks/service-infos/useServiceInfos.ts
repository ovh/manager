import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficeLicenseServiceInfos } from '@/data/api/service-infos/api';
import {
  getOfficeLicenseServiceInfoTenantQueryKey,
  getOfficeLicenseServiceInfosKey,
} from '@/data/api/service-infos/key';
import { OfficeLicenseServiceInfosType } from '@/data/api/service-infos/type';
import { ServiceType } from '@/utils/ServiceType.utils';

export const useServiceInfos = () => {
  const { serviceName } = useParams();
  const serviceType = ServiceType(serviceName);
  return useQuery<OfficeLicenseServiceInfosType>({
    queryKey: [
      serviceType === 'payAsYouGo'
        ? getOfficeLicenseServiceInfosKey(serviceName)
        : getOfficeLicenseServiceInfoTenantQueryKey(serviceName),
      serviceName,
    ],
    queryFn: () => getOfficeLicenseServiceInfos(serviceName),
  });
};
