import DomainsList from '@/common/components/DomainsList/domainsList';
import { resellerDomainsListApiUrl } from '@/common/constants';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { findContact } from '@/common/utils/utils';
import Loading from '@/domain/components/Loading/Loading';
import { useMemo } from 'react';

export default function DomainResellerDomainsList() {
  const {
    serviceInfo,
    isServiceInfoLoading,
  } = useGetServiceInformationByRoutes(ServiceRoutes.DomainReseller);

  const nicAdmin = useMemo(() => {
    if (!serviceInfo?.customer?.contacts) return undefined;
    return findContact(
      serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    );
  }, [serviceInfo]);

  if (isServiceInfoLoading) {
    return <Loading />;
  }

  return <DomainsList baseRoute={resellerDomainsListApiUrl(nicAdmin)} />;
}
