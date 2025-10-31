import { ColumnSort, Datagrid } from '@ovh-ux/manager-react-components';
import React, { useMemo, useState } from 'react';
import { useDomainDatagridColumns } from '@/alldoms/hooks/domainDatagrid/useDomainDatagridColumns';
import { TDomainsInfo } from '@/alldoms/types';

interface ServiceDetailDomainsProps {
  readonly alldomTerminated: boolean;
  readonly items: TDomainsInfo[];
}

export default function ServiceDetailDomains({
  alldomTerminated,
  items = [],
}: ServiceDetailDomainsProps) {
  const [sorting, setSorting] = useState<ColumnSort>({
    id: 'name',
    desc: false,
  });

  const columns = useDomainDatagridColumns({ alldomTerminated });

  const sortedItems = useMemo(() => {
    if (sorting.desc) {
      return [...items].sort((a, b) => b.name.localeCompare(a.name));
    }
    return items;
  }, [items, sorting.desc]);

  return (
    <Datagrid
      columns={columns}
      items={sortedItems}
      totalItems={items.length}
      sorting={sorting}
      onSortChange={setSorting}
      manualSorting
    />
  );
}
