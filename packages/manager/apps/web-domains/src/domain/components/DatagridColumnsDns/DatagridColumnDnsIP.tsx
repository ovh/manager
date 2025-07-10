import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { TNameServerWithType } from '@/domain/types/domainResource';

interface DatagridColumnDnsIpProps {
  readonly dnsResource: TNameServerWithType;
}

export default function DatagridColumnDnsIP({
  dnsResource,
}: DatagridColumnDnsIpProps) {
  let ipToDisplay = '-';

  if (dnsResource.ipv4) {
    ipToDisplay = dnsResource.ipv4;
  } else if (dnsResource.ipv6) {
    ipToDisplay = dnsResource.ipv6;
  }

  return <DataGridTextCell>{ipToDisplay}</DataGridTextCell>;
}
