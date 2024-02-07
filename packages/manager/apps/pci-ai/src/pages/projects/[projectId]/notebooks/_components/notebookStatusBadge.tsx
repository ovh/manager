import { Badge, badgeVariants } from '@/components/ui/badge';
import { ai } from '@/models/types';

const NotebookStatusBadge = ({
  status,
}: {
  status: ai.notebook.Notebook['status'];
}) => {
  let variant = badgeVariants({ variant: 'default' });
  switch (status.state) {
    case 'DELETING':
    case 'STOPPING':
    case 'RESTARTING':
    case 'STARTING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'STOPPED':
    case 'SYNC_FAILED':
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

export default NotebookStatusBadge;
