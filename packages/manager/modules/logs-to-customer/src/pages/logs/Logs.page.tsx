import React from 'react';
import LogsSubscriptions from '../../components/subscriptions/Subscriptions';
import LogTail from '../../components/logTail/LogTail.component';

export default function Logs() {
  return (
    <div className="flex gap-8 flex-col">
      <LogTail />
      <LogsSubscriptions />
    </div>
  );
}
