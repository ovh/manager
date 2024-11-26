import React from 'react';
import LogsSubscriptions from '../../components/subscriptions/Subscriptions';
import LogsTail from '../../components/logTail/LogTail';

export default function Logs() {
  return (
    <div className="flex gap-8">
      <LogsTail />
      <LogsSubscriptions />
    </div>
  );
}
