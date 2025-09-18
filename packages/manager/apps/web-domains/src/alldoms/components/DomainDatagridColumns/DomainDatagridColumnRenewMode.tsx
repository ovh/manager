import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR, Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';
import { useGetServiceInformation } from '@/alldoms/hooks/data/query';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

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
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

  const { mode } = data.billing.renew.current;
  const { lifecycle } = data.billing;

  let label = t(`allDom_table_status_${mode}`);
  let badgeColor;
  badgeColor =
    mode === ServiceInfoRenewModeEnum.Automatic
      ? BADGE_COLOR.success
      : BADGE_COLOR.warning;

  if (
    (mode === ServiceInfoRenewModeEnum.Automatic || alldomTerminated) &&
    hasTerminateAtExpirationDateAction(lifecycle?.current.pendingActions ?? [])
  ) {
    label = t('allDom_table_status_terminate');
    badgeColor = BADGE_COLOR.critical;
  }

  return <Badge color={badgeColor}>{label}</Badge>;
}
