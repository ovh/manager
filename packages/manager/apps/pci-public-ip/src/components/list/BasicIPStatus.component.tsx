import { Badge } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { TBasicIpResourceStatus } from '@/api/data/basic-ip';

type TBadgeColor =
  | 'success'
  | 'warning'
  | 'critical'
  | 'neutral'
  | 'information';

const STATUS_COLORS: Record<TBasicIpResourceStatus, TBadgeColor> = {
  READY: 'success',
  CREATING: 'warning',
  UPDATING: 'warning',
  DELETING: 'warning',
  OUT_OF_SYNC: 'warning',
  SUSPENDED: 'neutral',
  ERROR: 'critical',
  UNKNOWN: 'information',
};

export default function BasicIPStatus({
  status,
}: Readonly<{ status: TBasicIpResourceStatus }>) {
  const { t } = useTranslation('common');

  return (
    <Badge
      className="w-fit whitespace-nowrap"
      size="sm"
      color={STATUS_COLORS[status] ?? 'information'}
      label={t(`pci_additional_ips_basic_ip_status_${status}`)}
    />
  );
}
