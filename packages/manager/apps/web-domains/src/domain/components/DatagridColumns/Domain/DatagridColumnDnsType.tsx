import { Text } from '@ovhcloud/ods-react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';

interface DatagridColumnDnsTypeProps {
  readonly type: DnsConfigurationTypeEnum;
}

export default function DatagridColumnDnsType({
  type,
}: DatagridColumnDnsTypeProps) {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  return <DataGridTextCell>{capitalizedType}</DataGridTextCell>;
}
