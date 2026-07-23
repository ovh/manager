import {
  ManagerTile,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import Emails from './Emails';
import Hosting from './Hosting';
import SubDomainMultiSite from './SubDomainsMultiSite';
import { useGetAssociatedHosting } from '@/domain/hooks/data/query';

interface AssociatedServicesCardsProps {
  readonly serviceName: string;
}

export default function AssociatedServicesCards({
  serviceName,
}: AssociatedServicesCardsProps) {
  const { t } = useTranslation(['domain']);

  const { data: associatedHosting } = useGetAssociatedHosting(serviceName);
  const { data: availability } = useFeatureAvailability([
    'web-domains:domains:associated-email',
  ]);
  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t(`domain_tab_general_information_associated_services_title`)}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <Hosting serviceName={serviceName} />
      <ManagerTile.Divider />
      <SubDomainMultiSite serviceNames={associatedHosting} />
      {availability?.['web-domains:domains:associated-email'] && (
        <>
          <ManagerTile.Divider />
          <Emails serviceName={serviceName} />
        </>
      )}
    </ManagerTile>
  );
}
