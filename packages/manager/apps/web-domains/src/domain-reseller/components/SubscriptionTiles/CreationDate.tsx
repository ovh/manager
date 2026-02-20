import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  ManagerTile,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface CreationDateProps {
  creationDate: string;
  serviceName: string;
  serviceId: string;
}

export default function CreationDate({
  creationDate,
  serviceName,
  serviceId
}: Readonly<CreationDateProps>) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, 'domain']);
  const formatDate = useFormatDate();
  const { data: managedServices } = useNavigationGetUrl([
    'billing',
    '/autorenew/services',
    {
      selectedType: 'DOMAIN_RESELLER',
      searchText: serviceName,
    },
  ]);

  const { data: resiliateServices } = useNavigationGetUrl([
    'billing',
    '/autorenew/services/resiliate',
    {
      serviceId: serviceId,
    },
  ]);

  return (
    <ManagerTile.Item>
      <div className="flex items-center justify-between">
        <div>
          <ManagerTile.Item.Label>{t('creation_date')}</ManagerTile.Item.Label>
          <Text>{formatDate({ date: creationDate })}</Text>
        </div>
        <ActionMenu
          id="creation-date"
          isCompact
          items={[
            {
              id: 1,
              label: t(
                'domain:domain_tab_general_information_subscription_creation_date_bouton',
              ),
              href: managedServices as string,
            },
            {
              id: 2,
              label: t(`${NAMESPACES.BILLING}:cancel_service`),
              color: ODS_BUTTON_COLOR.critical,
              href: resiliateServices as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
