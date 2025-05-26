import React from 'react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  DataGridTextCell,
  DatagridColumn,
  TagsList,
} from '@ovh-ux/manager-react-components';
import { ActionCell } from '@/components/actionCell';
import { DedicatedServer } from '@/data/types/server.type';
import MonitoringStatusChip from '@/components/monitoringStatus';
import { DSVrack } from './vRackCell';
import NameCell from './cells/nameCell';
import RenewCell from './cells/renewCell';
import ExpirationCell from './cells/expirationCell';
import EngagementCell from './cells/engagementCell';
import PriceCell from './cells/priceCell';

const colorByProductStatus: Record<string, ODS_BADGE_COLOR> = {
  ok: ODS_BADGE_COLOR.success,
  hacked: ODS_BADGE_COLOR.warning,
  hackedBlocked: ODS_BADGE_COLOR.information,
};

const textByProductStatus: Record<string, string> = {
  ok: 'server_configuration_state_OK',
  hacked: 'server_configuration_state_HACKED',
  hackedBlocked: 'server_configuration_state_HACKED_BLOCKED',
};

export function getColumns(
  t: (v: string) => string,
): DatagridColumn<DedicatedServer>[] {
  return [
    {
      id: 'serverId',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Numeric,
      label: t('server_display_id'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.serverId.toString())}</DataGridTextCell>
      ),
    },
    {
      id: 'iam.displayName',
      isSearchable: true,
      isFilterable: true,
      enableHiding: false,
      type: FilterTypeCategories.String,
      label: t('server_display_name'),
      cell: NameCell,
    },
    {
      id: 'ip',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_ip'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.ip)}</DataGridTextCell>
      ),
    },
    {
      id: 'reverse',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_reverse'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{t(server.reverse)}</span>
        </DataGridTextCell>
      ),
    },
    {
      id: 'commercialRange',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_model'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{t(server.commercialRange)}</span>
        </DataGridTextCell>
      ),
    },
    {
      id: 'os',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_operating_system'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.os)}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_region'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{t(server.region)}</span>
        </DataGridTextCell>
      ),
    },
    {
      id: 'rack',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_rack'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.rack)}</DataGridTextCell>
      ),
    },
    {
      id: 'datacenter',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_datacentre'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.datacenter)}</DataGridTextCell>
      ),
    },
    {
      id: 'state',
      isSearchable: false,
      isFilterable: false, // until fix
      enableHiding: true,
      type: FilterTypeCategories.Boolean,
      label: t('server_display_state'),
      cell: (server: DedicatedServer) => (
        <OdsBadge
          label={t(textByProductStatus[server.state])}
          color={colorByProductStatus[server.state]}
          className="mt-3"
        />
      ),
    },
    {
      id: 'monitoring',
      isFilterable: false, // until fix
      enableHiding: true,
      type: FilterTypeCategories.Boolean,
      label: t('server_display_monitoring'),
      cell: MonitoringStatusChip,
    },
    {
      id: 'vrack',
      isSearchable: true,
      isFilterable: false, // until fix
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_vrack'),
      cell: DSVrack,
    },
    {
      id: 'renew',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_renew'),
      cell: RenewCell,
    },
    {
      id: 'expiration',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_expiration'),
      cell: ExpirationCell,
    },
    {
      id: 'engagement',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_engagement'),
      cell: EngagementCell,
    },
    {
      id: 'price',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_price'),
      cell: PriceCell,
    },
    {
      id: 'tags',
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Tags,
      label: 'Tags',
      cell: (server: DedicatedServer) => {
        return (
          server.iam?.tags &&
          Object.keys(server.iam?.tags).length > 0 && (
            <TagsList
              tags={server.iam?.tags}
              lineNumber={1}
              onClick={() => {
                // open modal
              }}
            />
          )
        );
      },
    },
    {
      id: 'actions',
      isSearchable: false,
      enableHiding: false,
      label: '',
      isSortable: false,
      cell: ActionCell,
    },
  ];
}
