import React from 'react';
import { Tmessage } from '../../../../data/api/logTailMessages';
import { LogLevel } from './logLevel/LogLevel.component';
import { HighlightSearch } from './highligthSearch/HighlightSearch.component';
import { LogTimestamp } from './logTimestamp/LogTimestamp.component';

export const LogSeparator = () => {
  return <span className="text-slate-500"> | </span>;
};

const LogContent = ({ message }: { message: Tmessage['message'] }) => {
  return (
    <span>
      <HighlightSearch text={message} />
    </span>
  );
};

export const Log = ({ msg }: { msg: Tmessage }) => {
  return (
    <div>
      <LogTimestamp timestamp={msg.timestamp} />
      <LogSeparator />
      <LogLevel level={msg.level} />
      <LogSeparator />
      <LogContent message={msg.message} />
    </div>
  );
};
