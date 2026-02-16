import React, { useMemo } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Text } from '@ovhcloud/ods-react';

import { DatagridColumn } from '@ovh-ux/muk';

import { ShareStatusBadge } from '@/components/status-badge/ShareStatusBadge.component';
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
        cell: ({ row }): string => t(row.original.regionDisplayKey, { micro: row.original.region }),
        minSize: 250,
        maxSize: 250,
      },
      {
        id: 'protocol',
        accessorKey: 'protocol',
        header: t('share:fields.protocol'),
        minSize: 97,
        size: 97,
      },
      {
        id: 'allocated_capacity',
        accessorKey: 'size',
        header: t('share:fields.allocated_capacity'),
        cell: ({ getValue }) => <ShareSizeCell sizeInGiB={getValue<number>() ?? 0} />,
        minSize: 140,
        maxSize: 140,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('share:fields.status'),
        cell: ({ row }) => {
          const { labelKey, badgeColor } = row.original.statusDisplay;
          return <ShareStatusBadge labelKey={labelKey} badgeColor={badgeColor} />;
        },
      },
      {
        id: 'actions',
        header: () => <div className="flex justify-center">{t('share:actions.column')}</div>,
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
