import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  ServiceInfoRenewMode,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';

interface DatagridColumnBadgeProps {
  readonly renewMode: ServiceInfoRenewMode | null;
  readonly allDomResourceState: ServiceInfoUpdateEnum;
}

export default function DatagridColumnRenewMode({
  renewMode,
  allDomResourceState,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');

  if (allDomResourceState === ServiceInfoUpdateEnum.TerminateAtExpirationDate) {
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
        renewMode === ServiceInfoRenewMode.Automatic
          ? ODS_BADGE_COLOR.success
          : ODS_BADGE_COLOR.warning
      }
      data-testid="status"
    />
  );
}
