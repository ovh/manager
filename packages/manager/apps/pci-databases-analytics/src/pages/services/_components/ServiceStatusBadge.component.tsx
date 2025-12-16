import { useTranslation } from 'react-i18next';
import { Badge, BadgeVariant } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';

const ServiceStatusBadge = ({
  status,
}: {
  status: database.Service['status'];
}) => {
  const { t } = useTranslation('pci-databases-analytics/services/status');
  let variantProp: BadgeVariant = 'primary';
  switch (status) {
    case 'CREATING':
    case 'DELETING':
    case 'LOCKED':
    case 'LOCKED_PENDING':
    case 'LOCKED_UPDATING':
    case 'PENDING':
    case 'UPDATING':
      variantProp = 'warning';
      break;
    case 'ERROR':
    case 'ERROR_INCONSISTENT_SPEC':
      variantProp = 'critical';
      break;
    case 'READY':
      variantProp = 'success';
      break;
    default:
      variantProp = 'primary';
      break;
  }
  return (
    <Badge className="whitespace-nowrap" variant={variantProp}>
      {t(`status-${status}`)}
    </Badge>
  );
};

export default ServiceStatusBadge;
