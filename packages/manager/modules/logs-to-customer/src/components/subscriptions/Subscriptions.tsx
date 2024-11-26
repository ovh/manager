import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogsContext } from '../../LogsToCustomer.context';

export default function LogsSubscriptions() {
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  return (
    <div className="flex gap-8 flex-col  p-8">
      <h3>Subscriptions</h3>
      <Link to={'streams'}>data-streams</Link>
      <ul>
        <li>
          CurrentLogKind: <b>{currentLogKind?.displayName}</b>
        </li>
        <li>
          logSubscriptionUrl: <b>{logApiUrls.logSubscription}</b>
        </li>
        <li>
          logApiVersion: <b>{logApiVersion}</b>
        </li>
      </ul>
    </div>
  );
}
