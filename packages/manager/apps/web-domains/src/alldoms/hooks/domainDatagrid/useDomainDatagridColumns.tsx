import React from 'react';
import { useTranslation } from 'react-i18next';
import { TDomainsInfo } from '@/alldoms/types';
import DomainDatagridColumnRegisteredStatus from '@/alldoms/components/domainDatagridColumns/DomainDatagridColumnRegisteredStatus';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';
import DomainDatagridColumnDate from '@/alldoms/components/domainDatagridColumns/DomainDatagridColumnDate';
import DomainDatagridColumnDomain from '@/alldoms/components/domainDatagridColumns/DomainDatagridColumnDomain';
import DomainDatagridColumnRenewMode from '@/alldoms/components/domainDatagridColumns/DomainDatagridColumnRenewMode';

interface DomainDatagridColumnsProps {
  readonly alldomTerminated: boolean;
}

export const useDomainDatagridColumns = ({
  alldomTerminated,
}: DomainDatagridColumnsProps) => {
  const { t } = useTranslation('allDom');

  const columns = [
    {
      id: 'domainName',
      cell: (props: TDomainsInfo) => (
        <DomainDatagridColumnDomain domain={props.name} />
      ),
      label: t('allDom_domain_table_header_domain_name'),
      isSortable: true,
    },
    {
      id: 'status',
      cell: (props: TDomainsInfo) => (
        <DomainDatagridColumnRegisteredStatus
          registrationStatus={props.registrationStatus}
        />
      ),
      label: t('allDom_domain_table_header_status'),
    },
    {
      id: 'domain_renew_mode',
      cell: (props: TDomainsInfo) => {
        return props.registrationStatus ===
          DomainRegistrationStateEnum.Registered ? (
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
        return props.registrationStatus ===
          DomainRegistrationStateEnum.Registered ? (
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
