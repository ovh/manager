import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { AlldomService } from '@/alldoms/types';
import DatagridColumnDomainRegisteredAuthorized from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDomainRegisteredAuthorized';
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
      id: 'id',
      cell: (props: AlldomService) => (
        <DatagridColumnServiceName allDomName={props.currentState.name} />
      ),
      label: t('allDom_table_header_serviceName'),
      enableHiding: false,
      isFilterable: true,
      isSearchable: true,
      type: FilterTypeCategories.String,
    },
    {
      id: 'renewMode',
      cell: (props: AlldomService) => (
        <DatagridColumnRenewMode
          renewMode={props.renewMode}
          allDomResourceState={props.allDomResourceState}
        />
      ),
      label: t('allDom_table_header_renewMode'),
      enableHiding: true,
    },
    {
      id: 'ovh:type',
      cell: (props: AlldomService) => (
        <DataGridTextCell>
          {t(`allDom_table_type_${props.currentState.type}`)}
        </DataGridTextCell>
      ),
      label: t('allDom_table_header_type'),
      enableHiding: true,
      isFilterable: true,
      type: FilterTypeCategories.Tags,
      filterOptions: ['french', 'international'].map((op) => ({
        label: op,
        value: op,
      })),
    },
    {
      id: 'authorized_domain',
      cell: (props: AlldomService) => (
        <DatagridColumnDomainRegisteredAuthorized
          allDomType={props.currentState.type}
          registeredDomainCount={props.currentState.domains.length}
        />
      ),
      label: t('allDom_table_header_registered_authorized_domain'),
      enableHiding: true,
    },
    {
      id: 'expiration_date',
      cell: (props: AlldomService) => (
        <DatagridColumnDate expirationDate={props.expirationDate} />
      ),
      label: t('allDom_domain_table_header_expiration_date'),
      enableHiding: false,
    },
    {
      id: 'nicAdmin',
      cell: (props: AlldomService) => (
        <DatagridColumnContact contact={props.nicAdmin} />
      ),
      label: t('allDom_table_header_nicAdmin'),
    },
    {
      id: 'nicTech',
      cell: (props: AlldomService) => (
        <DatagridColumnContact contact={props.nicTechnical} />
      ),
      label: t('allDom_table_header_nicTech'),
      enableHiding: true,
    },
    {
      id: 'nicBilling',
      cell: (props: AlldomService) => (
        <DatagridColumnContact contact={props.nicBilling} />
      ),
      label: t('allDom_table_header_nicBilling'),
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (props: AlldomService) => (
        <ServiceActionMenu
          serviceName={props.currentState.name}
          terminateUrl={`terminate/${props.currentState.name}`}
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
