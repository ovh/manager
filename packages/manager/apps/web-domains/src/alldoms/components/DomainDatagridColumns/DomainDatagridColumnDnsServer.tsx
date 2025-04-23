import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { TDomainsInfo } from '@/alldoms/types';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnDnsServerProps {
  readonly nameServers?: TDomainsInfo['nameServers'];
  readonly registrationStatus: DomainRegistrationStateEnum;
}

export default function DomainDatagridColumnDnsServer({
  nameServers,
  registrationStatus,
}: DomainDatagridColumnDnsServerProps) {
  if (
    registrationStatus === DomainRegistrationStateEnum.Unregistered ||
    !nameServers.length
  ) {
    return '';
  }

  return (
    <DataGridTextCell>
      <details className="max-w-[300px]">
        <summary>{nameServers?.slice(0, 3).join(', ')}</summary>
        <div className="mt-1">{nameServers?.slice(3).join(', ')}</div>
      </details>
    </DataGridTextCell>
  );
}
