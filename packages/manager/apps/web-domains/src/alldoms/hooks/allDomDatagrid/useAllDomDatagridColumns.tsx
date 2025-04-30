import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnDomainNumber from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDomainNumber';
import DatagridColumnServiceName from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnServiceName';
import { DatagridColumnDate } from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDate';
import DatagridColumnActionMenu from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnActionMenu';
import DatagridColumnContact from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnContact';
import {
  DomainRegistrationStateEnum,
  ServiceInfoContactEnum,
} from '@/alldoms/enum/service.enum';
import DatagridColumnRenewMode from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnRenewMode';
import { findContact } from '../../utils/utils';

export const useAllDomDatagridColumns = (
  openModal: (serviceInfoDetail: TServiceDetail) => void,
) => {
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
          <DataGridTextCell>
            {
              props.domainAttached.currentState.domains.filter(
                (domain) =>
                  domain.registrationStatus ===
                  DomainRegistrationStateEnum.Registered,
              ).length
            }
          </DataGridTextCell>
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
        cell: (props: TServiceDetail) => {
          const contact = findContact(
            props,
            ServiceInfoContactEnum.Administrator,
          );
          return <DatagridColumnContact contact={contact} />;
        },
        label: t('allDom_table_header_nicAdmin'),
      },
      {
        id: 'nicTech',
        cell: (props: TServiceDetail) => {
          const contact = findContact(props, ServiceInfoContactEnum.Technical);
          return <DatagridColumnContact contact={contact} />;
        },
        label: t('allDom_table_header_nicTech'),
      },
      {
        id: 'nicBilling',
        cell: (props: TServiceDetail) => {
          const contact = findContact(props, ServiceInfoContactEnum.Billing);
          return <DatagridColumnContact contact={contact} />;
        },
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
