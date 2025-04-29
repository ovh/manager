import React from 'react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  DataGridTextCell,
  DatagridColumn,
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
  goToServer: (name: string) => void,
) {
  const serverColumns: DatagridColumn<DedicatedServer>[] = [
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
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_name'),
      cell: (server: DedicatedServer) => (
        <NameCell server={server} navigate={goToServer} />
      ),
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
      id: 'datacentre',
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
      id: 'vrack',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_vrack'),
      cell: (server: DedicatedServer) => {
        return <DSVrack server={server.name} />;
      },
    },
    {
      id: 'renew',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_renew'),
      cell: (server: DedicatedServer) => <RenewCell server={server} />,
    },
    {
      id: 'expiration',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_expiration'),
      cell: (server: DedicatedServer) => <ExpirationCell server={server} />,
    },
    {
      id: 'engagement',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_engagement'),
      cell: (server: DedicatedServer) => <EngagementCell server={server} />,
    },
    {
      id: 'price',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_price'),
      cell: (server: DedicatedServer) => <PriceCell server={server} />,
    },
    {
      id: 'reverse',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_reverse'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.reverse)}</DataGridTextCell>
      ),
    },
    {
      id: 'model',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_model'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.commercialRange)}</DataGridTextCell>
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
      id: 'region',
      isSearchable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_region'),
      cell: (server: DedicatedServer) => (
        <DataGridTextCell>{t(server.region)}</DataGridTextCell>
      ),
    },
    {
      id: 'state',
      isSearchable: false,
      isFilterable: true,
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
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Boolean,
      label: t('server_display_monitoring'),
      cell: (server: DedicatedServer) => (
        <MonitoringStatusChip
          monitoring={server.monitoring}
          noIntervention={server.noIntervention}
        />
      ),
    },
    {
      id: 'actions',
      isSearchable: false,
      enableHiding: false,
      label: '',
      isSortable: false,
      cell: (server: DedicatedServer) => <ActionCell {...server} />,
    },
  ];
  return serverColumns;
}
