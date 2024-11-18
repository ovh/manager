import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { ColumnSort } from '@tanstack/react-table';
import { Quota } from '@/api/data/quota';
import { PRODUCTS } from '@/constants';
import { LimitedQuotaBadgeComponent } from '@/pages/quota/components/LimitedQuotaBadge.component';
import {
  isCpuQuotaThresholdReached,
  isInstanceQuotaThresholdReached,
  isRamQuotaThresholdReached,
  isVolumeQuotaThresholdReached,
} from '@/helpers/thresholds';

export type QuotaRow = Quota & { fullRegionName: string };

export const sortQuotas = (quotas: QuotaRow[], sorting: ColumnSort) => {
  const { id: sortKey, desc } = sorting;
  if (sortKey === 'region') {
    const sortedQuotas = [...quotas].sort((a, b) =>
      a.fullRegionName.localeCompare(b.fullRegionName),
    );
    return desc ? sortedQuotas : sortedQuotas.reverse();
  }
  return quotas;
};

export const useDatagridColumn = () => {
  const { t } = useTranslation('quotas');
  const columns: DatagridColumn<QuotaRow>[] = [
    {
      id: 'region',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>{props.fullRegionName}</DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_region'),
    },
    {
      id: 'servers',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>
          <span>
            {props.instance.usedInstances} /
            {props.instance.maxInstances === -1
              ? t('pci_projects_project_quota_instance_unlimited')
              : props.instance.maxInstances}
          </span>

          {isInstanceQuotaThresholdReached(props) && (
            <LimitedQuotaBadgeComponent />
          )}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_instance'),
      isSortable: false,
    },
    {
      id: 'vCpu',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>
          <span>
            {props.instance.usedCores} /
            {props.instance.maxCores === -1
              ? t('pci_projects_project_quota_instance_unlimited')
              : props.instance.maxCores}
          </span>

          {isCpuQuotaThresholdReached(props) && <LimitedQuotaBadgeComponent />}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_quota_core'),
      isSortable: false,
    },
    {
      id: 'ram',
      cell: (props: QuotaRow) => {
        const { formatBytes } = useBytes();
        const [used, max] = [
          formatBytes(props.instance.usedRAM * 1_000_000, 2),
          formatBytes(props.instance.maxRam * 1_000_000, 2),
        ];
        return (
          <DataGridTextCell>
            <span>
              {props.instance.usedRAM > 0
                ? used
                : props.instance.usedRAM * 1_000_000}{' '}
              /
              {props.instance.maxRam === -1
                ? t('pci_projects_project_quota_instance_unlimited')
                : max}
            </span>

            {isRamQuotaThresholdReached(props) && (
              <LimitedQuotaBadgeComponent />
            )}
          </DataGridTextCell>
        );
      },
      label: t('pci_projects_project_quota_ram'),
      isSortable: false,
    },
    {
      id: 'disk',
      cell: (props: QuotaRow) => {
        const { formatBytes } = useBytes();
        const [used, max] = [
          formatBytes(props.volume.usedGigabytes * 1_000_000_000, 2),
          formatBytes(props.volume.maxGigabytes * 1_000_000_000, 2),
        ];

        return (
          <DataGridTextCell>
            <span>
              {props.volume.usedGigabytes > 0
                ? used
                : props.volume.usedGigabytes * 1_000_000}{' '}
              /
              {props.volume.usedGigabytes === -1
                ? t('pci_projects_project_quota_instance_unlimited')
                : max}
            </span>
            {isVolumeQuotaThresholdReached(props) && (
              <LimitedQuotaBadgeComponent />
            )}
          </DataGridTextCell>
        );
      },
      label: t('pci_projects_project_quota_add_disk'),
      isSortable: false,
    },
    {
      id: 'ips',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>
          {props.network.usedFloatingIPs} / {props.network.maxFloatingIPs}
        </DataGridTextCell>
      ),
      label: PRODUCTS.FLOATING_IP,
      isSortable: false,
    },
    {
      id: 'gateways',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>
          {props.network.usedGateways} / {props.network.maxGateways}
        </DataGridTextCell>
      ),
      label: PRODUCTS.GATEWAYS,
      isSortable: false,
    },
    {
      id: 'lbs',
      cell: (props: QuotaRow) => (
        <DataGridTextCell>
          {props.loadbalancer?.usedLoadbalancers || 0} /{' '}
          {props.loadbalancer?.maxLoadbalancers || 0}
        </DataGridTextCell>
      ),
      label: PRODUCTS.LB_OCTAVIA,
      isSortable: false,
    },
  ];

  return columns;
};
