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
          <div>
            <Link as={RouterLink} to={`../${row.original.id}`}>
              {row.original.name}
            </Link>
            <Text preset="paragraph">{row.original.id}</Text>
          </div>
        ),
        minSize: 300,
      },
      {
        id: 'region',
        accessorKey: 'region',
        header: t('list:columns.region'),
        cell: ({ row }): string => t(row.original.regionDisplayKey, { micro: row.original.region }),
      },
      {
        id: 'protocol',
        accessorKey: 'protocol',
        header: t('list:columns.protocol'),
        size: 60,
      },
      {
        id: 'allocated_capacity',
        accessorKey: 'size',
        header: t('list:columns.allocated_capacity'),
        cell: ({ getValue }): string => {
          const capacity = getValue<number>() ?? 0;
          return t('list:columns.allocated_capacity_value', { capacity });
        },
        size: 80,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('list:columns.status'),
        cell: ({ row }) => {
          const { labelKey, badgeColor } = row.original.statusDisplay;
          return <ShareStatusBadge labelKey={labelKey} badgeColor={badgeColor} />;
        },
        size: 50,
      },
      {
        id: 'actions',
        header: () => <div className="flex justify-center">{t('list:columns.actions')}</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ActionsMenu items={row.original.actions} />
          </div>
        ),
        size: 50,
      },
    ],
    [t],
  );
};
