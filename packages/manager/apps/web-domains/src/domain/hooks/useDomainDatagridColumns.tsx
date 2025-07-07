import React from 'react';
import { useTranslation } from 'react-i18next';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/DatagridColumnServiceName';
import { TDomainResource } from '../types/domainResource';

export const useDomainDatagridColumns = () => {
  const { t } = useTranslation('domain');
  const columns = [
    {
      id: 'serviceName',
      cell: (props: TDomainResource) => (
        <DatagridColumnServiceName domainName={props.id} />
      ),
      label: t('domain_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
    },
  ];
  return columns;
};
