import { Text } from '@ovhcloud/ods-react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { NameServerTypeEnum } from '@/domain/types/domainResource';

interface DatagridColumnDnsTypeProps {
  readonly type: NameServerTypeEnum;
}

export default function DatagridColumnDnsType({
  type,
}: DatagridColumnDnsTypeProps) {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  return <DataGridTextCell>{capitalizedType}</DataGridTextCell>;
}
