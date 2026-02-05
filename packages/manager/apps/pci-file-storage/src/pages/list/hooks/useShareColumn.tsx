import { useMemo } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Text } from '@ovhcloud/ods-react';

import { DatagridColumn } from '@ovh-ux/muk';

import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { ShareStatusBadge } from '@/components/status-badge/ShareStatusBadge.component';
import { ActionsMenu } from '@/pages/list/components/menu/ActionsMenu.component';

export const useShareColumn = (): DatagridColumn<TShareListRow>[] => {
  const { t } = useTranslation(['list', 'regions']);

  return useMemo(
    () => [
      {
        id: 'name_id',
        accessorKey: 'name',
        header: t('list:columns.name_id'),
        cell: ({ row }) => (
          <div className="max-w-[300px]">
            <Link as={RouterLink} to={`../${row.original.id}`}>
              {row.original.name}
            </Link>
            <Text preset="paragraph">{row.original.id}</Text>
          </div>
        ),
        minSize: 300,
        maxSize: 310,
      },
      {
        id: 'region',
        accessorKey: 'region',
        header: t('list:columns.region'),
        cell: ({ row }): string => t(row.original.regionDisplayKey, { micro: row.original.region }),
        minSize: 250,
        maxSize: 250,
      },
      {
        id: 'protocol',
        accessorKey: 'protocol',
        header: t('list:columns.protocol'),
        minSize: 70,
        size: 70
      },
      {
        id: 'allocated_capacity',
        accessorKey: 'size',
        header: t('list:columns.allocated_capacity'),
        cell: ({ getValue }): string => {
          const capacity = getValue<number>() ?? 0;
          return t('list:columns.allocated_capacity_value', { capacity });
        },
        minSize: 120,
        maxSize: 120,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('list:columns.status'),
        cell: ({ row }) => {
          const { labelKey, badgeColor } = row.original.statusDisplay;
          return <ShareStatusBadge labelKey={labelKey} badgeColor={badgeColor} />;
        },
      },
      {
        id: 'actions',
        header: () => <div className="flex justify-center">{t('list:columns.actions')}</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ActionsMenu items={row.original.actions} />
          </div>
        ),
        minSize: 60,
        maxSize: 60,
      },
    ],
    [t],
  );
};
