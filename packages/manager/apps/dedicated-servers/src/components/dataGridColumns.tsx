import React from 'react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { DatagridColumn } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { ActionCell } from '@/components/actionCell';
import { DedicatedServer } from '@/data/types/server.type';
import MonitoringStatusChip from '@/components/monitoringStatus';
import { DSVrack } from './vRackCell';
import NameCell from './cells/nameCell';
import RenewCell from './cells/renewCell';
import ExpirationCell from './cells/expirationCell';
import EngagementCell from './cells/engagementCell';
import PriceCell from './cells/priceCell';
import TagsCell from './cells/tagsCell';
import OsCell from './cells/osCell';

import { textByProductStatus } from './commonCellsWording';

const colorByProductStatus: Record<string, ODS_BADGE_COLOR> = {
  ok: ODS_BADGE_COLOR.success,
  hacked: ODS_BADGE_COLOR.warning,
  hackedBlocked: ODS_BADGE_COLOR.information,
};

export function useColumns(): DatagridColumn<DedicatedServer>[] {
  const { t } = useTranslation('dedicated-servers');
  return [
    {
      id: 'serverId',
      accessorFn: (row) => {
        return row.serverId;
      },
      accessorKey: 'id',
      isSearchable: false,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Numeric,
      header: t('server_display_id'),
      label: t('server_display_id'),
      cell: ({ row: { original: server } }) => <div>{server.serverId}</div>,
    },
    {
      id: 'iam.displayName',
      accessorKey: 'displayName',
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      enableHiding: false,
      type: FilterTypeCategories.String,
      header: t('server_display_name'),
      label: t('server_display_name'),
      cell: ({ row: { original: server } }) => NameCell(server),
    },
    {
      id: 'ip',
      isSearchable: false,
      accessorKey: 'ip',
      isSortable: false,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_ip'),
      label: t('server_display_ip'),
      cell: ({ row: { original: server } }) => <div>{t(server.ip)}</div>,
    },
    {
      id: 'reverse',
      accessorKey: 'reverse',
      isSearchable: false,
      isFilterable: true,
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_reverse'),
      label: t('server_display_reverse'),
      cell: ({ row: { original: server } }) => (
        <div>
          <span className="whitespace-nowrap">{t(server.reverse)}</span>
        </div>
      ),
    },
    {
      id: 'commercialRange',
      accessorKey: 'commercialRange',
      isSearchable: false,
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_model'),
      label: t('server_display_model'),
      cell: ({ row: { original: server } }) => (
        <div>
          <span className="whitespace-nowrap">{t(server.commercialRange)}</span>
        </div>
      ),
    },
    {
      id: 'os',
      accessorKey: 'os',
      isSearchable: false,
      isFilterable: true,
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_operating_system'),
      label: t('server_display_operating_system'),
      cell: ({ row: { original: server } }) => OsCell(server),
    },
    {
      id: 'region',
      accessorKey: 'region',
      isSearchable: false,
      isFilterable: true,
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_region'),
      label: t('server_display_region'),
      cell: ({ row: { original: server } }) => (
        <div>
          <span className="whitespace-nowrap">{t(server.region)}</span>
        </div>
      ),
    },
    {
      id: 'rack',
      accessorKey: 'rack',
      isSearchable: false,
      isFilterable: true,
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_rack'),
      label: t('server_display_rack'),
      cell: ({ row: { original: server } }) => <div>{t(server.rack)}</div>,
    },
    {
      id: 'datacenter',
      accessorKey: 'datacenter',
      isSearchable: false,
      isFilterable: true,
      isSortable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_datacentre'),
      label: t('server_display_datacentre'),
      cell: ({ row: { original: server } }) => (
        <div>{t(server.datacenter)}</div>
      ),
    },
    {
      id: 'state',
      accessorKey: 'state',
      isSearchable: false,
      isFilterable: false, // until fix
      enableHiding: true,
      isSortable: true,
      type: FilterTypeCategories.Boolean,
      header: t('server_display_state'),
      label: t('server_display_state'),
      cell: ({ row: { original: server } }) => (
        <OdsBadge
          label={t(textByProductStatus[server.state])}
          color={colorByProductStatus[server.state]}
          className="mt-3"
        />
      ),
    },
    {
      id: 'monitoring',
      accessorKey: 'monitoring',
      isSearchable: false,
      isFilterable: false, // until fix
      isSortable: false,
      enableHiding: true,
      type: FilterTypeCategories.Boolean,
      header: t('server_display_monitoring'),
      label: t('server_display_monitoring'),
      cell: ({ row: { original: server } }) => MonitoringStatusChip(server),
    },
    {
      id: 'vrack',
      accessorKey: 'vrack',
      isSearchable: false,
      isFilterable: false, // until fix
      isSortable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_vrack'),
      label: t('server_display_vrack'),
      cell: ({ row: { original: server } }) => DSVrack(server),
    },
    {
      id: 'renew',
      accessorKey: 'renew',
      isSearchable: false,
      isFilterable: false,
      isSortable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_renew'),
      label: t('server_display_renew'),
      cell: ({ row: { original: server } }) => RenewCell(server),
    },
    {
      id: 'expiration',
      accessorKey: 'expiration',
      isSearchable: false,
      isFilterable: false,
      isSortable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_expiration'),
      label: t('server_display_expiration'),
      cell: ({ row: { original: server } }) => ExpirationCell(server),
    },
    {
      id: 'engagement',
      accessorKey: 'engagement',
      isSearchable: false,
      isFilterable: false,
      isSortable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      header: t('server_display_engagement'),
      label: t('server_display_engagement'),
      cell: ({ row: { original: server } }) => EngagementCell(server),
    },
    {
      id: 'price',
      accessorKey: 'price',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      isSortable: false,
      type: FilterTypeCategories.String,
      header: t('server_display_price'),
      label: t('server_display_price'),
      cell: ({ row: { original: server } }) => PriceCell(server),
    },
    {
      id: 'tags',
      accessorKey: 'tags',
      isSearchable: false,
      isFilterable: true,
      enableHiding: true,
      isSortable: false,
      type: FilterTypeCategories.Tags,
      header: 'Tags',
      label: 'Tags',
      cell: ({ row: { original: server } }) => TagsCell(server),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      isSearchable: false,
      isFilterable: false,
      enableHiding: false,
      header: '',
      isSortable: false,
      cell: ({ row: { original: server } }) => ActionCell(server),
    },
  ];
}
