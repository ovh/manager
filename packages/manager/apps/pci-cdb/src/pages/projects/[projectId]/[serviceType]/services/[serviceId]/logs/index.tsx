import { useState, useRef, useEffect } from 'react';
import { H2, P } from '@/components/typography';
import { useGetServiceLogs } from '@/hooks/api/logs.api.hooks';
import { useServiceData } from '../serviceData.hook';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FormattedDate from '@/components/table-date';

export const Handle = {
  breadcrumb: () => 'Logs',
};

const LogsPage = () => {
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
      <H2>Logs</H2>
      <P>
        To help you monitor and manage your database service, view the latest
        events (logs) below in almost-real time. Their retention period depends
        on your service solution.
      </P>
      <div className="flex items-center space-x-2 mb-2">
        <Switch
          className="rounded-xl"
          id="poll-logs"
          checked={poll}
          onCheckedChange={(checked: boolean) => setPoll(checked)}
        />
        <Label htmlFor="poll-logs">Auto-refresh</Label>
      </div>
      {logsQuery.isSuccess ? (
        <>
          <ScrollArea className="p-2 h-[500px] bg-[#122844]">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default LogsPage;
