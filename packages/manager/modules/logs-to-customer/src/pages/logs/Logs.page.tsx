import React from 'react';

import LogTail from '../../components/logTail/LogTail.component';
import LogsSubscriptions from '../../components/subscriptions/Subscriptions.component';

export default function Logs() {
  return (
    <div className="flex gap-8 flex-col">
      <LogTail />
      <LogsSubscriptions />
    </div>
  );
}
