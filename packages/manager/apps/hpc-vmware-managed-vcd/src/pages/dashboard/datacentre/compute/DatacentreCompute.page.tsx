import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DataGridTextCell } from '@ovhcloud/manager-components';
import { VHOSTS_TITLE } from './DatacentreCompute.constants';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import IVcdCompute from '@/types/vcd-compute.interface';
import { getVcdDatacentreComputeRoute } from '@/data/api/hpc-vmware-managed-vcd-datacentre';

const DatagridIdCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute?.id}</DataGridTextCell>
);
const DatagridVHostProfilCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute?.currentState?.profile}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdCompute: IVcdCompute) => (
  <DataGridTextCell>{vcdCompute.currentState?.vCPUCount}</DataGridTextCell>
);
const DatagridBillingCell = (vcdCompute: IVcdCompute) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  return (
    <DataGridTextCell>
      {t(
        `managed_vcd_vdc_compute_billing_${vcdCompute.currentState?.billingType}`,
      )}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdCompute: IVcdCompute) => {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdCompute.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

export default function ComputeListingPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres/compute');
  const { t: tVdc } = useTranslation('hpc-vmware-managed-vcd/datacentres');

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: t('managed_vcd_vdc_compute_id'),
    },
    {
      id: 'vHostProfile',
      cell: DatagridVHostProfilCell,
      label: t('managed_vcd_vdc_compute_vhost_profile'),
    },
    {
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tVdc('managed_vcd_vdc_cpu_count'),
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
    },
    {
      id: 'billing',
      cell: DatagridBillingCell,
      label: t('managed_vcd_vdc_compute_billing'),
    },
  ];

  const datagridProps: TDatagridContainerProps = {
    title: VHOSTS_TITLE,
    containerId: `compute-${id}-${vdcId}`,
    isEmbedded: true,
    route: {
      api: getVcdDatacentreComputeRoute(id, vdcId),
      onboarding: null, // TODO update with order compute page when available
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
