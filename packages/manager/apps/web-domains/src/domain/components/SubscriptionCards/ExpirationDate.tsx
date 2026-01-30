import { Universe } from '@/common/enum/common.enum';
import { TServiceInfo } from '@/common/types/common.types';
import { isServiceInCreation } from '@/domain/utils/helpers';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  ManagerTile,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { Text, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface ExpirationDateProps {
  readonly serviceName: string;
  readonly serviceInfo: TServiceInfo;
  readonly isFetchingServiceInfo: boolean;
}

export default function ExpirationDate({
  serviceInfo,
  serviceName,
  isFetchingServiceInfo,
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
        <Text data-testid="billing-expiration-date">{formatDate({ date: serviceInfo.billing?.expirationDate })}</Text>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionMenu
                id="expiration-date-action-menu"
                isCompact
                isLoading={isFetchingServiceInfo}
                isDisabled={isServiceInCreation(serviceInfo)}
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
          </TooltipTrigger>
          {isServiceInCreation(serviceInfo) && (
            <TooltipContent>
              {t('domain_tab_name_service_in_creation')}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </ManagerTile.Item>
  );
}