import { Badge, BADGE_COLOR, Icon } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { domainStatusToBadge } from '@/domain/utils/domainStatus';
import { useGetDnssecStatus } from '@/domain/hooks/data/query';
import { DOMAIN_DNSSEC_STATUS } from '@/domain/constants/serviceDetail';

interface DatagridColumnStatusProps {
  readonly serviceName: string;
}

export default function DatagridColumnDnssec({
  serviceName,
}: DatagridColumnStatusProps) {
  const { t } = useTranslation('domain');
  const { dnssecStatus } = useGetDnssecStatus(serviceName);

  if (!dnssecStatus) {
    return (
      <Badge
        color={BADGE_COLOR.neutral}
        data-testid={'status-badge-unavailable'}
      >
        {t('domain_tab_general_information_status_unavailable')}
      </Badge>
    );
  }
  const domainState = domainStatusToBadge(
    DOMAIN_DNSSEC_STATUS,
    dnssecStatus?.status,
  );
  return (
    <>
      {domainState && (
        <Badge
          color={domainState.statusColor}
          data-testid={`status-badge-${dnssecStatus?.status}`}
        >
          {domainState?.icon && <Icon name={domainState.icon} />}
          {t(domainState?.i18nKey)}
        </Badge>
      )}
    </>
  );
}
