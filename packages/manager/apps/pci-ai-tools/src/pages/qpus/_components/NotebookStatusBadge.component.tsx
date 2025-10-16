import { useTranslation } from 'react-i18next';
import { Badge, BadgeProps, badgeVariants } from '@datatr-ux/uxlib';
import ai from '@/types/AI';

const NotebookStatusBadge = ({
  status,
}: {
  status: ai.notebook.NotebookStateEnum;
}) => {
  const { t } = useTranslation('ai-tools/notebooks/status');
  let variant: BadgeProps['variant'];
  switch (status) {
    case 'DELETING':
    case 'RESTARTING':
    case 'STARTING':
    case 'STOPPING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'ERROR':
    case 'STOPPED':
    case 'SYNC_FAILED':
      variant = badgeVariants({ variant: 'destructive' });
      break;
    case 'RUNNING':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'primary' });
      break;
  }
  return <Badge className={variant}>{t(`status-${status}`)}</Badge>;
};

export default NotebookStatusBadge;
