import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import {
  LifecycleActionsEnum,
  ServiceInfoRenewMode,
} from '@/alldoms/enum/service.enum';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

interface ServiceDetailSubscribingRenewModeProps {
  readonly renewMode: ServiceInfoRenewMode;
  readonly lifecyclePendingActions: LifecycleActionsEnum[];
}

export default function ServiceDetailSubscribingRenewMode({
  renewMode,
  lifecyclePendingActions,
}: ServiceDetailSubscribingRenewModeProps) {
  const { t } = useTranslation('allDom');

  return (
    <div className="flex flex-col gap-y-2">
      <Text preset={TEXT_PRESET.heading6}>
        {t('allDom_table_header_renewMode')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph}>
        {hasTerminateAtExpirationDateAction(lifecyclePendingActions)
          ? t(`allDom_table_status_terminate`)
          : t(`allDom_status_${renewMode}`)}
      </Text>
    </div>
  );
}
