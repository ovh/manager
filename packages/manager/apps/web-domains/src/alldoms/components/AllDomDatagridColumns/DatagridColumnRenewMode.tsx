import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  LifecycleCapacitiesEnum,
} from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface DatagridColumnBadgeProps {
  readonly renewMode: ServiceInfoRenewModeEnum | null;
  readonly lifecycleCapacities: LifecycleCapacitiesEnum[];
}

export default function DatagridColumnRenewMode({
  renewMode,
  lifecycleCapacities,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');

  if (!renewMode) {
    return '';
  }

  if (
    lifecycleCapacities.includes(
      LifecycleCapacitiesEnum.TerminateAtExpirationDate,
    )
  ) {
    return (
      <OdsBadge
        label={t('allDom_table_status_terminate')}
        color={ODS_BADGE_COLOR.critical}
      />
    );
  }

  return (
    <OdsBadge
      label={t(`allDom_table_status_${renewMode}`)}
      color={
        renewMode === ServiceInfoRenewModeEnum.Automatic
          ? ODS_BADGE_COLOR.success
          : ODS_BADGE_COLOR.warning
      }
      data-testid="status"
    />
  );
}
