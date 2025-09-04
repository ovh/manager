import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_BADGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  LifecycleCapacitiesEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';
import { useGetServiceInformation } from '@/alldoms/hooks/data/query';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

interface DomainDatagridColumnRenewModeProps {
  readonly serviceName: string;
}

export default function DomainDatagridColumnRenewMode({
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
    mode === ServiceInfoRenewModeEnum.Automatic
      ? ODS_BADGE_COLOR.success
      : ODS_BADGE_COLOR.warning;

  if (
    lifecycle?.capacities.actions.includes(
      LifecycleCapacitiesEnum.TerminateAtExpirationDate,
    )
  ) {
    label = t('allDom_table_status_terminate');
    badgeColor = ODS_BADGE_COLOR.critical;
  }

  return <OdsBadge label={label} color={badgeColor} />;
}
