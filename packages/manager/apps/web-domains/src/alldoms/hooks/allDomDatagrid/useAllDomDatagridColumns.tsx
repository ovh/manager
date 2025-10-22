import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { AlldomService } from '@/alldoms/types';
import DatagridColumnDomainRegisteredAuthorized from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDomainRegisteredAuthorized';
import DatagridColumnServiceName from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnServiceName';
import { DatagridColumnDate } from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnDate';
import DatagridColumnContact from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnContact';
import DatagridColumnRenewMode from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnRenewMode';
import ServiceActionMenu from '@/alldoms/components/ActionMenu/ServiceActionMenu';
import { ActionEnum } from '@/alldoms/enum/service.enum';
import DatagridColumnSkeleton from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnSkeleton';
import { useNichandle } from '@/alldoms/hooks/nichandle/useNichandle';
import { CANCEL_TERMINATE_URL, TERMINATE_URL } from '@/alldoms/constants';

export const useAllDomDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  const { nichandle } = useNichandle();
  const { data: accountUrl } = useNavigationGetUrl(['account', '', {}]);

  const columns = [
    {
      id: 'id',
      cell: (props: AlldomService) => (
        <DatagridColumnServiceName allDomName={props.currentState.name} />
      ),
      label: t('allDom_table_header_id'),
      enableHiding: false,
      type: FilterTypeCategories.String,
      isFilterable: true,
      isSearchable: true,
    },
    {
      id: 'renewMode',
      cell: (props: AlldomService) => (
        <DatagridColumnSkeleton serviceId={props.serviceId}>
          <DatagridColumnRenewMode
            renewMode={props.renewMode}
            lifecyclePendingActions={props.lifecyclePendingActions}
          />
        </DatagridColumnSkeleton>
      ),
      label: t('allDom_table_header_renewMode'),
      enableHiding: true,
    },
    {
      id: 'type',
      cell: (props: AlldomService) => (
        <DataGridTextCell>
          {t(`allDom_table_type_${props.currentState.type}`)}
        </DataGridTextCell>
      ),
      label: t('allDom_table_header_type'),
      enableHiding: true,
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
        <DatagridColumnSkeleton serviceId={props.serviceId}>
          <DatagridColumnDate expirationDate={props.expirationDate} />
        </DatagridColumnSkeleton>
      ),
      label: t('allDom_domain_table_header_expiration_date'),
      enableHiding: false,
    },
    {
      id: 'nicAdmin',
      cell: (props: AlldomService) => (
        <DatagridColumnSkeleton serviceId={props.serviceId}>
          <DatagridColumnContact
            contact={props.nicAdmin}
            url={
              props.nicAdmin === nichandle &&
              `${accountUrl as string}/useraccount/infos`
            }
          />
        </DatagridColumnSkeleton>
      ),
      label: t('allDom_table_header_nicAdmin'),
    },
    {
      id: 'nicTech',
      cell: (props: AlldomService) => (
        <DatagridColumnSkeleton serviceId={props.serviceId}>
          <DatagridColumnContact
            contact={props.nicTechnical}
            url={
              props.nicTechnical === nichandle &&
              `${accountUrl as string}/useraccount/infos`
            }
          />
        </DatagridColumnSkeleton>
      ),
      label: t('allDom_table_header_nicTech'),
      enableHiding: true,
    },
    {
      id: 'nicBilling',
      cell: (props: AlldomService) => (
        <DatagridColumnSkeleton serviceId={props.serviceId}>
          <DatagridColumnContact
            contact={props.nicBilling}
            url={
              props.nicBilling === nichandle &&
              `${accountUrl as string}/useraccount/infos`
            }
          />
        </DatagridColumnSkeleton>
      ),
      label: t('allDom_table_header_nicBilling'),
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (props: AlldomService) => (
        <ServiceActionMenu
          id={`${props.currentState.name}-${ActionEnum.All}`}
          serviceName={props.currentState.name}
          terminateUrl={TERMINATE_URL(props.currentState.name)}
          lifecyclePendingActions={props.lifecyclePendingActions}
          whichAction={ActionEnum.All}
          cancelTerminateUrl={CANCEL_TERMINATE_URL(props.currentState.name)}
        />
      ),
      label: '',
      enableHiding: false,
    },
  ];
  return columns;
};
