import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormattedDate from '@/components/table-date';
import { H2, P } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useGetServiceLogs } from '@/hooks/api/logs.api.hooks';
import { useServiceData } from '../layout';
import { Skeleton } from '@/components/ui/skeleton';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';

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
    <ul className="divide-y-4 divide-transparent">
      {randomWidths.map((width, index) => (
        <li key={index}>
          <Skeleton className={`h-4 w-[${width}]`} />
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
  const logsQuery = useGetServiceLogs(projectId, service.engine, service.id, {
    refetchInterval: poll ? 30_000 : false,
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
      <H2 className="mb-2">{t('title')}</H2>
      <P className="mb-2">{t('description')}</P>
      <div className="flex items-center space-x-2 mb-2">
        <Switch
          className="rounded-xl"
          id="poll-logs"
          checked={poll}
          onCheckedChange={(checked: boolean) => setPoll(checked)}
        />
        <Label htmlFor="poll-logs">{t('autoRefreshInputLabel')}</Label>
      </div>
      <ScrollArea className="p-2 h-[500px] bg-[#122844]">
        <ul ref={listLogRef}>
          {logsQuery.isSuccess ? (
            logsQuery.data.map((log, index) => (
              <li
                className="whitespace-pre text-white font-mono text-sm"
                key={index}
              >
                <FormattedDate date={new Date(log.timestamp * 1000)} />
                <span>{log.hostname}</span>
                <span>{log.message}</span>
              </li>
            ))
          ) : (
            <RandomWidthSkeletons itemCount={24} minWidth={9} maxWidth={20} />
          )}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default Logs;
