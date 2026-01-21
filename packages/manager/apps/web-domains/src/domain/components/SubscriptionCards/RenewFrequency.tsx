import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import {
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
import CircleQuestionTooltip from '../CircleQuestionTooltip/CircleQuestionTooltip';
import {
  goToUpdateRenewFrequencyParams,
  isServiceInCreation,
} from '@/domain/utils/helpers';

interface RenewFrequencyProps {
  readonly serviceInfo: TServiceInfo;
  readonly serviceName: string;
}
export default function RenewFrequency({
  serviceInfo,
  serviceName,
}: RenewFrequencyProps) {
  const { t } = useTranslation(['domain']);

  const billingUrl = goToUpdateRenewFrequencyParams(serviceName);
  const { data: renewFrequencyURL } = useNavigationGetUrl([
    billingUrl.scope,
    billingUrl.target,
    billingUrl.params,
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_subscription_renew_frequency')}

        {serviceInfo.billing?.renew?.current.mode ===
          ServiceInfoRenewModeEnum.Manual && (
          <CircleQuestionTooltip
            translatedMessage={t(
              'domain_tab_general_information_subscription_manual_renew_tooltip',
            )}
          />
        )}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>
          {translateRenewPeriod(serviceInfo.billing?.renew?.current.period, t)}
        </Text>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionMenu
                id="renew-frequency"
                isCompact
                isDisabled={isServiceInCreation(serviceInfo)}
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
