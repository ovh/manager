import React from 'react';
import { Outlet } from 'react-router-dom';
import LogTail from '../../components/logTail/LogTail.component';
import LogsSubscriptions from '../../components/subscriptions/Subscriptions.component';
import { useZoomedInOut } from '../../hooks/useZoomedInOut';

export default function Logs() {
  const { isZoomedIn } = useZoomedInOut();
  const logTailClasses = isZoomedIn ? 'w-full' : 'w-2/3';
  const subscriptionsListClasses = isZoomedIn ? 'w-full' : 'w-1/2';
  const containerClasses = isZoomedIn ? 'flex-col' : '';

  return (
    <div className={`flex gap-4 ${containerClasses}`}>
      <div className={`${logTailClasses} overflow-y-auto`}>
        <LogTail />
      </div>
      <div className={`${subscriptionsListClasses}`}>
        <LogsSubscriptions />
      </div>
      <Outlet />
    </div>
  );
}
