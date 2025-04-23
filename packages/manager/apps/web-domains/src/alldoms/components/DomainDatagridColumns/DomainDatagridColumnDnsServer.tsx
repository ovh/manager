import React from 'react';
import { TDomainsInfo } from '@/alldoms/types';

interface DomainDatagridColumnDnsServerProps {
  readonly nameServers?: TDomainsInfo['nameServers'];
}

export default function DomainDatagridColumnDnsServer({
  nameServers,
}: DomainDatagridColumnDnsServerProps) {
  return (
    <div>
      {nameServers?.length > 2 ? (
        <details className="max-w-[300px]">
          <summary>
            {nameServers
              .slice(0, 3)
              .map((item) => item.nameServer)
              .join(', ')}
          </summary>
          <div className="mt-1">
            {nameServers
              .slice(3)
              .map((item) => item.nameServer)
              .join(', ')}
          </div>
        </details>
      ) : (
        <div>{nameServers?.map((item) => item.nameServer).join(', ')}</div>
      )}
    </div>
  );
}
