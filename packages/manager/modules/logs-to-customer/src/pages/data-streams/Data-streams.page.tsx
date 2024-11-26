import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogsContext } from '../../LogsToCustomer.context';

export default function DataStreams() {
  const { currentLogKind } = useContext(LogsContext);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Link to={'..'}>logs & subscriptions</Link>
      <h3>Data-streams</h3>
      <ul>
        <li>
          CurrentLogKind: <b>{currentLogKind?.displayName}</b>
        </li>
      </ul>
    </div>
  );
}
