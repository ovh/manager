import { Badge, Icon, Skeleton } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetServiceInformation } from '@/domain/hooks/data/query';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { DOMAIN_PENDING_ACTIONS } from '@/domain/constants/serviceDetail';

interface DatagridColumnPendingActionsProps {
  serviceName: string;
}

export default function DatagridColumnPendingActions({
  serviceName,
}: DatagridColumnPendingActionsProps) {
  const { t } = useTranslation('domain');
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return <Skeleton />;
  }

  if (
    !serviceInfo &&
    !serviceInfo?.billing?.lifecycle?.current?.pendingActions
  ) {
    return <></>;
  }

  const domainState = domainStatusToBadge(
    DOMAIN_PENDING_ACTIONS,
    serviceInfo?.billing?.lifecycle?.current?.pendingActions[0] || '',
  );
  return (
    <>
      {serviceInfo && domainState && (
        <Badge
          color={domainState.statusColor}
          data-testid={`status-badge-${serviceInfo?.billing?.lifecycle?.current?.pendingActions[0]}`}
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </Badge>
      )}
    </>
  );
}
