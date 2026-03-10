import { useTranslation } from 'react-i18next';
import { Badge, BadgeProps } from '@datatr-ux/uxlib';
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
      variant = 'warning';
      break;
    case 'FAILED':
    case 'ERROR':
    case 'STOPPED':
    case 'SYNC_FAILED':
      variant = 'destructive';
      break;
    case 'RUNNING':
      variant = 'success';
      break;
    default:
      variant = 'primary';
      break;
  }
  return <Badge variant={variant}>{t(`status-${status}`)}</Badge>;
};

export default NotebookStatusBadge;
