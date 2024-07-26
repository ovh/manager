import { Badge, badgeVariants } from '@/components/ui/badge';
import * as database from '@/types/cloud/project/database';

const UserStatusBadge = ({ status }: { status: database.StatusEnum }) => {
  let variant;
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
  return <Badge className={variant}>{status}</Badge>;
};

export default UserStatusBadge;
