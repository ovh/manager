import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface DatagridColumnBadgeProps {
  readonly renewMode: ServiceInfoRenewModeEnum | null;
  readonly pendingActions: LifecycleCapacitiesEnum[];
}

export default function DatagridColumnRenewMode({
  renewMode,
  pendingActions,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');

  if (!renewMode) {
    return '';
  }

  if (hasTerminateAtExpirationDateAction(pendingActions)) {
    return (
      <Badge color={BADGE_COLOR.critical}>
        {t('allDom_table_status_terminate')}
      </Badge>
    );
  }

  return (
    <Badge
      color={
        renewMode === ServiceInfoRenewModeEnum.Automatic
          ? BADGE_COLOR.success
          : BADGE_COLOR.warning
      }
      data-testid="status"
      className="text-nowrap"
    >
      {t(`allDom_table_status_${renewMode}`)}
    </Badge>
  );
}
