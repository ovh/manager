import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { ODS_BUTTON_COLOR as BUTTON_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ManagerTile,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { TDomainResource } from '@/domain/types/domainResource';
import { isServiceInCreation } from '@/domain/utils/helpers';
import { TServiceInfo } from '@/common/types/common.types';

interface CreationDateProps {
  readonly serviceName: string;
  readonly domainResource: TDomainResource;
  readonly serviceInfo: TServiceInfo;
  readonly isFetchingDomainResources: boolean;
}

export default function CreationDate({
  domainResource,
  serviceInfo,
  isFetchingDomainResources,
  serviceName,
}: CreationDateProps) {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
  ]);

  const formatDate = useFormatDate();

  const { data: managedServices } = useNavigationGetUrl([
    'billing',
    '/autorenew/services',
    {
      selectedType: 'DOMAIN',
      searchText: serviceName,
    },
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t(`${NAMESPACES.DASHBOARD}:creation_date`)}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>
          {formatDate({ date: domainResource?.currentState?.createdAt })}
        </Text>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionMenu
                id="creation-date"
                isCompact
                isLoading={isFetchingDomainResources}
                isDisabled={isServiceInCreation(serviceInfo)}
                data-testid={'action-btn-creation'}
                items={[
                  {
                    id: 1,
                    label: t(
                      'domain_tab_general_information_subscription_creation_date_bouton',
                    ),
                    href: managedServices as string,
                  },
                  {
                    id: 2,
                    label: t(`${NAMESPACES.BILLING}:cancel_service`),
                    color: BUTTON_COLOR.critical,
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
