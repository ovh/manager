import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { getRenewMode } from '@/alldoms/utils/renewMode.utils';

interface DatagridColumnBadgeProps {
  readonly renewMode: boolean;
}

export default function DatagridColumnBadge({
  renewMode,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');
  const { renewLabel, renewBadge } = getRenewMode(renewMode);

  return (
    <OdsBadge
      label={t(`allDom_table_status_${renewLabel}`)}
      color={renewBadge}
      data-testid="status"
    />
  );
}
