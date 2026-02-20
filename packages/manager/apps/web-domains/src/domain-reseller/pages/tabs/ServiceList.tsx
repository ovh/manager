import DomainsList from '@/common/components/DomainsList/domainsList';
import { resellerDomainsListApiUrl } from '@/common/constants';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { findContact } from '@/common/utils/utils';
import AssociateModal from '@/domain-reseller/components/Modal/AssociateModal';
import Loading from '@/domain/components/Loading/Loading';
import { useMemo, useState } from 'react';

export default function DomainResellerDomainsList() {
  const [associateModalOpen, setAssociateModalOpen] = useState<boolean>(false);
  const {
    serviceInfo,
    isServiceInfoLoading,
  } = useGetServiceInformationByRoutes(ServiceRoutes.DomainReseller);

  const nicAdminReseller = useMemo(() => {
    if (!serviceInfo?.customer?.contacts) return undefined;
    return findContact(
      serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    );
  }, [serviceInfo]);

  if (isServiceInfoLoading) {
    return <Loading />;
  }

  return (
    <div data-testid="domain-reseller-domains-list">
      <DomainsList
        baseRoute={resellerDomainsListApiUrl(nicAdminReseller)}
        onAssociateModalChange={setAssociateModalOpen}
        isActionMenu
      />
      {associateModalOpen && (
        <AssociateModal
          isOpen={associateModalOpen}
          nicAdminReseller={nicAdminReseller}
          onAssociateModalChange={setAssociateModalOpen}
        />
      )}
    </div>
  );
}
