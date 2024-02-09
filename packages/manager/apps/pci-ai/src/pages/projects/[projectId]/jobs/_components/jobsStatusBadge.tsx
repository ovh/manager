import { Badge, badgeVariants } from '@/components/ui/badge';
import { ai } from '@/models/types';

const JobsStatusBadge = ({ status }: { status: ai.job.Job['status'] }) => {
  let variant = badgeVariants({ variant: 'default' });
  switch (status.state) {
    case 'RESTARTING':
    case 'QUEUED':
    case 'INTERRUPTING':
    case 'PENDING':
    case 'INTERRUPTED':
    case 'INITIALIZING':
    case 'FINALIZING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'ERROR':
    case 'SYNC_FAILED':
    case 'TIMEOUT':
      variant = badgeVariants({ variant: 'error' });
      break;
    case 'RUNNING':
    case 'DONE':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'default' });
      break;
  }
  return <Badge className={variant}>{status.state}</Badge>;
};

export default JobsStatusBadge;
