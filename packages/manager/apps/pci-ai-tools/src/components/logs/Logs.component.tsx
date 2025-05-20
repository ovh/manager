import { ScrollArea, ScrollBar, Skeleton } from '@datatr-ux/uxlib';
import { useEffect, useRef } from 'react';
import ai from '@/types/AI';

interface LogsProps {
  logs: ai.Logs;
}

export default function Logs({ logs }: LogsProps) {
  const listLogRef = useRef<HTMLUListElement>(null);

  // scroll to the bottom on data update
  useEffect(() => {
    if (logs.logs.length > 0 && listLogRef.current) {
      listLogRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [logs]);

  return (
    <>
      <ScrollArea className="p-2 h-[500px] bg-[#122844]">
        <ul data-testid="logs-area" ref={listLogRef}>
          {logs.logs.map((log, index) => (
            <li
              className="whitespace-pre text-white font-mono text-sm"
              key={index}
            >
              <span className="mr-2">{log.timestamp}</span>
              <span>{log.content}</span>
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

interface RandomWidthSkeletonsProps {
  itemCount: number;
  minWidth: number;
  maxWidth: number;
}

Logs.Skeleton = function logsSkeleton({
  itemCount,
  minWidth,
  maxWidth,
}: RandomWidthSkeletonsProps) {
  const randomWidths = Array.from(
    { length: itemCount },
    () =>
      `${Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth}rem`,
  );
  return (
    <ScrollArea
      data-testid="skeleton-container"
      className="p-2 h-[500px] bg-[#122844]"
    >
      <ul>
        {randomWidths.map((width, index) => (
          <li className="mt-1" key={index}>
            <div className="flex flex-row">
              <Skeleton className={'h-4'} style={{ width }} />
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};
