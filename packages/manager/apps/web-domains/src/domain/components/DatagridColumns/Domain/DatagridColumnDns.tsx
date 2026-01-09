import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TNameServerWithType } from '@/domain/types/domainResource';

interface DatagridColumnDnsProps {
  readonly dns: TNameServerWithType[];
}

export default function DatagridColumnDns({ dns }: DatagridColumnDnsProps) {
  return (
    <DataGridTextCell>
      {dns.map((ns) => ns.nameServer).join('; ')}
    </DataGridTextCell>
  );
}
