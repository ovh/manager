import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TQuota } from '@ovh-ux/manager-pci-common';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslatedBytes } from '@ovh-ux/manager-pci-block-storage-app/src/hooks/useTranslatedBytes';
import { Quota } from '@/api/data/quota';
import { PRODUCTS } from '@/constants';

export const useDatagridColumn = () => {
  const { t } = useTranslation('quotas');
  const columns: DatagridColumn<Quota>[] = [
    {
      id: 'region',
      cell: (props: Quota) => (
        // TODO translate region
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_region'),
    },
    {
      id: 'servers',
      cell: (props: Quota) => (
        <DataGridTextCell>
          <span>
            {props.instance.usedInstances} /
            {props.instance.maxInstances === -1
              ? t('pci_projects_project_quota_instance_unlimited')
              : props.instance.maxInstances}
          </span>

          {props.isInstanceQuotaThresholdReached && (
            <OdsBadge
              label={t('pci_projects_project_quota_threshold_reached')}
              color="warning"
              className="ml-4"
            ></OdsBadge>
          )}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_instance'),
    },
    {
      id: 'vCpu',
      cell: (props: Quota) => (
        <DataGridTextCell>
          <span>
            {props.instance.usedCores} /
            {props.instance.maxCores === -1
              ? t('pci_projects_project_quota_instance_unlimited')
              : props.instance.maxCores}
          </span>

          {props.isCpuQuotaThresholdReached && (
            <OdsBadge
              label={t('pci_projects_project_quota_threshold_reached')}
              color="warning"
              className="ml-4"
            ></OdsBadge>
          )}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_core'),
    },
    {
      id: 'ram',
      cell: (props: Quota) => {
        const used = useTranslatedBytes(
          props.instance.usedRAM * 1000000,
          2,
          false,
          'B',
          false,
        );
        const max = useTranslatedBytes(
          props.instance.maxRam * 1000000,
          2,
          false,
          'B',
          false,
        );
        return (
          <DataGridTextCell>
            <span>
              {props.instance.usedRAM > 0
                ? used
                : props.instance.usedRAM * 1000000}{' '}
              /
              {props.instance.maxRam === -1
                ? t('pci_projects_project_quota_instance_unlimited')
                : max}
            </span>

            {props.isRamQuotaThresholdReached && (
              <OdsBadge
                label={t('pci_projects_project_quota_threshold_reached')}
                color="warning"
                className="ml-4"
              ></OdsBadge>
            )}
          </DataGridTextCell>
        );
      },
      label: t('pci_projects_project_quota_ram'),
    },
    {
      id: 'disk',
      cell: (props: Quota) => {
        const used = useTranslatedBytes(
          props.volume.usedGigabytes * 1000000000,
          2,
          false,
          'B',
          false,
        );
        const max = useTranslatedBytes(
          props.volume.maxGigabytes * 1000000000,
          2,
          false,
          'B',
          false,
        );
        return (
          <DataGridTextCell>
            <span>
              {props.volume.usedGigabytes > 0
                ? used
                : props.volume.usedGigabytes * 1000000}{' '}
              /
              {props.volume.usedGigabytes === -1
                ? t('pci_projects_project_quota_instance_unlimited')
                : max}
            </span>

            {props.isVolumeQuotaThresholdReached && (
              <OdsBadge
                label={t('pci_projects_project_quota_threshold_reached')}
                color="warning"
                className="ml-4"
              ></OdsBadge>
            )}
          </DataGridTextCell>
        );
      },
      label: t('pci_projects_project_quota_add_disk'),
    },
    {
      id: 'ips',
      cell: (props: Quota) => (
        <DataGridTextCell>
          {props.network.usedFloatingIPs} / {props.network.maxFloatingIPs}
        </DataGridTextCell>
      ),
      label: PRODUCTS.FLOATING_IP,
    },
    {
      id: 'gateways',
      cell: (props: Quota) => (
        <DataGridTextCell>
          {props.network.usedGateways} / {props.network.maxGateways}
        </DataGridTextCell>
      ),
      label: PRODUCTS.GATEWAYS,
    },
    {
      id: 'lbs',
      cell: (props: TQuota) => (
        <DataGridTextCell>
          {props.loadbalancer?.usedLoadbalancers || 0} /{' '}
          {props.loadbalancer?.maxLoadbalancers || 0}
        </DataGridTextCell>
      ),
      label: PRODUCTS.LB_OCTAVIA,
    },
  ];

  return columns;
};
