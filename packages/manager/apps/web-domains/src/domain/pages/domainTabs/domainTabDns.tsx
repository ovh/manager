import React from 'react';
import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';
import {
  TDatagridDnsDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import { useDomainDnsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnsDatagridColumns';
import { computeDnsDetails } from '@/domain/utils/utils';

interface DomainTabDnsProps {
  readonly domainResource: TDomainResource;
}

export default function DomainTabDns({ domainResource }: DomainTabDnsProps) {
  const { t, i18n } = useTranslation(['domain', 'web-domains/error']);

  const dnsDetails: TDatagridDnsDetails[] = computeDnsDetails(domainResource);

  const columns = useDomainDnsDatagridColumns();

  return (
    <div data-testid="datagrid">
      <h1>{domainResource.id}</h1>
      {/* <Datagrid
        columns={columns}
        items={dnsResources}
        totalItems={dnsResources?.length ? dnsResources.length : 0}
      /> */}
    </div>
  );
}
