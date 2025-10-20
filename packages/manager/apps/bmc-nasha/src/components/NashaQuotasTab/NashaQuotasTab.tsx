/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsTable, OdsText } from '@ovhcloud/ods-components/react';

import { useBytes } from '@ovh-ux/manager-react-components';

import type { NashaQuota } from '@/types/Nasha.type';

interface NashaQuotasTabProps {
  serviceName: string;
  quotas: NashaQuota[];
}

export default function NashaQuotasTab({ serviceName, quotas }: NashaQuotasTabProps) {
  const { t } = useTranslation('dashboard');
  const { formatBytes } = useBytes();

  const columns = [
    {
      header: t('uid'),
      accessorKey: 'uid',
    },
    {
      header: t('gid'),
      accessorKey: 'gid',
    },
    {
      header: t('path'),
      accessorKey: 'path',
    },
    {
      header: t('quota_size'),
      accessorKey: 'size',
      cell: ({ row }: any) => formatBytes(row.original.size * 1024 * 1024 * 1024),
    },
    {
      header: t('used'),
      accessorKey: 'used',
      cell: ({ row }: any) => formatBytes(row.original.used * 1024 * 1024 * 1024),
    },
    {
      header: t('usage_percentage'),
      id: 'usage',
      cell: ({ row }: any) => {
        const percentage =
          row.original.size > 0 ? (row.original.used / row.original.size) * 100 : 0;
        return `${percentage.toFixed(1)}%`;
      },
    },
  ];

  if (quotas.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.USER} size="xl" className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_quotas')}
        </OdsText>
        <OdsText preset="body-2" color="neutral-600">
          {t('no_quotas_description')}
        </OdsText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <OdsText preset="heading-2">
          {t('quotas')} ({quotas.length})
        </OdsText>
      </div>

      <OdsCard className="p-6">
        <OdsTable columns={columns} data={quotas} className="w-full" />
      </OdsCard>
    </div>
  );
}
