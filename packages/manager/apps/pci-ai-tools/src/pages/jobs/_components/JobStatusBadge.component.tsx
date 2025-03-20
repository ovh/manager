import { useTranslation } from 'react-i18next';
import { Badge, BadgeProps } from '@datatr-ux/uxlib';
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
      variant = 'warning';
      break;
    case 'FAILED':
    case 'ERROR':
    case 'TIMEOUT':
    case 'SYNC_FAILED':
      variant = 'destructive';
      break;
    case 'PENDING':
    case 'RESTARTING':
    case 'RUNNING':
    case 'DONE':
      variant = 'success';
      break;
    default:
      break;
  }
  return (
    <Badge
      className="h-6 rounded-md px-2.5 py-0.5 text-sm font-semibold"
      variant={variant}
    >
      {t(`status-${status}`)}
    </Badge>
  );
};

export default JobStatusBadge;
