import { Badge, BadgeVariant } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';

const UserStatusBadge = ({ status }: { status: database.StatusEnum }) => {
  let variant: BadgeVariant;
  switch (status) {
    case 'CREATING':
    case 'DELETING':
    case 'LOCKED':
    case 'LOCKED_PENDING':
    case 'LOCKED_UPDATING':
    case 'PENDING':
    case 'UPDATING':
      variant = 'warning';
      break;
    case 'ERROR':
    case 'ERROR_INCONSISTENT_SPEC':
      variant = 'critical';
      break;
    case 'READY':
      variant = 'success';
      break;
    default:
      variant = 'neutral';
      break;
  }
  return <Badge variant={variant}>{status}</Badge>;
};

export default UserStatusBadge;
