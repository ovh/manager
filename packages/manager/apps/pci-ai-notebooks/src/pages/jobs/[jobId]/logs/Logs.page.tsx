import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useJobData } from '../Job.context';
import { useGetLogs } from '@/hooks/api/ai/job/logs/useGetLogs.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-notebooks/notebooks/notebook/logs"
    />
  );
}

interface RandomWidthSkeletonsProps {
  itemCount: number;
  minWidth: number;
  maxWidth: number;
}
const RandomWidthSkeletons = ({
  itemCount,
  minWidth,
  maxWidth,
}: RandomWidthSkeletonsProps) => {
  const randomWidths = Array.from(
    { length: itemCount },
    () =>
      `${Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth}rem`,
  );
  return (
    <ul
      className="divide-y-4 divide-transparent"
      data-testid="skeleton-container"
    >
      {randomWidths.map((width, index) => (
        <li key={index}>
          <Skeleton className={'h-4'} style={{ width }} />
        </li>
      ))}
    </ul>
  );
};

const Logs = () => {
  const { projectId, job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/logs');

  const [poll, setPoll] = useState(false);
  const listLogRef = useRef<HTMLUListElement>(null);
  const { isUserActive } = useUserActivityContext();
  const logsQuery = useGetLogs(projectId, job.id, {
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
      <ScrollArea className="p-2 h-[500px] bg-[#122844]">
        {logsQuery.isSuccess ? (
          <ul data-testid="logs-area" ref={listLogRef}>
            {logsQuery.data.logs.map((log, index) => (
              <li
                className="whitespace-pre text-white font-mono text-sm"
                key={index}
              >
                <span className="mr-2">{log.timestamp}</span>
                <span>{log.content}</span>
              </li>
            ))}
          </ul>
        ) : (
          <RandomWidthSkeletons itemCount={24} minWidth={9} maxWidth={20} />
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default Logs;
