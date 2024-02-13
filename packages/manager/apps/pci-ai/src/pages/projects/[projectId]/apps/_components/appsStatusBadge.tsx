import { Badge, badgeVariants } from '@/components/ui/badge';
import { ai } from '@/models/types';

const AppsStatusBadge = ({ status }: { status: ai.app.App['status'] }) => {
  let variant = badgeVariants({ variant: 'default' });
  switch (status.state) {
    case 'DELETING':
    case 'QUEUED':
    case 'INITIALIZING':
    case 'SCALING':
    case 'STOPPING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'ERROR':
    case 'STOPPED':
    case 'DELETED':
      variant = badgeVariants({ variant: 'error' });
      break;
    case 'RUNNING':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'default' });
      break;
  }
  return <Badge className={variant}>{status.state}</Badge>;
};

export default AppsStatusBadge;
