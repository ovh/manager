import { useTranslation } from 'react-i18next';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { database } from '@/models/database';

const ServiceStatusBadge = ({
  status,
}: {
  status: database.Service['status'];
}) => {
  const { t } = useTranslation('pci-databases-analytics/services/status');
  let variant = badgeVariants({ variant: 'default' });
  switch (status) {
    case 'CREATING':
    case 'DELETING':
    case 'LOCKED':
    case 'LOCKED_PENDING':
    case 'LOCKED_UPDATING':
    case 'PENDING':
    case 'UPDATING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'ERROR':
    case 'ERROR_INCONSISTENT_SPEC':
      variant = badgeVariants({ variant: 'error' });
      break;
    case 'READY':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'default' });
      break;
  }
  return <Badge className={variant}>{t(`status-${status}`)}</Badge>;
};

export default ServiceStatusBadge;
