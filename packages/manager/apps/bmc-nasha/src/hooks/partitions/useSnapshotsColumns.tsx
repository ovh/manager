import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import type { DatagridColumn } from '@ovh-ux/muk';

import SnapshotActionsCell from '@/components/partition/snapshots/SnapshotActionsCell.component';

type SnapshotRow = {
  type: string;
  name: string;
  isCustom: boolean;
};

export function useSnapshotsColumns() {
  const { t } = useTranslation(['partition']);

  return useMemo<DatagridColumn<SnapshotRow>[]>(
    () => [
      {
        accessorKey: 'type',
        header: t('partition:snapshots.columns.type'),
        cell: ({ row }) => row.original.type,
        isSortable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'name',
        header: t('partition:snapshots.columns.name'),
        cell: ({ row }) => row.original.name,
        isSortable: true,
        isSearchable: true,
        isFilterable: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => (
          <SnapshotActionsCell snapshotName={row.original.name} isCustom={row.original.isCustom} />
        ),
        isSortable: false,
        enableHiding: false,
      },
    ],
    [t],
  );
}
