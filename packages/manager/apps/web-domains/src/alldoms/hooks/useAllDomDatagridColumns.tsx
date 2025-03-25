import {
  DataGridTextCell,
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnBadge from '@/alldoms/components/DatagridColumnBadge/DatagridColumnBadge';
import DatagridColumnDomainNumber from '@/alldoms/components/DatagridColumnBadge/DatagridColumnDomainNumber';
import DatagridColumnServiceName from '@/alldoms/components/DatagridColumnBadge/DatagridColumnServiceName';

export const useAllDomDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  return useMemo(
    () => [
      {
        id: 'serviceName',
        cell: (props: TServiceDetail) => (
          <DatagridColumnServiceName props={props} />
        ),
        label: t('allDom_table_header_serviceName'),
        isFilterable: true,
      },
      {
        id: 'renewMode',
        cell: (props: TServiceDetail) => <DatagridColumnBadge props={props} />,
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
          <DatagridColumnDomainNumber props={props} />
        ),
        label: t('allDom_table_header_authorized_domain'),
      },
      {
        id: 'expiration_date',
        cell: (props: TServiceDetail) => (
          <DataGridTextCell>
            {useFormattedDate({
              dateString: props.serviceInfo.expiration,
              format: DateFormat.compact,
            })}
          </DataGridTextCell>
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
    ],
    [],
  );
};
