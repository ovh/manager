import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ServiceInfoRenewMode } from '@/alldoms/enum/service.enum';

interface DatagridColumnBadgeProps {
  readonly renewMode: ServiceInfoRenewMode | null;
}

export default function DatagridColumnRenewMode({
  renewMode,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');

  if (!renewMode) {
    return '-';
  }

  return (
    <OdsBadge
      label={t(`allDom_table_status_${renewMode}`)}
      color={
        renewMode === ServiceInfoRenewMode.Automatic
          ? ODS_BADGE_COLOR.success
          : ODS_BADGE_COLOR.warning
      }
      data-testid="status"
    />
  );
}
