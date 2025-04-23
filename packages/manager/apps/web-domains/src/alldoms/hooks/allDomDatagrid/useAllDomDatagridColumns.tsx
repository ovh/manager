import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnDomainNumber from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDomainNumber';
import DatagridColumnServiceName from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnServiceName';
import { DatagridColumnDate } from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDate';
import DatagridColumnContact from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnContact';
import DatagridColumnRenewMode from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnRenewMode';
import ServiceActionMenu from '@/alldoms/components/ActionMenu/ServiceActionMenu';
import { ActionEnum } from '@/alldoms/enum/service.enum';

export const useAllDomDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  const columns = [
    {
      id: 'serviceName',
      cell: (props: TServiceDetail) => (
        <DatagridColumnServiceName
          allDomName={props.allDomResource.currentState.name}
        />
      ),
      label: t('allDom_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'renewMode',
      cell: (props: TServiceDetail) => (
        <DatagridColumnRenewMode
          renewMode={props.serviceInfo.billing.renew.current.mode}
          allDomResourceState={props.allDomResourceState}
        />
      ),
      label: t('allDom_table_header_renewMode'),
      enableHiding: true,
    },
    {
      id: 'type',
      cell: (props: TServiceDetail) => (
        <DataGridTextCell>
          {t(`allDom_table_type_${props.allDomResource.currentState.type}`)}
        </DataGridTextCell>
      ),
      label: t('allDom_table_header_type'),
      enableHiding: true,
    },
    {
      id: 'register_domain',
      cell: (props: TServiceDetail) => (
        <DataGridTextCell>
          {props.allDomResource.currentState.domains.length}
        </DataGridTextCell>
      ),
      label: t('allDom_table_header_register_domain'),
      enableHiding: true,
    },
    {
      id: 'authorized_domain',
      cell: (props: TServiceDetail) => (
        <DatagridColumnDomainNumber
          allDomType={props.allDomResource.currentState.type}
        />
      ),
      label: t('allDom_table_header_authorized_domain'),
      enableHiding: true,
    },
    {
      id: 'expiration_date',
      cell: (props: TServiceDetail) => (
        <DatagridColumnDate
          expirationDate={props.serviceInfo.billing.expirationDate}
        />
      ),
      label: t('allDom_domain_table_header_expiration_date'),
      enableHiding: false,
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
      enableHiding: true,
    },
    {
      id: 'nicBilling',
      cell: (props: TServiceDetail) => (
        <DatagridColumnContact contact={props.nicBilling} />
      ),
      label: t('allDom_table_header_nicBilling'),
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (props: TServiceDetail) => (
        <ServiceActionMenu
          serviceId={`${props.serviceInfo.serviceId}`}
          serviceName={props.allDomResource.currentState.name}
          terminateUrl={`terminate/${props.allDomResource.currentState.name}`}
          allDomResourceState={props.allDomResourceState}
          whichAction={ActionEnum.All}
        />
      ),
      label: '',
      enableHiding: false,
    },
  ];
  return columns;
};
