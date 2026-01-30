import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';
import { goToUpdateRenewFrequencyParams, isServiceInCreation } from '@/domain/utils/helpers';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
  Universe,
} from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface RenewModeProps {
  readonly serviceName: string;
  readonly universe: Universe;
}

export default function RenewModeItemTile({
  serviceName,
  universe,
}: RenewModeProps) {
  const { t } = useTranslation(['allDom', 'domain', 'web-domains']);

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

  const tooltipGenericMessage = t('web-domains:web_domains_renew_mode_tooltip')
  const tooltipDomainMessage = universe === Universe.DOMAIN ? ` ${t('domain:domain_tab_general_information_subscription_manual_renew_mode_tooltip_domain')}` : ""
  const renewMode = serviceInfo.billing?.renew?.current?.mode || ServiceInfoRenewModeEnum.Manual;
  const isManualRenew = renewMode === ServiceInfoRenewModeEnum.Manual;

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('web-domains:web_domains_renew_mode')}
        {isManualRenew && (
          <CircleQuestionTooltip
            translatedMessage={`${tooltipGenericMessage}${tooltipDomainMessage}`}
          />
        )}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        {serviceInfo.billing?.lifecycle?.current?.pendingActions.includes(
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        ) ? (
          <Badge color={BADGE_COLOR.critical}>
            {t('allDom_table_status_terminate')}
          </Badge>
        ) : (
          <Badge
            color={
              isManualRenew
                ? BADGE_COLOR.warning
                : BADGE_COLOR.success
            }
          >
            {t(`web-domains:web_domains_renew_mode_${serviceInfo.billing?.renew?.current?.mode ?? ServiceInfoRenewModeEnum.Manual}`)}
          </Badge>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionMenu
                id="renew-mode"
                isCompact
                isDisabled={isServiceInCreation(serviceInfo)}
                items={[
                  {
                    id: 1,
                    label: t(
                      'web-domains:web_domains_renew_mode_modify',
                    ),
                    href: renewFrequencyURL as string,
                  },
                ]}
              />
            </div>
          </TooltipTrigger>
          {isServiceInCreation(serviceInfo) && (
            <TooltipContent>
              {t('domain:domain_tab_name_service_in_creation')}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </ManagerTile.Item>
  );
}
