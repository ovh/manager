import { useMemo } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge, type BadgeColor, Link, Text } from '@ovhcloud/ods-react';

import { DatagridColumn, useBytes } from '@ovh-ux/muk';

import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { type TShareStatusBadgeColor } from '@/adapters/shares/left/shareStatusMapper';

const BADGE_COLOR_BY_STATUS: Record<TShareStatusBadgeColor, BadgeColor> = {
  success: BADGE_COLOR.success,
  warning: BADGE_COLOR.warning,
  critical: BADGE_COLOR.critical,
  neutral: BADGE_COLOR.neutral,
};

export const useShareColumn = (): DatagridColumn<TShareListRow>[] => {
  const { t } = useTranslation(['list']);
  const { formatBytes } = useBytes();

  return useMemo(
    () => [
      {
        id: 'name_id',
        accessorKey: 'name',
        header: t('list:columns.name_id'),
        cell: ({ row }) => (
          <div className="flex flex-col gap-3">
            <Link as={RouterLink} to={`../${row.original.id}`}>
              {row.original.name}
            </Link>
            <Text className="text-ods-body-text-400" preset="paragraph">
              {row.original.id}
            </Text>
          </div>
        ),
        size: 400,
      },
      {
        id: 'region',
        accessorKey: 'region',
        header: t('list:columns.region'),
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
        cell: ({ getValue }) => formatBytes(getValue<number>() ?? 0, 0, 1000),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('list:columns.status'),
        cell: ({ row }) => {
          const { labelKey, badgeColor } = row.original.statusDisplay;
          return (
            <Badge color={BADGE_COLOR_BY_STATUS[badgeColor]} size="md" className="text-nowrap">
              {t(labelKey)}
            </Badge>
          );
        },
      },
    ],
    [t, formatBytes],
  );
};
