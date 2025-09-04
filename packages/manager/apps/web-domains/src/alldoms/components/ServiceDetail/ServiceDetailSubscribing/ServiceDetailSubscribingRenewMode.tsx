import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LifecycleCapacitiesEnum,
} from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface ServiceDetailSubscribingRenewModeProps {
  readonly renewMode: ServiceInfoRenewModeEnum;
  readonly lifecycleCapacities: LifecycleCapacitiesEnum[];
}

export default function ServiceDetailSubscribingRenewMode({
  renewMode,
  lifecycleCapacities,
}: ServiceDetailSubscribingRenewModeProps) {
  const { t } = useTranslation('allDom');

  return (
    <div className="flex flex-col gap-y-2">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {t('allDom_table_header_renewMode')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {lifecycleCapacities.includes(
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        )
          ? t(`allDom_table_status_terminate`)
          : t(`allDom_status_${renewMode}`)}
      </OdsText>
    </div>
  );
}
