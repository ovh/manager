import { Text } from '@ovhcloud/ods-react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { NameServer } from '@/domain/types/domainResource';

interface DatagridColumnDnsProps {
  readonly dns: NameServer[];
}

export default function DatagridColumnDns({ dns }: DatagridColumnDnsProps) {
  return (
    <DataGridTextCell>
      {dns.map((ns) => ns.nameServer).join('; ')}
    </DataGridTextCell>
  );
}
