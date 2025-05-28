import { useTranslation } from 'react-i18next';
import { Badge, BadgeProps, badgeVariants } from '@datatr-ux/uxlib';
import ai from '@/types/AI';

const JobStatusBadge = ({ status }: { status: ai.job.JobStateEnum }) => {
  const { t } = useTranslation('ai-tools/jobs/status');
  let variant: BadgeProps['variant'];
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
      variant = badgeVariants({ variant: 'destructive' });
      break;
    case 'PENDING':
    case 'RESTARTING':
    case 'RUNNING':
    case 'DONE':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      break;
  }
  return <Badge className={variant}>{t(`status-${status}`)}</Badge>;
};

export default JobStatusBadge;
