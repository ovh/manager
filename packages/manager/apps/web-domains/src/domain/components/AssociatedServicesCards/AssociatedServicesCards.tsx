import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import Emails from './Emails';

interface AssociatedServicesCardsProps {
  readonly serviceName: string;
}

export default function AssociatedServicesCards({
  serviceName,
}: AssociatedServicesCardsProps) {
  const { t } = useTranslation(['domain']);

  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t(`domain_tab_general_information_associated_services_title`)}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <Emails serviceName={serviceName} />
    </ManagerTile>
  );
}
