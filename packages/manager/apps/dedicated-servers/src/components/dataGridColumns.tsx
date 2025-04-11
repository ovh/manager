import React from 'react';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { ActionCell } from '@/components/actionCell';
import { DedicatedServerWithIAM } from '@/data/types/server.type';
import MonitoringStatusChip from '@/components/monitoringStatus';
import { DSVrack } from './vRackCell';
import { DSBilling } from './billingCell';

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

type ServerSateChipProps = {
  state: string;
};

function formatDate(input: string) {
  const date = new Date(input);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getColumns(
  t: (v: string) => string,
  goToServer: (name: string) => void,
) {
  const ProductStatusChip: React.FC<ServerSateChipProps> = ({
    state,
  }: {
    state: string;
  }) => {
    return (
      <OdsBadge
        label={t(textByProductStatus[state])}
        color={colorByProductStatus[state]}
        className="mt-3"
      />
    );
  };

  const serverColumns: DatagridColumn<DedicatedServerWithIAM>[] = [
    {
      id: 'serverId',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Numeric,
      label: t('server_display_id'),
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
        <DataGridTextCell>
          <OdsLink
            color="primary"
            href={`#/server/${server.name}`}
            onClick={() => {
              goToServer(server.name);
            }}
            label={t(server?.iam?.displayName)}
          ></OdsLink>
        </DataGridTextCell>
      ),
    },
    {
      id: 'ip',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_ip'),
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => {
        return <DSVrack server={server.name}></DSVrack>;
      },
    },
    {
      id: 'renew',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_renew'),
      cell: (server: DedicatedServerWithIAM) => {
        return (
          <DSBilling server={server.name}>
            {(billingInfo) => (
              <DataGridTextCell>
                {billingInfo?.billing?.renew?.current?.mode ? (
                  t(
                    `server_display_renew-${billingInfo?.billing?.renew?.current?.mode}`,
                  )
                ) : (
                  <>-</>
                )}
              </DataGridTextCell>
            )}
          </DSBilling>
        );
      },
    },
    {
      id: 'expiration',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_expiration'),
      cell: (server: DedicatedServerWithIAM) => {
        return (
          <DSBilling server={server.name}>
            {(billingInfo) => (
              <DataGridTextCell>
                {formatDate(billingInfo?.billing?.expirationDate)}
              </DataGridTextCell>
            )}
          </DSBilling>
        );
      },
    },
    {
      id: 'engagement',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_engagement'),
      cell: (server: DedicatedServerWithIAM) => {
        return (
          <DSBilling server={server.name}>
            {(billingInfo) =>
              billingInfo?.billing?.engagement ? (
                <OdsBadge
                  label={t('server_display_with-engagement')}
                  color={ODS_BADGE_COLOR.success}
                  className="mt-3"
                />
              ) : (
                <OdsBadge
                  label={t('server_display_without-engagement')}
                  color={ODS_BADGE_COLOR.warning}
                  className="mt-3"
                />
              )
            }
          </DSBilling>
        );
      },
    },
    {
      id: 'price',
      isSearchable: false,
      isFilterable: false,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_price'),
      cell: (server: DedicatedServerWithIAM) => {
        return (
          <DSBilling server={server.name}>
            {(billingInfo) => (
              <DataGridTextCell>
                {billingInfo?.billing?.pricing?.price?.text}
              </DataGridTextCell>
            )}
          </DSBilling>
        );
      },
    },
    {
      id: 'reverse',
      isSearchable: true,
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_reverse'),
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
        <DataGridTextCell>{t(server.rack)}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      isSearchable: true,
      enableHiding: true,
      type: FilterTypeCategories.String,
      label: t('server_display_region'),
      cell: (server: DedicatedServerWithIAM) => (
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
      cell: (server: DedicatedServerWithIAM) => (
        <ProductStatusChip state={server.state} />
      ),
    },
    {
      id: 'monitoring',
      isFilterable: true,
      enableHiding: true,
      type: FilterTypeCategories.Boolean,
      label: t('server_display_monitoring'),
      cell: (server: DedicatedServerWithIAM) => (
        <MonitoringStatusChip
          monitoring={server.monitoring}
          noIntervention={server.noIntervention}
        ></MonitoringStatusChip>
      ),
    },
    {
      id: 'actions',
      isSearchable: false,
      enableHiding: false,
      label: '',
      isSortable: false,
      cell: (server: DedicatedServerWithIAM) => <ActionCell {...server} />,
    },
  ];
  return serverColumns;
}
