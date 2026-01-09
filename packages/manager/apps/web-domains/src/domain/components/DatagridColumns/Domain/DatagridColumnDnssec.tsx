import { Badge, Icon, Skeleton } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { useGetDnssecStatus } from '@/domain/hooks/data/query';
import { DOMAIN_DNSSEC_STATUS } from '@/domain/constants/serviceDetail';
import { TCurrentState, TTargetSpec } from '@/domain/types/domainResource';

interface DatagridColumnStatusProps {
  readonly resourceCurrentState: TCurrentState;
  readonly resourceTargetSpec: TTargetSpec;
}

export default function DatagridColumnDnssec({
  resourceCurrentState,
  resourceTargetSpec,
}: DatagridColumnStatusProps) {
  const { t } = useTranslation('domain');
  const { dnssecStatus, isDnssecStatusLoading } = useGetDnssecStatus(
    resourceCurrentState,
    resourceTargetSpec,
  );

  if (isDnssecStatusLoading) {
    return <Skeleton />;
  }

  const domainState = domainStatusToBadge(DOMAIN_DNSSEC_STATUS, dnssecStatus);
  return (
    <>
      {domainState && (
        <Badge
          color={domainState.statusColor}
          data-testid={`status-badge-${dnssecStatus}`}
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </Badge>
      )}
    </>
  );
}
