import { Badge, Icon, Skeleton } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { DOMAIN_PENDING_ACTIONS } from '@/domain/constants/serviceDetail';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface DatagridColumnPendingActionsProps {
  serviceName: string;
  isProcedure: boolean;
}

export default function DatagridColumnPendingActions({
  serviceName,
  isProcedure,
}: DatagridColumnPendingActionsProps) {
  const { t } = useTranslation('domain');
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return (
      <div className="w-full">
        <Skeleton />
      </div>
    );
  }

  if (!serviceInfo?.billing?.lifecycle?.current?.pendingActions) {
    return <span>-</span>;
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
          className="w-max"
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </Badge>
      )}
      {isProcedure && (
        <Badge color="warning" className="w-max mt-2">
          {t('domain_status_ongoing_proceedings')}
        </Badge>
      )}
    </>
  );
}
