import { useTranslation } from 'react-i18next';
import { Badge, badgeVariants } from '@/components/ui/badge';
import * as ai from '@/types/cloud/project/ai';

const AppStatusBadge = ({ status }: { status: ai.app.AppStateEnum }) => {
  const { t } = useTranslation('pci-ai-deploy/apps/status');
  let variant: string;
  switch (status) {
    case 'DELETING':
    case 'INITIALIZING':
    case 'SCALING':
    case 'QUEUED':
    case 'STOPPING':
      variant = badgeVariants({ variant: 'warning' });
      break;
    case 'FAILED':
    case 'ERROR':
    case 'DELETED':
    case 'STOPPED':
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

export default AppStatusBadge;
