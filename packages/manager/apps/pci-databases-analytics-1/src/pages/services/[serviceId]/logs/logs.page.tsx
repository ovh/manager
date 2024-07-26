import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useServiceData } from '../Service.context';
import { Skeleton } from '@/components/ui/skeleton';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { GuideSections } from '@/types/guide';
import Guides from '@/components/guides/Guides.component';
import { useGetServiceLogs } from '@/hooks/api/database/logs/useGetServiceLogs.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/logs"
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
  const { t } = useTranslation('pci-databases-analytics/services/service/logs');
  const [poll, setPoll] = useState(false);
  const listLogRef = useRef<HTMLUListElement>(null);
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const logsQuery = useGetServiceLogs(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && poll && POLLING.LOGS,
  });
  // scroll to the bottom on data update
  useEffect(() => {
    if (
      logsQuery.isSuccess &&
      logsQuery.data.length > 0 &&
      listLogRef.current
    ) {
      listLogRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [logsQuery.isSuccess, logsQuery.data]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.logs} engine={service.engine} />
      </div>
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
          <ul ref={listLogRef}>
            {logsQuery.data.map((log, index) => (
              <li
                className="whitespace-pre text-white font-mono text-sm"
                key={index}
              >
                <FormattedDate date={new Date(log.timestamp * 1000)} />
                <span>{log.hostname}</span>
                <span>{log.message}</span>
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
