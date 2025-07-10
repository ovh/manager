import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TDatagridDnsDetails } from '@/domain/types/domainResource';
import DatagridColumnDnsStatus from '@/domain/components/DatagridColumns/DatagridColumnDnsStatus';
import DatagridColumnDnsType from '@/domain/components/DatagridColumns/DatagridColumnDnsType';

export const useDomainDnsDatagridColumns = () => {
  const { t } = useTranslation('domain');
  const columns = [
    {
      id: 'nameServer',
      cell: (props: TDatagridDnsDetails) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      label: t('domain_dns_table_header_serviceName'),
    },
    {
      id: 'ip',
      cell: (props: TDatagridDnsDetails) => (
        <DataGridTextCell>{props.ip}</DataGridTextCell>
      ),
      label: t('domain_dns_table_header_ip'),
    },
    {
      id: 'status',
      cell: (props: TDatagridDnsDetails) => (
        <DatagridColumnDnsStatus status={props.status} />
      ),
      label: t('domain_dns_table_header_status'),
    },
    {
      id: 'type',
      cell: (props: TDatagridDnsDetails) => (
        <DatagridColumnDnsType type={props.type} />
      ),
      label: t('domain_dns_table_header_type'),
    },
  ];
  return columns;
};
