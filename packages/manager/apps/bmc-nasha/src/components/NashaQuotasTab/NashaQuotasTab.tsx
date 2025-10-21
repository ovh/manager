/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';

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
      id: 'uid',
      label: t('uid'),
      cell: (quota: NashaQuota) => (
        <DataGridTextCell>{quota.uid}</DataGridTextCell>
      ),
    },
    {
      id: 'gid',
      label: t('gid'),
      cell: (quota: NashaQuota) => (
        <DataGridTextCell>{quota.gid}</DataGridTextCell>
      ),
    },
    {
      id: 'path',
      label: t('path'),
      cell: (quota: NashaQuota) => (
        <DataGridTextCell>{quota.path}</DataGridTextCell>
      ),
    },
    {
      id: 'size',
      label: t('quota_size'),
      cell: (quota: NashaQuota) => (
        <DataGridTextCell>{formatBytes(quota.size * 1024 * 1024 * 1024)}</DataGridTextCell>
      ),
    },
    {
      id: 'used',
      label: t('used'),
      cell: (quota: NashaQuota) => (
        <DataGridTextCell>{formatBytes(quota.used * 1024 * 1024 * 1024)}</DataGridTextCell>
      ),
    },
    {
      id: 'usage',
      label: t('usage_percentage'),
      cell: (quota: NashaQuota) => {
        const percentage =
          quota.size > 0 ? (quota.used / quota.size) * 100 : 0;
        return (
          <DataGridTextCell>{`${percentage.toFixed(1)}%`}</DataGridTextCell>
        );
      },
    },
  ];

  if (quotas.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.user} className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_quotas')}
        </OdsText>
        <OdsText preset="paragraph" color="neutral-600">
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
        <Datagrid
          columns={columns}
          items={quotas}
          totalItems={quotas.length}
          noResultLabel={t('no_quotas')}
        />
      </OdsCard>
    </div>
  );
}
