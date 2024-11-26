import { useTranslation } from 'react-i18next';
import { Badge, badgeVariants } from '@/components/ui/badge';
import * as ai from '@/types/cloud/project/ai';

const NotebookStatusBadge = ({
  status,
}: {
  status: ai.notebook.NotebookStateEnum;
}) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/status');
  let variant: string;
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
      variant = badgeVariants({ variant: 'error' });
      break;
    case 'RUNNING':
      variant = badgeVariants({ variant: 'success' });
      break;
    default:
      variant = badgeVariants({ variant: 'default' });
      break;
  }
  return <Badge className={variant}>{t(`status-${status}`)}</Badge>;
};

export default NotebookStatusBadge;
