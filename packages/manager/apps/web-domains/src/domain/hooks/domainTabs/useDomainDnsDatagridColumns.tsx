import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/DatagridColumnServiceName';
import { TNameServerWithType } from '@/domain/types/domainResource';
import DatagridColumnDnsIP from '@/domain/components/DatagridColumnsDns/DatagridColumnDnsIp';

export const useDomainDnsDatagridColumns = () => {
  const { t } = useTranslation('domain');
  const columns = [
    {
      id: 'serviceName',
      cell: (props: TNameServerWithType) => (
        <DataGridTextCell>{props.nameServer}</DataGridTextCell>
      ),
      label: t('domain_dns_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'ip',
      cell: (props: TNameServerWithType) => (
        <DatagridColumnDnsIP dnsResource={props} />
      ),
      label: t('domain_dns_table_header_ip'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'status',
      cell: (props: TNameServerWithType) => (
        <DatagridColumnServiceName domainName={props.nameServer} />
      ),
      label: t('domain_dns_table_header_status'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'type',
      cell: (props: TNameServerWithType) => (
        <DatagridColumnServiceName domainName={props.nameServer} />
      ),
      label: t('domain_dns_table_header_type'),
      isFilterable: true,
      enableHiding: false,
    },
  ];
  return columns;
};
