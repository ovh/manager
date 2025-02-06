import { useTranslation } from 'react-i18next';
import { Badge, badgeVariants } from '@/components/ui/badge';
import * as ai from '@/types/cloud/project/ai';

const JobStatusBadge = ({ status }: { status: ai.job.JobStateEnum }) => {
  const { t } = useTranslation('pci-ai-training/jobs/status');
  let variant: string;
  switch (status) {
    case 'FINALIZING':
    case 'INITIALIZING':
    case 'INTERRUPTING':
    case 'QUEUED':
    case 'INTERRUPTED':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'ERROR':
    case 'TIMEOUT':
    case 'SYNC_FAILED':
      variant = badgeVariants({ variant: 'error' });
      break;
    case 'PENDING':
    case 'RESTARTING':
    case 'RUNNING':
    case 'DONE':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'default' });
      break;
  }
  return <Badge className={variant}>{t(`status-${status}`)}</Badge>;
};

export default JobStatusBadge;
