import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface ServiceDetailSubscribingRenewModeProps {
  readonly renewMode: ServiceInfoRenewModeEnum;
  readonly pendingActions: LifecycleCapacitiesEnum[];
}

export default function ServiceDetailSubscribingRenewMode({
  renewMode,
  pendingActions,
}: ServiceDetailSubscribingRenewModeProps) {
  const { t } = useTranslation('allDom');

  return (
    <div className="flex flex-col gap-y-2">
      <Text preset={TEXT_PRESET.heading6}>
        {t('allDom_table_header_renewMode')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph}>
        {pendingActions.includes(
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        )
          ? t(`allDom_table_status_terminate`)
          : t(`allDom_status_${renewMode}`)}
      </Text>
    </div>
  );
}
