import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import type { DatagridColumn } from '@ovh-ux/muk';

import AccessActionsCell from '@/components/partition/accesses/AccessActionsCell.component';

type PartitionAccess = {
  ip: string;
  type: string;
  aclDescription?: string;
};

export function useAccessesColumns() {
  const { t } = useTranslation(['partition']);

  return useMemo<DatagridColumn<PartitionAccess>[]>(
    () => [
      {
        accessorKey: 'ip',
        header: 'IP',
        cell: ({ row }) => row.original.ip,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'type',
        header: t('partition:accesses.columns.type'),
        cell: ({ row }) => row.original.type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'aclDescription',
        header: t('partition:accesses.columns.description'),
        cell: ({ row }) => row.original.aclDescription || '-',
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <AccessActionsCell ip={row.original.ip} />,
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );
}
