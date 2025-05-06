import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnBadge from '@/alldoms/components/DatagridColumns/DatagridColumnBadge';
import DatagridColumnDomainNumber from '@/alldoms/components/DatagridColumns/DatagridColumnDomainNumber';
import DatagridColumnServiceName from '@/alldoms/components/DatagridColumns/DatagridColumnServiceName';
import { DatagridColumnDate } from '@/alldoms/components/DatagridColumns/DatagridColumnDate';
import DatagridColumnActionMenu from '@/alldoms/components/DatagridColumns/DatagridColumnActionMenu';

export const useAllDomDatagridColumns = (
  openModal: (serviceInfoDetail: TServiceDetail) => void,
) => {
  const { t } = useTranslation('allDom');
  return useMemo(
    () => [
      {
        id: 'serviceName',
        cell: (props: TServiceDetail) => (
          <DatagridColumnServiceName allDomName={props.serviceInfo.domain} />
        ),
        label: t('allDom_table_header_serviceName'),
        isFilterable: true,
      },
      {
        id: 'renewMode',
        cell: (props: TServiceDetail) => (
          <DatagridColumnBadge renewMode={props.serviceInfo.renew.automatic} />
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
          <DatagridColumnDate expirationDate={props.serviceInfo.expiration} />
        ),
        label: t('allDom_table_header_expirationDate'),
      },
      {
        id: 'nicAdmin',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>{props.serviceInfo.contactAdmin}</DataGridTextCell>
        ),
        label: t('allDom_table_header_nicAdmin'),
      },
      {
        id: 'nicTech',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>{props.serviceInfo.contactTech}</DataGridTextCell>
        ),
        label: t('allDom_table_header_nicTech'),
      },
      {
        id: 'nicBilling',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>
            {props.serviceInfo.contactBilling}
          </DataGridTextCell>
        ),
        label: t('allDom_table_header_nicBilling'),
      },
      {
        id: 'actions',
        cell: (props: TServiceDetail) => (
          <DatagridColumnActionMenu
            serviceId={`${props.serviceInfo.serviceId}`}
            serviceInfoDetail={props}
            openModal={openModal}
          />
        ),
        label: '',
      },
    ],
    [],
  );
};
