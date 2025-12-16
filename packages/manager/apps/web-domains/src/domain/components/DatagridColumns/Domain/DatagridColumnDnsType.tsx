import { DataGridTextCell } from '@ovh-ux/manager-react-components';

interface DatagridColumnDnsTypeProps {
  readonly type: string;
}

export default function DatagridColumnDnsType({
  type,
}: DatagridColumnDnsTypeProps) {
  return <DataGridTextCell>{type}</DataGridTextCell>;
}
