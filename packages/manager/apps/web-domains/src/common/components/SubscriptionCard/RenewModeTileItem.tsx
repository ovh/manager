import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';
import { goToUpdateRenewFrequencyParams } from '@/domain/utils/helpers';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  Universe,
} from '@/common/enum/common.enum';

interface RenewModeProps {
  readonly renewMode: ServiceInfoRenewModeEnum;
  readonly pendingActions: LifecycleCapacitiesEnum[];
  readonly serviceName: string;
  readonly isDomainPage: boolean;
  readonly universe: Universe;
}

export default function RenewModeItemTile({
  renewMode,
  pendingActions,
  serviceName,
  isDomainPage,
  universe,
}: RenewModeProps) {
  const { t } = useTranslation(['allDom', 'domain']);

  const billingUrl = goToUpdateRenewFrequencyParams(serviceName, universe);
  const { data: renewFrequencyURL } = useNavigationGetUrl([
    billingUrl.scope,
    billingUrl.target,
    billingUrl.params,
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('allDom_table_header_renewMode')}
        {renewMode === ServiceInfoRenewModeEnum.Manual && (
          <CircleQuestionTooltip
            translatedMessage={`${t(
              'domain:domain_tab_general_information_subscription_manual_renew_mode_tooltip',
            )}${
              isDomainPage
                ? ` ${t(
                    'domain:domain_tab_general_information_subscription_manual_renew_mode_tooltip_domain',
                  )}`
                : ''
            }`}
          />
        )}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        {pendingActions.includes(
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        ) ? (
          <Badge color={BADGE_COLOR.critical}>
            {t('allDom_table_status_terminate')}
          </Badge>
        ) : (
          <Badge
            color={
              renewMode === ServiceInfoRenewModeEnum.Automatic
                ? BADGE_COLOR.success
                : BADGE_COLOR.warning
            }
          >
            {t(`allDom_status_${renewMode}`)}
          </Badge>
        )}

        <ActionMenu
          id="renew-mode"
          isCompact
          items={[
            {
              id: 1,
              label: t(
                'domain:domain_tab_general_information_subscription_handle_renew_modify',
              ),
              href: renewFrequencyURL as string,
            },
          ]}
        />
      </div>
    </ManagerTile.Item>
  );
}
