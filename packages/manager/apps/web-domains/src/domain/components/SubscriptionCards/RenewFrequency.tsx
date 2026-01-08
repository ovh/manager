import React from 'react';
import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Icon,
  ICON_NAME,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { TServiceInfo } from '@/common/types/common.types';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';
import { translateRenewPeriod } from '@/domain/utils/utils';

interface RenewFrequencyProps {
  readonly serviceInfo: TServiceInfo;
  readonly serviceName: string;
}
export default function RenewFrequency({
  serviceInfo,
  serviceName,
}: RenewFrequencyProps) {
  const { t } = useTranslation(['domain']);
  const { data: renewFrequencyURL } = useNavigationGetUrl([
    'billing',
    '/autorenew/services/updates',
    {
      selectedType: 'DOMAIN',
      serviceId: serviceName,
    },
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_subscription_renew_frequency')}
        <Tooltip>
          {serviceInfo.billing?.renew?.current.mode ===
            ServiceInfoRenewModeEnum.Manual && (
            <TooltipTrigger asChild>
              <Icon
                className="pl-3 text-[--ods-color-primary-500]"
                name={ICON_NAME.circleQuestion}
              />
            </TooltipTrigger>
          )}
          <TooltipContent>
            {t(
              'domain_tab_general_information_subscription_manual_renew_tooltip',
            )}
          </TooltipContent>
        </Tooltip>
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>
          {translateRenewPeriod(serviceInfo.billing?.renew?.current.period, t)}
        </Text>
        <ActionMenu
          id="renew-frequency"
          isCompact
          items={[
            {
              id: 3,
              label: t(
                'domain_tab_general_information_subscription_handle_renew_frequency',
              ),
              href: renewFrequencyURL as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
