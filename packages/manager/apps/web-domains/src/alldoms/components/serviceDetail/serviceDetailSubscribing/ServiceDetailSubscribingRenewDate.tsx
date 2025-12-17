import React from 'react';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface ServiceDetailSubscribingRenewProps {
  readonly renewDate: string;
  readonly expirationDate: string;
  readonly renewMode: string;
  readonly pendingActions: LifecycleCapacitiesEnum[];
}

export default function ServiceDetailSubscribingRenewDate({
  renewDate,
  expirationDate,
  renewMode,
  pendingActions,
}: ServiceDetailSubscribingRenewProps) {
  const { t } = useTranslation('allDom');
  const formatDate = useFormatDate();
  const isAutomatic = renewMode === ServiceInfoRenewModeEnum.Automatic;
  const isTerminated = pendingActions.includes(
    LifecycleCapacitiesEnum.TerminateAtExpirationDate,
  );
  let date = renewDate;

  if (!isAutomatic || isTerminated) {
    date = expirationDate;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Text preset={TEXT_PRESET.heading6}>
        {isTerminated
          ? t(`allDom_manual_renew`)
          : t(`allDom_${renewMode}_renew`)}
      </Text>
      <Text>
        {formatDate({
          date,
          format: 'PP',
        })}
      </Text>
    </div>
  );
}
