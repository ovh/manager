import React, { useState } from 'react';
import clsx from 'clsx';
import { TailLogs, LogTiles } from '.';

export interface LogsViewProps {
  onGotoStreams: () => void;
}

export function LogsView({ onGotoStreams }: Readonly<LogsViewProps>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <div
      className={clsx(
        'flex mt-4 md:h-[600px]',
        isFullscreen ? 'flex-col' : 'flex-col md:flex-row',
      )}
    >
      <div className={clsx(isFullscreen || 'w-full md:w-[68%] h-full')}>
        <TailLogs
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((full) => !full)}
        />
      </div>

      <div
        className={clsx(
          isFullscreen ||
            'w-full md:w-[32%] h-full overflow-y-auto mt-4 md:mt-0 ml-0 md:ml-4',
          'min-h-0',
        )}
      >
        <LogTiles onGotoStreams={onGotoStreams} />
      </div>
    </div>
  );
}
