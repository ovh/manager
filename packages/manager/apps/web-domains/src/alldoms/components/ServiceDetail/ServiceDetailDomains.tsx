import { Datagrid } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useDomainDatagridColumns } from '@/alldoms/hooks/domainDatagrid/useDomainDatagridColumns';
import { TDomainsInfo } from '@/alldoms/types';

interface ServiceDetailDomainsProps {
  readonly items: TDomainsInfo[];
}

export default function ServiceDetailDomains({
  items,
}: ServiceDetailDomainsProps) {
  const columns = useDomainDatagridColumns();
  return <Datagrid columns={columns} items={items} totalItems={items.length} />;
}
