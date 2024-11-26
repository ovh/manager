import React, { useContext } from 'react';
import { LogsContext } from '../../LogsToCustomer.context';

export default function LogsTail() {
  const { currentLogKind, logApiUrls } = useContext(LogsContext);

  return (
    <div className="flex gap-8 flex-col p-8">
      <h3>Live tail</h3>
      <ul>
        <li>
          CurrentLogKind: <b>{currentLogKind?.displayName}</b>
        </li>
        <li>
          logTailUrl: <b>{logApiUrls.logUrl}</b>
        </li>
      </ul>
    </div>
  );
}
