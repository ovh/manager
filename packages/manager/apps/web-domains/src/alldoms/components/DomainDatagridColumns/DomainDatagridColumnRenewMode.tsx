import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_BADGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ServiceInfoRenewMode,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';
import { useGetServiceInformation } from '@/alldoms/hooks/data/query';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

interface DomainDatagridColumnRenewModeProps {
  readonly alldomTerminated: boolean;
  readonly serviceName: string;
}

export default function DomainDatagridColumnRenewMode({
  alldomTerminated,
  serviceName,
}: DomainDatagridColumnRenewModeProps) {
  const { t } = useTranslation('allDom');
  const { data, isLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.xs} />;
  }

  const { mode } = data.billing.renew.current;
  const { lifecycle } = data.billing;

  let label = t(`allDom_table_status_${mode}`);
  let badgeColor =
    mode === ServiceInfoRenewMode.Automatic
      ? ODS_BADGE_COLOR.success
      : ODS_BADGE_COLOR.warning;

  if (
    (mode === ServiceInfoRenewMode.Automatic || alldomTerminated) &&
    hasTerminateAtExpirationDateAction(lifecycle?.current.pendingActions ?? [])
  ) {
    label = t('allDom_table_status_terminate');
    badgeColor = ODS_BADGE_COLOR.critical;
  }

  return <OdsBadge label={label} color={badgeColor} />;
}
