import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnDomainNumber from '@/alldoms/components/DatagridColumns/DatagridColumnDomainNumber';
import DatagridColumnServiceName from '@/alldoms/components/DatagridColumns/DatagridColumnServiceName';
import { DatagridColumnDate } from '@/alldoms/components/DatagridColumns/DatagridColumnDate';
import DatagridColumnActionMenu from '@/alldoms/components/DatagridColumns/DatagridColumnActionMenu';
import DatagridColumnContact from '@/alldoms/components/DatagridColumns/DatagridColumnContact';
import DatagridColumnRenewMode from '@/alldoms/components/DatagridColumns/DatagridColumnRenewMode';

export const useAllDomDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  return useMemo(
    () => [
      {
        id: 'serviceName',
        cell: (props: TServiceDetail) => (
          <DatagridColumnServiceName allDomName={props.allDomProperty.name} />
        ),
        label: t('allDom_table_header_serviceName'),
        isFilterable: true,
      },
      {
        id: 'renewMode',
        cell: (props: TServiceDetail) => (
          <DatagridColumnRenewMode
            renewMode={props.serviceInfo.billing.renew.current.mode}
          />
        ),
        label: t('allDom_table_header_renewMode'),
      },
      {
        id: 'type',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>
            {t(`allDom_table_type_${props.allDomProperty.type}`)}
          </DataGridTextCell>
        ),
        label: t('allDom_table_header_type'),
      },
      {
        id: 'register_domain',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>{props.domainAttached.length}</DataGridTextCell>
        ),
        label: t('allDom_table_header_register_domain'),
      },
      {
        id: 'authorized_domain',
        cell: (props: TServiceDetail) => (
          <DatagridColumnDomainNumber
            allDomProperty={props.allDomProperty.type}
          />
        ),
        label: t('allDom_table_header_authorized_domain'),
      },
      {
        id: 'expiration_date',
        cell: (props: TServiceDetail) => (
          <DatagridColumnDate
            expirationDate={props.serviceInfo.billing.expirationDate}
          />
        ),
        label: t('allDom_table_header_expirationDate'),
      },
      {
        id: 'nicAdmin',
        cell: (props: TServiceDetail) => (
          <DatagridColumnContact contact={props.nicAdmin} />
        ),
        label: t('allDom_table_header_nicAdmin'),
      },
      {
        id: 'nicTech',
        cell: (props: TServiceDetail) => (
          <DatagridColumnContact contact={props.nicTechnical} />
        ),
        label: t('allDom_table_header_nicTech'),
      },
      {
        id: 'nicBilling',
        cell: (props: TServiceDetail) => (
          <DatagridColumnContact contact={props.nicBilling} />
        ),
        label: t('allDom_table_header_nicBilling'),
      },
      {
        id: 'actions',
        cell: (props: TServiceDetail) => (
          <DatagridColumnActionMenu
            serviceId={`${props.serviceInfo.serviceId}`}
            serviceName={props.allDomProperty.name}
            serviceRenewMode={props.serviceInfo.billing.renew.current.mode}
            isServiceNameUrl={true}
          />
        ),
        label: '',
      },
    ],
    [],
  );
};
