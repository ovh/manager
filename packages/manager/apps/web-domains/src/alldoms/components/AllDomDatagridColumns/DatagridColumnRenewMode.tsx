import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import {
  ServiceInfoRenewMode,
  LifecycleActionsEnum,
} from '@/alldoms/enum/service.enum';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

interface DatagridColumnBadgeProps {
  readonly renewMode: ServiceInfoRenewMode | null;
  readonly lifecyclePendingActions: LifecycleActionsEnum[];
}

export default function DatagridColumnRenewMode({
  renewMode,
  lifecyclePendingActions,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');

  if (!renewMode) {
    return '';
  }

  if (hasTerminateAtExpirationDateAction(lifecyclePendingActions)) {
    return (
      <Badge color={BADGE_COLOR.critical}>
        {t('allDom_table_status_terminate')}
      </Badge>
    );
  }

  return (
    <Badge
      color={
        renewMode === ServiceInfoRenewMode.Automatic
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
