import { useTranslation } from 'react-i18next';
import { Badge, BADGE_COLOR, Spinner, SPINNER_SIZE } from '@ovhcloud/ods-react';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  ServiceRoutes,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';

interface DomainDatagridColumnRenewModeProps {
  readonly alldomTerminated: boolean;

  readonly serviceName: string;
}

export default function DomainDatagridColumnRenewMode({
  alldomTerminated,
  serviceName,
}: DomainDatagridColumnRenewModeProps) {
  const { t } = useTranslation('allDom');
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'allDom',
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

  const mode = serviceInfo?.billing.renew?.current.mode;

  let label = t(`allDom_table_status_${mode}`);
  let badgeColor;
  badgeColor =
    mode === ServiceInfoRenewModeEnum.Automatic
      ? BADGE_COLOR.success
      : BADGE_COLOR.warning;

  if (
    hasTerminateAtExpirationDateAction(serviceInfo?.billing?.lifecycle?.current.pendingActions ?? [])
  ) {
    label = t('allDom_table_status_terminate');
    badgeColor = BADGE_COLOR.critical;
  }

  return <Badge color={badgeColor}>{label}</Badge>;
}
