import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ServiceInfoRenewModeEnum, ServiceRoutes, Universe } from '@/common/enum/common.enum';
import { translateRenewPeriod } from '@/domain/utils/utils';
import { goToUpdateRenewFrequencyParams, isServiceInCreation } from '@/domain/utils/helpers';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface RenewFrequencyProps {
  readonly serviceName: string;
  readonly universe: Universe;
}
export default function RenewFrequencyTileItem({
  serviceName,
  universe,
}: RenewFrequencyProps) {
  const { t } = useTranslation(['domain', 'web-domains']);

  const key = universe === Universe.DOMAIN ? 'domain' : 'allDom';
  const serviceRoute = universe === Universe.DOMAIN ? ServiceRoutes.Domain : ServiceRoutes.AllDom;

  const { serviceInfo } = useGetServiceInformation(
    key,
    serviceName,
    serviceRoute
  );

  const billingUrl = goToUpdateRenewFrequencyParams(serviceName, universe);
  const { data: renewFrequencyURL } = useNavigationGetUrl([
    billingUrl.scope,
    billingUrl.target,
    billingUrl.params,
  ]);

  const tooltipGenericMessage = t('domain_tab_general_information_subscription_manual_renew_tooltip');
  const tooltipDomainMessage = universe === Universe.DOMAIN ? ` ${t('domain_tab_general_information_subscription_manual_renew_mode_tooltip_domain')}` : ""

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('web-domains:web_domains_renew_frequency')}
        {serviceInfo.billing?.renew?.current?.mode === ServiceInfoRenewModeEnum.Manual && (
          <CircleQuestionTooltip
            translatedMessage={`${tooltipGenericMessage}${tooltipDomainMessage}`}
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
                      'web-domains:web_domains_renew_frequency_modify',
                    ),
                    href: renewFrequencyURL as string,
                  },
                ]}
              />
            </div>
          </TooltipTrigger>
          {isServiceInCreation(serviceInfo) && (
            <TooltipContent data-testid="service-in-creation-tooltip-content">
              {t('domain:domain_tab_name_service_in_creation')}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </ManagerTile.Item>
  );
}
