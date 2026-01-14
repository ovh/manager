import { Badge, Icon, Skeleton } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DOMAIN_PENDING_ACTIONS } from '@/domain/constants/serviceDetail';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';

interface DatagridColumnPendingActionsProps {
  readonly serviceName: string;
  readonly isProcedure: boolean;
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
    return;
  }

  const domainStatusToBadges = serviceInfo?.billing?.lifecycle?.current?.pendingActions.map(
    (action: LifecycleCapacitiesEnum) => {
      const status = DOMAIN_PENDING_ACTIONS[action];
      if (!status) {
        return null;
      }

      return (
        <Badge
          color={status.statusColor}
          data-testid={`status-badge-${action}`}
          key={`status-badge-${action}`}
          className="w-max"
        >
          {status?.icon && <Icon name={status.icon} />}
          {t(status?.i18nKey)}
        </Badge>
      );
    },
  );

  return (
    <div className="flex flex-col">
      {serviceInfo && domainStatusToBadges}
      {isProcedure && (
        <Badge color="warning" className="w-max mt-2">
          {t('domain_status_ongoing_proceedings')}
        </Badge>
      )}
    </div>
  );
}
