import React from 'react';
import { useTranslation } from 'react-i18next';
import { TDomainsInfo } from '@/alldoms/types';
import DomainDatagridColumnRegisteredStatus from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnRegisteredStatus';
import DomainDatagridColumnState from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnState';
import {
  DomainProtectionStateEnum,
  Gender,
  ServiceResourceStatus,
} from '@/alldoms/enum/service.enum';
import DomainDatagridColumnDate from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDate';
import DomainDatagridColumnDomain from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDomain';
import DomainDatagridColumnDnsServer from '@/alldoms/components/DomainDatagridColumns/DomainDatagridColumnDnsServer';

export const useDomainDatagridColumns = (
  allDomResourceState: ServiceResourceStatus,
) => {
  const { t } = useTranslation('allDom');
  const displayData = allDomResourceState !== ServiceResourceStatus.ToDelete;
  const columns = [
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
      cell: (props: TDomainsInfo) => {
        return displayData ? (
          <DomainDatagridColumnDnsServer nameServers={props.nameServers} />
        ) : (
          <p>-</p>
        );
      },
      label: t('allDom_domain_table_header_dns_server'),
    },
    {
      id: 'transfert_protection',
      cell: (props: TDomainsInfo) => {
        return displayData ? (
          <DomainDatagridColumnState
            valueToVerify={props.protectionState}
            correspondingEnum={DomainProtectionStateEnum.Protected}
          />
        ) : (
          <p>-</p>
        );
      },
      label: t('allDom_domain_table_header_transfert_protection'),
    },
    {
      id: 'dnssec',
      cell: (props: TDomainsInfo) => {
        return displayData ? (
          <DomainDatagridColumnState
            valueToVerify={props.dnssecActivated}
            correspondingEnum={true}
            gender={Gender.Masc}
          />
        ) : (
          <p>-</p>
        );
      },
      label: t('allDom_domain_table_header_dnssec'),
    },
    {
      id: 'expiration_date',
      cell: (props: TDomainsInfo) => {
        return displayData ? (
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
