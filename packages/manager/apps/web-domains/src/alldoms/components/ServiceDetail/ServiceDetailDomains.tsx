import { Datagrid } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useDomainDatagridColumns } from '@/alldoms/hooks/domainDatagrid/useDomainDatagridColumns';
import { TDomainsInfo, TServiceDetail } from '@/alldoms/types';

interface ServiceDetailDomainsProps {
  readonly items: TDomainsInfo[];
  readonly allDomResourceState: TServiceDetail['allDomResourceState'];
}

export default function ServiceDetailDomains({
  items,
  allDomResourceState,
}: ServiceDetailDomainsProps) {
  const columns = useDomainDatagridColumns(allDomResourceState);
  return <Datagrid columns={columns} items={items} totalItems={items.length} />;
}
