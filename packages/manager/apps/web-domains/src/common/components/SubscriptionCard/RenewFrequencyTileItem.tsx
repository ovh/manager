import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ServiceInfoRenewModeEnum, Universe } from '@/common/enum/common.enum';
import { translateRenewPeriod } from '@/domain/utils/utils';
import { goToUpdateRenewFrequencyParams } from '@/domain/utils/helpers';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';

interface RenewFrequencyProps {
  readonly mode: ServiceInfoRenewModeEnum;
  readonly period: string;
  readonly serviceName: string;
  readonly isDomainPage: boolean;
  readonly universe: Universe;
}
export default function RenewFrequencyTileItem({
  mode,
  period,
  serviceName,
  isDomainPage,
  universe,
}: RenewFrequencyProps) {
  const { t } = useTranslation(['domain']);

  const billingUrl = goToUpdateRenewFrequencyParams(serviceName, universe);
  const { data: renewFrequencyURL } = useNavigationGetUrl([
    billingUrl.scope,
    billingUrl.target,
    billingUrl.params,
  ]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_subscription_renew_frequency')}

        {mode === ServiceInfoRenewModeEnum.Manual && (
          <CircleQuestionTooltip
            translatedMessage={`${t(
              'domain_tab_general_information_subscription_manual_renew_tooltip',
            )}${
              isDomainPage
                ? ` ${t(
                    'domain_tab_general_information_subscription_manual_renew_mode_tooltip_domain',
                  )}`
                : ''
            }`}
          />
        )}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>{translateRenewPeriod(period, t)}</Text>
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
