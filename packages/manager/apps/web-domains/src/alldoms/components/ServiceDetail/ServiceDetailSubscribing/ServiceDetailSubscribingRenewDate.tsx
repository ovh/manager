import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface ServiceDetailSubscribingRenewProps {
  readonly renewDate: string;
  readonly expirationDate: string;
  readonly renewMode: string;
  readonly lifecycleCapacities: LifecycleCapacitiesEnum[];
}

export default function ServiceDetailSubscribingRenewDate({
  renewDate,
  expirationDate,
  renewMode,
  lifecycleCapacities,
}: ServiceDetailSubscribingRenewProps) {
  const { t } = useTranslation('allDom');
  const formatDate = useFormatDate();
  const isAutomatic = renewMode === ServiceInfoRenewModeEnum.Automatic;
  const isTerminated = lifecycleCapacities.includes(
    LifecycleCapacitiesEnum.TerminateAtExpirationDate,
  );
  let date = renewDate;

  if (!isAutomatic || isTerminated) {
    date = expirationDate;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {isTerminated
          ? t(`allDom_manual_renew`)
          : t(`allDom_${renewMode}_renew`)}
      </OdsText>
      <OdsText>
        {formatDate({
          date,
          format: 'PP',
        })}
      </OdsText>
    </div>
  );
}
