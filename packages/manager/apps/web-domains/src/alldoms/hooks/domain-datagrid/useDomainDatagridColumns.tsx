import React from 'react';

import { useTranslation } from 'react-i18next';

import DomainDatagridColumnDate from '@/alldoms/components/domain-datagrid-columns/DomainDatagridColumnDate';
import DomainDatagridColumnDomain from '@/alldoms/components/domain-datagrid-columns/DomainDatagridColumnDomain';
import DomainDatagridColumnRegisteredStatus from '@/alldoms/components/domain-datagrid-columns/DomainDatagridColumnRegisteredStatus';
import DomainDatagridColumnRenewMode from '@/alldoms/components/domain-datagrid-columns/DomainDatagridColumnRenewMode';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';
import { TDomainsInfo } from '@/alldoms/types';

export const useDomainDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  const columns = [
    {
      id: 'domainName',
      cell: (props: TDomainsInfo) => <DomainDatagridColumnDomain domain={props.name} />,
      label: t('allDom_domain_table_header_domain_name'),
      isSortable: true,
    },
    {
      id: 'status',
      cell: (props: TDomainsInfo) => (
        <DomainDatagridColumnRegisteredStatus
          domainName={props.name}
          registrationStatus={props.registrationStatus}
        />
      ),
      label: t('allDom_domain_table_header_status'),
    },
    {
      id: 'domain_renew_mode',
      cell: (props: TDomainsInfo) => {
        return props.registrationStatus === DomainRegistrationStateEnum.Registered ? (
          <DomainDatagridColumnRenewMode serviceName={props.name} />
        ) : (
          <p>-</p>
        );
      },
      label: t('allDom_table_header_renewMode'),
    },
    {
      id: 'expiration_date',
      cell: (props: TDomainsInfo) => {
        return props.registrationStatus === DomainRegistrationStateEnum.Registered ? (
          <DomainDatagridColumnDate date={props.expiresAt} />
        ) : (
          <p>-</p>
        );
      },
      label: t('allDom_domain_table_header_expiration_date'),
    },
  ];
  return columns;
};
