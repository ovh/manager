import { TServiceInfo } from '@/common/types/common.types';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';
import { Badge, BADGE_COLOR, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import CreationDate from '../SubscriptionTiles/CreationDate';
import Contacts from '../SubscriptionTiles/Contacts';

interface SubscriptionProps {
  creationDate: string;
  expirationDate: string;
  contacts: TServiceInfo['customer']['contacts'];
  serviceName: string;
  serviceId: string;
}

export default function Subscription({
  creationDate,
  expirationDate,
  contacts,
  serviceName,
  serviceId
}: Readonly<SubscriptionProps>) {
  const { t } = useTranslation([
    NAMESPACES.BILLING,
    NAMESPACES.DASHBOARD,
    NAMESPACES.CONTACT,
    'domain',
    'domain-reseller',
  ]);
  const formatDate = useFormatDate();
  return (
    <ManagerTile>
      <ManagerTile.Title>{t('subscription')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <CreationDate creationDate={creationDate} serviceName={serviceName} serviceId={serviceId} />
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(
            'domain:domain_tab_general_information_subscription_expiration_date',
          )}
        </ManagerTile.Item.Label>
        <Text>{formatDate({ date: expirationDate })}</Text>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain-reseller:domain_reseller_renew_mode_label')}
        </ManagerTile.Item.Label>
        <Badge color={BADGE_COLOR.success} className="w-fit">
          {t('domain-reseller:domain_reseller_renew_mode_automatic')}
        </Badge>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <Contacts contacts={contacts} />
    </ManagerTile>
  );
}
