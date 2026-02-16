import React from 'react';

import { HighlightSearch } from '@/components/log-tail/log-messages/log/highlight-search/HighlightSearch.component';
import { LogLevel } from '@/components/log-tail/log-messages/log/log-level/LogLevel.component';
import { LogTimestamp } from '@/components/log-tail/log-messages/log/log-timestamp/LogTimestamp.component';
import { Tmessage } from '@/data/api/logTailMessages';

const LOG_SEPARATOR = <span className="text-slate-500"> | </span>;

export const Log = ({ msg }: { msg?: Tmessage }) => {
  if (!msg) {
    return null;
  }

  return (
    <div>
      <LogTimestamp timestamp={msg.timestamp} />
      {LOG_SEPARATOR}
      <LogLevel level={msg.level} />
      {LOG_SEPARATOR}
      <span>
        <HighlightSearch text={msg.message} />
      </span>
    </div>
  );
};
