import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Label, Switch } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useAppData } from '../App.context';
import Logs from '@/components/logs/Logs.component';
import { useGetLogs } from '@/data/hooks/ai/app/logs/useGetLogs.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-deploy/apps/app/logs"
    />
  );
}

const LogsApps = () => {
  const { projectId, app } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/logs');
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
