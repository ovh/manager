import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TDomainsInfo } from '@/alldoms/types';
import DomainDatagridColumnRegisteredStatus from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnRegisteredStatus';
import DomainDatagridColumnState from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnState';
import { DomainProtectionStateEnum } from '@/alldoms/enum/service.enum';
import DomainDatagridColumnDate from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDate';
import DomainDatagridColumnDomain from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDomain';
import DomainDatagridColumnDnsServer from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDnsServer';

export const useDomainDatagridColumns = () => {
  const { t } = useTranslation('allDom');
  return useMemo(
    () => [
      {
        id: 'domainName',
        cell: (props: TDomainsInfo) => (
          <DomainDatagridColumnDomain domain={props.name} />
        ),
        label: t('allDom_domain_table_header_domain_name'),
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
        id: 'dns_server',
        cell: (props: TDomainsInfo) => (
          <DomainDatagridColumnDnsServer
            nameServers={props.nameServers}
            registrationStatus={props.registrationStatus}
          />
        ),
        label: t('allDom_domain_table_header_dns_server'),
      },
      {
        id: 'transfert_protection',
        cell: (props: TDomainsInfo) => (
          <DomainDatagridColumnState
            registrationStatus={props.registrationStatus}
            valueToVerify={props.protectionState}
            correspondingEnum={DomainProtectionStateEnum.Protected}
          />
        ),
        label: t('allDom_domain_table_header_transfert_protection'),
      },
      {
        id: 'dnssec',
        cell: (props: TDomainsInfo) => (
          <DomainDatagridColumnState
            valueToVerify={props.isDnssecActivated}
            correspondingEnum={true}
            registrationStatus={props.registrationStatus}
          />
        ),
        label: t('allDom_domain_table_header_dnssec'),
      },
      {
        id: 'expiration_date',
        cell: (props: TDomainsInfo) => (
          <DomainDatagridColumnDate
            registrationStatus={props.registrationStatus}
            date={props.expiration}
          />
        ),
        label: t('allDom_domain_table_header_expiration_date'),
      },
    ],
    [],
  );
};
