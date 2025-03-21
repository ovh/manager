import { useTranslation } from 'react-i18next';
import { Badge, BadgeProps } from '@datatr-ux/uxlib';
import ai from '@/types/AI';

const AppStatusBadge = ({ status }: { status: ai.app.AppStateEnum }) => {
  const { t } = useTranslation('ai-tools/apps/status');
  let variant: BadgeProps['variant'];
  switch (status) {
    case 'DELETING':
    case 'INITIALIZING':
    case 'SCALING':
    case 'QUEUED':
    case 'STOPPING':
      variant = 'warning';
      break;
    case 'FAILED':
    case 'ERROR':
    case 'DELETED':
    case 'STOPPED':
      variant = 'destructive';
      break;
    case 'RUNNING':
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

export default AppStatusBadge;
