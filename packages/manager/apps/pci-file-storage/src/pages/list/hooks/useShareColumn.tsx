import React, { useMemo } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Text } from '@ovhcloud/ods-react';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { DatagridColumn } from '@ovh-ux/muk';

import { StatusBadge } from '@/components/status-badge/StatusBadge.component';
import { useFormatGiBSize } from '@/hooks/useFormatShareSize';
import { ActionsMenu } from '@/pages/list/components/menu/ActionsMenu.component';
import { TShareListRow } from '@/pages/list/view-model/shareList.view-model';

const ShareSizeCell: React.FC<{ sizeInGiB: number }> = ({ sizeInGiB }) => {
  const formatted = useFormatGiBSize(sizeInGiB);
  return <>{formatted}</>;
};

export const useShareColumn = (): DatagridColumn<TShareListRow>[] => {
  const { t } = useTranslation(['share', 'list', 'regions']);

  return useMemo(
    () => [
      {
        id: 'name_id',
        accessorKey: 'name',
        header: t('share:fields.name_id'),
        label: t('share:fields.name_id'),
        isSearchable: true,
        isSortable: true,
        type: FilterTypeCategories.String,
        comparator: [FilterComparator.Includes],
        cell: ({ row }) => (
          <div className="max-w-[300px]">
            <Link as={RouterLink} to={`./${row.original.region}/${row.original.id}`}>
              {row.original.name}
            </Link>
            <Text preset="paragraph">{row.original.id}</Text>
          </div>
        ),
        minSize: 310,
        maxSize: 320,
      },
      {
        id: 'region',
        accessorKey: 'region',
        header: t('share:fields.region'),
        label: t('share:fields.region'),
        isSortable: true,
        type: FilterTypeCategories.String,
        comparator: [FilterComparator.IsEqual],
        cell: ({ row }): string => t(row.original.regionDisplayKey, { micro: row.original.region }),
        minSize: 250,
        maxSize: 250,
      },
      {
        id: 'protocol',
        accessorKey: 'protocol',
        header: () => <span className="cursor-auto">{t('share:fields.protocol')}</span>,
        label: t('share:fields.protocol'),
        isSortable: false,
        minSize: 97,
        size: 97,
      },
      {
        id: 'allocated_capacity',
        accessorKey: 'size',
        header: t('share:fields.allocated_capacity'),
        isSortable: true,
        cell: ({ getValue }) => <ShareSizeCell sizeInGiB={getValue<number>() ?? 0} />,
        minSize: 171,
        maxSize: 171,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => <span className="cursor-auto">{t('share:fields.status')}</span>,
        label: t('share:fields.status'),
        cell: ({ row }) => {
          const { labelKey, badgeColor } = row.original.statusDisplay;
          return <StatusBadge labelKey={labelKey} badgeColor={badgeColor} />;
        },
        isSortable: false,
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex cursor-auto justify-center">{t('share:actions.column')}</div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ActionsMenu items={row.original.actions} />
          </div>
        ),
        minSize: 77,
        maxSize: 77,
      },
    ],
    [t],
  );
};
