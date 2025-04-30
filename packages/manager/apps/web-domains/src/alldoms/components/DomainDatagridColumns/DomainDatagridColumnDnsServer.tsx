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
  if (registrationStatus === DomainRegistrationStateEnum.Unregistered) {
    return '';
  }

  return (
    <DataGridTextCell>
      {nameServers?.map((item) => item).join(', ')}
    </DataGridTextCell>
  );
}
