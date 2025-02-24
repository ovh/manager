import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useAppData } from '../App.context';
import { useGetLogs } from '@/hooks/api/ai/app/logs/useGetLogs.hook';
import Logs from '@/components/logs/Logs.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-notebooks/notebooks/notebook/logs"
    />
  );
}

const LogsApps = () => {
  const { projectId, app } = useAppData();
  const { t } = useTranslation('pci-ai-training/apps/app/logs');
  const [poll, setPoll] = useState(false);
  const { isUserActive } = useUserActivityContext();
  const logsQuery = useGetLogs(projectId, app.id, {
    refetchInterval: isUserActive && poll && POLLING.LOGS,
  });

  return (
    <>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <div className="flex items-center space-x-2">
        <Switch
          className="rounded-xl"
          id="poll-logs"
          checked={poll}
          onCheckedChange={(checked: boolean) => setPoll(checked)}
        />
        <Label htmlFor="poll-logs">{t('autoRefreshInputLabel')}</Label>
      </div>
      {logsQuery.isSuccess ? (
        <Logs logs={logsQuery.data} />
      ) : (
        <Logs.Skeleton itemCount={28} maxWidth={20} minWidth={9} />
      )}
    </>
  );
};

export default LogsApps;
