import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Label, Switch } from '@datatr-ux/uxlib';
import { useNotebookData } from '../Notebook.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetLogs } from '@/data/hooks/ai/notebook/logs/useGetLogs.hook';
import Logs from '@/components/logs/Logs.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/notebooks/notebook/logs"
    />
  );
}

const LogsNotebook = () => {
  const { projectId, notebook } = useNotebookData();
  const { t } = useTranslation('ai-tools/notebooks/notebook/logs');

  const [poll, setPoll] = useState(false);
  const listLogRef = useRef<HTMLUListElement>(null);
  const { isUserActive } = useUserActivityContext();
  const logsQuery = useGetLogs(projectId, notebook.id, {
    refetchInterval: isUserActive && poll && POLLING.LOGS,
  });
  // scroll to the bottom on data update
  useEffect(() => {
    if (
      logsQuery.isSuccess &&
      logsQuery.data?.logs.length > 0 &&
      listLogRef.current
    ) {
      listLogRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [logsQuery.isSuccess, logsQuery.data]);

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

export default LogsNotebook;
