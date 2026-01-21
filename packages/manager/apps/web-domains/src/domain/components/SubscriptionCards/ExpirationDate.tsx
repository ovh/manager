import { Universe } from '@/common/enum/common.enum';
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

interface ExpirationDateProps {
  readonly date: string;
  readonly serviceName: string;
  readonly isFetchingDomainResources: boolean;
}

export default function ExpirationDate({
  date,
  serviceName,
  isFetchingDomainResources,
}: ExpirationDateProps) {
  const { t } = useTranslation('domain');
  const formatDate = useFormatDate();

  const { data: managedServices } = useNavigationGetUrl([
    'billing',
    '/autorenew/services',
    {
      selectedType: Universe.DOMAIN,
      searchText: serviceName,
    },
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_subscription_expiration_date')}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>{formatDate({ date, format: 'PP' })}</Text>
        <ActionMenu
          id="expiration-date"
          isCompact
          isLoading={isFetchingDomainResources}
          data-testid={'action-btn-expiration'}
          items={[
            {
              id: 1,
              label: t(
                'domain_tab_general_information_subscription_expiration_date_action',
              ),
              href: managedServices as string,
            },
            {
              id: 2,
              label: t(`${NAMESPACES.BILLING}:cancel_service`),
              color: ODS_BUTTON_COLOR.critical,
              href: managedServices as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
