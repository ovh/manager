import { useState, useRef, useEffect } from 'react';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import { H3 } from '@/components/typography';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { useGetJobLogs } from '@/hooks/api/jobs/useGetJobLogs';
import { ai } from '@/models/types';

export const Handle = {
  breadcrumb: () => 'Logs',
};

export default function LogsJobPage() {
  const { projectId, jobId } = useRequiredParams<{
    projectId: string;
    jobId: string;
  }>();
  const [poll, setPoll] = useState(false);
  const listLogRef = useRef<HTMLUListElement>(null);
  const logsQuery = useGetJobLogs(projectId, jobId, {
    refetchInterval: poll ? 30_000 : false,
  });
  // scroll to the bottom on data update
  useEffect(() => {
    if (
      logsQuery.isSuccess &&
      logsQuery.data.logs.length > 0 &&
      listLogRef.current
    ) {
      listLogRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [logsQuery.isSuccess, logsQuery.data]);
  //console.log(logsQuery.data?.logs);
  var limitedLogs : ai.LogLine[];
  if (logsQuery.data?.logs.length && logsQuery.data?.logs.length > 500) {
    console.log(logsQuery.data.logs);
    limitedLogs = logsQuery.data?.logs.slice(-500);
    console.log(limitedLogs);
  } else {
    limitedLogs = logsQuery.data?.logs || [];
    console.log(limitedLogs);
  }
  
  
  return (
    <>
      <H3>Logs</H3>
      <div className="flex items-center space-x-2 mb-2">
        <Switch
          disabled={limitedLogs?.length === 0}
          className="rounded-xl"
          id="poll-logs"
          checked={poll}
          onCheckedChange={(checked: boolean) => setPoll(checked)}
        />
        <Label htmlFor="poll-logs">Auto-refresh</Label>
      </div>
      {logsQuery.isSuccess && limitedLogs && limitedLogs?.length > 0 ? (
        <>
          <ScrollArea className="p-2 h-[500px] bg-[#122844]">
            <ul ref={listLogRef}>
              {limitedLogs.map((log, index) => (
                <li
                  className="whitespace-pre text-white font-mono text-sm"
                  key={index}
                >
                  <span>{log.content}</span>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </>
      ) : logsQuery.isSuccess && limitedLogs && limitedLogs?.length === 0 ? (
        <p>No logs to display</p>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}
